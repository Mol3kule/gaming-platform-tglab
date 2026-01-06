'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { SafeUser } from '@/types/player.types';
import { getAuthUser } from '@/lib/auth/server-auth';

interface AuthContextType {
    user: SafeUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (user: SafeUser) => void;
    logout: () => Promise<void>;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<SafeUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = (newUser: SafeUser) => {
        setUserState(newUser);
    };

    const logout = async () => {
        try {
            // Call logout API to clear cookies
            await axios.post('/api/logout');
            setUserState(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const refreshUser = async () => {
        const user = await getAuthUser();
        setUserState(user);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
