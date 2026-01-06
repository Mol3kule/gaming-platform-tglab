import createMiddleware from 'next-intl/middleware';
import { i18nConfig } from './i18n/config';
import { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware({
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
    localePrefix: 'never',
});

export default async function middleware(request: NextRequest) {
    return handleI18nRouting(request);
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};
