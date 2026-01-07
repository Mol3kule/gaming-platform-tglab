'use client';

import { getValidServerToken } from '@/lib/auth/server-auth';
import { Game } from '@/types/game.types';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const useGetGameById = (id: string) => {
    return useQuery({
        queryKey: ['getGameById', id],
        queryFn: async () => {
            try {
                const token = await getValidServerToken();

                if (!token) {
                    return null;
                }

                return (await axios.get(`/api/games/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })) as AxiosResponse<Game | null>;
            } catch {
                return null;
            }
        },
        staleTime: Infinity,
    });
};
