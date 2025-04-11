import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8080/api';

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

// Hàm lấy token xác thực từ cookie
const getAuthHeader = () => {
  const token = Cookies.get('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Lấy danh sách người dùng
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: getAuthHeader()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Không thể lấy danh sách người dùng');
    }

    const result = await response.json();
    return result.users;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
};

// Lấy thông tin người dùng theo ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: getAuthHeader()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Không thể lấy thông tin người dùng');
    }

    return response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};

// Tạo người dùng mới
export const createUser = async (userData: CreateUserPayload): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Không thể tạo người dùng mới');
    }

    return response.json();
  } catch (error) {
    console.error('Lỗi khi tạo người dùng mới:', error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (id: number, userData: UpdateUserPayload): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Không thể cập nhật thông tin người dùng');
    }

    return response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Không thể xóa người dùng');
    }
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    throw error;
  }
};

// Cập nhật quyền của người dùng
export const updateUserRoles = async (id: number, roles: string[]): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}/roles`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ roles })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Không thể cập nhật quyền người dùng');
    }

    return response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật quyền người dùng:', error);
    throw error;
  }
}; 