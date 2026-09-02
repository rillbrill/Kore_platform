import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      leftElement,
      rightElement,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-300 select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3.5 pointer-events-none text-slate-400 flex items-center">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                "w-full bg-surface-raised text-white placeholder:text-slate-500 border border-border rounded-lg px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/40 disabled:opacity-50 disabled:bg-surface",
                leftElement && "pl-10",
                rightElement && "pr-10",
                errorText && "border-status-restricted focus:border-status-restricted focus:ring-status-restricted/40",
                className
              )
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 text-slate-400 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {helperText && !errorText && (
          <p className="text-[11px] text-slate-400">{helperText}</p>
        )}
        {errorText && (
          <p className="text-[11px] text-status-restricted font-medium">{errorText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
