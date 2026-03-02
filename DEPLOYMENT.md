# Sivakasi Crackers Deployment Guide

This project is now split into three separate parts for maximum security and performance.

## 🚨 IF UPDATES ARE NOT SHOWING (FIX)
If you update in Admin but the Shop doesn't change, it means your **Environment Variables** are missing in Vercel.

**Do this for BOTH the Shop and Admin projects in Vercel:**
1.  Go to your **Vercel Dashboard**.
2.  Click on your **Project > Settings > Environment Variables**.
3.  Add this variable:
    - **Key**: `REACT_APP_API_URL`
    - **Value**: `https://ecom-rne9.onrender.com`
4.  Go to the **Deployments** tab and click **"Redeploy"** on the latest build.

*Once you do this, the Admin will correctly talk to your backend instead of "localhost".*

---

## ⚡ ONE-CLICK DEPLOY
Run this single command to build both Shop and Admin apps automatically:
```bash
npm run deploy
```
*This script installs dependencies, builds both apps, and tells you exactly how to push to GitHub.*

---

## 🚀 Automatic Deployment (Highly Recommended)
I have set up **GitHub Actions** so your site updates automatically when you push code to GitHub.

### 1. Setup GitHub Secrets (For Frontend & Meta-Deployment)
In your GitHub Repository, go to **Settings > Secrets and variables > Actions** and add these:
- `VERCEL_TOKEN`: Your Vercel API Token (from Vercel Account Settings).
- `VERCEL_ORG_ID`: Your Vercel User/Org ID.
- `VERCEL_PROJECT_ID`: Your Vercel Project ID.
- `RENDER_DEPLOY_HOOK_URL`: Your Render "Deploy Hook" URL (found in Render Service Settings).
- `REACT_APP_API_URL`: Your full production backend URL (e.g., `https://sivakasi-backend.onrender.com`).

---

## 🚀 2. Backend Environment Variables (On Render/Hosting)
You MUST add these to your Render web service environment settings:
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: A long random string for security.
- `FRONTEND_URL`: Your Shop URL (e.g., `https://yoursite.com`).
- `RAZORPAY_KEY_ID`: Your actual Razorpay Key.
- `RAZORPAY_KEY_SECRET`: Your actual Razorpay Secret.
- `EMAIL_USER` / `EMAIL_PASS`: For sending order confirmations.
- `TWILIO_SID` / `TWILIO_TOKEN`: For SMS notifications.

---

### 3. First Time Push
Run these commands in your terminal to link and push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3. How it works
- Push to `main` branch → **Auto Deploy**.
- The `Shop` and `Admin` are built separately and pushed to Vercel.
- The `Backend` is notified via the Render Hook to pull the latest code.

---

## 🛠️ Manual Deployment
If you prefer to deploy manually:

### 1. Frontend: Shop (Customer Site)
- **Location**: `frontend/build-shop/`
- **What to do**: Upload the **contents** of this folder to your public hosting (e.g., Vercel, Netlify, or your main domain).
- **Security**: This build contains **zero** Admin code.

## 2. Frontend: Admin (Owner Portal)
- **Location**: `frontend/build-admin/`
- **What to do**: Upload the **contents** of this folder to a private URL or a separate subdomain (e.g., `admin.yoursite.com`).
- **Security**: This belongs ONLY to the owner.

## 3. Backend: API Server
- **Location**: `backend/`
- **What to do**: Deploy this on a Node.js host (e.g., Render, Railway, or a VPS).
- **Setup**:
  - Set your `MONGODB_URI` in the environment variables.
  - Set `REACT_APP_API_URL` when building the frontend to point to this backend.

---

## 🔐 How to Deploy Admin (Owner Portal)
Since the Admin is a separate build for security, follow these steps to deploy it on Vercel:

1.  **Create a New Project** in Vercel.
2.  Import your `Ecom` repository again.
3.  **Project Settings**:
    - **Root Directory**: `frontend`
    - **Build Command**: `npm run build:admin`
    - **Output Directory**: `build-admin`
4.  **Environment Variables**:
    - Add `REACT_APP_API_URL`: `https://your-backend.onrender.com`
5.  **Deploy**: This will give you a private URL just for your admin panel.

---

### Build Commands (if you change code)
If you make changes and need to rebuild:
```bash
# In the frontend directory:
npm run build:shop    # Creates build-shop/
npm run build:admin   # Creates build-admin/
```

### Static Serving (Local Test)
To test the production builds locally:
```bash
# Install serve
npm install -g serve

# Serve Shop
serve -s frontend/build-shop -l 4000

# Serve Admin
serve -s frontend/build-admin -l 4001
```
