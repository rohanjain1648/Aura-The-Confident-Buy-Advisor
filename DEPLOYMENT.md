# Aura — Production Deployment Guide

This guide covers step-by-step instructions for deploying **Aura — The Confident-Buy Advisor** to **Vercel**, **Railway**, **Render**, or a **Docker VPS host**.

---

## 1. Environment Variables Checklist

Before deploying, configure the following environment variables on your hosting provider:

| Variable Name | Required? | Example Value | Description |
|---|---|---|---|
| `YOUCAM_MODE` | **Yes** | `fixture` *(or `live`)* | Set to `fixture` for zero-cost offline mock responses; set to `live` for real YouCam S2S REST APIs. |
| `YOUCAM_CLIENT_ID` | If `live` | `your_youcam_client_id` | YouCam Developer Portal Client ID |
| `YOUCAM_CLIENT_SECRET` | If `live` | `your_youcam_client_secret` | YouCam Developer Portal Client Secret |
| `SESSION_SECRET` | **Yes** | `8f92a14b7c6d3e5f1029384756102938` | Secret key used for signing session cookies |
| `NODE_ENV` | **Yes** | `production` | Production environment flag |
| `DATABASE_URL` | **Yes** | `file:./dev.db` | SQLite database connection string |

---

## 2. Option A: Deploy to Vercel (Recommended for Next.js)

Vercel is the native hosting platform for Next.js App Router applications.

### Steps:

1. **Push your code to GitHub**:
   Ensure your latest commits are pushed to `https://github.com/rohanjain1648/Aura-The-Confident-Buy-Advisor`.

2. **Import Project into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository: `rohanjain1648/Aura-The-Confident-Buy-Advisor`.
   - Set **Root Directory** to `.` (or `aura` if deploying from workspace root).

3. **Configure Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `pnpm prisma generate && pnpm build`
   - **Install Command**: `pnpm install`
   - **Output Directory**: `.next`

4. **Set Environment Variables**:
   Add `YOUCAM_MODE=fixture`, `SESSION_SECRET`, and any live API keys.

5. **Deploy**:
   Click **Deploy**. Vercel will build the application, execute static page generation, and deploy the live URL (`https://aura-confident-buy.vercel.app`).

---

## 3. Option B: Deploy to Railway / Render (Best for Persistent SQLite)

If you prefer to keep SQLite as a local persistent database file on disk, deploy to a service with persistent storage like **Railway** or **Render**.

### Railway Steps:

1. Log into [railway.app](https://railway.app) and create a **New Project**.
2. Select **Deploy from GitHub repository** $\rightarrow$ `Aura-The-Confident-Buy-Advisor`.
3. In **Service Settings**:
   - **Build Command**: `pnpm install && pnpm prisma migrate deploy && pnpm prisma db seed && pnpm build`
   - **Start Command**: `pnpm start`
4. In **Variables**, add all required environment variables.
5. In **Volumes**, attach a persistent volume mapped to `/app/prisma` to retain user session state across redeployments.
6. Click **Deploy**.

---

## 4. Option C: Docker Container Deployment

To run Aura in Docker on AWS EC2, DigitalOcean Droplet, or any VPS:

### 1. Pre-configured `Dockerfile` (already included in repository):

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy application source
COPY . .

# Run Prisma client generation & seed
RUN pnpm prisma generate
RUN pnpm prisma migrate deploy
RUN pnpm prisma db seed

# Build Next.js app
RUN pnpm build

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["pnpm", "start"]
```

### 2. Build & Run Docker Commands:

```bash
# Build Docker image
docker build -t aura-storefront .

# Run Docker container locally or on server
docker run -d \
  -p 3000:3000 \
  -e YOUCAM_MODE=fixture \
  -e SESSION_SECRET=your_32_byte_secret_here \
  --name aura-app \
  aura-storefront
```

---

## 5. Post-Deployment Verification Checklist

After deployment completes, test the following endpoints on your live domain:

1. ✅ **Landing Page**: `https://your-domain.com/` (Verify Lenis smooth scroll, canvas particle backdrop, and interactive passport simulator).
2. ✅ **Selfie Analysis**: `https://your-domain.com/onboarding` (Upload selfie $\rightarrow$ test SSE progress stream $\rightarrow$ verify Skin Passport renders).
3. ✅ **Storefront Badges**: `https://your-domain.com/shop` (Verify personalized match badges compute per session).
4. ✅ **PDP Verdict**: `https://your-domain.com/shop/apparel-jacket-1` (Verify apparel color harmony score + YouCam Cloth VTO viewer).
5. ✅ **Cart & History**: `https://your-domain.com/cart` and `/dashboard` (Verify saved looks and session stats).
