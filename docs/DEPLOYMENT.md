# NammaNudi — Deployment Guide

This guide describes how to deploy NammaNudi to cloud hosting platforms for the **Kannada Digital Innovation Hackathon 2026**.

The deployment uses:
1. **Frontend**: Static SPA hosted on **Vercel** (or Cloudflare Pages / Netlify) with global CDN and automated HTTPS.
2. **Backend**: Spring Boot 4.1.1 (Java 21) containerized service hosted on **Render** (Free Web Service tier, 512 MB RAM, automated HTTPS, zero credit card required).

---

## 1. Environment Variables Reference

### Backend (`Render` Web Service)
| Environment Variable | Required | Example Value | Purpose |
|---|---|---|---|
| `SERVER_PORT` | Yes (or default 10000) | `10000` | Port Spring Boot listens on inside container (Render routes to 10000) |
| `APP_CORS_ALLOWED_ORIGINS` | Yes | `https://nammanudi.vercel.app` | Comma-separated list of allowed frontend origins for CORS |

### Frontend (`Vercel` / Hosting Platform)
| Environment Variable | Required | Example Value | Purpose |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `https://nammanudi-api.onrender.com` | Base URL of the deployed backend without trailing slash |

---

## 2. Step-by-Step Deployment Instructions

### Phase A: Deploy Backend on Render (First)
The backend must be deployed first so you have its live HTTPS URL to configure into the frontend.

1. **Sign Up / Log In to Render**:
   - Go to [https://dashboard.render.com](https://dashboard.render.com).
   - Sign up with GitHub (no credit card required).
2. **Create New Web Service**:
   - Click **New +** > **Web Service**.
   - Select **Build and deploy from a Git repository**.
   - Connect your GitHub account and choose the `NammaNudi` repository.
3. **Configure Service Details**:
   - **Name**: `nammanudi-api` (or your choice).
   - **Region**: Singapore or Frankfurt (closest to target users).
   - **Branch**: `main`.
   - **Root Directory**: Leave blank (root context).
   - **Language / Runtime**: **Docker** (Render detects the root `Dockerfile`).
   - **Instance Type**: **Free** (0.1 CPU, 512 MB RAM).
4. **Configure Environment Variables**:
   Under the **Environment Variables** section, add:
   - `SERVER_PORT` = `10000`
   - `APP_CORS_ALLOWED_ORIGINS` = `http://localhost:5173,https://<your-frontend-project-name>.vercel.app` *(You can update this once your Vercel URL is finalized)*
5. **Deploy**:
   - Click **Deploy Web Service**.
   - Render will build the container from `Dockerfile` and launch the service.
   - Note your live backend URL: `https://<service-name>.onrender.com`.
   - Verify health: Visit `https://<service-name>.onrender.com/api/health` in your browser. It should respond with `{"status":"ok"}`.

---

### Phase B: Deploy Frontend on Vercel
1. **Sign Up / Log In to Vercel**:
   - Go to [https://vercel.com](https://vercel.com).
   - Sign in with your GitHub account (Hobby free plan, no credit card required).
2. **Import Project**:
   - Click **Add New...** > **Project**.
   - Select the `NammaNudi` GitHub repository.
3. **Configure Project Settings**:
   - **Project Name**: `nammanudi` (or your choice).
   - **Framework Preset**: **Vite**.
   - **Root Directory**: Click *Edit* and select **`frontend`**.
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default).
4. **Set Environment Variable**:
   - Expand the **Environment Variables** section.
   - Key: `VITE_API_BASE_URL`
   - Value: `https://<your-backend-subdomain>.onrender.com` (from Phase A, without trailing slash).
5. **Deploy**:
   - Click **Deploy**.
   - Vercel will install dependencies, build the production bundle with the embedded backend URL, and deploy it to a `https://<project-name>.vercel.app` domain.

---

### Phase C: Finalize CORS on Render
1. Go back to Render Dashboard > Your `nammanudi-api` service > **Environment**.
2. Update `APP_CORS_ALLOWED_ORIGINS` to include your exact Vercel URL:
   `https://nammanudi.vercel.app,http://localhost:5173`
3. Click **Save Changes** (Render will automatically re-deploy with the updated CORS rule).

---

## 3. How Cold-Start and Offline Work in Production

1. **Backend Idle Spin-Down**:
   - On Render's Free tier, the backend spins down after 15 minutes of inactivity.
   - When a user opens the app, the frontend's built-in cold-start handler detects if the first request takes longer than 4 seconds.
   - A friendly message appears: *"Waking up the server, this can take up to a minute"* with a spinner and automatic retries.
   - As soon as Render finishes booting (usually ~30–45s), the app smoothly transitions into the active view without crashing.
2. **Service Worker Offline Cache**:
   - Upon the first successful load, the Service Worker precaches the app shell and warms the cache for all 6 scenarios' phrases, role-play dialogues, and quizzes using the live `VITE_API_BASE_URL`.
   - If the user loses internet connection later, they can continue browsing scenarios and practicing offline.
