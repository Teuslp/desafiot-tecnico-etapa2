import { api } from './api';

// --- AUTH ---
export const loginUser = (data: any) => api.post('/auth/login', data);

// --- USERS & ADMIN ---
export const getUsers = (params?: any) => api.get('/users', { params });
export const createUser = (data: any) => api.post('/users', data);
export const getAdminOverview = () => api.get('/admin/overview');
export const getAdminReports = (params?: any) => api.get('/admin/reports', { params });

// --- CATEGORIES ---
export const getCategories = () => api.get('/categories');
export const createCategory = (data: any) => api.post('/categories', data);

// --- PRODUCTS ---
export const getProducts = (params?: any) => api.get('/products', { params });
export const createProduct = (formData: FormData) => api.post('/products', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// --- FAVORITES ---
export const getFavorites = () => api.get('/products/favorites');
export const addFavorite = (id: number) => api.post(`/products/${id}/favorite`);
export const removeFavorite = (id: number) => api.delete(`/products/${id}/favorite`);

// --- NOTIFICATIONS ---
export const getNotifications = () => api.get('/notifications');
export const markNotificationAsRead = (id: number) => api.patch(`/notifications/${id}/read`);
