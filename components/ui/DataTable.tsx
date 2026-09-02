"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { clsx } from "clsx";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "표시할 데이터가 없습니다.",
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });

  return (
    <div className={clsx("w-full overflow-x-auto custom-scrollbar dex-card rounded-2xl", className)}>
      <table className="w-full text-left border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-slate-200/80 bg-[#FAFBFD] text-slate-500 uppercase text-[10px] tracking-wider font-bold">
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{ width: col.width }}
                className={clsx(
                  "py-3 px-4 font-bold select-none whitespace-nowrap",
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left",
                  col.sortable && "cursor-pointer hover:text-blue-700"
                )}
                onClick={() => col.sortable && handleSort(col.accessorKey)}
              >
                <div
                  className={clsx(
                    "flex items-center gap-1.5",
                    col.align === "right"
                      ? "justify-end"
                      : col.align === "center"
                      ? "justify-center"
                      : "justify-start"
                  )}
                >
                  <span>{col.header}</span>
                  {col.sortable && (
                    <span className="text-slate-400">
                      {sortKey === col.accessorKey ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-3 h-3 text-blue-600" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-blue-600" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick && onRowClick(item)}
                className={clsx(
                  "transition-colors group",
                  onRowClick
                    ? "cursor-pointer hover:bg-blue-50/40"
                    : "hover:bg-slate-50/40"
                )}
              >
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={clsx(
                      "py-3.5 px-4 whitespace-nowrap text-slate-900",
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    )}
                  >
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-slate-400 font-mono"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
