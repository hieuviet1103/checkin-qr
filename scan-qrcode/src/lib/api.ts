import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Tạo instance axios với base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
};

// User API
export const userAPI = {
  // Lấy danh sách users
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Lấy thông tin user theo ID
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Tạo user mới
  createUser: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Cập nhật thông tin user
  updateUser: async (id: string, userData: {
    username: string;
    email: string;
  }) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Cập nhật role của user
  updateUserRole: async (id: string, role: string) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  // Lấy thông tin profile của user hiện tại
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
};

export default api; 