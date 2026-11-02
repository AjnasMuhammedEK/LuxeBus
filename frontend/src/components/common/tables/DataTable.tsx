
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  minWidth?: string;
}

function DataTable<T>({
  columns,
  data,
  getRowKey,
  loading = false,
  error = "",
  emptyMessage = "No records found",
  loadingMessage = "Loading...",
  minWidth = "640px",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-left text-sm"
        style={{ minWidth }}
      >
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {loading || error || data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={`px-6 py-10 text-center ${
                  error ? "text-red-500" : "text-slate-400"
                }`}
              >
                {loading
                  ? loadingMessage
                  : error || emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className="transition-colors hover:bg-slate-50"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
