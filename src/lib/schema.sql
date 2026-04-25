export const videosTable = `
-- Videos table for stefu.com
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL, -- Mux playback ID or direct URL
  thumbnail TEXT,
  category TEXT NOT NULL, -- 'trending', 'exclusive', 'lifestyle', 'talks'
  type TEXT NOT NULL DEFAULT 'episode', -- 'live', 'episode', 'clip'
  duration INTEGER, -- in seconds
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  timeline_slot TEXT, -- 'morning', 'afternoon', 'evening', 'night'
  timeline_time TEXT, -- '06:00', '14:00', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline table
CREATE TABLE IF NOT EXISTS timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  start_time TEXT NOT NULL, -- '06:00', '14:00', etc.
  end_time TEXT,
  day_of_week INTEGER[], -- [0,1,2,3,4,5,6] for Sunday-Saturday, null = every day
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free', -- 'free', 'premium', 'inner_circle'
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Videos RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view non-premium videos" ON videos
  FOR SELECT USING (is_premium = false);

CREATE POLICY "Premium users can view all videos" ON videos
  FOR SELECT USING (
    is_premium = false OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status IN ('premium', 'inner_circle'))
  );

-- Indexes
CREATE INDEX IF NOT EXISTS videos_category_idx ON videos(category);
CREATE INDEX IF NOT EXISTS videos_type_idx ON videos(type);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS timeline_start_time_idx ON timeline(start_time);
`

export const insertSampleVideos = `
-- Sample videos for development
INSERT INTO videos (title, description, url, thumbnail, category, type, duration, views, is_premium, timeline_slot, timeline_time) VALUES
  ('The Rise of a Legend', 'How Stefan became who he is today', 'vz03d8bD6A7oE8xMp8nN01X6G00oTqZ01dX6M6XxXg', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'trending', 'episode', 9900, 2100000, false, 'morning', '06:00'),
  ('Power Conversation', 'In-depth discussion on success', 'iqJ8L4c8N6A7oE8xMp8nN01X6G00oTqZ01dX6M6XxXg', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80', 'exclusive', 'episode', 11520, 1800000, true, 'afternoon', '14:00'),
  ('A Day in the Life', 'Following Stefan for a full day', 'kz03d8bD6A7oE8xMp8nN01X6G00oTqZ01dX6M6XxXg', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', 'exclusive', 'episode', 2700, 950000, true, 'evening', '18:00'),
  ('The Finnish Dream', 'Building an empire from Finland', 'az03d8bD6A7oE8xMp8nN01X6G00oTqZ01dX6M6XxXg', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80', 'talks', 'episode', 4980, 1200000, false, 'night', '22:00'),
  ('When opportunity knocks', 'The mindset that changed everything', 'bz03d8bD6A7oE8xMp8nN01X6G00oTqZ01dX6M6XxXg', 'https://images.unsplash.com/photo-1517963626746-2e20b1a1a63c?w=600&q=80', 'lifestyle', 'clip', 45, 45200, false, null, null),
  ('Never follow, always lead', 'Stefan on success', 'cz03d8bD6A7oE8xMp8nN01X6G00oTqZ01dX6M6XxXg', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80', 'lifestyle', 'clip', 62, 32100, false, null, null),
  ('The morning routine', 'How legends start their day', 'dz03d8bD6A7oE8xMp8nN01X6G00oTqZ01dX6M6XxXg', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', 'lifestyle', 'clip', 58, 28700, false, null, null);
`