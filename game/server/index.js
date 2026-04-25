const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const OBSTACLE_SIZE = 25;
const MVP_DURATION_MS = 30000;
const INPUT_RATE_LIMIT = 20;
const MAX_LIVES = 3;
const INVINCIBILITY_MS = 2000;
const POWERUP_TYPES = ['shield', 'double', 'slow'];
const POWERUP_SIZE = 20;
const POWERUP_SPAWN_RATE = 8000;
const POWERUP_SPEED = 1.5;

// Set SUPABASE_URL and SUPABASE_SERVICE_KEY in the server's environment to enable leaderboard persistence
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

let gameState = {
  player: { x: 200, y: 350, vx: 0, alive: true, respawnTimer: 0 },
  obstacles: [],
  powerups: [],
  score: 0,
  highScore: 0,
  inputs: {},
  mvpSocketId: null,
  mvpUntil: 0,
  pendingQueue: [],
  lives: MAX_LIVES,
  invincibleUntil: 0,
  activePowerups: { shield: false, double: 0, slow: 0 },
  combo: 0,
  comboMultiplier: 1,
};

let lastObstacleSpawn = 0;
let lastScoreUpdate = Date.now();
let lastPowerupSpawn = 0;
const inputCounts = new Map();

function getObstacleSpeed(score) {
  return Math.min(3 + score / 200, 10);
}

function getSpawnRate(score) {
  return Math.max(600, 1500 - score * 2);
}

function getComboMultiplier(combo) {
  if (combo >= 8) return 3;
  if (combo >= 5) return 2.5;
  if (combo >= 3) return 2;
  if (combo >= 1) return 1.5;
  return 1;
}

function spawnObstacle() {
  const lane = Math.floor(Math.random() * 3);
  const x = 70 + lane * 130;
  gameState.obstacles.push({ x, y: -OBSTACLE_SIZE, id: Date.now() + Math.random() });
}

function spawnPowerup() {
  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  const x = 50 + Math.random() * 300;
  gameState.powerups.push({ x, y: -POWERUP_SIZE, id: Date.now() + Math.random(), type });
}

function checkCollision(player, obstacle) {
  const px = player.x - PLAYER_WIDTH / 2;
  const py = player.y - PLAYER_HEIGHT / 2;
  const ox = obstacle.x - OBSTACLE_SIZE / 2;
  const oy = obstacle.y - OBSTACLE_SIZE / 2;

  return px < ox + OBSTACLE_SIZE &&
         px + PLAYER_WIDTH > ox &&
         py < oy + OBSTACLE_SIZE &&
         py + PLAYER_HEIGHT > oy;
}

function checkPowerupCollision(player, powerup) {
  return Math.abs(player.x - powerup.x) < 25 && Math.abs(player.y - powerup.y) < 25;
}

function rotateMVP() {
  gameState.pendingQueue = gameState.pendingQueue.filter(id => id !== gameState.mvpSocketId);
  const next = gameState.pendingQueue[0] || null;
  gameState.mvpSocketId = next;
  if (next) gameState.mvpUntil = Date.now() + MVP_DURATION_MS;
}

function isRateLimited(socketId) {
  const now = Date.now();
  const r = inputCounts.get(socketId) || { count: 0, windowStart: now };
  if (now - r.windowStart >= 1000) {
    inputCounts.set(socketId, { count: 1, windowStart: now });
    return false;
  }
  if (r.count >= INPUT_RATE_LIMIT) return true;
  r.count++;
  inputCounts.set(socketId, r);
  return false;
}

async function saveHighScore(score) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/game_scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ score }),
    });
  } catch (err) {
    console.error('Score save failed:', err.message);
  }
}

