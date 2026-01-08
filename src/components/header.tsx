'use client';

import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { useLocale } from 'next-intl';
import { SidebarTrigger, useSidebar } from './ui/sidebar';

interface Props {
    displaySidebar?: boolean;
}

export const Header = ({ displaySidebar = true }: Props) => {
    const locale = useLocale();
    const { open } = useSidebar();

    return (
        <header className="flex justify-between items-center gap-2 p-2">
            {displaySidebar && <SidebarTrigger className={open ? 'mt-2.5' : ''} />}
            <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitcher currentLocale={locale} />
            </div>
        </header>
    );
};
