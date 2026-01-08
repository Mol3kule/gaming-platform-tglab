'use client';

import { ITEMS_PER_PAGE } from '@/types/paginate.types';
import { useSearchParams } from 'next/navigation';

export const usePagination = <TStatus = string, TType = string>() => {
    const params = useSearchParams();
    const pageParams = Number(params.get('page')) || 1;
    const limitParams = Number(params.get('limit')) || ITEMS_PER_PAGE;
    const idFilter = params.get('id') || undefined;
    const statusFilter = (params.get('status') as TStatus) || undefined;
    const typeFilter = (params.get('type') as TType) || undefined;

    return { params, pageParams, limitParams, idFilter, statusFilter, typeFilter };
};
