'use client';

import { useState } from 'react';
import { usePagination } from '@/hooks/use-pagination';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';
import { FilterContent } from './filter-content';

interface RenderAdditionalFilterProps<T extends string> {
    filter: 'type' | 'status';
    options: { value: T | 'all'; label: string }[];
    isMobile?: boolean;
}

export const RenderAdditionalFilter = <T extends string>({
    filter,
    options,
    isMobile = false,
}: RenderAdditionalFilterProps<T>) => {
    const { params: searchParams, typeFilter, statusFilter } = usePagination();
    const t = useTranslations('transactions');
    const router = useRouter();

    const [selectedFilter, setFilter] = useState<T | 'all'>(
        (filter === 'type' ? typeFilter ?? 'all' : statusFilter ?? 'all') as T | 'all',
    );

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedFilter !== 'all') {
            params.set(filter, selectedFilter);
        } else {
            params.delete(filter);
        }

        params.set('page', '1');

        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        setFilter('all');

        const params = new URLSearchParams(searchParams.toString());
        params.delete(filter);
        params.set('page', '1');

        router.push(`?${params.toString()}`);
    };

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
                        <FilterContent<T>
                            t={t}
                            options={options}
                            setOption={setFilter}
                            selectedOption={selectedFilter}
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
                <FilterContent<T>
                    t={t}
                    options={options}
                    setOption={setFilter}
                    selectedOption={selectedFilter}
                    handleApplyFilters={handleApplyFilters}
                    handleReset={handleReset}
                />
            </CardContent>
        </Card>
    );
};
