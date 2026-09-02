"use client";

import React from "react";
import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "emerald" | "rose" | "blue" | "slate" | "teal" | "cobalt" | "buy" | "sell" | "settled" | "pending" | "warning";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    emerald: "bg-slate-100 text-slate-800 border-slate-200",
    settled: "bg-slate-100 text-slate-800 border-slate-200",
    teal: "bg-slate-100 text-slate-800 border-slate-200",
    blue: "bg-slate-100 text-slate-800 border-slate-200",
    cobalt: "bg-slate-100 text-slate-800 border-slate-200",
    pending: "bg-amber-50/80 text-amber-800 border-amber-200/60",
    warning: "bg-amber-50/80 text-amber-800 border-amber-200/60",
    rose: "bg-rose-50/80 text-rose-800 border-rose-200/60",
    buy: "bg-slate-100 text-slate-800 border-slate-200",
    sell: "bg-rose-50/80 text-rose-800 border-rose-200/60",
  };

  const dotColors = {
    neutral: "bg-slate-400",
    slate: "bg-slate-500",
    emerald: "bg-emerald-500",
    settled: "bg-emerald-500",
    teal: "bg-emerald-500",
    blue: "bg-blue-500",
    cobalt: "bg-blue-500",
    pending: "bg-blue-500",
    warning: "bg-amber-500",
    rose: "bg-rose-500",
    buy: "bg-emerald-500",
    sell: "bg-rose-500",
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10.5px]",
    md: "px-2 py-0.5 text-[11.5px]",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 font-mono font-medium rounded border tabular-nums select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      <span>{children}</span>
    </span>
  );
}
