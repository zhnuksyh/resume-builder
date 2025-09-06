-- Add avatar_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL of the user profile picture stored in Supabase Storage';