setInterval(() => {
  const now = Date.now();

  if (gameState.player.alive && now - lastScoreUpdate >= 100) {
    const base = (now < gameState.activePowerups.double) ? 2 : 1;
    gameState.score = Math.round(gameState.score + base * gameState.comboMultiplier);
    lastScoreUpdate = now;
  }

  // Rotate MVP on timer
  if (gameState.mvpSocketId && now > gameState.mvpUntil) {
    rotateMVP();
  }

  // Weighted vote aggregation — MVP counts 3×, everyone else 1×
  let move = 0;
  Object.entries(gameState.inputs).forEach(([id, input]) => {
    const weight = id === gameState.mvpSocketId ? 3 : 1;
    if (input === 'left') move -= weight;
    if (input === 'right') move += weight;
  });

  if (move !== 0) {
    gameState.player.vx = (move > 0 ? 1 : -1) * 5;
  } else {
    gameState.player.vx *= 0.8;
  }

  gameState.player.x += gameState.player.vx;
  gameState.player.x = Math.max(30, Math.min(GAME_WIDTH - 30, gameState.player.x));

  const spawnRate = getSpawnRate(gameState.score);
  if (now - lastObstacleSpawn > spawnRate) {
    spawnObstacle();
    lastObstacleSpawn = now;
  }

  const slowActive = now < gameState.activePowerups.slow;
  const obstacleSpeed = getObstacleSpeed(gameState.score) * (slowActive ? 0.5 : 1);
  const playerY = gameState.player.y;

  gameState.obstacles.forEach(obs => {
    const prevY = obs.prevY !== undefined ? obs.prevY : obs.y;
    obs.prevY = obs.y;
    obs.y += obstacleSpeed;
    // Close-dodge detection: obstacle just crossed player's level while nearby but not colliding
    if (gameState.player.alive && obs.y > playerY + 15 && prevY <= playerY + 15) {
      const lateralDist = Math.abs(obs.x - gameState.player.x);
      if (lateralDist > 20 && lateralDist < 70) {
        gameState.combo += 1;
        gameState.comboMultiplier = getComboMultiplier(gameState.combo);
      }
    }
  });
  gameState.obstacles = gameState.obstacles.filter(obs => obs.y < GAME_HEIGHT + OBSTACLE_SIZE);

  // Spawn and move power-ups
  if (now - lastPowerupSpawn > POWERUP_SPAWN_RATE) {
    spawnPowerup();
    lastPowerupSpawn = now;
  }

  gameState.powerups = gameState.powerups.filter(pu => {
    pu.y += POWERUP_SPEED;
    if (gameState.player.alive && checkPowerupCollision(gameState.player, pu)) {
      if (pu.type === 'shield') gameState.activePowerups.shield = true;
      if (pu.type === 'double') gameState.activePowerups.double = now + 10000;
      if (pu.type === 'slow')   gameState.activePowerups.slow   = now + 5000;
      return false;
    }
    return pu.y < GAME_HEIGHT + POWERUP_SIZE;
  });

  if (gameState.player.alive && now > gameState.invincibleUntil) {
    for (const obs of gameState.obstacles) {
      if (checkCollision(gameState.player, obs)) {
        if (gameState.activePowerups.shield) {
          gameState.activePowerups.shield = false;
          gameState.invincibleUntil = now + INVINCIBILITY_MS;
        } else {
          gameState.lives -= 1;
          if (gameState.lives <= 0) {
            gameState.player.alive = false;
            gameState.player.respawnTimer = 60;
            if (gameState.score > gameState.highScore) {
              gameState.highScore = gameState.score;
              saveHighScore(gameState.highScore);
            }
            gameState.score = 0;
            gameState.lives = MAX_LIVES;
            gameState.combo = 0;
            gameState.comboMultiplier = 1;
            gameState.activePowerups = { shield: false, double: 0, slow: 0 };
          } else {
            gameState.invincibleUntil = now + INVINCIBILITY_MS;
            gameState.combo = 0;
            gameState.comboMultiplier = 1;
          }
        }
        break;
      }
    }
  } else if (!gameState.player.alive) {
    gameState.player.respawnTimer -= 1;
    if (gameState.player.respawnTimer <= 0) {
      gameState.player.alive = true;
      gameState.player.x = 200;
      gameState.obstacles = [];
      gameState.powerups = [];
      rotateMVP();
    }
  }

  // Tally raw vote counts for client visualization
  let voteLeft = 0, voteRight = 0;
  Object.values(gameState.inputs).forEach(input => {
    if (input === 'left') voteLeft++;
    if (input === 'right') voteRight++;
  });

  io.emit("state", {
    player: gameState.player,
    obstacles: gameState.obstacles.map(obs => ({ x: obs.x, y: obs.y, id: obs.id })),
    powerups: gameState.powerups,
    score: gameState.score,
    highScore: gameState.highScore,
    playerCount: Object.keys(gameState.inputs).length,
    mvpSocketId: gameState.mvpSocketId,
    mvpUntil: gameState.mvpUntil,
    voteLeft,
    voteRight,
    lives: gameState.lives,
    invincible: now < gameState.invincibleUntil,
    activePowerups: {
      shield: gameState.activePowerups.shield,
      double: gameState.activePowerups.double > now,
      slow: gameState.activePowerups.slow > now,
      doubleUntil: gameState.activePowerups.double,
      slowUntil: gameState.activePowerups.slow,
    },
    combo: gameState.combo,
    comboMultiplier: gameState.comboMultiplier,
  });
}, 1000 / 60);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  if (!gameState.mvpSocketId) {
    gameState.mvpSocketId = socket.id;
    gameState.mvpUntil = Date.now() + MVP_DURATION_MS;
  }
  gameState.pendingQueue.push(socket.id);

  socket.on("input", (data) => {
    if (isRateLimited(socket.id)) return;
    gameState.inputs[socket.id] = data;
  });

  socket.on("disconnect", () => {
    delete gameState.inputs[socket.id];
    inputCounts.delete(socket.id);
    gameState.pendingQueue = gameState.pendingQueue.filter(id => id !== socket.id);
    if (socket.id === gameState.mvpSocketId) rotateMVP();
  });
});

server.listen(3000, () => {
  console.log("Game server running on http://localhost:3000");
});
