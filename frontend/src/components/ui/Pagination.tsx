import React from 'react';
import { Paginator } from '@uigovpe/components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="surface-card rounded-[1.5rem] px-3 py-2">
      <Paginator
        first={(currentPage - 1) * 10}
        rows={10}
        totalRecords={totalPages * 10}
        centered
        showRowsPerPage={false}
        showCurrentPageReport={false}
        onPageChange={(event) => onPageChange(event.page + 1)}
      />
    </div>
  );
}
