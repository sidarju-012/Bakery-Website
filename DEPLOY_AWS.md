# Deploying **The Happy Oven** on AWS (Frontend + Backend + Domain + DB)

You can absolutely deploy this using cloud providers like **AWS**. Your project is a **full‑stack app**:

- **Frontend**: React (Vite) → best hosted as a **static website** (S3 + CloudFront)
- **Backend**: Node/Express API → run on an **application compute** (Lightsail / EC2 / Elastic Beanstalk / ECS)
- **Database**: MongoDB Atlas → keep it hosted on Atlas (recommended; simplest + reliable)

This guide focuses on **production-ready but simple** setups.

---

## Recommended AWS architecture (simple + common)

- **Frontend**: S3 (static files) + CloudFront (CDN + HTTPS)
- **Backend**: Lightsail (or EC2) running Node + PM2 behind Nginx
- **Domain**: Route 53 (optional) or external registrar → points to CloudFront and backend
- **DB**: MongoDB Atlas

---

## 0) AWS “free credits” / low-cost options

AWS sometimes provides credits via programs like:
- **AWS Free Tier** (some services free within limits)
- **AWS Activate** (startup credits if eligible)
- **AWS Educate** (student credits if eligible)

Even with credits, always set **billing alerts** to avoid surprises.

### Set a billing alarm (highly recommended)
- AWS Console → **Billing** → **Budgets** → Create budget + alerts (email).

---

## 1) Prerequisites

- An AWS account + MFA enabled
- A custom domain (you can buy anywhere: GoDaddy, Namecheap, etc.)
- MongoDB Atlas cluster + DB user
- Your app builds successfully locally:

```bash
npm install
npm run build
```

---

## 2) Database: MongoDB Atlas (recommended)

1. Atlas → **Network Access**
2. Add your backend server’s public IP (Lightsail/EC2)
3. Atlas connection string → set on backend server as:
   - `MONGODB_URI="mongodb+srv://..."`

Tip: If your server IP can change, use a static IP (Lightsail Static IP / EC2 Elastic IP).

---

## 3) Backend deployment path A (easiest): **AWS Lightsail**

Lightsail is simpler than EC2 and often cheaper for small apps.

### 3.1 Create a Lightsail instance
AWS Console → Lightsail:

- Create instance
- OS: **Ubuntu**
- Plan: smallest that fits your needs
- Enable **Static IP** (recommended)

### 3.2 SSH into the instance
Use Lightsail browser SSH or your own terminal:

```bash
ssh ubuntu@YOUR_STATIC_IP
```

### 3.3 Install Node.js + Nginx + PM2

```bash
sudo apt-get update
sudo apt-get install -y nginx

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo npm i -g pm2
```

### 3.4 Upload your backend code to the server
Copy these files/folders:
- `server/`
- `package.json`
- `package-lock.json`

Example:

```bash
scp -r server package.json package-lock.json ubuntu@YOUR_STATIC_IP:/opt/the-happy-oven/
```

Then:

```bash
cd /opt/the-happy-oven
npm install --production
```

### 3.5 Create backend `.env`
Create `/opt/the-happy-oven/.env`:

```env
PORT=5001
MONGODB_URI="YOUR_ATLAS_CONNECTION_STRING"
```

### 3.6 Start backend with PM2

```bash
pm2 start server/index.js --name happy-oven-api
pm2 save
pm2 startup
```

Confirm:

```bash
curl http://127.0.0.1:5001/api/health
```

### 3.7 Configure Nginx reverse proxy for `/api`
Create a site config:

```bash
sudo nano /etc/nginx/sites-available/happy-oven
```

Paste:

```nginx
server {
  listen 80;
  server_name api.yourdomain.com;

  location /api/ {
    proxy_pass http://127.0.0.1:5001/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/happy-oven /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Now your API should be reachable as:
- `http://api.yourdomain.com/api/health` (after DNS)

---

## 4) Frontend deployment: **S3 + CloudFront**

### 4.1 Build frontend with production API URL
Create a local file `.env.production` in the project root:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Then build:

```bash
npm run build
```

This creates `dist/`.

### 4.2 Create S3 bucket
S3 → Create bucket:
- Name: `yourdomain.com` (or `happy-oven-frontend-prod`)
- Block public access: **ON** (recommended)

Upload `dist/` contents to the bucket (not the folder itself).

### 4.3 Create CloudFront distribution
CloudFront → Create distribution:
- Origin: your S3 bucket
- Enable **Origin Access Control (OAC)** (recommended)
- Default root object: `index.html`

For React Router (SPA):
- Configure **custom error responses**:
  - 403/404 → return `/index.html` with 200

### 4.4 Add HTTPS (ACM)
AWS Certificate Manager (ACM) in **us-east-1** (required for CloudFront):
- Request certificate for:
  - `yourdomain.com`
  - `www.yourdomain.com`
- Validate via DNS (easy if using Route 53)

Attach the certificate to CloudFront.

---

## 5) Domain setup (Route 53 recommended)

### 5.1 If you bought domain elsewhere
You can:
- Keep registrar as-is and point DNS to Route 53 name servers, OR
- Manage DNS in your registrar

### 5.2 Records you typically need

#### Frontend
- `A / AAAA` record to CloudFront (via Route 53 “Alias”)
  - `yourdomain.com` → CloudFront
  - `www.yourdomain.com` → CloudFront

