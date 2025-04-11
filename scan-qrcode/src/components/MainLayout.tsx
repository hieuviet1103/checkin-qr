'use client';

import BootstrapIcons from './BootstrapIcons';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <BootstrapIcons />
      <div className="d-flex min-vh-100">
        <Sidebar />
        <main className="flex-grow-1 p-3 overflow-auto" style={{ minHeight: '100vh' }}>
          {children}
        </main>
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        defer
      ></script>
    </>
  );
} 