'use client';

import * as React from 'react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavAdditional } from '@/components/sidebar/nav-additional';
import { NavUser } from '@/components/sidebar/nav-user';
import { NavHeader } from '@/components/sidebar/nav-header';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavHeader />
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
                <NavAdditional />
            </SidebarContent>
            {user && (
                <SidebarFooter>
                    <NavUser user={user} />
                </SidebarFooter>
            )}
            <SidebarRail />
        </Sidebar>
    );
}
