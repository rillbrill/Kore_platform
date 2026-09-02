"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface AnimatedPriceProps {
  value: number;
  format?: (v: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
  flashOnUpdate?: boolean;
}

export function AnimatedPrice({
  value,
  format,
  prefix = "$",
  suffix = "",
  className = "",
  flashOnUpdate = true,
}: AnimatedPriceProps) {
  const prevValueRef = useRef(value);
  const [flashDirection, setFlashDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (!flashOnUpdate) return;
    if (value > prevValueRef.current) {
      setFlashDirection("up");
      const timer = setTimeout(() => setFlashDirection(null), 800);
      return () => clearTimeout(timer);
    } else if (value < prevValueRef.current) {
      setFlashDirection("down");
      const timer = setTimeout(() => setFlashDirection(null), 800);
      return () => clearTimeout(timer);
    }
    prevValueRef.current = value;
  }, [value, flashOnUpdate]);

  const displayString = format ? format(value) : value.toFixed(2);

  return (
    <motion.span
      className={clsx(
        "inline-flex items-baseline tabular-nums font-mono px-1 py-0.5 rounded transition-colors duration-500",
        flashDirection === "up" && "bg-emerald-500/15 text-emerald-700 font-bold",
        flashDirection === "down" && "bg-rose-500/15 text-rose-700 font-bold",
        className
      )}
    >
      {prefix && <span className="mr-0.5 text-opacity-80 font-normal">{prefix}</span>}
      <span>{displayString}</span>
      {suffix && <span className="ml-0.5 text-opacity-80 font-normal">{suffix}</span>}
    </motion.span>
  );
}
