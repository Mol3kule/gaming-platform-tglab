'use client';

import { GamesList } from './GamesList';
import { useState } from 'react';
import { useGetGames } from '@/hooks/games/useGetGames';
import { useSearchParams } from 'next/navigation';
import { ITEMS_PER_PAGE } from '@/types/paginate.types';
import { GameName, GameStatus } from '@/types/game.types';
import { useTranslations } from 'next-intl';
import { GamesFilter } from './GamesFilter';
import { Pagination } from '../pagination';
import { usePagination } from '@/hooks/use-pagination';

type GamesContainerProps = {
    userName: string;
};

export const GamesContainer = ({ userName }: GamesContainerProps) => {
    const { params, pageParams, limitParams, statusFilter } = usePagination<GameStatus>();
    const gameNameFilter = (params.get('gameName') || undefined) as GameName | undefined;

    const [page, setPage] = useState(pageParams);

    const { data, isFetching } = useGetGames({
        page: page,
        limit: limitParams,
        gameName: gameNameFilter,
        status: statusFilter,
    });

    const t = useTranslations('games');

    return (
        <div className="flex flex-col flex-1 p-3.5">
            <div className="w-max">
                <h1 className="text-3xl font-bold mb-2">{t('title', { username: userName })}</h1>
                <p className="text-muted-foreground">{t('description')}</p>
            </div>
            <div className="flex flex-col lg:flex-row flex-1 py-12 gap-3.5">
                <GamesFilter />
                <div className="flex flex-col justify-between gap-4 w-full">
                    <GamesList
                        games={data?.data.map((game) => ({ ...game, startTime: new Date(game.startTime) })) || []}
                        isLoading={isFetching}
                    />
                    {data && data.data.length > 0 && (
                        <Pagination currentPage={data?.currentPage || 1} totalPages={data?.totalPages || 1} />
                    )}
                </div>
            </div>
        </div>
    );
};
