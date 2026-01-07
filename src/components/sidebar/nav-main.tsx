'use client';

import { Gamepad2 } from 'lucide-react';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function NavMain() {
    const t = useTranslations('navigation');

    return (
        <SidebarGroup className="select-none">
            <SidebarGroupLabel>{t('general.title')}</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/games">
                        <SidebarMenuButton className="cursor-pointer">
                            <Gamepad2 />
                            {t('general.games')}
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
