import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect when we're inside the admin area (hash starts with
      // #/admin). The app uses HashRouter under base `/gesp-ace/` and there
      // is no public `/login` route, so changing window.location.href would
      // jump outside the SPA and trigger Vite's "did you mean /gesp-ace/login"
      // overlay. Updating the hash keeps us inside the router.
      const hash = window.location.hash || '';
      if (hash.startsWith('#/admin') && hash !== '#/admin/login') {
        window.location.hash = '#/admin/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export default api;
