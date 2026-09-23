import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Interceptor to attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shodh_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized / expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired on protected action, clear stored token
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('shodh_token');
        localStorage.removeItem('shodh_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (formData) => api.post('/auth/register', formData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (formData) => api.put('/auth/profile', formData),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Item Services
export const itemService = {
  getItems: (params) => api.get('/items', { params }),
  getItemById: (id) => api.get(`/items/${id}`),
  createItem: (formData) => api.post('/items', formData),
  updateItem: (id, formData) => api.put(`/items/${id}`, formData),
  deleteItem: (id) => api.delete(`/items/${id}`),
  getMyItems: () => api.get('/items/my-items'),
  getStatsSummary: () => api.get('/items/stats/summary'),
};

// Claim Services
export const claimService = {
  createClaim: (formData) => api.post('/claims', formData),
  getMySentClaims: () => api.get('/claims/my-claims'),
  getMyReceivedClaims: () => api.get('/claims/received'),
  getClaimsForItem: (itemId) => api.get(`/claims/item/${itemId}`),
  updateClaimStatus: (id, data) => api.put(`/claims/${id}`, data),
  deleteClaim: (id) => api.delete(`/claims/${id}`),
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getClaims: () => api.get('/admin/claims'),
};

// Notification Services
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
};

export default api;
