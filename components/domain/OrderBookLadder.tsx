"use client";

import React, { useState, useEffect } from "react";
import { Security } from "@/types/domain";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LiveTradeTape } from "@/components/domain/LiveTradeTape";
import { Layers, Activity } from "lucide-react";
import { clsx } from "clsx";

export function OrderBookLadder({
  security,
  selectedPrice,
  onPriceClick,
}: {
  security: Security;
  selectedPrice?: number | null;
  onPriceClick?: (price: number) => void;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<"book" | "tape">("book");

  // Dynamic depth offset incrementing smoothly every 1200ms
  const [depthOffset, setDepthOffset] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDepthOffset((prev) => (prev + 1) % 1000);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const baseP = security.usdPrice;

  // 6 Ask levels (from highest price down to best ask)
  const askConfigs = [
    { mult: 1.005, baseQty: 180, factor: 17 },
    { mult: 1.004, baseQty: 320, factor: 23 },
    { mult: 1.003, baseQty: 450, factor: 11 },
    { mult: 1.002, baseQty: 580, factor: 29 },
    { mult: 1.001, baseQty: 390, factor: 13 },
    { mult: 1.0005, baseQty: 210, factor: 19 },
  ];

  // Dynamic raw asks
  const rawAsks = askConfigs.map((cfg) => {
    const microVariation = ((depthOffset * cfg.factor) % 140) - 60;
    const qty = Math.max(15, cfg.baseQty + microVariation);
    return {
      price: parseFloat((baseP * cfg.mult).toFixed(2)),
      qty,
    };
  });

  // Cumulative depth for Asks: accumulates from best ask (index 5) up to index 0
  let askRunningSum = 0;
  const asks = [...rawAsks]
    .reverse()
    .map((item) => {
      askRunningSum += item.qty;
      return { ...item, total: askRunningSum };
    })
    .reverse();

  // 6 Bid levels (from best bid downwards)
  const bidConfigs = [
    { mult: 0.9995, baseQty: 290, factor: 21 },
    { mult: 0.999, baseQty: 410, factor: 15 },
    { mult: 0.998, baseQty: 530, factor: 31 },
    { mult: 0.997, baseQty: 340, factor: 18 },
    { mult: 0.996, baseQty: 620, factor: 27 },
    { mult: 0.995, baseQty: 470, factor: 14 },
  ];

  let bidRunningSum = 0;
  const bids = bidConfigs.map((cfg) => {
    const microVariation = ((depthOffset * cfg.factor) % 150) - 65;
    const qty = Math.max(15, cfg.baseQty + microVariation);
    bidRunningSum += qty;
    return {
      price: parseFloat((baseP * cfg.mult).toFixed(2)),
      qty,
      total: bidRunningSum,
    };
  });

  // True dynamic maximum cumulative depth
  const maxTotal = Math.max(askRunningSum, bidRunningSum, 1);
  const bestAsk = asks[asks.length - 1].price;
  const bestBid = bids[0].price;
  const spreadUsd = parseFloat((bestAsk - bestBid).toFixed(2));
  const spreadBps = Math.round((spreadUsd / baseP) * 10000);

  return (
    <div className="rounded-xl p-4 bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 font-mono text-xs select-none">
      {/* 1. Linear Sliding Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <SegmentedControl<"book" | "tape">
          size="sm"
          value={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          options={[
            { id: "book", label: "호가창 (Order Book)", icon: <Layers className="w-3.5 h-3.5" /> },
            { id: "tape", label: "실시간 체결 (Live Tape)", icon: <Activity className="w-3.5 h-3.5" /> },
          ]}
        />

        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
          호가 단위: $0.01
        </span>
      </div>

      {activeTab === "book" ? (
        <div className="space-y-1">
          {/* Table Headers */}
          <div className="grid grid-cols-3 text-[10.5px] text-slate-400 px-2 py-0.5 font-sans border-b border-slate-50">
            <span>가격 (USD)</span>
            <span className="text-right">주문 잔량</span>
            <span className="text-right">누적 뎁스</span>
          </div>

          {/* Asks (Sell Orders) - Treemap Matched Terracotta Burgundy */}
          <div className="space-y-0.5">
            {asks.map((ask, idx) => {
              const depthPct = Math.min(100, Math.max(8, (ask.total / maxTotal) * 100));
              const isSelected = selectedPrice === ask.price;

              return (
                <div
                  key={`ask-${idx}`}
                  onClick={() => onPriceClick && onPriceClick(ask.price)}
                  className={clsx(
                    "relative grid grid-cols-3 px-2 py-1 rounded-md cursor-pointer transition-all duration-200 group",
                    isSelected
                      ? "bg-rose-50/90 ring-1 ring-rose-400/60 shadow-xs"
                      : "hover:bg-slate-50"
                  )}
                >
                  {/* Dynamic Gradient Depth Bar (Proportional to Real-Time Depth) */}
                  <div
                    className="absolute right-0 top-0 bottom-0 pointer-events-none rounded-r transition-all duration-500 ease-out"
                    style={{
                      width: `${depthPct}%`,
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(140, 53, 53, 0.04) 20%, rgba(140, 53, 53, 0.20) 100%)",
                    }}
                  />
                  <span className="text-[#8c3535] font-bold relative z-10 tabular-nums text-xs">
                    ${ask.price.toFixed(2)}
                  </span>
                  <span className="text-right text-slate-700 relative z-10 tabular-nums text-xs font-semibold">
                    {ask.qty.toLocaleString()}
                  </span>
                  <span className="text-right text-slate-400 relative z-10 tabular-nums text-[11px]">
                    {ask.total.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mid-Market Price & Live Spread Strip */}
          <div className="py-2 px-3 my-1.5 bg-slate-50/90 rounded-lg border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <strong className="text-slate-900 font-bold text-sm tabular-nums">
                ${security.usdPrice.toFixed(2)}
              </strong>
              <span
                className={clsx(
                  "text-[10.5px] font-bold flex items-center tabular-nums",
                  security.change24h >= 0 ? "text-[#336344]" : "text-[#8c3535]"
                )}
              >
                {security.change24h >= 0 ? "+" : ""}
                {security.change24h}%
              </span>
            </div>

            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>스프레드</span>
              <strong className="text-slate-800 font-semibold">${spreadUsd.toFixed(2)} ({spreadBps} bps)</strong>
            </div>
          </div>

          {/* Bids (Buy Orders) - Treemap Matched Muted Pine Sage */}
          <div className="space-y-0.5">
            {bids.map((bid, idx) => {
              const depthPct = Math.min(100, Math.max(8, (bid.total / maxTotal) * 100));
              const isSelected = selectedPrice === bid.price;

              return (
                <div
                  key={`bid-${idx}`}
                  onClick={() => onPriceClick && onPriceClick(bid.price)}
                  className={clsx(
                    "relative grid grid-cols-3 px-2 py-1 rounded-md cursor-pointer transition-all duration-200 group",
                    isSelected
                      ? "bg-emerald-50/90 ring-1 ring-emerald-400/60 shadow-xs"
                      : "hover:bg-slate-50"
                  )}
                >
                  {/* Dynamic Gradient Depth Bar (Proportional to Real-Time Depth) */}
                  <div
                    className="absolute right-0 top-0 bottom-0 pointer-events-none rounded-r transition-all duration-500 ease-out"
                    style={{
                      width: `${depthPct}%`,
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(51, 99, 68, 0.04) 20%, rgba(51, 99, 68, 0.20) 100%)",
                    }}
                  />
                  <span className="text-[#336344] font-bold relative z-10 tabular-nums text-xs">
                    ${bid.price.toFixed(2)}
                  </span>
                  <span className="text-right text-slate-700 relative z-10 tabular-nums text-xs font-semibold">
                    {bid.qty.toLocaleString()}
                  </span>
                  <span className="text-right text-slate-400 relative z-10 tabular-nums text-[11px]">
                    {bid.total.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Real-time Streaming Live Tape */
        <LiveTradeTape security={security} onPriceClick={onPriceClick} />
      )}
    </div>
  );
}
