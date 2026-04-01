/*import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// Events
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getFeatured: (limit = 6) => api.get('/events/featured', { params: { limit } }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Organizers
export const organizersAPI = {
  getAll: (params) => api.get('/organizers', { params }),
  getById: (id) => api.get(`/organizers/${id}`),
};

// Favorites
export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (eventId) => api.post(`/favorites/${eventId}`),
  remove: (eventId) => api.delete(`/favorites/${eventId}`),
  check: (eventId) => api.get(`/favorites/check/${eventId}`),
};

// Stats
export const statsAPI = {
  getOrganizerStats: () => api.get('/stats/organizer'),
};

// Plan
export const planAPI = {
  upgrade: () => api.post('/plan/upgrade'),
  cancel: () => api.post('/plan/cancel'),
};

// Contact
export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

// Upload
export const uploadAPI = {
  image: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Districts
export const districtsAPI = {
  getAll: () => api.get('/districts'),
};

// Seed
export const seedAPI = {
  seed: () => api.post('/seed'),
};

export default api;*/

import axios from 'axios';

// 🔥 IMPORTANTE: VITE usa esto, no REACT_APP
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= AUTH TOKEN =================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= HANDLE 401 =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ================= AUTH =================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ================= EVENTS =================
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// ================= CATEGORIES =================
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
};

// ================= DISTRICTS =================
export const districtsAPI = {
  getAll: () => api.get('/districts'),
};

export default api;

