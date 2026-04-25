const socket = io(window.SOCKET_URL || "http://localhost:3000");

let player;
let obstacles = [];
let scoreText;
let highScoreText;
let playerCountText;
let mvpText;
let voteBarLeft;
let voteBarRight;
let deathOverlay;
let scene;
let lastX = 200;
let wasAlive = true;
let currentState = null;
let hearts = [];

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  backgroundColor: '#1a1a2e',
  scene: { create, update }
};

const game = new Phaser.Game(config);

function create() {
  scene = this;

  const ground = this.add.graphics();
  ground.fillStyle(0x0f3460, 1);
  ground.fillRect(0, 370, 400, 30);

  for (let i = 0; i < 3; i++) {
    const x = 70 + i * 130;
    const marker = this.add.graphics();
    marker.lineStyle(2, 0xe94560, 0.3);
    marker.lineBetween(x, 370, x, 400);
  }

  this.add.text(10, 10, 'SCORE', { fontSize: '12px', fill: '#e94560', fontFamily: 'Arial' });
  scoreText = this.add.text(10, 22, '0', { fontSize: '20px', fill: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold' });

  this.add.text(280, 10, 'BEST', { fontSize: '12px', fill: '#e94560', fontFamily: 'Arial' });
  highScoreText = this.add.text(280, 22, '0', { fontSize: '20px', fill: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold' });

  this.add.text(160, 10, 'PLAYERS', { fontSize: '12px', fill: '#e94560', fontFamily: 'Arial' });
  playerCountText = this.add.text(185, 22, '0', { fontSize: '20px', fill: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold' });

  const voteBarBg = this.add.graphics();
  voteBarBg.fillStyle(0xffffff, 0.08);
  voteBarBg.fillRect(10, 48, 380, 5);
  voteBarLeft = this.add.graphics();
  voteBarRight = this.add.graphics();

  mvpText = this.add.text(200, 57, '', {
    fontSize: '9px', fill: '#00ff88', fontFamily: 'Arial', align: 'center'
  }).setOrigin(0.5, 0);

  for (let i = 0; i < 3; i++) {
    hearts.push(this.add.text(10 + i * 18, 70, '♥', {
      fontSize: '14px', fill: '#e94560', fontFamily: 'Arial'
    }));
  }

  player = this.add.container(200, 350);

  const body = this.add.graphics();
  body.fillStyle(0x00ff88, 1);
  body.fillRect(-15, -15, 30, 30);
  body.lineStyle(2, 0x00cc66, 1);
  body.strokeRect(-15, -15, 30, 30);

  const eye1 = this.add.graphics();
  eye1.fillStyle(0xffffff, 1);
  eye1.fillCircle(-5, -3, 4);
  eye1.fillStyle(0x1a1a2e, 1);
  eye1.fillCircle(-4, -2, 2);

  const eye2 = this.add.graphics();
  eye2.fillStyle(0xffffff, 1);
  eye2.fillCircle(5, -3, 4);
  eye2.fillStyle(0x1a1a2e, 1);
  eye2.fillCircle(6, -2, 2);

  player.add([body, eye1, eye2]);

  deathOverlay = this.add.graphics();
  deathOverlay.setAlpha(0);

  this.input.keyboard.on("keydown-LEFT", () => socket.emit("input", "left"));
  this.input.keyboard.on("keydown-RIGHT", () => socket.emit("input", "right"));
  this.input.keyboard.on("keyup-LEFT", () => socket.emit("input", null));
  this.input.keyboard.on("keyup-RIGHT", () => socket.emit("input", null));

  const leftZone = this.add.zone(0, 300, 160, 100).setOrigin(0, 0).setInteractive();
  const rightZone = this.add.zone(240, 300, 160, 100).setOrigin(0, 0).setInteractive();

  this.add.text(50, 345, '◀', { fontSize: '28px', fill: '#ffffff15', fontFamily: 'Arial' }).setOrigin(0.5, 0.5);
  this.add.text(350, 345, '▶', { fontSize: '28px', fill: '#ffffff15', fontFamily: 'Arial' }).setOrigin(0.5, 0.5);

  leftZone.on('pointerdown', () => socket.emit('input', 'left'));
  leftZone.on('pointerup', () => socket.emit('input', null));
  leftZone.on('pointerout', () => socket.emit('input', null));
  rightZone.on('pointerdown', () => socket.emit('input', 'right'));
  rightZone.on('pointerup', () => socket.emit('input', null));
  rightZone.on('pointerout', () => socket.emit('input', null));
}

function update() {}

socket.on("state", (state) => {
  currentState = state;

  window.parent.postMessage({
    type: 'gameState',
    score: state.score,
    highScore: state.highScore,
    playerCount: state.playerCount,
    isMVP: state.mvpSocketId === socket.id,
    voteLeft: state.voteLeft || 0,
    voteRight: state.voteRight || 0,
  }, '*');

  player.x = state.player.x;

  scoreText.setText(state.score.toString());
  highScoreText.setText(state.highScore.toString());
  playerCountText.setText(state.playerCount.toString());

  const lives = state.lives !== undefined ? state.lives : 3;
  hearts.forEach((h, i) => {
    h.setStyle({ fill: i < lives ? '#e94560' : '#ffffff15' });
  });

  const isMVP = state.mvpSocketId === socket.id;
  if (isMVP) {
    const secsLeft = Math.max(0, Math.ceil((state.mvpUntil - Date.now()) / 1000));
    mvpText.setText(`★ MVP (3×) — ${secsLeft}s`);
    mvpText.setStyle({ fill: '#00ff88' });
  } else if (state.mvpSocketId) {
    mvpText.setText('MVP has 3× control power');
    mvpText.setStyle({ fill: '#ffffff30' });
  } else {
    mvpText.setText('');
  }

  const total = (state.voteLeft || 0) + (state.voteRight || 0);
  voteBarLeft.clear();
  voteBarRight.clear();
  if (total > 0) {
    const leftW = Math.floor(380 * state.voteLeft / total);
    voteBarLeft.fillStyle(0xe94560, 0.8);
    voteBarLeft.fillRect(10, 48, leftW, 5);
    voteBarRight.fillStyle(0x00ff88, 0.8);
    voteBarRight.fillRect(10 + leftW, 48, 380 - leftW, 5);
  }

  if (state.player.alive) {
    player.setAlpha(1);
    deathOverlay.setAlpha(0);
  } else {
    player.setAlpha(0.3);
    deathOverlay.clear();
    deathOverlay.fillStyle(0xe94560, 0.4);
    deathOverlay.fillRect(0, 0, 400, 400);
    const flash = Math.sin(state.player.respawnTimer * 0.5) * 0.5 + 0.5;
    deathOverlay.setAlpha(flash * 0.5);
  }

  state.obstacles.forEach(obs => {
    let obstacle = obstacles.find(o => o.gameId === obs.id);
    if (!obstacle) {
      obstacle = scene.add.container(obs.x, obs.y);
      obstacle.gameId = obs.id;
      const obsGraphic = scene.add.graphics();
      obsGraphic.fillStyle(0xe94560, 1);
      obsGraphic.fillTriangle(0, -12, -12, 12, 12, 12);
      obsGraphic.lineStyle(2, 0xff6b6b, 1);
      obsGraphic.strokeTriangle(0, -12, -12, 12, 12, 12);
      obstacle.add(obsGraphic);
      obstacles.push(obstacle);
    }
    obstacle.y = obs.y;
  });

  obstacles = obstacles.filter(obs => {
    const stillExists = state.obstacles.some(o => o.id === obs.gameId);
    if (!stillExists) {
      obs.destroy();
      return false;
    }
    return true;
  });
});