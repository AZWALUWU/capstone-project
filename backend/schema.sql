-- Create tables for Sehatica application

-- Profiles table to store user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{"email_notifications": false, "marketing_emails": false, "save_history": true, "data_collection": false, "is_admin": false}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health guides table
CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content JSONB NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  time TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved guides table (for users to bookmark guides)
CREATE TABLE IF NOT EXISTS saved_guides (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guide_id INTEGER REFERENCES guides(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, guide_id)
);

-- Diagnosis history table
CREATE TABLE IF NOT EXISTS diagnosis_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  condition TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  severity TEXT NOT NULL,
  duration TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) policies

-- Profiles: Users can read all profiles but only update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Blog posts: Anyone can read, only admins can create/update/delete
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog posts are viewable by everyone" 
  ON blog_posts FOR SELECT USING (true);

CREATE POLICY "Only admins can insert blog posts" 
  ON blog_posts FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND preferences->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Only admins can update blog posts" 
  ON blog_posts FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND preferences->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Only admins can delete blog posts" 
  ON blog_posts FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND preferences->>'is_admin' = 'true'
    )
  );

-- Guides: Anyone can read, only admins can create/update/delete
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides are viewable by everyone" 
  ON guides FOR SELECT USING (true);

CREATE POLICY "Only admins can insert guides" 
  ON guides FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND preferences->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Only admins can update guides" 
  ON guides FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND preferences->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Only admins can delete guides" 
  ON guides FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND preferences->>'is_admin' = 'true'
    )
  );

-- Saved guides: Users can only see and manage their own saved guides
ALTER TABLE saved_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved guides" 
  ON saved_guides FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved guides" 
  ON saved_guides FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved guides" 
  ON saved_guides FOR DELETE USING (auth.uid() = user_id);

-- Diagnosis history: Users can only see and manage their own diagnosis history
ALTER TABLE diagnosis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own diagnosis history" 
  ON diagnosis_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnosis history" 
  ON diagnosis_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

