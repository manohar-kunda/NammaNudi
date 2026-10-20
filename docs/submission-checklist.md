# NammaNudi — Live Production Smoke-Test Checklist

Use this checklist to verify your live deployment after completing the steps in `docs/DEPLOYMENT.md`.

- **Live Frontend URL**: `https://<your-frontend>.vercel.app`
- **Live Backend URL**: `https://<your-backend>.onrender.com`

---

## 1. Backend Health Check
- [ ] Open `https://<your-backend>.onrender.com/api/health` directly in the browser or terminal (`curl`).
  - **Expected Result**: HTTP `200 OK` with JSON body:
    ```json
    { "status": "ok" }
    ```

---

## 2. All 6 Scenarios & Phrase Data
- [ ] Open `https://<your-backend>.onrender.com/api/scenarios`.
  - **Expected Result**: Exactly 6 scenarios listed: `basics`, `transport`, `shopping`, `healthcare`, `workplace`, `restaurant`, each showing `"phraseCount": 20`.
- [ ] Open the live frontend home screen `https://<your-frontend>.vercel.app`.
  - [ ] All 6 scenario cards render with Kannada/English headings and badge counts (20).
  - [ ] Click on each scenario (`/scenario/basics`, `/scenario/transport`, `/scenario/shopping`, `/scenario/healthcare`, `/scenario/workplace`, `/scenario/restaurant`).
  - [ ] Exactly 20 phrase cards render per scenario with Kannada script, Roman transliteration, and English translation.
  - [ ] Expand an individual phrase card and verify the example sentence displays properly.
  - [ ] Click the speaker button on a phrase card to confirm speech synthesis attempt (or polite fallback message if Kannada voice is not installed on the browser).

---

## 3. Practice Features
### A. Role-play Dialogue
- [ ] Navigate to **Practice** > Select **Transport** > Select **Role-play**.
- [ ] Confirm dialogue begins with node 1 line (`"ಎಲ್ಲಿಗೆ ಹೋಗ್ಬೇಕು ಸಾರ್?"`).
- [ ] Choose an option (e.g. Good, Ok, or Poor).
- [ ] Confirm instantaneous feedback with rating badge, feedback explanation, and next step button.
- [ ] Complete the role-play and confirm completion summary with correct counts and "Try again" button.

### B. Practice Quiz
- [ ] Navigate to **Practice** > Select **Transport** > Select **Quiz**.
- [ ] Verify questions render one at a time (total 5 questions).
- [ ] Select an answer and confirm explanation appears immediately.
- [ ] Complete all 5 questions and verify the final score card displays.
- [ ] Return to Home screen and check that the Progress summary reflects the completed roleplay and quiz score in `localStorage`.

---

## 4. Search Functionality
- [ ] Navigate to the **Search** tab.
- [ ] Search by English word (e.g., `meter` or `hospital`). Confirm relevant cards appear.
- [ ] Search by Kannada script (e.g., `ದೋಸೆ` or `ನೀರು`). Confirm instant match.
- [ ] Test the 100-character input boundary. Confirm input stops or shows safe validation without 500 error.
- [ ] Test blank query. Confirm default view or empty prompt displays cleanly without error.

---

## 5. CORS Verification
- [ ] Open DevTools (`F12` > Network tab) on `https://<your-frontend>.vercel.app`.
- [ ] Inspect any API request to `https://<your-backend>.onrender.com/api/scenarios`.
- [ ] Confirm the response headers include:
  ```http
  Access-Control-Allow-Origin: https://<your-frontend>.vercel.app
  ```
- [ ] Confirm there are no console errors regarding CORS or blocked origins.

---

## 6. Cold-Start Experience (Server Sleep Wakeup)
- [ ] Let the Render backend idle for 15+ minutes so it spins down to sleep (or trigger a restart in Render dashboard).
- [ ] In a private/incognito window, open `https://<your-frontend>.vercel.app`.
- [ ] After 4 seconds of waiting, confirm the friendly banner appears:
  - *"Waking up the server, this can take up to a minute"*
  - Spinner indicator is active.
  - Manual "Retry" button is available.
- [ ] Confirm that once Render boots (~30–45 seconds), the banner automatically disappears and the scenario cards render cleanly without a manual page refresh.

---

## 7. Offline Mode Verification
- [ ] On the live frontend `https://<your-frontend>.vercel.app`, browse through the home page and click through the scenarios to ensure the Service Worker cache is warmed.
- [ ] Open DevTools (`F12`) > **Network** tab > Toggle throttling to **Offline** (or disconnect Wi-Fi).
- [ ] Reload the page or navigate between:
  - Home screen (`/`)
  - Scenario phrases (`/scenario/transport`, `/scenario/basics`, etc.)
  - Practice role-play and quiz for cached scenarios
  - Saved phrases
- [ ] Confirm all cached pages load seamlessly offline.
- [ ] Attempt a live search while offline: confirm the UI displays a clean offline message rather than a raw crash.
