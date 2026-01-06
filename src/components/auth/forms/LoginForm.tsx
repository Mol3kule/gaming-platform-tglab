'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { loginSchema, type LoginFormData } from '@/lib/validators/auth.validators';
import { FormField } from './FormField';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
    const t = useTranslations('auth.login');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const loading = isLoading || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
                label={t('emailLabel')}
                type="email"
                placeholder={t('emailPlaceholder')}
                error={errors.email?.message}
                disabled={loading}
                required
                {...register('email')}
            />

            <FormField
                label={t('passwordLabel')}
                type="password"
                placeholder={t('passwordPlaceholder')}
                error={errors.password?.message}
                disabled={loading}
                required
                {...register('password')}
            />

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                    <>
                        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {t('signingIn')}
                    </>
                ) : (
                    <>
                        <Lock />
                        {t('submitButton')}
                    </>
                )}
            </Button>
        </form>
    );
}
