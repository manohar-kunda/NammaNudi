import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BASE_URL } from './api';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'OFFLINE_CACHE_WARMED') {
      window.__NAMMANUDI_CACHE_WARMED = true;
    }
  });

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const readyReg = await navigator.serviceWorker.ready;
      const activeWorker = readyReg.active || registration.active;

      if (activeWorker) {
        const resourceUrls = performance
          .getEntriesByType('resource')
          .map((r) => r.name)
          .filter((u) => u.startsWith(window.location.origin));

        activeWorker.postMessage({
          type: 'WARM_OFFLINE_CACHE',
          apiBaseUrl: BASE_URL,
          shellUrls: [window.location.origin + '/', ...resourceUrls],
        });
      }
    } catch (err) {
      console.error('[NammaNudi SW] Service worker registration failed:', err);
    }
  });
}
