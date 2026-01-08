'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BetStatus } from '@/types/player.types';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { FilterContent } from '../filters/filter-content';

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
                        <FilterContent
                            t={t}
                            options={statusOptions}
                            setOption={setStatus}
                            selectedOption={status}
                            handleApplyFilters={handleApplyFilters}
                            handleReset={handleReset}
                        />
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
                <FilterContent
                    t={t}
                    options={statusOptions}
                    setOption={setStatus}
                    selectedOption={status}
                    handleApplyFilters={handleApplyFilters}
                    handleReset={handleReset}
                />
            </CardContent>
        </Card>
    );
};
