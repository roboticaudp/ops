import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware ligero: solo verifica la PRESENCIA de cookies de sesión.
 * NO valida el JWT contra Supabase Auth (eso lo hace el server layout).
 * Esto reduce drásticamente las llamadas a Supabase Auth API.
 */
export async function proxy(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/auth/callback');

  // Buscar cookies de sesión de Supabase (formato: sb-<project>-auth-token*)
  const hasAuthCookie = request.cookies.getAll().some(
    cookie => cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')
  );

  // Si no hay cookie de sesión y no está en una página de auth → redirect a login
  if (!hasAuthCookie && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Si tiene cookie y está en login → redirect a home
  if (hasAuthCookie && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

