'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SidebarMenuButton } from '../ui/sidebar';

export function NavHeader() {
    const t = useTranslations('app');
    return (
        <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight items-center">
                <span className="truncate font-medium">{t('title')}</span>
            </div>
        </SidebarMenuButton>
    );
}
