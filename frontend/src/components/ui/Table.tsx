import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  keyExtractor: (item: any) => string | number;
}

export function Table({ columns, data, keyExtractor }: TableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500 border border-gov-border rounded bg-white text-sm">
        Nenhum registro encontrado.
      </div>
    );
  }

  return (
    <div className="border border-gov-border rounded bg-white overflow-hidden">
      
      {/* VISTA DESKTOP (Tabela Clássica) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gov-darkBlue font-semibold border-b border-gov-border">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={keyExtractor(row)} 
                className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VISTA MOBILE (Cards) */}
      <div className="md:hidden flex flex-col divide-y divide-gray-200 bg-gray-50">
        {data.map((row) => (
          <div key={keyExtractor(row)} className="p-4 bg-white flex flex-col gap-2">
            {columns.map((col) => (
              <div key={col.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-0">
                  {col.label}
                </span>
                <span className="text-sm font-medium text-gray-800 break-words">
                  {col.render ? col.render(row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}
