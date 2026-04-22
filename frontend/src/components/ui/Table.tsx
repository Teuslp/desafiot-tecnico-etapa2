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
      <div className="w-full p-8 text-center text-gray-500 border border-gov-border rounded bg-white">
        Nenhum registro encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gov-border rounded bg-white">
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
  );
}
