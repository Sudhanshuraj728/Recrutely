/**
 * API client — thin, typed-free wrapper around the existing backend API.
 *
 * The CareerCraft Express backend is the single source of truth for data
 * and authentication. This module only handles transport (fetch + cookies)
 * and error normalization. It introduces NO mock data.
 *
 * Vite proxies `/api` and `/auth` to the backend during development.
 */

const DEFAULT_HEADERS = {};

async function request(path, { method = 'GET', body, headers } = {}) {
  const isFormData = body instanceof FormData;
  const hasJsonBody = body !== undefined && body !== null && !isFormData;

  const response = await fetch(path, {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    credentials: 'include', // send session cookies to the backend
    body: hasJsonBody ? JSON.stringify(body) : body,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.error || data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.code = data?.code;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  request,
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) =>
    request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) =>
    request(path, { ...options, method: 'PATCH', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),

  /** Health probe — used to confirm connectivity with the backend. */
  health: () => request('/api/health'),
};
