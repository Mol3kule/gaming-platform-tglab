'use client';

import { getValidServerToken } from '@/lib/auth/server-auth';
import { ITEMS_PER_PAGE, PaginatedResult } from '@/types/paginate.types';
import { Transaction, TransactionType } from '@/types/player.types';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

interface MyTransactionParams {
    id?: string;
    page?: number;
    limit?: number;
    type?: TransactionType;
}

export const useGetMyTransactions = ({ id, page = 1, limit = ITEMS_PER_PAGE, type }: MyTransactionParams) => {
    return useQuery({
        queryKey: ['my-transactions', { id, page, limit, type }],
        queryFn: async () => {
            try {
                const token = await getValidServerToken();

                if (!token) {
                    return null;
                }

                return (await axios.get('/api/my-transactions', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        id,
                        page,
                        limit,
                        type,
                    },
                })) as AxiosResponse<PaginatedResult<Transaction>>;
            } catch {
                return null;
            }
        },
    });
};
