# Creative Challenge App - Setup Guide

## Quick Start

The sign-in/sign-up pages won't load because Supabase environment variables are missing. Follow these steps to fix:

## 1. Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project name: `creative-challenge-app`
5. Set a database password (save this!)
6. Choose a region close to you
7. Click "Create new project"

## 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Create Environment File

Create a file named `.env.local` in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with your actual Supabase credentials.

## 4. Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Run the migration files in this order:
   - `supabase/migrations/20241201_create_jackpot_entries.sql`
   - `supabase/migrations/20241201_create_jackpot_draws.sql`
   - `supabase/migrations/20241201_update_users_jackpot_entries.sql`
   - `supabase/migrations/20241201_create_jackpot_entries_function.sql`
   - `supabase/migrations/20241201_database_optimization.sql`

## 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. Go to **Authentication** → **Providers**
5. Enable **Google** provider if you want Google sign-in
6. Configure OAuth settings as needed

## 6. Set Up Storage (Optional)

1. In Supabase dashboard, go to **Storage**
2. Create a bucket named `artwork-submissions`
3. Set it to public if you want public access to uploaded images

## 7. Restart Development Server

```bash
npm run dev
```

## 8. Test the Application

1. Go to `http://localhost:3000`
2. Click "Sign In" or "Sign Up"
3. The authentication pages should now load properly

## Troubleshooting

### Still getting redirected to error page?
- Check that `.env.local` file exists in the project root
- Verify the environment variable names are exactly as shown above
- Make sure there are no extra spaces or quotes around the values
- Restart the development server after making changes

### Database errors?
- Make sure you've run all the migration files
- Check that your Supabase project is active and not paused
- Verify the database password is correct

### Authentication not working?
- Check the Site URL and Redirect URLs in Supabase settings
- Make sure the environment variables are correct
- Check the browser console for any error messages

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Look at the terminal where you ran `npm run dev` for server errors
3. Verify all steps above were completed correctly
