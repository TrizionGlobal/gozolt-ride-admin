import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — attach access token from cookie-based auth
apiClient.interceptors.request.use(
  (config) => {
    // Token is managed via HTTP-only cookies through Next.js API routes
    // The proxy route will forward the token
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Only attempt token refresh for genuine 401 Unauthorized errors
    // Ignore 4xx errors like 400 Bad Request — those are not auth issues
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token via our Next.js API route.
        // Must send withCredentials so the refresh token cookie is included.
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        // Refresh succeeded — silently retry the original request with the new token
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // Refresh token is expired/invalid — force logout
        const refreshStatus = refreshError.response?.status;
        if (refreshStatus === 401 || refreshStatus === 403) {
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname + window.location.search;
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
