'use client';

import { History } from 'lucide-react';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function NavAdditional() {
    const t = useTranslations('navigation');

    return (
        <SidebarGroup className="select-none">
            <SidebarGroupLabel>{t('additional.title')}</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/transactions">
                        <SidebarMenuButton className="cursor-pointer">
                            <History />
                            {t('additional.transactions')}
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/my-bets">
                        <SidebarMenuButton className="cursor-pointer">
                            <History />
                            {t('additional.my-bets')}
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
