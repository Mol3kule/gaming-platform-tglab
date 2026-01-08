'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketContextProvider } from '@/contexts/SocketContext';
import { SafeUser } from '@/types/player.types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

interface AppProviderProps {
    children: ReactNode;
    user: SafeUser | null;
}

export const AppProvider = ({ children, user }: AppProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <SocketContextProvider>
                    <AuthProvider user={user}>
                        <SidebarProvider>{children}</SidebarProvider>
                    </AuthProvider>
                </SocketContextProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};
