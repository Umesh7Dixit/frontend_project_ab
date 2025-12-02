"use client";
import { useMemo, useState } from "react";

interface UsePaginationProps<T> {
    data: T[];
    itemsPerPage?: number;
}

export function usePagination<T>({ data, itemsPerPage = 10 }: UsePaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [currentPage, data, itemsPerPage]);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return {
        currentPage,
        totalPages,
        paginatedData,
        goToPage,
        setCurrentPage,
    };
}
