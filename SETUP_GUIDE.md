# 🚀 AI ArtVerse Setup Guide

## **CRITICAL SETUP STEPS**

### **1. Environment Variables (REQUIRED)**
Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional AI Services
OPENAI_API_KEY=your_openai_key
REPLICATE_API_TOKEN=your_replicate_token

# Optional Payment
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
```

### **2. Database Setup (REQUIRED)**
Run this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Basic tables for the app to work
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  prize_amount DECIMAL(10,2),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID REFERENCES contests(id),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  prompt TEXT,
  ai_model TEXT,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Contests are viewable by everyone" ON contests FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create contests" ON contests FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Submissions are viewable by everyone" ON submissions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create submissions" ON submissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### **3. Admin Setup (REQUIRED)**
To access admin features, run this SQL in Supabase:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
UPDATE profiles 
SET is_admin = true 
WHERE id = 'YOUR_USER_ID';
```

### **4. Quick Test Setup**
If you want to test immediately without full setup:

1. **Minimal Environment Variables:**
   - Just add the Supabase URL and anon key
   - The app will work with limited functionality

2. **Basic Database:**
   - Run just the basic tables SQL above
   - Skip the advanced features for now

## **FEATURES THAT REQUIRE SETUP**

### **✅ Works Without Setup:**
- Basic UI and navigation
- Static content display
- Basic authentication flow

### **⚠️ Requires Environment Variables:**
- AI art generation
- Database operations
- User authentication
- Real-time features

### **⚠️ Requires Database Setup:**
- User profiles
- Contests and submissions
- Admin features
- Data persistence

## **TROUBLESHOOTING**

### **Internal Server Error:**
- Check environment variables are set
- Verify database tables exist
- Check Supabase connection

### **Authentication Issues:**
- Ensure Supabase URL and keys are correct
- Check RLS policies are set up

### **AI Features Not Working:**
- Add OpenAI API key for AI generation
- Add Replicate token for image processing

## **NEXT STEPS**

1. **Set up Supabase project** (if not done)
2. **Add environment variables** to Vercel
3. **Run database migration** in Supabase
4. **Set yourself as admin** in database
5. **Redeploy** the app

Your app should work perfectly after these steps! 🎨✨
