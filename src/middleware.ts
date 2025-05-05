import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Danh sách các routes cần bảo vệ
const protectedRoutes = ['/experience', '/skills', '/cover-letters']
// Danh sách các routes công khai
const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Kiểm tra nếu đang ở route công khai
  if (publicRoutes.includes(pathname)) {
    // Nếu đã đăng nhập, chuyển hướng về trang chủ
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Kiểm tra nếu đang ở route được bảo vệ
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 