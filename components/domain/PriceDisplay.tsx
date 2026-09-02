"use client";

import React, { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface PriceDisplayProps {
  usdPrice: number;
  krwPrice: number;
  change24h: number;
  size?: "sm" | "md" | "lg" | "xl";
  showKrw?: boolean;
  className?: string;
  enableFlash?: boolean;
}

export function PriceDisplay({
  usdPrice,
  krwPrice,
  change24h,
  size = "md",
  showKrw = true,
  className,
  enableFlash = true,
}: PriceDisplayProps) {
  const isPositive = change24h >= 0;
  const prevPriceRef = useRef(usdPrice);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (!enableFlash) return;
    if (usdPrice > prevPriceRef.current) {
      setFlash("up");
      const timer = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(timer);
    } else if (usdPrice < prevPriceRef.current) {
      setFlash("down");
      const timer = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = usdPrice;
  }, [usdPrice, enableFlash]);

  const formattedUsd = usdPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [intPart, decPart] = formattedUsd.split(".");

  const sizeStyles = {
    sm: {
      usd: "text-sm font-semibold tracking-[-0.02em]",
      dec: "text-xs font-normal text-slate-400",
      krw: "text-[10.5px] text-slate-400 font-mono",
    },
    md: {
      usd: "text-lg sm:text-xl font-semibold tracking-[-0.025em]",
      dec: "text-sm font-normal text-slate-400",
      krw: "text-xs text-slate-500 font-mono",
    },
    lg: {
      usd: "text-2xl sm:text-3xl font-semibold tracking-[-0.03em]",
      dec: "text-lg font-normal text-slate-400",
      krw: "text-xs sm:text-sm text-slate-500 font-mono",
    },
    xl: {
      usd: "text-3xl sm:text-4xl font-semibold tracking-[-0.035em]",
      dec: "text-xl font-normal text-slate-400",
      krw: "text-sm sm:text-base text-slate-500 font-mono",
    },
  };

  const current = sizeStyles[size];

  return (
    <div className={clsx("flex flex-col font-mono", className)}>
      <div className="flex items-baseline gap-2.5 flex-wrap">
        {/* Optical USD Price with Micro Flash */}
        <motion.div
          animate={{
            backgroundColor:
              flash === "up"
                ? "rgba(51, 99, 68, 0.12)"
                : flash === "down"
                ? "rgba(140, 53, 53, 0.12)"
                : "transparent",
          }}
          transition={{ duration: 0.3 }}
          className="flex items-baseline px-1.5 py-0.5 rounded-lg -ml-1.5 transition-colors"
        >
          <span className="text-slate-400 text-sm font-medium mr-0.5">$</span>
          <span className={clsx("text-slate-950 tabular-nums", current.usd)}>
            {intPart}
          </span>
          <span className={clsx("tabular-nums text-slate-400", current.dec)}>
            .{decPart}
          </span>
        </motion.div>

        {/* Change Indicator */}
        <span
          className={clsx(
            "inline-flex items-center gap-1 font-mono font-bold tabular-nums select-none text-xs",
            isPositive ? "text-emerald-700" : "text-rose-700"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {change24h.toFixed(2)}%
          </span>
        </span>
      </div>

      {/* KRW Sub-Price */}
      {showKrw && (
        <span className={clsx("mt-0.5 tabular-nums text-slate-400 font-medium", current.krw)}>
          ≈ ₩{krwPrice.toLocaleString()} KRW
        </span>
      )}
    </div>
  );
}
