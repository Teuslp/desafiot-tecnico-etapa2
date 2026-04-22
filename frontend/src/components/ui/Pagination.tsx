import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded border border-gov-border bg-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gov-darkBlue"
      >
        &laquo; Anterior
      </button>
      
      <span className="text-sm font-bold text-gray-600 px-4">
        Página {currentPage} de {totalPages}
      </span>

      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded border border-gov-border bg-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gov-darkBlue"
      >
        Próximo &raquo;
      </button>
    </div>
  );
}
