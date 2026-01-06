'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './auth/UserMenu';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { useLocale } from 'next-intl';

interface Props {
    displayMenu?: boolean;
}

export const HeaderInformation = ({ displayMenu = true }: Props) => {
    const { isAuthenticated } = useAuth();
    const locale = useLocale();

    return (
        <div className="absolute top-4 right-4 flex items-center gap-3">
            {isAuthenticated && displayMenu && <UserMenu />}
            <LanguageSwitcher currentLocale={locale} />
        </div>
    );
};
