'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './auth/UserMenu';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { useLocale, useTranslations } from 'next-intl';

interface Props {
    displayMenu?: boolean;
}

export const Header = ({ displayMenu = true }: Props) => {
    const { isAuthenticated } = useAuth();
    const locale = useLocale();
    const t = useTranslations('app');

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between select-none">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {t('title')}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated && displayMenu && <UserMenu />}
                    <LanguageSwitcher currentLocale={locale} />
                </div>
            </div>
        </header>
    );
};
