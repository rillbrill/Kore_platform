"use client";

import React from "react";
import Link from "next/link";
import { Security } from "@/types/domain";
import { clsx } from "clsx";

interface LiveTickerRibbonProps {
  securities: Security[];
}

export function LiveTickerRibbon({ securities }: LiveTickerRibbonProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar bg-slate-50 border-b border-slate-200 py-2 px-4 font-sans text-xs">
      <div className="flex items-center gap-4 min-w-max">
        <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800">
            24/7 OTC LIVE
          </span>
        </div>

        {securities.slice(0, 6).map((sec) => (
          <Link
            key={sec.id}
            href={`/markets/${sec.id}`}
            className="flex items-center gap-2 hover:bg-slate-200/60 px-2 py-1 rounded-md transition-all group"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-blue-50 border border-blue-200/80 flex items-center justify-center font-bold text-[9px] text-blue-700 font-mono">
                {sec.symbol.slice(1, 3)}
              </span>
              <strong className="text-slate-900 font-semibold group-hover:text-blue-700 transition-colors text-xs">
                {sec.name}
              </strong>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-slate-900 font-bold tabular-nums">
                ${sec.usdPrice.toFixed(2)}
              </span>
              <span
                className={clsx(
                  "font-bold tabular-nums text-[11px]",
                  sec.change24h >= 0 ? "text-emerald-700" : "text-rose-700"
                )}
              >
                {sec.change24h >= 0 ? "+" : ""}{sec.change24h.toFixed(2)}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
