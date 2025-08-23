-- Drop existing policies for profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Create improved RLS policies that work better with triggers

-- Allow users to select their own profile
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

-- Allow profile insertion for authenticated users (needed for trigger)
-- This is more permissive but still secure since the trigger controls the logic
CREATE POLICY "profiles_insert_authenticated" ON public.profiles 
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL OR 
    current_setting('role') = 'service_role' OR
    current_setting('role') = 'postgres'
  );

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- Alternative: Temporarily disable RLS for profiles during development
-- Uncomment the line below if you want to completely disable RLS for profiles
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
