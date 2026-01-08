'use client';

import { getValidServerToken } from '@/lib/auth/server-auth';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useLogoutMutation = () => {
    return useMutation({
        mutationKey: ['logout'],
        mutationFn: async () => {
            try {
                const token = await getValidServerToken();

                if (!token) {
                    return null;
                }

                const response = await axios.post('/api/logout', undefined, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                return response.data;
            } catch {
                return null;
            }
        },
    });
};
