const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

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
      throw err;
    }

    return await res.json();
  } catch (error) {
    if (error.name === 'TypeError' || error.message?.includes('Failed to fetch')) {
      console.error(`[NammaNudi API] Network error while requesting ${url}:`, error);
      const connErr = new Error(
        'Unable to connect to the server right now. Please check your connection and try again.'
      );
      connErr.isNetworkError = true;
      throw connErr;
    }
    throw error;
  }
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
