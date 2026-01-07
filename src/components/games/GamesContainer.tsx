'use client';

import { GamesList } from './GamesList';
import { useCallback, useState } from 'react';
import { useGetGames } from '@/hooks/games/useGetGames';
import { useSearchParams } from 'next/navigation';
import { ITEMS_PER_PAGE } from '@/types/paginate.types';
import { GameName } from '@/types/game.types';

type GamesContainerProps = {
    userName: string;
};

export const GamesContainer = ({ userName }: GamesContainerProps) => {
    const params = useSearchParams();
    const pageParams = Number(params.get('page')) || 1;
    const limitParams = Number(params.get('limit')) || ITEMS_PER_PAGE;
    const gameNameParams = (params.get('type') || undefined) as GameName | undefined;

    const [page, setPage] = useState(pageParams);
    const { data, isFetching } = useGetGames({ page: page, limit: limitParams, gameName: gameNameParams });

    const handlePlaceBet = useCallback((gameId: string, betType: 'homeWin' | 'draw' | 'awayWin') => {
        console.log(`Placing bet for game ${gameId} on ${betType}`);
    }, []);

    return (
        <div className="flex flex-col container mx-auto py-8 px-4 flex-1">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
                <p className="text-muted-foreground">Place your bets on esports tournaments and matches</p>
            </div>

            <GamesList
                games={data?.data.map((game) => ({ ...game, startTime: new Date(game.startTime) })) || []}
                onPlaceBet={handlePlaceBet}
                isLoading={isFetching}
            />
        </div>
    );
};
