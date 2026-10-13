const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const COLD_START_THRESHOLD_MS = 4000;
const RETRY_TIMEOUT_MS = 15000;
const MAX_AUTO_RETRIES = 3;
const RETRY_BACKOFF_MS = 1500;

let hasCompletedFirstCall = false;
let coldStartState = {
  isWakingUp: false,
  retryAttempt: 0,
  maxRetries: MAX_AUTO_RETRIES,
};
let activeAbortController = null;
let manualRetryCallback = null;
const listeners = new Set();

function notifyListeners() {
  for (const listener of listeners) {
    listener({ ...coldStartState });
  }
}

export function subscribeColdStart(listener) {
  listeners.add(listener);
  listener({ ...coldStartState });
  return () => listeners.delete(listener);
}

export function triggerManualColdStartRetry() {
  if (typeof manualRetryCallback === 'function') {
    manualRetryCallback();
  } else if (activeAbortController) {
    activeAbortController.abort('MANUAL_RETRY');
  }
}

function waitMs(ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      manualRetryCallback = null;
      resolve('timeout');
    }, ms);
    manualRetryCallback = () => {
      clearTimeout(timer);
      manualRetryCallback = null;
      resolve('manual');
    };
  });
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const isInitialCall = !hasCompletedFirstCall;
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_AUTO_RETRIES; attempt++) {
    const controller = new AbortController();
    activeAbortController = controller;

    const timeoutMs =
      isInitialCall && attempt === 0 ? COLD_START_THRESHOLD_MS : RETRY_TIMEOUT_MS;

    const timeoutId = setTimeout(() => {
      if (!hasCompletedFirstCall) {
        coldStartState = {
          isWakingUp: true,
          retryAttempt: Math.min(attempt + 1, MAX_AUTO_RETRIES),
          maxRetries: MAX_AUTO_RETRIES,
        };
        notifyListeners();
      }
      controller.abort('COLD_START_TIMEOUT');
    }, timeoutMs);

    if (attempt > 0 && isInitialCall) {
      coldStartState = {
        isWakingUp: true,
        retryAttempt: attempt,
        maxRetries: MAX_AUTO_RETRIES,
      };
      notifyListeners();
      console.error(
        `[NammaNudi API] Cold-start automatic retry ${attempt}/${MAX_AUTO_RETRIES} for ${url}`
      );
    }

    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          ...options.headers,
        },
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      activeAbortController = null;

      if (!res.ok) {
        let errorMsg = 'Unable to load the requested content right now. Please try again.';
        try {
          const errorData = await res.json();
          if (errorData?.error) {
            errorMsg = errorData.error;
          }
        } catch {
          // use default errorMsg
        }
        console.error(`[NammaNudi API] HTTP ${res.status} on ${url}:`, errorMsg);
        const err = new Error(errorMsg);
        err.status = res.status;

        if (isInitialCall && res.status >= 500 && attempt < MAX_AUTO_RETRIES) {
          coldStartState = {
            isWakingUp: true,
            retryAttempt: attempt + 1,
            maxRetries: MAX_AUTO_RETRIES,
          };
          notifyListeners();
          lastError = err;
          await waitMs(RETRY_BACKOFF_MS);
          continue;
        }
        throw err;
      }

      const data = await res.json();
      hasCompletedFirstCall = true;
      if (coldStartState.isWakingUp || coldStartState.retryAttempt > 0) {
        coldStartState = {
          isWakingUp: false,
          retryAttempt: 0,
          maxRetries: MAX_AUTO_RETRIES,
        };
        notifyListeners();
      }
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      activeAbortController = null;

      const isAborted =
        error.name === 'AbortError' ||
        controller.signal.aborted;
      const isNetErr =
        isAborted ||
        error.name === 'TypeError' ||
        error.message?.includes('Failed to fetch');

      if (isNetErr) {
        console.error(
          `[NammaNudi API] Request attempt ${attempt + 1} failed or timed out for ${url}:`,
          error
        );
        const connErr = new Error(
          'Unable to connect to the server right now. Please check your connection and try again.'
        );
        connErr.isNetworkError = true;
        lastError = connErr;

        if (isInitialCall && attempt < MAX_AUTO_RETRIES) {
          coldStartState = {
            isWakingUp: true,
            retryAttempt: attempt + 1,
            maxRetries: MAX_AUTO_RETRIES,
          };
          notifyListeners();
          if (!isAborted) {
            await waitMs(RETRY_BACKOFF_MS);
          }
          continue;
        }

        // All automatic retries exhausted
        coldStartState = {
          isWakingUp: false,
          retryAttempt: MAX_AUTO_RETRIES,
          maxRetries: MAX_AUTO_RETRIES,
        };
        notifyListeners();
        throw connErr;
      }

      throw error;
    }
  }

  throw (
    lastError ||
    new Error('Unable to connect to the server right now. Please check your connection and try again.')
  );
}

export async function fetchHealth() {
  return request('/api/health');
}

export async function fetchScenarios() {
  return request('/api/scenarios');
}

export async function fetchScenarioPhrases(slug) {
  return request(`/api/scenarios/${encodeURIComponent(slug)}/phrases`);
}

export async function fetchScenarioRoleplay(slug) {
  return request(`/api/scenarios/${encodeURIComponent(slug)}/roleplay`);
}

export async function fetchScenarioQuiz(slug) {
  return request(`/api/scenarios/${encodeURIComponent(slug)}/quiz`);
}

export async function searchPhrases(query = '', scenario = '') {
  const params = new URLSearchParams();
  if (query && query.trim()) params.set('q', query.trim());
  if (scenario && scenario.trim()) params.set('scenario', scenario.trim());
  const qs = params.toString();
  return request(`/api/phrases${qs ? `?${qs}` : ''}`);
}

export { BASE_URL };
