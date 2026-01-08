'use client';

import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage?: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const t = useTranslations('pagination');
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = useCallback(
        (pageNumber: number) => {
            const params = new URLSearchParams(searchParams);
            params.set('page', pageNumber.toString());
            return `${pathname}?${params.toString()}`;
        },
        [pathname, searchParams],
    );

    const pageNumbers = useMemo(() => {
        const pages: (number | 'ellipsis')[] = [];

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (currentPage <= 3) {
            pages.push(2, 3, 4, 'ellipsis', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    return (
        <ShadcnPagination>
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
                            aria-disabled={currentPage <= 1}
                            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                        >
                            <ChevronLeftIcon />
                            <span className="hidden sm:block">{t('previous')}</span>
                        </PaginationPrevious>
                    </PaginationItem>
                )}
                {pageNumbers.map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href={currentPage === page ? '#' : createPageURL(page)}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                {totalPages > currentPage && (
                    <PaginationItem>
                        <PaginationNext
                            href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
                            aria-disabled={currentPage >= totalPages}
                            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                        >
                            <span className="hidden sm:block">{t('next')}</span>
                            <ChevronRightIcon />
                        </PaginationNext>
                    </PaginationItem>
                )}
            </PaginationContent>
        </ShadcnPagination>
    );
}
