import { NextResponse } from 'next/server';

export function middleware(request) {
    const auth = request.cookies.get('auth_token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isApiRoute = request.nextUrl.pathname.startsWith('/api');

    // Skip API routes so our auth endpoints don't get blocked before they can even run
    if (isApiRoute) {
        return NextResponse.next();
    }

    // Redirect to login if unauthenticated and not on the login page
    if (!auth && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if authenticated and trying to access login page
    if (auth && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
