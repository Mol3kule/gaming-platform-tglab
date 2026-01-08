'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { i18nConfig } from '@/i18n/config';

const LANGUAGE_LABELS: Record<string, string> = {
    en: 'EN',
    lt: 'LT',
};

const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    lt: 'Lietuvių',
};

interface LanguageSwitcherProps {
    currentLocale: string;
    variant?: 'default' | 'ghost' | 'outline';
    showIcon?: boolean;
}

export function LanguageSwitcher({ currentLocale, variant = 'outline', showIcon = true }: LanguageSwitcherProps) {
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = React.useCallback(
        (newLocale: string) => {
            if (newLocale === currentLocale) return;

            // Remove current locale from pathname and add new locale
            const pathWithoutLocale = pathname.replace(`/${currentLocale}/`, '/');
            const newPath = `/${newLocale}${pathWithoutLocale}`;

            router.replace(newPath);
        },
        [currentLocale, pathname, router],
    );

    const getNextLocale = () => {
        const currentIndex = i18nConfig.locales.indexOf(currentLocale);
        const nextIndex = (currentIndex + 1) % i18nConfig.locales.length;
        return i18nConfig.locales[nextIndex];
    };

    const handleClick = () => {
        const nextLocale = getNextLocale();
        switchLocale(nextLocale);
    };

    const currentLanguage = LANGUAGE_LABELS[currentLocale] || currentLocale.toUpperCase();

    return (
        <Button variant={variant} size="sm" onClick={handleClick} className="gap-2">
            {showIcon && <Languages className="size-4" />}
            <span className="font-medium">{currentLanguage}</span>
        </Button>
    );
}
