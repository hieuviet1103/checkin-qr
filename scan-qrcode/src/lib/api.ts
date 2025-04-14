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

// Session API
export const sessionAPI = {
  // Lấy danh sách sessions
  getSessions: async () => {
    const response = await api.get('/sessions');
    return response.data;
  },

  // Lấy thông tin session theo ID
  getSessionById: async (id: string) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  // Tạo session mới
  createSession: async (sessionData: {
    session_name: string;
    start_time: string;
    end_time: string;
    base_url: string;
  }) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  // Cập nhật session
  updateSession: async (id: string, sessionData: {
    session_name: string;
    start_time: string;
    end_time: string;
    base_url: string;
  }) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  },

  // Xóa session
  deleteSession: async (id: string) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },
};

// Group API
export const groupAPI = {
  // Lấy danh sách groups
  getGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },

  // Lấy thông tin group theo ID
  getGroupById: async (id: string) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  // Tạo group mới
  createGroup: async (groupData: {
    group_name: string;
  }) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  // Cập nhật group
  updateGroup: async (id: string, groupData: {
    group_name: string;
  }) => {
    const response = await api.put(`/groups/${id}`, groupData);
    return response.data;
  },

  // Xóa group
  deleteGroup: async (id: string) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  },
};

// Session User Group API
export const sessionUserGroupAPI = {
  // Gán user vào session và group
  assignUserToSessionGroup: async (sessionId: string, userId: string, groupId: string) => {
    const response = await api.post(`/sessions/${sessionId}/users/${userId}/groups/${groupId}`);
    return response.data;
  },

  // Cập nhật trạng thái của user trong session và group
  updateUserSessionGroup: async (sessionId: string, userId: string, groupId: string, isActive: boolean) => {
    const response = await api.put(`/sessions/${sessionId}/users/${userId}/groups/${groupId}`, { is_active: isActive });
    return response.data;
  },

  // Xóa user khỏi session và group
  removeUserFromSessionGroup: async (sessionId: string, userId: string, groupId: string) => {
    const response = await api.delete(`/sessions/${sessionId}/users/${userId}/groups/${groupId}`);
    return response.data;
  },

  // Lấy danh sách session và group của user
  getUserSessionGroups: async (userId: string) => {
    const response = await api.get(`/users/${userId}/sessions`);
    return response.data;
  },
};

export default api; 