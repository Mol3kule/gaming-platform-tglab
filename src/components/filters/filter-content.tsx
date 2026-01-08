'use client';

import { _Translator } from 'next-intl';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface FilterContentProps<T> {
    t: _Translator;
    options: { value: T | 'all'; label: string }[];
    setOption: (value: T | 'all') => void;
    selectedOption: T | 'all';
    handleApplyFilters: () => void;
    handleReset: () => void;
}

export const FilterContent = <T,>({
    t,
    options,
    setOption,
    selectedOption,
    handleApplyFilters,
    handleReset,
}: FilterContentProps<T>) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <Label>{t('filter.typeLabel')}</Label>
                <div className="flex flex-col gap-2">
                    {options.map((option, idx) => (
                        <button
                            key={`${idx}_${option.value}`}
                            onClick={() => setOption(option.value)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                selectedOption === option.value
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
};
