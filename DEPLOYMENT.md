# 🚀 Deployment Guide - MedVault Healthcare System

This guide will walk you through deploying your application to production using **Vercel** (frontend) and **Render** (backend).

---

## 📋 Prerequisites

- GitHub account with your repository
- Vercel account (sign up at https://vercel.com - free)
- Render account (sign up at https://render.com - free)
- MongoDB Atlas cluster (you already have this configured)

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Prepare Your Repository

Your repository is already configured! The `render.yaml` file has been created with the correct settings.

### Step 2: Deploy on Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click **"New +"** → **"Blueprint"**

2. **Connect GitHub Repository**
   - Select your repository: `HIS-Ready-Secure-Healthcare-Access-System`
   - Render will automatically detect the `render.yaml` file
   - Click **"Apply"**

3. **Set Environment Variables**
   
   In the Render dashboard, go to your service settings and add these environment variables:
   
   ```bash
   MONGO_URI=mongodb+srv://ayrus:HRxpfNn2iKvdFiqM@cluster0.ldikt7m.mongodb.net/secure_healthcare?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-key-change-this-in-production
   ```
   
   ⚠️ **IMPORTANT:** Generate a new JWT secret for production:
   ```bash
   openssl rand -hex 32
   ```
   Copy the output and use it as your `JWT_SECRET`.

4. **Deploy**
   - Render will automatically build and deploy your backend
   - Wait 3-5 minutes for the first deployment
   - Your API will be live at: `https://medvault-api.onrender.com` (or similar)

5. **Verify Backend**
   - Visit: `https://your-api-url.onrender.com/docs`
   - You should see the FastAPI Swagger documentation

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Configure Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Your Repository**
   - Select **"Import Git Repository"**
   - Choose: `HIS-Ready-Secure-Healthcare-Access-System`
   - Click **"Import"**

3. **Configure Build Settings**
   
   Vercel should auto-detect Next.js. Update these settings:
   
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install`

4. **Set Environment Variables**
   
   In the "Environment Variables" section, add:
   
   ```
   NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
   ```
   
   ⚠️ Replace `your-render-backend-url.onrender.com` with your actual Render API URL from Part 1

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for the build
   - Your frontend will be live at: `https://your-project.vercel.app`

---

## 🔐 Part 3: Configure CORS (CRITICAL!)

After both services are deployed, you need to update CORS settings in your backend.

### Update Backend CORS

1. Go to your Render dashboard
2. Open your service → **"Environment"** tab
3. Add a new environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. **Edit `backend/app/main.py`** (we'll do this via Git):

   Update the CORS configuration to use the environment variable:
   
   ```python
   import os
   
   # Update the origins list
   origins = [
       os.getenv("FRONTEND_URL", "http://localhost:3000"),
       "http://localhost:3000",  # Keep for local dev
   ]
   ```

5. Commit and push:
   ```bash
   git add backend/app/main.py
   git commit -m "Configure CORS for production deployment"
   git push origin main
   ```

6. Render will auto-deploy the update

---

## ✅ Part 4: Verify Deployment

### Test Your Production Application

1. **Visit your Vercel URL:**
   ```
   https://your-project.vercel.app
   ```

2. **Test Login Flow:**
   - Go to `/register` and create a test account
   - Login with the credentials
   - Verify the dashboard loads

3. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for any CORS errors
   - Check Network tab to see API calls going to your Render backend

4. **Test API Directly:**
   ```bash
   curl https://your-render-api.onrender.com/
   ```
   Should return: `{"message": "Secure Healthcare API"}`

---

## ⚙️ Part 5: Production Optimizations

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
