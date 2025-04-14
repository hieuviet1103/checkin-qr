'use client';

import { userAPI } from '@/lib/api';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra token trong cookies
    const token = getCookie('auth_token');
    
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      router.push('/login');
      return;
    }

    // Nếu có token, thử lấy thông tin người dùng từ API
    const fetchUserProfile = async () => {
      try {
        const data = await userAPI.getProfile();
        setUser(data.user);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        // Nếu API trả về lỗi, xóa token và chuyển hướng đến trang đăng nhập
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Hiển thị loading khi đang kiểm tra đăng nhập
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  // Chuyển hướng đến trang dashboard nếu đã đăng nhập
  if (user) {
    router.push('/checkin-result');
    return null;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className={styles.title}>Hệ thống quét mã QR Code</h1>
        <p className={styles.description}>
          Vui lòng đăng nhập để sử dụng hệ thống
        </p>
        <button 
          className={styles.loginButton}
          onClick={() => router.push('/login')}
        >
          Đăng nhập
        </button>
      </main>
    </div>
  );
}
