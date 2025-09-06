# Admin Access Setup

## 🔐 How to Set Up Admin Access

### Step 1: Get Your User ID
1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **Users**
3. Find your user account and copy the **User ID** (it looks like: `12345678-1234-1234-1234-123456789012`)

### Step 2: Add Your User ID to Admin List
1. Open `components/auth/AdminGuard.tsx`
2. Find the `ADMIN_USER_IDS` array on line 8-12
3. Add your User ID to the array:

```typescript
const ADMIN_USER_IDS = [
  'YOUR_USER_ID_HERE', // Replace with your actual User ID
  // Add more admin IDs here if needed
]
```

### Step 3: Alternative - Database Admin Role
You can also add an `is_admin` column to the profiles table:

```sql
-- Add admin column to profiles table
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Set yourself as admin (replace with your user ID)
UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID_HERE';
```

### Step 4: Test Admin Access
1. Sign out and sign back in
2. Try to access `/admin/submissions`
3. You should see the admin interface instead of "Access Denied"

## 🛡️ Security Features

- **User ID Whitelist**: Only specific user IDs can access admin areas
- **Database Role Check**: Fallback to check `is_admin` in profiles table
- **Automatic Redirects**: Non-admin users are redirected to appropriate pages
- **Loading States**: Smooth verification process with loading indicators

## 🔧 Adding More Admins

To add more admins, simply add their User IDs to the `ADMIN_USER_IDS` array in `AdminGuard.tsx`.

## ⚠️ Important Notes

- Keep your User ID secure
- Don't commit your actual User ID to version control
- Consider using environment variables for production
- The admin guard checks both the whitelist and database roles
