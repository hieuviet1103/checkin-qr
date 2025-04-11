import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Lấy thông tin auth_token từ cookie
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Danh sách các đường dẫn công khai (không cần xác thực)
  const publicPaths = ['/login'];
  
  // Kiểm tra xem đường dẫn hiện tại có phải là đường dẫn công khai không
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path + '/')
  );
  
  // Nếu không có auth_token và không phải đường dẫn công khai, chuyển hướng về trang login
  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Nếu có auth_token và đang ở trang login, chuyển hướng về trang chính
  if (authToken && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Cấu hình middleware chỉ áp dụng cho các đường dẫn sau
export const config = {
  matcher: [
    // Áp dụng cho tất cả các đường dẫn trừ các đường dẫn tĩnh
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 