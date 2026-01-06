'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './forms/RegisterForm';
import type { LoginFormData, RegisterFormData } from '@/lib/validators/auth.validators';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRegisterMutation } from '@/hooks/auth/useRegisterMutation';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

type AuthMode = 'login' | 'register';

export function AuthFormContainer() {
    const t = useTranslations('auth');
    const [mode, setMode] = useState<AuthMode>('login');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            console.log('Login data:', data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const { mutateAsync: registerMutationAsync } = useRegisterMutation();
    const handleRegister = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const { confirmPassword, ...registerPayload } = data;
            const response = await registerMutationAsync(registerPayload);

            toast.success(t('register.successMessage', { username: response.data.name }), { duration: 5000 });
        } catch (error) {
            if (error instanceof AxiosError && error.status === 400) {
                toast.error(t(error.response?.data?.message));
            } else {
                console.log('Registration error:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isLoginMode = mode === 'login';

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center">{isLoginMode ? t('login.title') : t('register.title')}</CardTitle>
                <CardDescription className="text-center">
                    {isLoginMode ? t('login.description') : t('register.description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoginMode ? (
                    <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                ) : (
                    <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                )}

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t dark:border-zinc-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground dark:bg-zinc-900">{t('divider')}</span>
                    </div>
                </div>

                <div className="text-center text-sm">
                    {isLoginMode ? (
                        <>
                            {t('login.noAccount')}{' '}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold"
                                onClick={() => setMode('register')}
                                disabled={isLoading}
                            >
                                {t('login.signUpLink')}
                            </Button>
                        </>
                    ) : (
                        <>
                            {t('register.hasAccount')}{' '}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold"
                                onClick={() => setMode('login')}
                                disabled={isLoading}
                            >
                                {t('register.signInLink')}
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
