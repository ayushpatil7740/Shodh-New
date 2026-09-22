import axios from 'axios';

// Get API base URL from environment or default to local backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/**
 * Fetch all items with optional query filters (type, category, location, sort)
 */
export async function getItems(params = {}) {
  const response = await apiClient.get('/items', { params });
  return response.data;
}

/**
 * Fetch single item by ID with computed matches
 */
export async function getItemById(id) {
  const response = await apiClient.get(`/items/${id}`);
  return response.data;
}

/**
 * Search items across fields
 */
export async function searchItems(query = '') {
  const response = await apiClient.get('/items/search', {
    params: { q: query }
  });
  return response.data;
}

/**
 * Submit a lost item report (accepts FormData for photo upload)
 */
export async function reportLostItem(formData) {
  const response = await apiClient.post('/items/lost', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Submit a found item report (accepts FormData for photo upload)
 */
export async function reportFoundItem(formData) {
  const response = await apiClient.post('/items/found', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Generic item creation: POST /api/items (accepts FormData or JSON)
 */
export async function createItem(data) {
  const isFormData = data instanceof FormData;
  const response = await apiClient.post('/items', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response.data;
}

/**
 * Delete an item report by ID
 */
export async function deleteItem(id) {
  const response = await apiClient.delete(`/items/${id}`);
  return response.data;
}

/**
 * Update an item report by ID
 */
export async function updateItem(id, data) {
  const isFormData = data instanceof FormData;
  const response = await apiClient.put(`/items/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response.data;
}

/**
 * Get server health and stats
 */
export async function getHealth() {
  const response = await apiClient.get('/health');
  return response.data;
}

/**
 * Get matches for an item
 */
export async function getItemMatches(id) {
  const response = await apiClient.get(`/items/${id}/matches`);
  return response.data;
}

/**
 * Authentication: Login
 */
export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
}

/**
 * Authentication: Register
 */
export async function register(userData) {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
}

/**
 * Authentication: Get current user
 */
export async function getMe() {
  const token = localStorage.getItem('auth_token');
  const response = await apiClient.get('/auth/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return response.data;
}

/**
 * Authentication: Logout
 */
export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

export default apiClient;
