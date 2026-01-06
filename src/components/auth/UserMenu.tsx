'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function UserMenu() {
    const { user, logout } = useAuth();
    const t = useTranslations('auth');

    if (!user) return null;

    return (
        <div className="flex items-center gap-4">
            <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">
                    {user.balance} {user.currency}
                </p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
            </Button>
        </div>
    );
}
