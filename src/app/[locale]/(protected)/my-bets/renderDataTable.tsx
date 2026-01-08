'use client';

import { DataTable } from '@/components/data-table';
import { myBetColumns } from './myBetColumns';
import { useGetMyBets } from '@/hooks/my-bets/useGetMyBets';
import { Pagination } from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { BetStatus } from '@/types/player.types';

export const RenderMyBetsDataTable = () => {
    const { limitParams, pageParams, statusFilter } = usePagination<BetStatus>();
    const { data, isFetching } = useGetMyBets({ page: pageParams, limit: limitParams, status: statusFilter });

    if (isFetching) {
        return <div>...</div>;
    }

    return (
        <>
            <DataTable columns={myBetColumns} data={data?.data.data || []} />
            {data?.data && (
                <Pagination currentPage={data.data.currentPage || 1} totalPages={data.data.totalPages || 1} />
            )}
        </>
    );
};
