'use client';

import { DataTable } from '@/components/data-table';
import { myTransactionColumns } from './myTransactionColumns';
import { Pagination } from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { useGetMyTransactions } from '@/hooks/transactions/useGetMyTransactions';
import { TransactionType } from '@/types/player.types';

export const RenderMyTransactionsDataTable = () => {
    const { idFilter, limitParams, pageParams, typeFilter } = usePagination();
    const { data, isFetching } = useGetMyTransactions({
        id: idFilter,
        page: pageParams,
        limit: limitParams,
        type: typeFilter as TransactionType,
    });

    if (isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <DataTable columns={myTransactionColumns} data={data?.data.data || []} />
            {data?.data && (
                <Pagination currentPage={data.data.currentPage || 1} totalPages={data.data.totalPages || 1} />
            )}
        </>
    );
};
