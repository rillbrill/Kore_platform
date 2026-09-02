"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export interface SegmentOption<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "default" | "dark" | "pill";
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = "md",
  className = "",
  variant = "default",
}: SegmentedControlProps<T>) {
  const instanceId = useId();

  const sizeClasses = {
    sm: "h-7 text-[11px] p-0.5 gap-0.5",
    md: "h-8 text-xs p-1 gap-1",
    lg: "h-10 text-xs sm:text-sm p-1 gap-1.5",
  };

  const itemPaddingClasses = {
    sm: "px-2 py-0.5",
    md: "px-2.5 py-1",
    lg: "px-3.5 py-1.5",
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-xl font-sans select-none border",
        variant === "dark"
          ? "bg-slate-900 border-slate-800 text-slate-400"
          : "bg-slate-100/90 border-slate-200/80 text-slate-500",
        sizeClasses[size],
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.id === value;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={clsx(
              "relative flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors z-10",
              itemPaddingClasses[size],
              isSelected
                ? variant === "dark"
                  ? "text-white font-semibold"
                  : "text-slate-950 font-semibold"
                : variant === "dark"
                ? "hover:text-slate-200"
                : "hover:text-slate-900"
            )}
          >
            {/* Sliding Pill Background via Framer Motion */}
            {isSelected && (
              <motion.div
                layoutId={`segmented-active-${instanceId}`}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
                className={clsx(
                  "absolute inset-0 rounded-lg -z-10 shadow-2xs",
                  variant === "dark"
                    ? "bg-slate-800 border border-slate-700"
                    : "bg-white border border-slate-200/90"
                )}
              />
            )}

            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
            {opt.badge && <span className="shrink-0">{opt.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
