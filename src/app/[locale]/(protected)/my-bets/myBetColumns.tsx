/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Bet } from '@/types/player.types';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useCancelBet } from '@/hooks/my-bets/useCancelBet';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrencySymbol } from '@/lib/currency';
import { useTranslations } from 'next-intl';

export const myBetColumns: ColumnDef<Bet>[] = [
    {
        accessorKey: 'id',
        header: 'id',
    },
    {
        accessorKey: 'status',
        header: 'status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const t = useTranslations('my-bets.status');
            return <span className="capitalize">{t(status)}</span>;
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
    {
        accessorKey: 'winAmount',
        header: 'win_amount',
        cell: ({ row }) => {
            const winAmount = row.getValue('winAmount') as number | null;
            const { user } = useAuth();
            const symbol = getCurrencySymbol(user?.currency || 'EUR');
            return winAmount ? `${symbol}${winAmount.toFixed(2)}` : '-';
        },
    },
    {
        id: 'actions',
        header: 'actions',
        cell: ({ row }) => {
            const bet = row.original;
            const { mutate: cancelBet, isPending } = useCancelBet();

            if (bet.status !== 'pending') {
                return null;
            }

            return (
                <Button variant="destructive" size="sm" onClick={() => cancelBet(bet.id)} disabled={isPending}>
                    {isPending ? 'Canceling...' : 'Cancel'}
                </Button>
            );
        },
    },
];
