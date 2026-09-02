"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "buy" | "sell" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      leftIcon,
      rightIcon,
      loading,
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isBusy = loading || isLoading;

    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-colors select-none focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-md";

    const variantStyles = {
      primary: "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border border-slate-900",
      secondary: "bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-xs",
      outline: "bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200",
      ghost: "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100",
      buy: "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border border-slate-900",
      sell: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-rose-600",
      danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-rose-600",
    };

    const sizeStyles = {
      sm: "h-7 px-2.5 text-xs gap-1.5",
      md: "h-8 px-3 text-xs gap-2",
      lg: "h-9 px-3.5 text-xs gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isBusy}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isBusy ? (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isBusy && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
