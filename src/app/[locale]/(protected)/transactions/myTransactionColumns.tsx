/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@/contexts/AuthContext';
import { getCurrencySymbol } from '@/lib/currency';
import { Transaction } from '@/types/player.types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

export const myTransactionColumns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'id',
        header: 'id',
    },
    {
        accessorKey: 'type',
        header: 'type',
        cell: ({ row }) => {
            const type = row.getValue('type') as string;
            const t = useTranslations('transactions.type');
            return <span className="capitalize">{t(type)}</span>;
        },
    },
    {
        accessorKey: 'amount',
        header: 'amount',
        cell: ({ row }) => {
            const amount = row.getValue('amount') as number;
            const { user } = useAuth();
            const symbol = getCurrencySymbol(user?.currency || 'EUR');
            return `${symbol}${amount.toFixed(2)}`;
        },
    },
];
