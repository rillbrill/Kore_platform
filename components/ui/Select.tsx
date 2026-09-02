import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, errorText, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-slate-300 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={twMerge(
              clsx(
                "w-full bg-surface-raised text-white border border-border rounded-lg px-3.5 py-2.5 text-sm appearance-none cursor-pointer pr-10 transition-all focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/40 disabled:opacity-50",
                errorText && "border-status-restricted",
                className
              )
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
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
Select.displayName = "Select";
