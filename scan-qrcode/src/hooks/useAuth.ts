'use client';

import { authAPI } from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roles: string[];
  [key: string]: string | number | boolean | string[] | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra token và thông tin người dùng khi component mount
    const loadUser = () => {
      if (initialized) return; // Chỉ load một lần

      setLoading(true);
      const token = Cookies.get('auth_token');
      const userJson = localStorage.getItem('user');

      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          setUser(user);
        } catch (error) {
          console.error('Lỗi khi parse thông tin người dùng', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitialized(true);
    };

    loadUser();
  }, [initialized]);

  const login = async (email: string, password: string) => {
    try {
      const data = await authAPI.login(email, password);
      
      if (!data.token || !data.user) {
        throw new Error('Đăng nhập thất bại: Không nhận được token hoặc thông tin người dùng');
      }

      // Lưu token và thông tin người dùng
      Cookies.set('auth_token', data.token, { expires: 1 });
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setInitialized(true);

      return data.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng nhập';
      throw new Error(message);
    }
  };

  const logout = () => {
    // Xóa token và thông tin người dùng
    Cookies.remove('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setInitialized(false);
    router.push('/login');
  };

  const isAuthenticated = !!user && !!Cookies.get('auth_token');

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    initialized,
  };
}; 