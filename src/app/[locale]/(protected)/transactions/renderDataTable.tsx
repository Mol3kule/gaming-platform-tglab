'use client';

import { DataTable } from '@/components/data-table';
import { myTransactionColumns } from './myTransactionColumns';
import { Pagination } from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { useGetMyTransactions } from '@/hooks/transactions/useGetMyTransactions';
import { TransactionType } from '@/types/player.types';
import { TransactionsFilter } from '@/components/transactions/TransactionsFilter';
import { useIsMobile } from '@/hooks/use-mobile';

export const RenderMyTransactionsDataTable = () => {
    const { idFilter, limitParams, pageParams, typeFilter } = usePagination();

    const { data, isFetching } = useGetMyTransactions({
        id: idFilter,
        page: pageParams,
        limit: limitParams,
        type: typeFilter as TransactionType,
    });
    const isMobile = useIsMobile();

    if (isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-3.5 flex-1">
            {!isMobile && (
                <aside className="md:sticky md:top-4 md:self-start">
                    <TransactionsFilter />
                </aside>
            )}
            <div className="flex-1 flex flex-col gap-3.5">
                {isMobile && (
                    <div className="flex justify-end">
                        <TransactionsFilter isMobile />
                    </div>
                )}
                <DataTable columns={myTransactionColumns} data={data?.data.data || []} />
                {data?.data && (
                    <Pagination currentPage={data.data.currentPage || 1} totalPages={data.data.totalPages || 1} />
                )}
            </div>
        </div>
    );
};
