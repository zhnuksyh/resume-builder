-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  template_id TEXT DEFAULT 'modern',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resume sections table for flexible content
CREATE TABLE IF NOT EXISTS public.resume_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL, -- 'personal_info', 'experience', 'education', 'skills', 'projects', 'custom'
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for resumes
CREATE POLICY "resumes_select_own" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "resumes_insert_own" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "resumes_update_own" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "resumes_delete_own" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for resume_sections
CREATE POLICY "resume_sections_select_own" ON public.resume_sections 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.resumes 
      WHERE resumes.id = resume_sections.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "resume_sections_insert_own" ON public.resume_sections 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.resumes 
      WHERE resumes.id = resume_sections.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "resume_sections_update_own" ON public.resume_sections 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.resumes 
      WHERE resumes.id = resume_sections.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "resume_sections_delete_own" ON public.resume_sections 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.resumes 
      WHERE resumes.id = resume_sections.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_sections_resume_id ON public.resume_sections(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_sections_order ON public.resume_sections(resume_id, order_index);
