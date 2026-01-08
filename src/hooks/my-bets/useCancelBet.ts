'use client';

import { getValidServerToken } from '@/lib/auth/server-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useCancelBet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['cancel-bet'],
        mutationFn: async (betId: string) => {
            const token = await getValidServerToken();

            if (!token) {
                throw new Error('Unauthorized');
            }

            const response = await axios.delete(`/api/my-bet/${betId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-bets'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const message = error.response?.data?.message || 'Failed to cancel bet';
            toast.error(message);
        },
    });
};
