"use client";

import React from "react";
import { clsx } from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "ghost";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white border border-slate-200 shadow-xs",
    subtle: "bg-slate-50 border border-slate-200",
    ghost: "bg-transparent border-transparent",
  };

  return (
    <div
      className={clsx(
        "rounded-lg p-5 transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
