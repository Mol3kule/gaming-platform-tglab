import { AuthFormContainer } from '@/components/auth/AuthFormContainer';
import { Header } from '@/components/header';
import { getAuthUser } from '@/lib/auth/server-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
    const user = await getAuthUser();

    if (user) {
        redirect('/dashboard');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-4">
            <Header displayMenu={false} />
            <main className="w-full flex items-center justify-center">
                <AuthFormContainer />
            </main>
        </div>
    );
}
