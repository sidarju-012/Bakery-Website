# Deploying **The Happy Oven** on GoDaddy (Frontend + Backend + DB)

This project is a **full‑stack** app:

- **Frontend**: React (Vite) → can be hosted as a **static site**
- **Backend**: Node/Express API → requires **application hosting** (Node runtime)
- **Database**: MongoDB Atlas (recommended) → **database hosting is already handled by Atlas**

GoDaddy can host this, but **the backend cannot run on basic “Shared Hosting” plans** unless your plan includes a **Node.js app runner** (cPanel “Setup Node.js App”) or you use a **VPS / Dedicated server**.

---

## 1) What hosting type do you need on GoDaddy?

### Option A (most common): **GoDaddy VPS**
Use this if:
- Your GoDaddy hosting **does not** show “Setup Node.js App” in cPanel, or
- You want full control (recommended for production).

You will host:
- Frontend static files via **Nginx**
- Backend via **Node + PM2** behind Nginx reverse proxy
- DB stays on MongoDB Atlas

### Option B: **cPanel hosting with Node.js support**
Use this if your cPanel has:
- **Software → Setup Node.js App** (or similar)

You will host:
- Frontend static in `public_html/`
- Backend via cPanel’s Node app runner
- DB stays on MongoDB Atlas

### MongoDB on GoDaddy?
- On **Shared Hosting**: usually **not supported**.
- On **VPS**: you *can* install MongoDB, but it’s more work and maintenance.
- **Recommended**: keep using **MongoDB Atlas**.

---

## 2) Before deployment: prepare production settings

### Backend port
Your repo currently runs backend on **5001** locally. In production you typically run on:
- An internal port like `5001` or `3001` (PM2),
- And expose it via Nginx reverse proxy on `https://yourdomain.com/api`.

### Frontend API URL
In production, set the frontend to call your real domain API, e.g.:
- `VITE_API_URL=https://yourdomain.com/api`

---

## 3) Deploy MongoDB (Database)

If you are using MongoDB Atlas (recommended):

1. In MongoDB Atlas, open **Network Access**
2. Add your server IP:
   - Best: add the **VPS public IP**
   - Temporary/testing: allow `0.0.0.0/0` (not recommended long-term)
3. Copy your Atlas connection string and set it on the backend server:
   - `MONGODB_URI="mongodb+srv://..."`

---

## 4) Deploy Frontend (Static Site)

### Build the frontend locally
From the project root:

```bash
npm install
npm run build
```

This creates the production frontend in:
- `dist/`

### Upload frontend to GoDaddy

#### If using cPanel:
1. Open **File Manager**
2. Go to `public_html/`
3. Upload **contents of `dist/`** (not the dist folder itself)

#### If using VPS (Nginx):
Copy `dist/` to your VPS, e.g.:

```bash
scp -r dist/* user@YOUR_VPS_IP:/var/www/happy-oven/
```

---

## 5) Deploy Backend (Node/Express API)

### Option A: VPS deployment (recommended)

#### A.1 SSH into the VPS

```bash
ssh user@YOUR_VPS_IP
```

#### A.2 Install Node.js (example for Ubuntu)
Use Node 18+:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

#### A.3 Upload backend code
You can upload the whole repo or only required files.
Example:

```bash
scp -r server package.json package-lock.json user@YOUR_VPS_IP:/opt/the-happy-oven/
```

#### A.4 Install dependencies on server

```bash
cd /opt/the-happy-oven
npm install --production
```

#### A.5 Create backend environment variables
Create `/opt/the-happy-oven/.env`:

```bash
PORT=5001
MONGODB_URI="YOUR_ATLAS_CONNECTION_STRING"
```

#### A.6 Run backend with PM2

```bash
sudo npm i -g pm2
pm2 start server/index.js --name happy-oven-api
pm2 save
pm2 startup
```

#### A.7 Configure Nginx reverse proxy
Install Nginx:

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

Create an Nginx site config, e.g.:

`/etc/nginx/sites-available/happy-oven`

```nginx
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;

  # Frontend static
  root /var/www/happy-oven;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Backend API
  location /api/ {
    proxy_pass http://127.0.0.1:5001/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/happy-oven /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### A.8 Enable HTTPS (recommended)
Use Let’s Encrypt:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### Option B: cPanel “Setup Node.js App”
(Exact steps vary by GoDaddy plan UI.)

High-level:
1. Open cPanel → **Setup Node.js App**
2. Create an app with:
   - Application root: folder where you upload backend (`server/` or repo root)
   - Startup file: `server/index.js`
   - Node version: 18+
3. Add environment variables in cPanel:
   - `MONGODB_URI=...`
   - `PORT=...` (often managed by cPanel, you may not set it)
4. Start the app

Important:
- You still need frontend static hosting separately in `public_html/`
- You must ensure your frontend calls the correct API URL:
  - `VITE_API_URL=https://yourdomain.com/api`

---

## 6) Final checklist (common issues)

- **Admin login fails**:
  - Confirm backend is running and frontend points to correct API (`VITE_API_URL`)
  - Confirm MongoDB Atlas allows your server IP
- **Frontend loads but API calls fail**:
  - Check CORS / proxy
  - Confirm `/api/health` works on your domain
- **React Router 404 on refresh**:
  - Ensure Nginx has: `try_files $uri $uri/ /index.html;`
  - On cPanel Apache, you may need an `.htaccess` rewrite
- **Images missing**:
  - Ensure images exist under `public/` and are deployed with frontend build

---

## 7) Recommended “Production” URL layout

- Frontend: `https://yourdomain.com/`
- API: `https://yourdomain.com/api/health`
- Admin: `https://yourdomain.com/admin/login`

---

## If you tell me your GoDaddy plan type
Reply with one of these and I’ll tailor the steps exactly:
- “GoDaddy Shared Hosting (cPanel)”
- “GoDaddy VPS”
- “GoDaddy Dedicated”

And tell me your domain name (e.g. `happyoven.in`) so I can fill in the exact config values.

---

## Hostinger instead?

If you want to deploy on Hostinger, see: `DEPLOY_HOSTINGER.md`


