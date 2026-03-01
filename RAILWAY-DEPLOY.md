# 🚀 Quick Railway Deployment - MedVault

**Deploy your full-stack healthcare system in 10 minutes using Railway!**

---

## Why Railway?

- ✅ **Simple Monorepo Support** - Deploys both backend + frontend from one repo
- ✅ **Auto-Detection** - Automatically detects Python and Next.js
- ✅ **No Sleep Time** - Your app stays awake 24/7 (unlike Render free tier)
- ✅ **One Platform** - Manage everything in one dashboard
- ✅ **Usage-Based Pricing** - Only pay for what you use (~$5-10/month)

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Account

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with GitHub (easiest option)
4. You get **$5 free credit** to start!

### Step 2: Deploy Backend

1. Click **"Deploy from GitHub repo"**
2. Authorize Railway to access your GitHub
3. Select: `HIS-Ready-Secure-Healthcare-Access-System`
4. Railway will scan your repo

5. **Add Backend Service:**
   - Click **"Add Service"**
   - Select the `backend` folder
   - Railway auto-detects Python!

6. **Add Environment Variables:**
   - Click on the backend service card
   - Go to **"Variables"** tab
   - Click **"New Variable"** and add these:

   ```bash
   MONGO_URI=mongodb+srv://ayrus:HRxpfNn2iKvdFiqM@cluster0.ldikt7m.mongodb.net/secure_healthcare
   JWT_SECRET=6db591ed429ab94a6a0b19ad7378b15118969a7d4635868a56b6ab2d4d741f29
   ```

7. **Generate Public URL:**
   - Click **"Settings"** tab
   - Scroll to **"Public Networking"**
   - Click **"Generate Domain"**
   - **COPY THIS URL!** You'll need it for the frontend
   - Example: `https://backend-production-xxxx.up.railway.app`

8. **Wait for deployment** (2-3 minutes)
   - Watch the logs in the **"Deployments"** tab
   - Look for: `Application startup complete`

### Step 3: Deploy Frontend

1. Back to project dashboard, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose the same repository again
4. This time select the `frontend` folder

5. **Add Environment Variable:**
   - Click on the frontend service card
   - Go to **"Variables"** tab
   - Add:

   ```bash
   NEXT_PUBLIC_API_URL=<paste-your-backend-url-from-step-2>
   ```

   **IMPORTANT:** Replace with your actual backend URL (no trailing slash)
   Example: `https://backend-production-abc123.up.railway.app`

6. **Generate Public URL:**
   - Click **"Settings"** tab
   - Scroll to **"Public Networking"**
   - Click **"Generate Domain"**
   - **THIS IS YOUR APP URL!** 🎉

7. **Wait for deployment** (3-4 minutes)
   - Next.js build takes a bit longer
   - Watch for: `Ready on http://...`

### Step 4: Update Backend CORS

Now connect the frontend to backend:

1. Go back to **backend service**
2. Click **"Variables"** tab
3. Add one more variable:

   ```bash
   FRONTEND_URL=<paste-your-frontend-url>
   ```

   Example: `https://frontend-production-xyz789.up.railway.app`

4. Backend will auto-redeploy (watch the **"Deployments"** tab)

### Step 5: Test Your App! 🎉

1. **Open your frontend URL** from Step 3
2. You should see the MedVault login page!
3. Try:
   - Register a new account
   - Login
   - Access the dashboard
4. Check browser console (F12) for any errors

---

## 🎯 Quick Verification Checklist

- [ ] Backend shows "Application startup complete" in logs
- [ ] Frontend shows "Ready on http://..." in logs
- [ ] Can access frontend URL in browser
- [ ] Can register/login successfully
- [ ] No CORS errors in browser console
- [ ] API calls work (check Network tab)

---

## 📊 View Your Services

**Railway Dashboard:** https://railway.app/dashboard

You'll see two services:
- 🐍 **backend** - Your FastAPI service
- ⚛️ **frontend** - Your Next.js app

Click each to view:
- Real-time logs
- Metrics (CPU, Memory, Network)
- Environment variables
- Deployments history

---

## 🔄 Auto-Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Added new feature"
git push origin main

# Railway automatically:
# 1. Detects the push
# 2. Rebuilds affected services
# 3. Deploys new version
# 4. Shows status in dashboard
```

No manual deployment needed! 🚀

---

## 💰 Costs

**Your First Month:**
- $5 free credit (included)
- Typical usage: ~$5-10/month
  - Backend: $3-5/month
  - Frontend: $2-5/month

**What's Included:**
- Unlimited deployments
- Custom domains + SSL
- Metrics & monitoring
- 24/7 uptime (no sleep)
- Auto-scaling

**MongoDB Atlas:**
- Free 512MB tier (enough for testing)

---

## 🐛 Common Issues

### Build Fails

**Problem:** "Command not found" or build errors

**Solution:**
1. Check the **"Deployments"** tab → Click latest deployment
2. Read the build logs carefully
3. Verify `nixpacks.toml` exists in the service folder
4. Check that `requirements.txt` (backend) or `package.json` (frontend) is correct

### Can't Connect to Database

**Problem:** MongoDB connection timeout

**Solution:**
1. Go to **MongoDB Atlas** → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**
5. Wait 2 minutes, then redeploy backend

### CORS Errors

**Problem:** Browser console shows CORS errors

**Solution:**
1. Verify `FRONTEND_URL` is set in backend variables (Step 4)
2. Make sure it matches your actual frontend URL
3. No trailing slash in the URL
4. Redeploy backend after adding the variable

### Frontend Can't Reach Backend

**Problem:** API calls fail, network errors

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` in frontend variables
2. Make sure it points to backend public URL
3. Test backend directly: Visit `https://your-backend.up.railway.app/` in browser
4. Should show: `{"message": "Healthcare Secure API running"}`

---

## 🎯 Production Checklist

Before going live with real users:

- [ ] Change `JWT_SECRET` to a new random value
- [ ] Set up custom domain (optional but recommended)
- [ ] Enable MongoDB authentication
- [ ] Review MongoDB Network Access settings
- [ ] Test all user flows (admin, doctor, patient)
- [ ] Monitor resource usage for first week
- [ ] Set up Railway usage alerts

---

## 📞 Need Help?

**Railway Resources:**
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**Project Issues:**
- Check Railway logs first
- Review this guide's troubleshooting section
- Verify all environment variables are set correctly

---

## 🎉 Success!

Your MedVault system is now live on Railway!

**Share your URLs:**
- Frontend: `https://your-app.up.railway.app`
- API Docs: `https://your-api.up.railway.app/docs`

Happy deploying! 🚀🏥
