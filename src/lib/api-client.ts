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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token via our Next.js API route
        await axios.post('/api/auth/refresh');
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
