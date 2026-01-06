'use client';

import { RegisterPayload } from '@/lib/validators/auth.validators';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

interface RegisterResponse {
    id: string;
    name: string;
}

export const useRegisterMutation = () => {
    return useMutation({
        mutationKey: ['auth_register'],
        mutationFn: async (data: RegisterPayload) => {
            return (await axios.post('/api/register', data)) as AxiosResponse<RegisterResponse>;
        },
    });
};
