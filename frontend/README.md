# NammaNudi — Everyday Spoken Kannada Assistant

NammaNudi (`ನಮ್ಮ ನುಡಿ`) is a mobile-first web application designed to help non-Kannada speakers navigate everyday situations in Karnataka across **Transport**, **Shopping**, **Healthcare**, **Workplace**, and **Restaurant** scenarios. Built for the **Kannada Digital Innovation Hackathon 2026** (Problem Statement 03).

---

## Running locally

### Prerequisites
- **Java 21+** (compatible with JDK 21–25) and **Maven 3.9+**
- **Node.js 20+** and **npm 10+**

### 1. Environment Variables
Copy `.env.example` to `.env` in the repository root (or inside `/frontend`):
```env
SERVER_PORT=8081
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173
VITE_API_BASE_URL=http://localhost:8081
```

| Variable | Component | Default | Description |
|---|---|---|---|
| `SERVER_PORT` | Backend | `8081` | HTTP port for the Spring Boot server |
| `APP_CORS_ALLOWED_ORIGINS` | Backend | `http://localhost:5173` | Comma-separated allowed CORS origins |
| `VITE_API_BASE_URL` | Frontend | `http://localhost:8081` | Base URL for backend API requests |

### 2. Start the Backend (Port `8081`)
From `/backend`:
```powershell
mvn spring-boot:run
```
Or run the packaged JAR:
```powershell
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
Verify backend health at `http://localhost:8081/api/health` (`{"status":"ok"}`).

### 3. Start the Frontend (Port `5173`)
From `/frontend`:
```powershell
npm.cmd install
npm.cmd run dev
```
Open `http://localhost:5173` in your browser.

To test the production bundle and Service Worker offline caching locally:
```powershell
npm.cmd run build
npm.cmd run preview -- --port 5173
```

---

## Deploying

### Frontend Build Variable (`VITE_API_BASE_URL`)
- Vite embeds `VITE_API_BASE_URL` at build time (`npm run build`).
- Set `VITE_API_BASE_URL` in your frontend hosting environment (e.g., `https://api.nammanudi.example.com`) before running `npm run build` so the static bundle points to your deployed backend URL.

### Backend Environment Variable (`APP_CORS_ALLOWED_ORIGINS`)
- Set `APP_CORS_ALLOWED_ORIGINS` on the Spring Boot backend container/host to the deployed frontend origin (e.g., `https://nammanudi.example.com`). Multiple origins can be provided as a comma-separated list.
- Optionally set `SERVER_PORT` if the hosting platform assigns a custom port.

---

## Content & Integrity Notes
- All phrases carry `"reviewed": false` until checked by a native Kannada speaker (see `/docs/CONTENT_REVIEW.md`).
- Pronunciation audio uses browser `speechSynthesis` (`lang="kn-IN"`) when available on the device, never claiming to be a native recording.
- Healthcare phrases are practical communication aids for clinics and pharmacies, not medical advice.
