import { getAuthUser } from '@/lib/auth/server-auth';
import { redirect } from 'next/navigation';
import { GamesContainer } from '@/components/games/GamesContainer';

export default async function GamesPage() {
    const user = await getAuthUser();

    if (!user) {
        redirect('/');
    }

    return <GamesContainer userName={user.name} />;
}
