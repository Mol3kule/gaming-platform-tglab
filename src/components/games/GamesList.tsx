'use client';

import { Game } from '@/types/game.types';
import { GameCard } from './GameCard';
import { useTranslations } from 'next-intl';

type GamesListProps = {
    games: Game[];
    onPlaceBet: (gameId: string, betType: 'homeWin' | 'draw' | 'awayWin') => void;
    isLoading?: boolean;
};

const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg" />
        ))}
    </div>
);

const EmptyState = () => {
    const t = useTranslations('games.emptyState');

    return (
        <div className="flex flex-col items-center justify-center text-center flex-1">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2">{t('noMatches')}</h3>
            <p className="text-muted-foreground">{t('checkBackLater')}</p>
        </div>
    );
};

export const GamesList = ({ games, onPlaceBet, isLoading = false }: GamesListProps) => {
    if (isLoading) {
        return <LoadingState />;
    }

    if (games.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {games.map((game) => (
                <GameCard key={game.id} game={game} onPlaceBet={onPlaceBet} />
            ))}
        </div>
    );
};
