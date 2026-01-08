'use client';

import { TransactionType } from '@/types/player.types';
import { useTranslations } from 'next-intl';
import { RenderAdditionalFilter } from '../filters/render-additional-filter';

const TRANSACTION_TYPES: TransactionType[] = ['bet', 'win', 'cancel'];

interface TransactionsFilterProps {
    isMobile?: boolean;
}

export const TransactionsFilter = ({ isMobile = false }: TransactionsFilterProps) => {
    const t = useTranslations('transactions');

    const typeOptions: { value: TransactionType | 'all'; label: string }[] = [
        { value: 'all', label: t('filter.allTypes') },
        ...TRANSACTION_TYPES.map((txType) => ({ value: txType, label: t(`type.${txType}`) })),
    ];

    return <RenderAdditionalFilter filter="type" options={typeOptions} isMobile={isMobile} />;
};
