'use client';

import { useEffect } from 'react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavAdditional } from '@/components/sidebar/nav-additional';
import { NavUser } from '@/components/sidebar/nav-user';
import { NavHeader } from '@/components/sidebar/nav-header';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { socket } = useSocket();
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        if (!socket) {
            return;
        }

        function onUpdateBalance({ balance }: { balance: number }) {
            // Here you would typically update the user's balance in your app's state
            console.log('Balance updated:', balance);
            refreshUser();
        }

        socket.on('updateBalance', onUpdateBalance);

        return () => {
            socket.off('updateBalance', onUpdateBalance);
        };
    }, [socket]);

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
