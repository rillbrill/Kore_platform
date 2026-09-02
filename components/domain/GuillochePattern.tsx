"use client";

import React from "react";
import { clsx } from "clsx";

interface GuillochePatternProps {
  variant?: "subtle" | "rosette" | "wave" | "border";
  className?: string;
  opacity?: number;
}

export function GuillochePattern({
  variant = "wave",
  className,
  opacity = 0.04,
}: GuillochePatternProps) {
  // Generate spirograph mathematical curves
  const generateRosette = () => {
    const points: string[] = [];
    const R = 120;
    const r = 35;
    const p = 60;
    const steps = 360;

    for (let i = 0; i <= steps; i++) {
      const theta = (i * Math.PI) / 180;
      const x = 150 + (R - r) * Math.cos(theta) + p * Math.cos(((R - r) * theta) / r);
      const y = 150 + (R - r) * Math.sin(theta) - p * Math.sin(((R - r) * theta) / r);
      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return points.join(" ");
  };

  return (
    <div
      className={clsx(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 300"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="guillocheCyanGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052FF" />
            <stop offset="50%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <pattern
            id="guillocheWavePattern"
            width="120"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 30 Q 30 0, 60 30 T 120 30 M 0 20 Q 30 -10, 60 20 T 120 20 M 0 40 Q 30 10, 60 40 T 120 40"
              fill="none"
              stroke="url(#guillocheCyanGold)"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>

        {variant === "wave" && (
          <rect width="100%" height="100%" fill="url(#guillocheWavePattern)" />
        )}

        {variant === "rosette" && (
          <g transform="translate(150, 0)">
            <path
              d={generateRosette()}
              fill="none"
              stroke="#0052FF"
              strokeWidth="0.8"
            />
            <path
              d={generateRosette()}
              fill="none"
              stroke="#0D9488"
              strokeWidth="0.5"
              transform="rotate(15 150 150)"
            />
            <path
              d={generateRosette()}
              fill="none"
              stroke="#D97706"
              strokeWidth="0.5"
              transform="rotate(30 150 150)"
            />
          </g>
        )}

        {/* Laser Grid Coordinate Crosshairs */}
        <g stroke="#0B0F19" strokeWidth="0.8" opacity="0.6">
          <path d="M 20 15 L 20 25 M 15 20 L 25 20" />
          <path d="M 580 15 L 580 25 M 575 20 L 585 20" />
          <path d="M 20 275 L 20 285 M 15 280 L 25 280" />
          <path d="M 580 275 L 580 285 M 575 280 L 585 280" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Aptos-style bracketed micro technical badge
 */
export function TechnicalCornerBadge({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400 select-none pb-1.5 border-b border-slate-100 mb-3 tracking-wide">
      <span className="flex items-center gap-1.5 text-blue-700 font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
        <span>[ {label || "SYS_REF: KSD-DVP-2026 // NODE_01"} ]</span>
      </span>
      <span className="tracking-widest opacity-40 font-bold">[ ⣿⣿⣿⣿ ]</span>
    </div>
  );
}
