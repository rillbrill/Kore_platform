"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: "right" | "left" | "bottom";
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className,
  side = "right",
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const slideVariants = {
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  };

  const containerStyles = {
    right: "top-0 right-0 h-full w-full max-w-xl border-l",
    left: "top-0 left-0 h-full w-full max-w-xl border-r",
    bottom: "bottom-0 left-0 w-full max-h-[85vh] border-t rounded-t-2xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.div
            {...slideVariants[side]}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={twMerge(
              clsx(
                "fixed bg-surface-raised border-border-strong shadow-elevation-overlay flex flex-col z-10",
                containerStyles[side],
                className
              )
            )}
          >
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <div>
                {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-surface-overlay transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
