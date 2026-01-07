'use client';

import { Game, GameName } from '@/types/game.types';
import { ITEMS_PER_PAGE, PaginatedResult } from '@/types/paginate.types';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

interface UseGetGamesParams {
    page?: number;
    limit?: number;
    gameName?: GameName;
}

export const useGetGames = ({ page = 1, limit = ITEMS_PER_PAGE, gameName }: UseGetGamesParams) => {
    return useQuery({
        queryKey: ['getGames', { page, limit, gameName }],
        queryFn: async (): Promise<PaginatedResult<Game>> => {
            const response = (await axios.get('/api/games', {
                params: { page, limit, type: decodeURIComponent(gameName || '') },
            })) as AxiosResponse<PaginatedResult<Game>>;

            return response.data;
        },
        staleTime: Infinity,
    });
};
