# 🚀 Deployment Guide - MedVault Healthcare System

This guide will walk you through deploying your application to production using **Railway** - a modern platform that makes deploying full-stack applications incredibly simple.

---

## 📋 Prerequisites

- GitHub account with your repository
- Railway account (sign up at https://railway.app - $5 credit free, then ~$5/month)
- MongoDB Atlas cluster (you already have this configured)

---

## 🚀 Deploy to Railway (All-in-One Solution)

Railway will automatically detect and deploy both your backend and frontend from the same repository!

### Step 1: Create Railway Project

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Click **"Start a New Project"**
   - Select **"Deploy from GitHub repo"**

2. **Connect GitHub**
   - Authorize Railway to access your GitHub
   - Select repository: `HIS-Ready-Secure-Healthcare-Access-System`
   - Railway will detect your monorepo structure automatically

### Step 2: Deploy Backend Service

1. **Railway will detect multiple services** (backend and frontend)
2. Click **"Add Service"** → Select `backend` folder
3. Railway auto-detects Python and uses `nixpacks.toml` config
4. Click on the backend service card

5. **Add Environment Variables:**
   - Click **"Variables"** tab
   - Add these variables:
   ```bash
   MONGO_URI=mongodb+srv://ayrus:HRxpfNn2iKvdFiqM@cluster0.ldikt7m.mongodb.net/secure_healthcare
   JWT_SECRET=6db591ed429ab94a6a0b19ad7378b15118969a7d4635868a56b6ab2d4d741f29
   ```

6. **Generate Public Domain:**
   - Click **"Settings"** tab
   - Scroll to **"Networking"**
   - Click **"Generate Domain"**
   - Copy the backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)

### Step 3: Deploy Frontend Service

1. Back in the project dashboard, click **"New Service"**
2. Select **"Deploy from GitHub repo"** again
3. Choose the same repository
4. Select `frontend` folder
5. Railway auto-detects Next.js

6. **Add Environment Variable:**
   - Click **"Variables"** tab
   - Add:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-url-from-step-2.up.railway.app
   ```
   Replace with your actual backend URL from Step 2!

7. **Generate Public Domain:**
   - Click **"Settings"** tab
   - Scroll to **"Networking"**
   - Click **"Generate Domain"**
   - Your frontend will be live! 🎉

### Step 4: Update CORS

Now that both services are deployed, update the backend to allow the frontend domain:

1. Go to backend service → **"Variables"** tab
2. Add:
   ```bash
   FRONTEND_URL=https://your-frontend-url.up.railway.app
   ```
3. Backend will automatically redeploy

### Step 5: Verify Deployment

1. **Visit your frontend URL** (from Step 3)
2. Try logging in / registering
3. Check browser console for errors
4. Test the full workflow

---

## ✅ That's It! 

Both services are now live and talking to each other!

### 1. Custom Domain (Optional)

**For Vercel (Frontend):**
- Go to Project Settings → Domains
- Add your custom domain (e.g., `medvault.yourhospital.com`)
- Update DNS records as instructed

**For Render (Backend):**
- Go to Service Settings → Custom Domain
- Add subdomain (e.g., `api.medvault.yourhospital.com`)
- Update DNS records

### 2. Enable HTTPS Everywhere

Both Vercel and Render provide automatic HTTPS certificates. Ensure:
- All API calls use `https://`
- No mixed content warnings in browser

### 3. Database Connection Pooling

Update MongoDB connection in production for better performance:

```python
# backend/app/database.py
from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(
    MONGO_URI,
    maxPoolSize=50,
    minPoolSize=10,
    maxIdleTimeMS=45000,
    serverSelectionTimeoutMS=5000
)
```

### 4. Enable Monitoring

**Render:**
- Enable "Health Check" in service settings
- Path: `/` (already configured)
- Check interval: 30 seconds

**Vercel:**
- Analytics are automatically enabled
- View in: Project → Analytics tab

---

## 🔄 Continuous Deployment

Both platforms are configured for **automatic deployment**:

✅ **Every time you push to `main` branch:**
- Render rebuilds and deploys the backend
- Vercel rebuilds and deploys the frontend

To deploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Wait 2-5 minutes and your changes will be live!

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** API returns 500 errors
- **Solution:** Check Render logs (Dashboard → Logs tab)
- Verify environment variables are set correctly

**Problem:** Database connection fails
- **Solution:** Check MongoDB Atlas network access settings
- Add `0.0.0.0/0` to IP whitelist (or Render's IP addresses)

**Problem:** Build fails on Render
- **Solution:** Check Python version compatibility
- Verify `requirements.txt` is correct

### Frontend Issues

**Problem:** API calls fail with CORS errors
- **Solution:** Verify CORS configuration in `main.py`
- Ensure `FRONTEND_URL` environment variable is set on Render

**Problem:** Environment variable not working
- **Solution:** Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding environment variables

**Problem:** Build fails on Vercel
- **Solution:** Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Issues

**Problem:** MongoDB connection timeout
- **Solution:** 
  1. Go to MongoDB Atlas → Network Access
  2. Click "Add IP Address"
  3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
  4. Save

**Problem:** Authentication failed
- **Solution:** Verify `MONGO_URI` connection string has correct credentials

---

## 📊 Monitoring URLs

After deployment, bookmark these:

- **Frontend:** `https://your-project.vercel.app`
- **Backend API:** `https://your-api.onrender.com`
- **API Docs:** `https://your-api.onrender.com/docs`
- **Vercel Dashboard:** `https://vercel.com/dashboard`
- **Render Dashboard:** `https://dashboard.render.com`
- **MongoDB Atlas:** `https://cloud.mongodb.com`

---

## 🎉 You're Live!

Your secure healthcare access system is now deployed and accessible worldwide!

### Next Steps:

1. ✅ Test all features in production
2. ✅ Create admin and doctor accounts
3. ✅ Monitor logs for the first few days
4. ✅ Set up custom domain (optional)
5. ✅ Enable monitoring alerts
6. ✅ Document your production URLs

---

## 💰 Cost Breakdown

**Free Tier (Current Setup):**
- ✅ Vercel: Free forever for hobby projects
- ✅ Render: 750 hours/month free (enough for 1 service running 24/7)
- ✅ MongoDB Atlas: 512MB free tier

**Total Monthly Cost:** $0 🎉

**If you need to scale:**
- Render Pro: $7/month (better performance, no sleep)
- Vercel Pro: $20/month (team features, more bandwidth)
- MongoDB M10: $57/month (dedicated cluster, better performance)

---

## 📞 Support

If you encounter issues:
- Check the troubleshooting section above
- Review Render/Vercel logs for error messages
- Verify all environment variables are set correctly

Good luck with your deployment! 🚀
