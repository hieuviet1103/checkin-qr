'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  [key: string]: string | number | boolean | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra token và thông tin người dùng khi component mount
    const loadUser = () => {
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
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Đăng nhập thất bại');
      }

      const data = await response.json();
      if (!data.token || !data.user) {
        throw new Error('Đăng nhập thất bại: Không nhận được token hoặc thông tin người dùng');
      }

      // Lưu token và thông tin người dùng
      Cookies.set('auth_token', data.token, { expires: 1 });
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

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
    router.push('/login');
  };

  const isAuthenticated = !!user && !!Cookies.get('auth_token');

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };
}; 