#### Backend
- `A` record:
  - `api.yourdomain.com` → Lightsail Static IP (or EC2 Elastic IP)

---

## 6) Alternative backend path B: **Elastic Beanstalk** (more managed)

Elastic Beanstalk can run Node apps with less server management.

### 6.1 What to deploy (recommended)

Deploy **backend only** to Elastic Beanstalk.

Minimum files needed in the ZIP:
- `routes/`
- `models/`
- `package.json`
- `package-lock.json`
- `Procfile`
- `app.js` (backend root)

#### Important: ZIP structure must be correct

Elastic Beanstalk requires that `package.json` (and `Procfile`/`app.js`) are at the **root of the ZIP**.

Common mistake:
- Zipping the *folder* `Bakery Website/` so the ZIP contains `Bakery Website/package.json` → EB will say “there is no package.json file”.

Correct:
- ZIP the **contents** so the ZIP contains `package.json` at the top level.

This repo includes a helper script that generates the correct ZIP:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\package-eb-backend.ps1
```

Upload: `dist-eb/happy-oven-backend-eb.zip`

This repo is currently wired so:
- Backend lives in `happy-oven-backend/`
- `npm start` (inside `happy-oven-backend/`) runs `node app.js`
- `app.js` reads `process.env.MONGODB_URI` and listens on `process.env.PORT` (fallback `8080`)

### 6.2 Create the Elastic Beanstalk environment (Console wizard)

Elastic Beanstalk → **Create application**

- **Application name**: `the-happy-oven-api`
- **Platform**: Node.js (use the latest recommended)
- **Application code**: upload your ZIP

During the wizard you’ll see optional steps. These are the best-practice choices for your app:

#### Step 3 (optional): Configure service access

- **Service role**:
  - If AWS offers “Create and use a new service role”, choose it.
  - Otherwise create a role named like `aws-elasticbeanstalk-service-role` and attach AWS-managed policies used by EB (the console will suggest the right ones).
- **EC2 instance profile**:
  - Choose/create an instance profile for the environment instances.
  - Minimum: permissions for Elastic Beanstalk web tier + CloudWatch logs if you enable log streaming.
- **EC2 key pair (SSH)**:
  - Set one so you can SSH to the instance for debugging.

#### Step 4 (optional): Set up networking, database, and tags

- **VPC**:
  - Easiest: use **default VPC** (public subnets).
  - Advanced: private subnets + NAT (more secure, more cost).
- **Public IP address**: enable (common for simple setups).
- **Database**: skip (you are using MongoDB Atlas).
- **Tags** (recommended):
  - `Project=TheHappyOven`
  - `Service=API`
  - `Env=prod`

##### MongoDB Atlas networking note (important)

Atlas requires IP allowlisting unless you open it broadly.

You have 3 options:
- **Option A (simple, OK for early stage)**: Atlas allowlist `0.0.0.0/0` temporarily, then lock down later.
- **Option B (recommended long-term)**: Put EB in a VPC with a **NAT Gateway + Elastic IP** and allowlist that Elastic IP in Atlas.
- **Option C (advanced)**: MongoDB Atlas **PrivateLink** (best security, more setup).

#### Step 5 (optional): Configure instance traffic and scaling

- **Environment type**:
  - If you want HTTPS + custom domain on the API: choose **Load balanced** (Application Load Balancer).
  - If you want cheapest possible: **Single instance** (no load balancer).
- **Health check path**: set to `/api/health`
- **Instance type**: start with a small one (free-tier eligible if available in your region).
- **Auto scaling**:
  - Min 1, Max 2 is a reasonable starting point for production.

### 6.3 Configure environment variables (required)

After the environment is created:

Elastic Beanstalk → your environment → **Configuration** → **Software** → **Environment properties**

Set:
- `MONGODB_URI` = your MongoDB Atlas connection string
- `NODE_ENV` = `production`

Do **not** hardcode `PORT`. Elastic Beanstalk provides it automatically and your app uses `process.env.PORT`.

### 6.4 Domain + HTTPS

- DNS:
  - Point `api.yourdomain.com` → the Elastic Beanstalk environment CNAME (via Route 53/registrar CNAME).
- HTTPS:
  - Recommended: use a **Load Balanced** EB environment + attach an **ACM certificate** to the load balancer (443).

### 6.5 Verify

- `https://api.yourdomain.com/api/health` should return OK
- Your frontend should use:
  - `VITE_API_URL=https://api.yourdomain.com/api`

---

## 7) What you will pay for (roughly)

Costs depend on traffic, region, and plan:
- Lightsail/EC2: monthly compute
- CloudFront: bandwidth (often low for small sites)
- S3: storage + requests (usually low)
- Route 53: small monthly hosted zone fee + DNS queries
- MongoDB Atlas: depends on cluster tier

Set a budget alert in AWS Billing.

---

## 8) Quick verification checklist

Backend:
- `https://api.yourdomain.com/api/health` returns OK
- Atlas IP allowlist includes your backend server

Frontend:
- `https://yourdomain.com/` loads
- Login/Register works (calls the API)
- Admin dashboard loads (calls admin APIs)

---

## 9) Tell me your preference and I’ll tailor the exact commands

Reply with:
- Do you want **Lightsail** or **Elastic Beanstalk** for backend?
- Your domain name (example: `thehappyoven.in`)
- Do you want API on `api.yourdomain.com` or `yourdomain.com/api`?

And I’ll give you a final, exact, copy‑paste setup for your choice.


