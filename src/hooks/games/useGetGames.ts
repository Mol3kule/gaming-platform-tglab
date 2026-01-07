'use client';

import { getValidServerToken } from '@/lib/auth/server-auth';
import { Game, GameName, GameStatus } from '@/types/game.types';
import { ITEMS_PER_PAGE, PaginatedResult } from '@/types/paginate.types';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

interface UseGetGamesParams {
    page?: number;
    limit?: number;
    gameName?: GameName;
    status?: GameStatus;
}

export const useGetGames = ({ page = 1, limit = ITEMS_PER_PAGE, gameName, status }: UseGetGamesParams) => {
    return useQuery({
        queryKey: ['getGames', { page, limit, gameName, status }],
        queryFn: async (): Promise<PaginatedResult<Game> | null> => {
            const params: Record<string, string | number> = { page, limit };
            const token = await getValidServerToken();

            if (!token) {
                return null;
            }

            if (gameName) {
                params.type = decodeURIComponent(gameName);
            }

            if (status) {
                params.status = status;
            }

            const response = (await axios.get('/api/games', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            })) as AxiosResponse<PaginatedResult<Game>>;

            return response.data;
        },
        staleTime: Infinity,
    });
};
