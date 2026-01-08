'use client';

import { DataTable } from '@/components/data-table';
import { myBetColumns } from './myBetColumns';
import { useGetMyBets } from '@/hooks/my-bets/useGetMyBets';
import { Pagination } from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { BetStatus } from '@/types/player.types';
import { MyBetsFilter } from '@/components/my-bets/MyBetsFilter';
import { useIsMobile } from '@/hooks/use-mobile';

export const RenderMyBetsDataTable = () => {
    const { limitParams, pageParams, statusFilter } = usePagination<BetStatus>();
    const { data, isFetching } = useGetMyBets({ page: pageParams, limit: limitParams, status: statusFilter });
    const isMobile = useIsMobile();

    if (isFetching) {
        return <div>...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-3.5 flex-1">
            {!isMobile && (
                <aside className="md:sticky md:top-4 md:self-start">
                    <MyBetsFilter />
                </aside>
            )}
            <div className="flex-1 flex flex-col gap-3.5">
                {isMobile && (
                    <div className="flex justify-end">
                        <MyBetsFilter isMobile />
                    </div>
                )}
                <DataTable columns={myBetColumns} data={data?.data.data || []} />
                {data?.data && (
                    <Pagination currentPage={data.data.currentPage || 1} totalPages={data.data.totalPages || 1} />
                )}
            </div>
        </div>
    );
};
