"use client";

import React from "react";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { clsx } from "clsx";

interface FinancialMetricProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  tooltip?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export function FinancialMetric({
  label,
  value,
  subValue,
  trend,
  tooltip,
  icon,
  highlight = false,
}: FinancialMetricProps) {
  return (
    <div
      className={clsx(
        "rounded-lg p-4 bg-white border font-mono flex flex-col justify-between transition-colors",
        highlight ? "border-slate-300" : "border-slate-200"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
          {label}
          {tooltip && (
            <span title={tooltip} className="cursor-help text-slate-400 hover:text-slate-600">
              <Info className="w-3 h-3" />
            </span>
          )}
        </span>
        {icon && (
          <div className="text-slate-400">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-xl sm:text-2xl font-semibold text-slate-950 tracking-tight tabular-nums font-mono">
          {value}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          {subValue && (
            <span className="text-slate-500 text-[11px] truncate max-w-[180px] font-sans">
              {subValue}
            </span>
          )}

          {trend && (
            <span
              className={clsx(
                "font-mono text-xs font-bold tabular-nums shrink-0",
                trend.isPositive ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
