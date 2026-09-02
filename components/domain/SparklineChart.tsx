"use client";

import React, { useMemo } from "react";

interface SparklineChartProps {
  change24h: number;
  width?: number;
  height?: number;
  seed?: string | number;
}

export function SparklineChart({
  change24h,
  width = 130,
  height = 36,
  seed = 1,
}: SparklineChartProps) {
  const isUp = change24h >= 0;

  // Generate deterministic smooth trendline points based on change24h and seed
  const points = useMemo(() => {
    const count = 10;
    const numSeed = typeof seed === "string" ? seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) : seed;
    const pts: { x: number; y: number }[] = [];

    // Base upward or downward slope
    const startVal = 50 - (change24h > 0 ? 15 : -15);
    const endVal = 50 + (change24h > 0 ? 18 : -18);

    const rawVals: number[] = [];
    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const linearBase = startVal + (endVal - startVal) * progress;
      // Deterministic wave noise
      const wave = Math.sin(progress * Math.PI * 2.5 + numSeed) * 12 + Math.cos(progress * Math.PI * 4 + numSeed) * 6;
      rawVals.push(linearBase + wave);
    }

    // Force endpoints
    if (isUp) {
      rawVals[0] = Math.min(...rawVals) + 2;
      rawVals[count - 1] = Math.max(...rawVals) - 1;
    } else {
      rawVals[0] = Math.max(...rawVals) - 2;
      rawVals[count - 1] = Math.min(...rawVals) + 1;
    }

    const minV = Math.min(...rawVals);
    const maxV = Math.max(...rawVals);
    const range = maxV - minV || 1;

    const padX = 2;
    const padY = 4;
    const usableW = width - padX * 2;
    const usableH = height - padY * 2;

    for (let i = 0; i < count; i++) {
      const x = padX + (i / (count - 1)) * usableW;
      const y = padY + (1 - (rawVals[i] - minV) / range) * usableH;
      pts.push({ x, y });
    }

    return pts;
  }, [change24h, width, height, seed, isUp]);

  // Smooth bezier curve path
  const curvePath = useMemo(() => {
    return points.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }, "");
  }, [points]);

  // Closed area path for gradient
  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${curvePath} L ${last.x} ${height} L ${first.x} ${height} Z`;
  }, [curvePath, points, height]);

  const gradientId = `spark-grad-${isUp ? "up" : "down"}-${typeof seed === "string" ? seed.replace(/[^a-zA-Z0-9]/g, "") : seed}`;
  const strokeColor = isUp ? "#059669" : "#E11D48";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible select-none shrink-0"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
          <stop offset="70%" stopColor={strokeColor} stopOpacity="0.06" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.00" />
        </linearGradient>
      </defs>

      {/* Area Fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Line Stroke */}
      <path
        d={curvePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
