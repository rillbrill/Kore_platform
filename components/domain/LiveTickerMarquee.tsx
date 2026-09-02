"use client";

import React from "react";
import Link from "next/link";
import { Security } from "@/types/domain";
import { useApp } from "@/context/AppContext";
import { clsx } from "clsx";

interface LiveTickerMarqueeProps {
  securities: Security[];
}

interface TickerItem {
  id?: string;
  label: string;
  subLabel?: string;
  value: string;
  change: string;
  isPos: boolean;
  isMacro: boolean;
}

export function LiveTickerMarquee({ securities }: LiveTickerMarqueeProps) {
  const { language } = useApp();

  const macroItems: TickerItem[] = [
    {
      label: "KOSPI 200",
      value: "368.42",
      change: "+1.18%",
      isPos: true,
      isMacro: true,
    },
    {
      label: "USD/KRW",
      value: "₩1,380.50",
      change: "-0.24%",
      isPos: false,
      isMacro: true,
    },
    {
      label: language === "KO" ? "US 10Y 국채" : "US 10Y Yield",
      value: "4.28%",
      change: "+0.03%",
      isPos: true,
      isMacro: true,
    },
    {
      label: language === "KO" ? "KTB 3Y 국고채" : "KTB 3Y Bond",
      value: "2.94%",
      change: "-0.01%",
      isPos: false,
      isMacro: true,
    },
  ];

  // Pick top 20 prominent market leaders for a focused, readable marquee
  const featuredSecurities = securities.slice(0, 20);

  const secItems: TickerItem[] = featuredSecurities.map((s) => ({
    id: s.id,
    label: s.symbol,
    subLabel: language === "KO" ? s.name : s.nameEn,
    value: `$${s.usdPrice.toFixed(2)}`,
    change: `${s.change24h >= 0 ? "+" : ""}${s.change24h.toFixed(2)}%`,
    isPos: s.change24h >= 0,
    isMacro: false,
  }));

  const allItems: TickerItem[] = [...macroItems, ...secItems];
  // Duplicate for seamless infinite horizontal loop
  const marqueeItems = [...allItems, ...allItems];

  return (
    <div className="w-full bg-slate-900 text-white overflow-hidden py-2 border-y border-slate-800 relative z-20 font-mono text-xs select-none group">
      <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
        {marqueeItems.map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-3">
            {item.id ? (
              <Link
                href={`/markets/${item.id}`}
                className="inline-flex items-center gap-2 hover:opacity-85 transition-opacity"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <strong className="text-slate-100 font-semibold text-xs font-mono">
                    {item.label}
                  </strong>
                  {item.subLabel && (
                    <span className="text-[11px] text-slate-400 font-sans max-w-[130px] truncate">
                      {item.subLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-semibold text-slate-200 tabular-nums">
                    {item.value}
                  </span>
                  <span
                    className={clsx(
                      "text-[10.5px] font-bold tabular-nums",
                      item.isPos ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {item.change}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 text-slate-300 font-mono">
                <span className="text-[9.5px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  MACRO
                </span>
                <span className="font-medium text-slate-300">{item.label}</span>
                <span className="font-semibold text-white tabular-nums">{item.value}</span>
                <span
                  className={clsx(
                    "text-[10.5px] font-bold tabular-nums",
                    item.isPos ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {item.change}
                </span>
              </div>
            )}

            <span className="text-slate-700 text-xs">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
