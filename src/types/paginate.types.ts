export const ITEMS_PER_PAGE = 10;

export type PaginatedResult<T> = {
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
};
