# Deploying **The Happy Oven** on Hostinger (Frontend + Backend + DB)

This project is a **full‑stack** app:

- **Frontend**: React (Vite) → can be hosted as a **static site**
- **Backend**: Node/Express API → needs **application hosting** (Node runtime)
- **Database**: MongoDB Atlas (recommended) → **database hosting is already handled by Atlas**

---

## 1) Is it possible on Hostinger?

Yes — but the backend requires either:

- **Hostinger VPS** (recommended), or
- A Hostinger plan that supports running **Node.js apps** (shared hosting usually does **not**).

If you only have **Shared Web Hosting**, you can still host the **frontend** there, but you should host the **backend elsewhere** (or upgrade to VPS).

---

## 2) Hosting category mapping (what your app is)

- **Application hosting**: ✅ Backend (Node/Express)
- **Static site hosting**: ✅ Frontend build (`dist/`)
- **Database hosting**: ✅ MongoDB Atlas
- **Object storage**: Optional (only needed if you later add user uploads/CDN)

---

## 3) Recommended setup for Hostinger: **VPS**

You’ll run:

- **Nginx** for the frontend static site + reverse proxy
- **Node + PM2** for the backend API (running on internal port 5001)
- MongoDB stays on **Atlas**

### 3.1 Buy/prepare the VPS

In Hostinger **hPanel**:

1. Go to **VPS**
2. Create a VPS with Ubuntu (recommended)
3. Enable **SSH access** and note:
   - VPS public IP
   - SSH username/password or SSH key

### 3.2 Point your domain to the VPS (DNS)

In hPanel → **DNS Zone Editor**:

- Create / update **A record**:
  - `@` → `YOUR_VPS_IP`
  - `www` → `YOUR_VPS_IP`

Wait for DNS propagation (often 5–30 minutes, sometimes longer).

---

## 4) MongoDB Atlas (Database)

Keep MongoDB Atlas (recommended):

1. Atlas → **Network Access**
2. Add **your VPS public IP**
3. Copy the connection string:
   - `mongodb+srv://...`
4. You’ll set it on the VPS in `.env` as `MONGODB_URI`

---

## 5) Deploy Frontend (Static)

### 5.1 Build locally

From project root:

```bash
npm install
npm run build
```

This creates the production build in:
- `dist/`

### 5.2 Upload to VPS

Example upload:

```bash
scp -r dist/* user@YOUR_VPS_IP:/var/www/happy-oven/
```

On the VPS, ensure the folder exists:

```bash
sudo mkdir -p /var/www/happy-oven
sudo chown -R $USER:$USER /var/www/happy-oven
```

---

## 6) Deploy Backend (Node/Express API)

### 6.1 SSH into VPS

```bash
ssh user@YOUR_VPS_IP
```

### 6.2 Install Node.js (Node 20 example)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

### 6.3 Upload backend code

Upload at least these to the VPS:
- `server/`
- `package.json`
- `package-lock.json`

Example:

```bash
scp -r server package.json package-lock.json user@YOUR_VPS_IP:/opt/the-happy-oven/
```

### 6.4 Install dependencies

```bash
cd /opt/the-happy-oven
npm install --production
```

### 6.5 Create `.env` on VPS

Create `/opt/the-happy-oven/.env`:

```bash
PORT=5001
MONGODB_URI="YOUR_ATLAS_CONNECTION_STRING"
```

### 6.6 Run backend using PM2

```bash
sudo npm i -g pm2
pm2 start server/index.js --name happy-oven-api
pm2 save
pm2 startup
```

---

## 7) Nginx: serve frontend + reverse proxy `/api`

### 7.1 Install Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 7.2 Create Nginx site config

Create:

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

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/happy-oven /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Test:
- `http://yourdomain.com/`
- `http://yourdomain.com/api/health`

---

## 8) HTTPS (SSL)

If you’re using VPS, easiest is Let’s Encrypt:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 9) Frontend API URL in production

Your frontend should call:
- `https://yourdomain.com/api`

Best practice: create a `.env.production` locally before build:

```env
VITE_API_URL=https://yourdomain.com/api
```

Then rebuild:

```bash
npm run build
```

Upload the new `dist/` contents again.

---

## 10) If you only have Hostinger Shared Hosting (no VPS)

You can do:

- **Frontend** on Hostinger Shared Hosting (upload `dist/` to `public_html/`)
- **Backend** on a Node hosting provider (Render / Railway / VPS / etc.)
- **DB** on MongoDB Atlas

Then set:

```env
VITE_API_URL=https://YOUR_BACKEND_DOMAIN/api
```

and rebuild + upload frontend.

---

## 11) Common issues checklist

- **Admin login fails**:
  - Ensure frontend points to the correct API domain (`VITE_API_URL`)
  - Ensure MongoDB Atlas allows your VPS IP
- **React Router 404 on refresh**:
  - Nginx must have `try_files $uri $uri/ /index.html;`
- **Images missing**:
  - Confirm the images exist under `public/` and got deployed
- **CORS errors**:
  - If frontend and backend are on different domains, configure CORS in Express

---

## If you tell me your Hostinger plan type
Reply with:
- **Hostinger VPS** (yes/no)
- Your **domain name**

and I’ll tailor the exact DNS values and final production URLs for your setup.


