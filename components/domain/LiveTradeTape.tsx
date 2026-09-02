"use client";

import React, { useState, useEffect, useRef } from "react";
import { Security } from "@/types/domain";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface TradeItem {
  id: string;
  time: string;
  price: number;
  qty: number;
  side: "BUY" | "SELL";
  krwPrice: number;
}

interface LiveTradeTapeProps {
  security: Security;
  onPriceClick?: (price: number) => void;
}

export function LiveTradeTape({ security, onPriceClick }: LiveTradeTapeProps) {
  const { language } = useApp();
  const counterRef = useRef<number>(1);

  const [trades, setTrades] = useState<TradeItem[]>(() => {
    const baseP = security.usdPrice;
    const now = new Date();
    const initialList: TradeItem[] = [];

    for (let i = 0; i < 10; i++) {
      const past = new Date(now.getTime() - i * 1800);
      const timeStr = past.toTimeString().split(" ")[0];
      const delta = (Math.random() - 0.48) * (baseP * 0.002);
      const p = parseFloat((baseP + delta).toFixed(2));
      const isBuy = Math.random() > 0.42;
      const q = Math.floor(Math.random() * 180) + 15;

      initialList.push({
        id: `TRD-init-${i}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        time: timeStr,
        price: p,
        qty: q,
        side: isBuy ? "BUY" : "SELL",
        krwPrice: Math.round(p * 1380.5),
      });
    }

    return initialList;
  });

  // Fast, Snappy Live Execution Stream (Every 900ms ~ 1400ms) with Guaranteed Unique Keys
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const baseP = security.usdPrice;
      const microDelta = (Math.random() - 0.48) * (baseP * 0.0025);
      const execPrice = parseFloat((baseP + microDelta).toFixed(2));
      const isBuy = Math.random() > 0.45;
      const execQty = Math.floor(Math.random() * 240) + 10;
      const uniqueCount = counterRef.current++;

      const newTrade: TradeItem = {
        id: `TRD-stream-${Date.now()}-${uniqueCount}-${Math.random().toString(36).substring(2, 6)}`,
        time: timeStr,
        price: execPrice,
        qty: execQty,
        side: isBuy ? "BUY" : "SELL",
        krwPrice: Math.round(execPrice * 1380.5),
      };

      setTrades((prev) => [newTrade, ...prev.slice(0, 24)]);
    }, 1100);

    return () => clearInterval(interval);
  }, [security.usdPrice]);

  // Buy vs Sell volume ratio calculation
  const totalVolume = trades.reduce((sum, t) => sum + t.qty, 0) || 1;
  const buyVolume = trades.filter((t) => t.side === "BUY").reduce((sum, t) => sum + t.qty, 0);
  const buyRatio = Math.round((buyVolume / totalVolume) * 100);
  const sellRatio = 100 - buyRatio;

  return (
    <div className="space-y-3 font-mono text-xs select-none">
      {/* 1. Live Flow Volume Ratio Meter (Treemap Palette Matched) */}
      <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5 font-sans">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#336344] font-bold">
            {language === "KO" ? "체결 매수세" : "Buy Flow"} {buyRatio}%
          </span>
          <span className="text-slate-400 text-[10px]">
            {language === "KO" ? "실시간 체결 유동성 강도" : "Real-Time Execution Flow"}
          </span>
          <span className="text-[#8c3535] font-bold">
            {language === "KO" ? "체결 매도세" : "Sell Flow"} {sellRatio}%
          </span>
        </div>

        <div className="h-1.5 w-full bg-[#fae8e8] rounded-full overflow-hidden flex">
          <div
            style={{ width: `${buyRatio}%` }}
            className="h-full bg-[#336344] transition-all duration-300"
          />
          <div
            style={{ width: `${sellRatio}%` }}
            className="h-full bg-[#8c3535] transition-all duration-300"
          />
        </div>
      </div>

      {/* 2. Real-time Tape Column Headers */}
      <div className="grid grid-cols-4 text-[10.5px] text-slate-400 px-2 py-1 font-sans border-b border-slate-100">
        <span>{language === "KO" ? "체결 시간" : "Time"}</span>
        <span>{language === "KO" ? "구분" : "Side"}</span>
        <span className="text-right">{language === "KO" ? "체결가 (USD)" : "Price ($)"}</span>
        <span className="text-right">{language === "KO" ? "체결 수량" : "Volume"}</span>
      </div>

      {/* 3. Streaming Trade Prints with Speedy Framer Motion Entry */}
      <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
        <AnimatePresence initial={false}>
          {trades.map((trade) => {
            const isBuy = trade.side === "BUY";
            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: -8, backgroundColor: isBuy ? "rgba(51, 99, 68, 0.12)" : "rgba(140, 53, 53, 0.12)" }}
                animate={{ opacity: 1, y: 0, backgroundColor: "transparent" }}
                transition={{ duration: 0.22 }}
                onClick={() => onPriceClick && onPriceClick(trade.price)}
                className="grid grid-cols-4 px-2 py-1.5 text-xs items-center hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group tabular-nums"
              >
                {/* Time */}
                <span className="text-[11px] text-slate-400 group-hover:text-slate-600">
                  {trade.time}
                </span>

                {/* Side Badge - Treemap Matched Color Tones */}
                <div>
                  <span
                    className={clsx(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold font-sans",
                      isBuy
                        ? "text-[#336344] bg-[#eaf3ed] border border-[#b8d6c5]"
                        : "text-[#8c3535] bg-[#fbf0f0] border border-[#ead6d6]"
                    )}
                  >
                    {isBuy ? (language === "KO" ? "매수" : "BUY") : (language === "KO" ? "매도" : "SELL")}
                  </span>
                </div>

                {/* Execution Price */}
                <div className="text-right">
                  <span className={clsx("font-bold text-xs", isBuy ? "text-[#336344]" : "text-[#8c3535]")}>
                    ${trade.price.toFixed(2)}
                  </span>
                </div>

                {/* Quantity */}
                <div className="text-right">
                  <span className="text-slate-900 font-semibold">
                    {trade.qty.toLocaleString()}
                  </span>
                  <span className="text-[10.5px] text-slate-400 ml-0.5 font-normal">
                    {language === "KO" ? "주" : "sh"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
