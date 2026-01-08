'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionType } from '@/types/player.types';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { FilterContent } from '../filters/filter-content';

const TRANSACTION_TYPES: TransactionType[] = ['bet', 'win', 'cancel'];

interface TransactionsFilterProps {
    isMobile?: boolean;
}

export const TransactionsFilter = ({ isMobile = false }: TransactionsFilterProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [type, setType] = useState<TransactionType | 'all'>((searchParams.get('type') as TransactionType) || 'all');
    const t = useTranslations('transactions');

    useEffect(() => {
        setType((searchParams.get('type') as TransactionType) || 'all');
    }, [searchParams]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (type !== 'all') {
            params.set('type', type);
        } else {
            params.delete('type');
        }

        params.set('page', '1');

        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        setType('all');

        const params = new URLSearchParams(searchParams.toString());
        params.delete('type');
        params.set('page', '1');

        router.push(`?${params.toString()}`);
    };

    const typeOptions: { value: TransactionType | 'all'; label: string }[] = [
        { value: 'all', label: t('filter.allTypes') },
        ...TRANSACTION_TYPES.map((txType) => ({ value: txType, label: t(`type.${txType}`) })),
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
                            options={typeOptions}
                            setOption={setType}
                            selectedOption={type}
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
                    options={typeOptions}
                    setOption={setType}
                    selectedOption={type}
                    handleApplyFilters={handleApplyFilters}
                    handleReset={handleReset}
                />
            </CardContent>
        </Card>
    );
};
