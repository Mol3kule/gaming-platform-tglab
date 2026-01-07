import { getAuthUser } from '@/lib/auth/server-auth';
import { redirect } from 'next/navigation';
import { GameDetail } from '@/components/games/GameDetail';

type Props = {
    params: Promise<{ gameId: string }>;
};

export default async function GameDetailPage({ params }: Props) {
    const user = await getAuthUser();

    if (!user) {
        redirect('/');
    }

    const { gameId } = await params;

    return <GameDetail gameId={gameId} user={user} />;
}
