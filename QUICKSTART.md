# 🚀 Quick Start Guide

## Option 1: Demo Mode (No Setup Required)

The app is currently running in **DEMO MODE** with sample data. You can:
- ✅ View the complete interface
- ✅ Test the booking form
- ✅ See price calculations
- ✅ Explore all features

**Just open:** http://localhost:5173

---

## Option 2: Full Setup with Supabase

To enable real database functionality, follow these steps:

### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (free tier available)
3. Sign up with GitHub or email

### Step 2: Create New Project

1. Click "New Project"
2. Fill in:
   - **Name**: `hostel-management`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Wait 2-3 minutes for setup

### Step 3: Run Database Schema

1. In Supabase dashboard, click **"SQL Editor"**
2. Click **"New query"**
3. Open `database-setup.sql` from your project
4. Copy ALL contents and paste into SQL Editor
5. Click **"Run"** (Ctrl+Enter)
6. Should see: "Success. No rows returned"

### Step 4: Create Manager User

1. Go to **"Authentication"** > **"Users"**
2. Click **"Add user"** > **"Create new user"**
3. Enter:
   - Email: `manager@hostel.com`
   - Password: `Manager123!`
   - ✅ Check "Auto Confirm User"
4. Click **"Create user"**

### Step 5: Get API Credentials

1. Go to **"Settings"** > **"API"**
2. Copy these values:
   - **Project URL** (like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

### Step 6: Update .env File

1. Open `.env` in your project
2. Replace with your actual values:
   ```
   VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
3. Save the file
4. **Restart the dev server**:
   - Stop: Press `Ctrl+C` in terminal
   - Start: Run `npm run dev` again

### Step 7: Test It Out!

1. Refresh http://localhost:5173
2. You should see "Demo Mode" warning disappear
3. Try making a booking - it will save to database!
4. Login as manager:
   - Click "Manager Login"
   - Email: `manager@hostel.com`
   - Password: `Manager123!`
5. Manage services, rooms, bookings, and settings!

---

## 🎨 Customization

Once Supabase is configured:

1. **Login to Dashboard** (manager@hostel.com / Manager123!)
2. **Go to Settings tab**:
   - Change hostel name
   - Update description
   - Add your hero image URL
3. **Go to Services tab**:
   - Edit prices
   - Add/remove services
   - Upload your images
4. **Go to Rooms tab**:
   - Update room prices
   - Add new room types
   - Set capacity

---

## 📁 Important Files

- **`.env`** - Supabase credentials (NEVER commit to git!)
- **`database-setup.sql`** - Complete database schema
- **`DEPLOYMENT.md`** - Full deployment guide for Vercel

---

## ❓ Troubleshooting

### "Failed to fetch" errors
- Check `.env` has correct Supabase URL and key
- Restart dev server after changing `.env`
- Verify Supabase project is running

### Can't login as manager
- Verify manager user exists in Supabase Auth
- Check email/password are correct
- Ensure `managers` table has the email

### Bookings not saving
- Check Supabase credentials
- Verify database schema ran successfully
- Check browser console for errors

---

**Need help?** Check the full `DEPLOYMENT.md` guide or Supabase documentation.
