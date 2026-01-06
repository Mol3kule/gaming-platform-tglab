'use client';

import { LoginFormData } from '@/lib/validators/auth.validators';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export interface LoginResponse {
    id: string;
    name: string;
    balance: number;
    currency: string;
    accessToken: string;
}

export const useLoginMutation = () => {
    return useMutation({
        mutationKey: ['auth_login'],
        mutationFn: async (data: LoginFormData) => {
            return (await axios.post('/api/login', data)) as AxiosResponse<LoginResponse>;
        },
    });
};
