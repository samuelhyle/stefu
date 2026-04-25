-- ============================================================
-- STEFU initial schema
-- Run via: supabase db push
-- ============================================================

-- Profiles (one row per auth.user)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'inner_circle')),
  subscription_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Videos
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT NOT NULL CHECK (category IN ('trending', 'exclusive', 'lifestyle', 'talks')),
  type TEXT NOT NULL DEFAULT 'episode' CHECK (type IN ('live', 'episode', 'clip')),
  duration INTEGER,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  timeline_slot TEXT CHECK (timeline_slot IN ('morning', 'afternoon', 'evening', 'night')),
  timeline_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view free videos" ON videos
  FOR SELECT USING (is_premium = false);

CREATE POLICY "Premium users can view all videos" ON videos
  FOR SELECT USING (
    is_premium = false OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND subscription_status IN ('premium', 'inner_circle')
        AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
    )
  );

CREATE POLICY "Admin can manage videos" ON videos
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS videos_category_idx ON videos(category);
CREATE INDEX IF NOT EXISTS videos_type_idx ON videos(type);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);

-- Timeline schedule
CREATE TABLE IF NOT EXISTS timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  start_time TEXT NOT NULL,
  end_time TEXT,
  day_of_week INTEGER[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view timeline" ON timeline FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS timeline_start_time_idx ON timeline(start_time);

-- Game scores
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  score INTEGER NOT NULL,
  player_name TEXT,
  session_id TEXT,
  achieved_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view scores"   ON game_scores FOR SELECT USING (true);
CREATE POLICY "Anyone can insert scores" ON game_scores FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS game_scores_score_idx ON game_scores(score DESC);

-- Mailing list subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage subscribers" ON subscribers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

-- Chat messages (Inner Circle community)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"              ON messages FOR SELECT USING (true);
CREATE POLICY "Logged-in users can send messages"     ON messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at ASC);

-- Realtime — enable messages table for broadcast
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
