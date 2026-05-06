# Charm-Sutra — Jewelry CRM & Invoicing System
## Production Deployment Guide (Hostinger Node.js)

---

## Prerequisites

- Node.js **v20 or higher** installed on your server
- A **PostgreSQL** database (see database options below)
- A domain name pointed to your server

---

## Step 1 — Upload Files

Upload the entire `charm-sutra-production/` folder contents to your Hostinger Node.js server root (usually `~/public_html` or the path shown in your Hostinger panel).

Your server directory should look like:
```
your-app-root/
├── server/
│   ├── index.mjs
│   ├── pino-*.mjs
│   ├── thread-stream-worker.mjs
│   ├── public/           ← React frontend
│   └── uploads/          ← Product & customer images
├── db-setup/
├── logs/                 ← Create this folder (for PM2 logs)
├── .env
├── package.json
└── ecosystem.config.cjs
```

---

## Step 2 — Set Up PostgreSQL Database

You need a PostgreSQL database. Choose one of:

### Option A — External Free Databases (Recommended for Hostinger)
- **Neon.tech** (free, PostgreSQL): https://neon.tech
- **Supabase** (free, PostgreSQL): https://supabase.com
- **Aiven** (free tier): https://aiven.io

### Option B — Hostinger VPS PostgreSQL
If your Hostinger plan is a VPS, install PostgreSQL:
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE USER charm_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "CREATE DATABASE charm_sutra OWNER charm_user;"
```

---

## Step 3 — Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit it with your values
nano .env
```

Fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `SESSION_SECRET` — a long random secret (minimum 32 characters)
- `PORT` — keep as 3000 (or whatever Hostinger assigns)

---

## Step 4 — Install Dependencies

```bash
# In your app root — installs 'sharp' (image processing)
npm install
```

---

## Step 5 — Create Database Tables

```bash
# Go to db-setup folder
cd db-setup

# Install drizzle tools
npm install

# Push the schema to your database
# (reads DATABASE_URL from parent .env automatically, or set it inline)
DATABASE_URL="your-connection-string-here" npm run push
```

This creates all required tables automatically. You only do this **once** when setting up, and again only if you update the app.

---

## Step 6 — Start the Application

### Option A — Using PM2 (Recommended — keeps running after SSH disconnect)

```bash
# Install PM2 globally
npm install -g pm2

# Go back to app root
cd ..

# Start the app
pm2 start ecosystem.config.cjs

# Check it's running
pm2 status

# View logs
pm2 logs charm-sutra

# Auto-start on server reboot
pm2 startup
pm2 save
```

### Option B — Direct Node.js (for testing only)

```bash
# Load env and start
PORT=3000 NODE_ENV=production DATABASE_URL="your-db-url" SESSION_SECRET="your-secret" node --enable-source-maps ./server/index.mjs
```

---

## Step 7 — Configure Hostinger to Route Traffic

In your Hostinger control panel (hPanel):
1. Go to **Websites → Manage → Node.js**
2. Set the **Entry Point** to: `server/index.mjs`
3. Set **Node.js version** to: `20.x` or higher
4. Set **Application Mode** to: `Production`
5. Add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = (use the port Hostinger assigns — usually shown in the panel)
   - `DATABASE_URL` = your PostgreSQL connection string
   - `SESSION_SECRET` = your secret key

> **Note:** If using Hostinger's Node.js panel, you may not need PM2 — Hostinger manages the process. Check their documentation for your specific plan.

---

## Step 8 — First Login

Once running, open your domain in a browser.

Default admin credentials:
- **Username:** `Admin`
- **Password:** `admin123`

**Change the password immediately** after first login via Settings → Users.

---

## File Uploads & Images

Product and customer images are stored in the `server/uploads/` folder. The existing images from your development environment are already included in this package.

Make sure the `uploads/` folder is **writable** by the Node.js process:
```bash
chmod 755 server/uploads/
```

---

## Updating the App

When you get a new version of Charm-Sutra:
1. Download the new production package
2. Replace `server/index.mjs` and `server/public/` with the new files
3. Keep your `server/uploads/`, `.env`, and `logs/` unchanged
4. Run `cd db-setup && DATABASE_URL="..." npm run push` to apply any schema changes
5. Restart: `pm2 restart charm-sutra`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't start | Check `pm2 logs charm-sutra` or `logs/error.log` for errors |
| Database connection failed | Verify `DATABASE_URL` in `.env` and that your DB allows connections from your server IP |
| Images not loading | Check that `server/uploads/` exists and is readable |
| 502 Bad Gateway | The Node.js process crashed — check logs and restart with `pm2 restart charm-sutra` |
| Login not working | Make sure `SESSION_SECRET` is set in `.env` |

---

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express 5
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** JWT tokens

---

*Charm-Sutra CRM v1.0 — Built with Replit*
