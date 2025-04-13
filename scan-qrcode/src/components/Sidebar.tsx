'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    // Lưu trạng thái vào localStorage để giữ nguyên trạng thái khi load lại trang
    localStorage.setItem('sidebarCollapsed', String(!collapsed));
  };

  useEffect(() => {
    // Kiểm tra trạng thái sidebar từ localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
      setCollapsed(true);
    }
  }, []);

  return (
    <div 
      className={`d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary ${collapsed ? 'sidebar-collapsed' : ''}`} 
      style={{ 
        width: collapsed ? '80px' : '280px',
        transition: 'width 0.3s ease',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto'
      }}
    >
      <div className="d-flex align-items-center justify-content-between">
        {!collapsed && (
          <Link href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <svg className="bi pe-none me-2" width="40" height="32">
              <use xlinkHref="#pin-map-fill"></use>
            </svg>
            <span className="fs-4">Check-in</span>
          </Link>
        )}
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={toggleSidebar}
          aria-label={collapsed ? "Mở rộng" : "Thu gọn"}
          title={collapsed ? "Mở rộng" : "Thu gọn"}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link 
            href="/" 
            className={`nav-link ${pathname === '/' ? 'active' : 'link-body-emphasis'}`}
            data-title="Home"
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#home"></use>
            </svg>
            {!collapsed && <span>Home</span>}
          </Link>
        </li>
        <li>
          <Link 
            href="/scan" 
            className={`nav-link ${pathname === '/scan' ? 'active' : 'link-body-emphasis'}`}
            data-title="Scan QR"
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#grid"></use>
            </svg>
            {!collapsed && <span>Scan QR</span>}
          </Link>
        </li>
        <li>
          <Link 
            href="/checkin-result" 
            className={`nav-link ${pathname === '/checkin-result' ? 'active' : 'link-body-emphasis'}`}
            data-title="Checkin Result"
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#table"></use>
            </svg>
            {!collapsed && <span>Check-in Result</span>}
          </Link>
        </li>
        
        <li>
          <Link 
            href="/users" 
            className={`nav-link ${pathname === '/users' ? 'active' : 'link-body-emphasis'}`}
            data-title="users"
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#people-circle"></use>
            </svg>
            {!collapsed && <span>Users</span>}
          </Link>
        </li>
        <li>
          <Link 
            href="#" 
            onClick={logout}
            className={`nav-link ${pathname === '/login' ? 'active' : 'link-body-emphasis'}`}
            data-title="logout"
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#house-dash-fill"></use>
            </svg>
            {!collapsed && <span>Logout</span>}
          </Link>
        </li>
        
      </ul>
      <hr />      
    </div>
  );
} 