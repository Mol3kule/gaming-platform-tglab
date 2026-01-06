import { AuthFormContainer } from '@/components/auth/AuthFormContainer';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface HomeProps {
    params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
    const { locale } = await params;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-4">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher currentLocale={locale} />
            </div>
            <main className="w-full flex items-center justify-center">
                <AuthFormContainer />
            </main>
        </div>
    );
}
