'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BetStatus } from '@/types/player.types';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

const BET_STATUSES: BetStatus[] = ['pending', 'win', 'lost', 'canceled'];

interface MyBetsFilterProps {
    isMobile?: boolean;
}

export const MyBetsFilter = ({ isMobile = false }: MyBetsFilterProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<BetStatus | 'all'>((searchParams.get('status') as BetStatus) || 'all');
    const t = useTranslations('my-bets');

    useEffect(() => {
        setStatus((searchParams.get('status') as BetStatus) || 'all');
    }, [searchParams]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (status !== 'all') {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        params.set('page', '1');

        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        setStatus('all');

        const params = new URLSearchParams(searchParams.toString());
        params.delete('status');
        params.set('page', '1');

        router.push(`?${params.toString()}`);
    };

    const statusOptions: { value: BetStatus | 'all'; label: string }[] = [
        { value: 'all', label: t('filter.allStatus') },
        ...BET_STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) })),
    ];

    const FilterContent = () => (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <Label>{t('filter.statusLabel')}</Label>
                <div className="flex flex-col gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setStatus(option.value)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                status === option.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <Button onClick={handleApplyFilters} className="flex-1">
                    {t('filter.apply')}
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                    {t('filter.reset')}
                </Button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="size-4" />
                        {t('filter.title')}
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 px-4">
                    <SheetHeader className="p-0 mt-3">
                        <SheetTitle>{t('filter.title')}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <FilterContent />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Card className="w-full md:w-80 h-fit">
            <CardHeader>
                <CardTitle>{t('filter.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <FilterContent />
            </CardContent>
        </Card>
    );
};
