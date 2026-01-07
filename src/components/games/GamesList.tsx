'use client';

import { Game } from '@/types/game.types';
import { GameCard } from './GameCard';

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

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center flex-1">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-xl font-semibold mb-2">No Esports Matches Available</h3>
        <p className="text-muted-foreground">Check back later for upcoming tournaments</p>
    </div>
);

export const GamesList = ({ games, onPlaceBet, isLoading = false }: GamesListProps) => {
    if (isLoading) {
        return <LoadingState />;
    }

    if (games.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
                <GameCard key={game.id} game={game} onPlaceBet={onPlaceBet} />
            ))}
        </div>
    );
};
