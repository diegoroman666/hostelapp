# 🚀 Deployment Guide - HostelHub

This guide will walk you through deploying your hostel management system to production using Supabase and Vercel.

---

## 📋 Prerequisites

- GitHub account
- Supabase account (free tier available)
- Vercel account (free tier available)

---

## 🗄️ Part 1: Supabase Database Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Fill in the project details:
   - **Name**: `hostel-management` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

### Step 2: Run Database Schema

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `database-setup.sql` from your project
4. Copy the entire contents and paste it into the SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. You should see a success message: "Success. No rows returned"

### Step 3: Create Manager User

1. In Supabase dashboard, go to **"Authentication"** > **"Users"**
2. Click **"Add user"** dropdown > **"Create new user"**
3. Fill in the credentials:
   - **Email**: `manager@scorpius.com`
   - **Password**: `Mg7!xL$9pQw2#vR`
   - **Auto Confirm User**: ✅ Check this box
4. Click **"Create user"**

### Step 4: Get Your Supabase Credentials

1. In Supabase dashboard, go to **"Settings"** > **"API"**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
3. Keep these values handy - you'll need them in the next steps

---

## 🌐 Part 2: Vercel Deployment

### Step 1: Push Code to GitHub

1. Open your terminal in the project directory
2. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Hostel Management System"
   ```
3. Create a new repository on GitHub:
   - Go to [https://github.com/new](https://github.com/new)
   - Name it `hostel-management`
   - **Do NOT** initialize with README
   - Click **"Create repository"**
4. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hostel-management.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New..."** > **"Project"**
3. Click **"Import Git Repository"**
4. Select your `hostel-management` repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### Step 3: Add Environment Variables

1. Before clicking "Deploy", expand **"Environment Variables"**
2. Add the following variables:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key |

3. Click **"Deploy"**
4. Wait 2-3 minutes for the deployment to complete

### Step 4: Access Your Application

1. Once deployed, Vercel will provide you with a URL like: `https://hostel-management-xxxxx.vercel.app`
2. Click on the URL to open your application
3. Your hostel management system is now live! 🎉

---

## 🔐 Part 3: First Login

### Manager Access

1. Navigate to your deployed URL
2. Click **"Manager Login"** in the navigation bar
3. Login with:
   - **Email**: `manager@scorpius.com`
   - **Password**: `Mg7!xL$9pQw2#vR`
4. You'll be redirected to the Dashboard

### ⚠️ IMPORTANT: Change Default Password

1. After first login, go to Supabase Dashboard
2. Navigate to **"Authentication"** > **"Users"**
3. Click on the manager user
4. Click **"Send password recovery"** to set a new password
5. Or update the password directly in the dashboard

---

## 🎨 Part 4: Customize Your Hostel

### Update Site Settings

1. Login to the Manager Dashboard
2. Click **"⚙️ Settings"** tab
3. Update:
   - **Hostel Name**: Your actual hostel name
   - **Hero Description**: Your welcome message
   - **Hero Image URL**: URL to your hostel's hero image

### Add/Edit Services

1. Go to **"🛎️ Services"** tab
2. Edit existing services or add new ones:
   - Towel rental
   - Tour packages
   - Parking
   - etc.

### Add/Edit Room Types

1. Go to **"🏠 Rooms"** tab
2. Edit existing room types or add new ones
3. Update prices according to your actual rates
4. Add real images of your rooms

---

## 📱 Part 5: Custom Domain (Optional)

### Add Your Own Domain

1. In Vercel dashboard, go to your project
2. Click **"Settings"** > **"Domains"**
3. Click **"Add"**
4. Enter your domain (e.g., `booking.yourhostel.com`)
5. Follow the DNS configuration instructions
6. Wait for DNS propagation (can take up to 48 hours)

---

## 🔄 Part 6: Updating Your Application

### Deploy Updates

Whenever you make changes to your code:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
2. Vercel will automatically detect the push and redeploy
3. Your changes will be live in 2-3 minutes

---

## 🛠️ Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and anon key in Vercel environment variables
- Check that RLS policies are enabled in Supabase
- Ensure the manager user exists in Supabase Auth

### Build Failures

- Check the Vercel build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify that `.env` is NOT committed to git (it's in `.gitignore`)

### Authentication Issues

- Verify the manager email exists in both `managers` table AND Supabase Auth
- Check that the password is correct
- Clear browser cache and cookies

---

## 📊 Monitoring

### Vercel Analytics

1. In Vercel dashboard, go to **"Analytics"**
2. View page views, performance metrics, and user behavior

### Supabase Logs

1. In Supabase dashboard, go to **"Logs"**
2. Monitor database queries and API requests

---

## 🎉 You're All Set!

Your hostel management system is now live and ready to accept bookings!

### Next Steps:

- ✅ Test the booking flow as a guest
- ✅ Add real room images and descriptions
- ✅ Update service offerings and prices
- ✅ Share the booking link with your guests
- ✅ Monitor bookings through the dashboard

### Support

If you encounter any issues, check:
- Vercel deployment logs
- Supabase database logs
- Browser console for errors

---

**Made with ❤️ for hostel management**
