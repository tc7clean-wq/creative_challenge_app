-- Step 2: Add is_admin column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for is_admin
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

