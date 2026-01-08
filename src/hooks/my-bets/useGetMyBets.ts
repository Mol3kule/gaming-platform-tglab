'use client';

import { getValidServerToken } from '@/lib/auth/server-auth';
import { ITEMS_PER_PAGE, PaginatedResult } from '@/types/paginate.types';
import { Bet, BetStatus } from '@/types/player.types';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

interface MyBetsParams {
    id?: string;
    page?: number;
    limit?: number;
    status?: BetStatus;
}

export const useGetMyBets = ({ id, page = 1, limit = ITEMS_PER_PAGE, status }: MyBetsParams) => {
    return useQuery({
        queryKey: ['my-bets'],
        queryFn: async () => {
            try {
                const token = await getValidServerToken();

                if (!token) {
                    return null;
                }

                return (await axios.get(
                    '/api/my-bets',

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            id,
                            page,
                            limit,
                            status,
                        },
                    },
                )) as AxiosResponse<PaginatedResult<Bet>>;
            } catch {
                return null;
            }
        },
    });
};
