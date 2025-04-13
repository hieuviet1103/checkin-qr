import api from '@/lib/api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role: string;
  roles: string[];
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  roles?: string[];
}

// Lấy danh sách người dùng
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
};

// Lấy thông tin người dùng theo ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.user;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};

// Tạo người dùng mới
export const createUser = async (userData: CreateUserPayload): Promise<User> => {
  try {
    const response = await api.post('/users', userData);
    return response.data.user;
  } catch (error) {
    console.error('Lỗi khi tạo người dùng mới:', error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (id: number, userData: UpdateUserPayload): Promise<User> => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.user;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    throw error;
  }
};

// Cập nhật quyền của người dùng
export const updateUserRoles = async (id: number, roles: string[]): Promise<User> => {
  try {
    const response = await api.put(`/users/${id}/role`, { roles });
    return response.data.user;
  } catch (error) {
    console.error('Lỗi khi cập nhật quyền người dùng:', error);
    throw error;
  }
}; 