import React from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
}

export function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-[1rem] border border-gov-border bg-white p-8 text-center text-sm text-gray-500">
        Nenhum registro encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1rem] border border-gov-border bg-white">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gov-border bg-gray-100 font-semibold text-gov-darkBlue">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-6 py-3">
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
                    {col.render ? col.render(row) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col divide-y divide-gray-200 bg-gray-50 md:hidden">
        {data.map((row) => (
          <div key={keyExtractor(row)} className="flex flex-col gap-2 bg-white p-4">
            {columns.map((col) => (
              <div key={col.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:mb-0">
                  {col.label}
                </span>
                <span className="break-words text-sm font-medium text-gray-800">
                  {col.render ? col.render(row) : null}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
