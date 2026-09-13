-- Run this in your Supabase SQL Editor

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    uid UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    displayName TEXT,
    email TEXT UNIQUE,
    photoURL TEXT,
    role TEXT DEFAULT 'user',
    verified BOOLEAN DEFAULT false,
    isRevert BOOLEAN DEFAULT false,
    bio TEXT,
    specialty TEXT,
    noorPoints INTEGER DEFAULT 0,
    noorLevel INTEGER DEFAULT 1,
    streakCount INTEGER DEFAULT 0,
    lastActive TIMESTAMP WITH TIME ZONE,
    lastLogin TIMESTAMP WITH TIME ZONE,
    revertPathDay INTEGER DEFAULT 0,
    lastRevertDayCompletedAt TIMESTAMP WITH TIME ZONE,
    completedDeeds TEXT[] DEFAULT '{}',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Videos Table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    clericId UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    clericName TEXT,
    clericPhoto TEXT,
    title TEXT,
    description TEXT,
    videoUrl TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Scholar Videos Table
CREATE TABLE IF NOT EXISTS public.scholar_videos (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    scholar_id UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    scholar_name TEXT,
    scholar_photo TEXT,
    title TEXT,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true
);

-- 4. Dreams Table
CREATE TABLE IF NOT EXISTS public.dreams (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    description TEXT NOT NULL,
    interpretation TEXT,
    mood TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Saved Resources Table
CREATE TABLE IF NOT EXISTS public.saved_resources (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    contentType TEXT NOT NULL,
    contentId TEXT NOT NULL,
    metadata JSONB,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Learning Progress Table
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    completedModules TEXT[] DEFAULT '{}',
    currentLevel INTEGER DEFAULT 1,
    points INTEGER DEFAULT 10,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Noor Chats Table
CREATE TABLE IF NOT EXISTS public.noor_chats (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    messages JSONB[] DEFAULT '{}',
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true
);

-- 9. Video Feedback Table
CREATE TABLE IF NOT EXISTS public.video_feedback (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES public.users(uid) ON DELETE SET NULL,
    videoId UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    feedback TEXT NOT NULL,
    type TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tarteel Sessions Table
CREATE TABLE IF NOT EXISTS public.tarteel_sessions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    verseId TEXT,
    verseName TEXT,
    errorsCount INTEGER DEFAULT 0,
    fluencyPercentage NUMERIC DEFAULT 0,
    wrongWords TEXT[] DEFAULT '{}',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Sadaqah Table
CREATE TABLE IF NOT EXISTS public.sadaqah (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    userName TEXT,
    type TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Gratitude Table
CREATE TABLE IF NOT EXISTS public.gratitude (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    text TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    userName TEXT,
    clericId UUID REFERENCES public.users(uid) ON DELETE SET NULL,
    clericName TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    isPaid BOOLEAN DEFAULT false,
    price NUMERIC DEFAULT 0,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn off RLS for MVP (you can enable it later for security)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholar_videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.dreams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.noor_chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarteel_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sadaqah DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitude DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- New Feature: TikTok-Style Posts
-- ==========================================

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('video', 'image')) NOT NULL,
  caption TEXT,
  surah_ayah_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies for Posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- Setup Storage Buckets
-- Note: You may need to create buckets 'quranic_videos' and 'quranic_images' in your Supabase Dashboard -> Storage manually, or run these:
INSERT INTO storage.buckets (id, name, public) VALUES ('quranic_videos', 'quranic_videos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('quranic_images', 'quranic_images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public video access" ON storage.objects FOR SELECT USING (bucket_id = 'quranic_videos');
CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'quranic_videos' AND auth.role() = 'authenticated');

CREATE POLICY "Public image access" ON storage.objects FOR SELECT USING (bucket_id = 'quranic_images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'quranic_images' AND auth.role() = 'authenticated');
