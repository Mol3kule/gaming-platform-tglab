'use client';

import { Game } from '@/types/game.types';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const useGetGameById = (id: string) => {
    return useQuery({
        queryKey: ['getGameById', id],
        queryFn: async () => {
            try {
                return (await axios.get(`/api/games/${id}`)) as AxiosResponse<Game | null>;
            } catch {
                return null;
            }
        },
        staleTime: Infinity,
    });
};
