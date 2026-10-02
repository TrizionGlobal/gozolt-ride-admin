'use client';

import React, { ReactNode, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from './input';

export interface ColumnDef<T> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (row: T, expanded?: boolean) => ReactNode;
  className?: string;
}

interface DynamicDataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  rowKey?: keyof T | ((row: T) => string);
  emptyText?: ReactNode;
  size?: 'default' | 'sm';
  renderExpandedRow?: (row: T) => ReactNode;
  
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  
  hideSearch?: boolean;
}

export function DynamicDataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  rowKey = 'id' as keyof T,
  emptyText = 'No data found',
  size = 'default',
  renderExpandedRow,
  searchPlaceholder = 'Search...',
  searchKeys,
  hideSearch = false,
}: DynamicDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const getRowKey = (row: T) => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return String(row[rowKey as keyof T]);
  };

  // 1. Filter Data
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchKeys || searchKeys.length === 0) return data;
    
    const lowercasedTerm = searchTerm.toLowerCase();
    return data.filter((row) => {
      return searchKeys.some((key) => {
        const val = row[key];
        if (val == null) return false;
        return String(val).toLowerCase().includes(lowercasedTerm);
      });
    });
  }, [data, searchTerm, searchKeys]);

  // 2. Paginate Data
  const total = filteredData.length;
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredData.slice(startIndex, startIndex + limit);
  }, [filteredData, page, limit]);

  // Adjust page if it exceeds total after filtering
  React.useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / limit));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [total, limit, page]);

  const cellPadding = size === 'sm' ? 'px-2 py-2' : 'px-4 py-3';

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Search Header */}
      {!hideSearch && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#1A1F2C] p-4 rounded-xl border border-slate-800">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#2D3342] border-slate-700 text-slate-200 placeholder:text-slate-500 w-full"
            />
          </div>
        </div>
      )}

      {/* Table Body */}
      <div className="border border-[#27272A] rounded-xl overflow-hidden bg-transparent">
        {isLoading ? (
          <div className="p-4 space-y-2 border-b border-[#27272A]">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 w-full rounded bg-[#27272A] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#0A0A0A]/50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`${cellPadding} text-xs font-medium text-[#9CA3AF] whitespace-nowrap ${col.className || ''}`}
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <RowItem
                    key={getRowKey(row)}
                    row={row}
                    columns={columns}
                    cellPadding={cellPadding}
                    onRowClick={onRowClick}
                    renderExpandedRow={renderExpandedRow}
                  />
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-sm text-[#52525B]"
                    >
                      {emptyText}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#27272A] p-4 gap-4">
            <div className="flex items-center gap-6">
              <div className="text-sm text-[#A1A1AA]">
                Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total} records
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-[#A1A1AA]">Rows per page:</label>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-md border border-[#27272A] bg-[#141414] px-2 py-1 text-sm text-[#A1A1AA] outline-none focus:border-[#FACC15]"
                >
                  {[20, 50, 100, 200, 500].map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-[#A1A1AA]">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <span>Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page * limit >= total}
                className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RowItem<T>({ 
  row, 
  columns, 
  cellPadding, 
  onRowClick, 
  renderExpandedRow 
}: { 
  row: T; 
  columns: ColumnDef<T>[]; 
  cellPadding: string; 
  onRowClick?: (row: T) => void;
  renderExpandedRow?: (row: T) => ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (renderExpandedRow) {
      setExpanded(!expanded);
    }
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <React.Fragment>
      <tr
        onClick={handleClick}
        className={`border-b border-[#27272A] last:border-b-0 transition-colors ${
          (onRowClick || renderExpandedRow) ? 'cursor-pointer hover:bg-[#1A1A1A]/30' : ''
        }`}
      >
        {columns.map((col) => (
          <td key={col.key} className={`${cellPadding} ${col.className || ''}`}>
            {col.render
              ? col.render(row, expanded)
              : col.dataIndex
              ? String((row as any)[col.dataIndex] ?? '—')
              : '—'}
          </td>
        ))}
      </tr>
      {expanded && renderExpandedRow && (
        <tr className="bg-[#141414] border-b border-[#2A2A2A]">
          <td colSpan={columns.length} className="p-0">
            {renderExpandedRow(row)}
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}
