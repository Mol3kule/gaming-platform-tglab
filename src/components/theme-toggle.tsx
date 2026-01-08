'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
    variant?: 'default' | 'ghost' | 'outline';
    showIcon?: boolean;
}

export function ThemeToggle({ variant = 'outline', showIcon = true }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Avoid hydration mismatch
    if (!mounted) {
        return (
            <Button variant={variant} size="sm" className="gap-2">
                {showIcon && <Sun className="size-4" />}
            </Button>
        );
    }

    return (
        <Button variant={variant} size="sm" onClick={toggleTheme} className="gap-2">
            {showIcon && (
                <>
                    <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </>
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
