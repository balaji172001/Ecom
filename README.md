# 🎆 Sri Ram Ballaji Agency - Complete E-Commerce Platform

## Project Structure

```
sivakasi-crackers/
├── frontend/                 # React.js Customer App
│   ├── src/
│   │   ├── index.jsx         ← Main shop (provided)
│   │   ├── admin.jsx         ← Admin panel (provided)
│   │   └── ...
│   └── package.json
├── backend/
│   ├── server.js             ← Express API (provided)
│   ├── .env                  ← Environment variables
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. One-repo setup

This repository combines the frontend and backend into a single workspace. From the repo root:

```bash
cd /Users/balajig/Downloads/sivakasi-crackers
# Install deps for both projects
npm run install:all

# Start backend only
npm run start:backend

# Start frontend only
npm run start:frontend

# Or start both (runs backend in background then frontend)
npm start
```

> Notes:
> - The frontend expects a CRA-style app (react-scripts). If you prefer Next.js, move files to a Next app.
> - The backend uses `node server.js` to run the Express server.

For full original README and implementation details see the provided attachments that were used to create this monorepo.
