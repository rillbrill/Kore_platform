"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Tabs({
  items,
  activeId,
  onChange,
  className,
  size = "md",
}: TabsProps) {
  const sizeStyles = {
    sm: "text-xs py-2 px-3",
    md: "text-sm py-2.5 px-4",
  };

  return (
    <div className={twMerge(clsx("flex items-center border-b border-border overflow-x-auto custom-scrollbar", className))}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={twMerge(
              clsx(
                "relative flex items-center gap-2 font-medium transition-colors whitespace-nowrap select-none",
                sizeStyles[size],
                isActive
                  ? "text-brand-teal-light font-semibold border-b-2 border-brand-teal -mb-[1px]"
                  : "text-slate-400 hover:text-slate-200"
              )
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold",
                  isActive
                    ? "bg-brand-teal/20 text-brand-teal-light"
                    : "bg-surface-overlay text-slate-400"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
