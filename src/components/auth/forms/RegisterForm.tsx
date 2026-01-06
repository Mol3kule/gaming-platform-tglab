'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { registerSchema, type RegisterFormData } from '@/lib/validators/auth.validators';
import { FormField } from './FormField';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => Promise<void>;
    isLoading?: boolean;
}

export function RegisterForm({ onSubmit, isLoading = false }: RegisterFormProps) {
    const t = useTranslations('auth.register');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });

    const loading = isLoading || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
                label={t('usernameLabel')}
                type="text"
                placeholder={t('usernamePlaceholder')}
                autoComplete="off"
                error={errors.username?.message}
                disabled={loading}
                required
                {...register('username')}
            />

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

            <FormField
                label={t('confirmPasswordLabel')}
                type="password"
                placeholder={t('confirmPasswordPlaceholder')}
                error={errors.confirmPassword?.message}
                disabled={loading}
                required
                {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                    <>
                        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {t('creatingAccount')}
                    </>
                ) : (
                    <>
                        <UserPlus />
                        {t('submitButton')}
                    </>
                )}
            </Button>
        </form>
    );
}
