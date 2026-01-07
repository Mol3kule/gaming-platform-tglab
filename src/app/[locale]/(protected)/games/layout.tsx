import { getTranslations } from 'next-intl/server';
import { i18nConfig } from '@/i18n/config';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Header } from '@/components/header';

interface Props {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

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

export default async function GamesLayout({ children }: Readonly<Props>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <Header />
                {children}
            </main>
        </SidebarProvider>
    );
}
