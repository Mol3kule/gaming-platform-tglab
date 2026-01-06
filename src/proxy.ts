import createMiddleware from 'next-intl/middleware';
import { i18nConfig } from './i18n/config';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createMiddleware({
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
    localePrefix: 'never',
});

const protectedRoutes = ['/dashboard', '/profile', '/settings'];
export default async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const pathname = request.nextUrl.pathname;

    // Define protected routes
    const isProtectedRoute = protectedRoutes.some((route) => pathname.includes(route));

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        const locale = pathname.split('/')[1] || 'en';
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    return handleI18nRouting(request);
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};
