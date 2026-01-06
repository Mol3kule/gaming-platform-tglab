'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { SafeUser } from '@/types/player.types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
            <AuthProvider user={user}>{children}</AuthProvider>
        </QueryClientProvider>
    );
};
