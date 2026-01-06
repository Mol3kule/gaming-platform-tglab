import { getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import { i18nConfig } from '@/i18n/config';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AppProvider } from '@/providers/app.provider';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';
import { getAuthUser } from '@/lib/auth/server-auth';

interface Props {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export function generateStaticParams() {
    return i18nConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, 'children'>) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'app' });

    return {
        title: t('title'),
        icons: {
            icon: [
                {
                    url: '/favicon.ico',
                    href: '/favicon.ico',
                },
            ],
        },
    } satisfies Metadata;
}

export default async function RootLayout({ children, params }: Readonly<Props>) {
    const messages = await getMessages();
    const { locale } = await params;

    const user = await getAuthUser();

    return (
        <html lang={locale ?? i18nConfig.defaultLocale}>
            <body className={`${inter.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <AppProvider user={user}>{children}</AppProvider>
                    <Toaster />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
