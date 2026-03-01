# Sivakasi Crackers Deployment Guide

This project is now split into three separate parts for maximum security and performance.

## 🚀 Automatic Deployment (Highly Recommended)
I have set up **GitHub Actions** so your site updates automatically when you push code to GitHub.

### 1. Setup GitHub Secrets
In your GitHub Repository, go to **Settings > Secrets and variables > Actions** and add these:
- `VERCEL_TOKEN`: Your Vercel API Token.
- `VERCEL_ORG_ID`: Your Vercel Organization ID.
- `VERCEL_PROJECT_ID`: Your Vercel Project ID.
- `RENDER_DEPLOY_HOOK_URL`: Your Render Deployment Hook URL (for the backend).
- `REACT_APP_API_URL`: Your production backend URL (e.g., `https://api.yoursite.com`).

### 2. How it works
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
