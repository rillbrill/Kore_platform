"use client";

import React, { useState, useMemo, useRef } from "react";
import { Security } from "@/types/domain";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface InteractivePriceChartProps {
  security?: Security;
  symbol?: string;
  basePrice?: number;
  change24h?: number;
}

type Timeframe = "1D" | "1W" | "1M" | "1Y" | "ALL";

export function InteractivePriceChart({
  security,
  symbol: propSymbol,
  basePrice: propBasePrice,
  change24h: propChange24h,
}: InteractivePriceChartProps) {
  const symbol = security?.symbol || propSymbol || "dSEC";
  const basePrice = security?.usdPrice || propBasePrice || 56.87;
  const change24h =
    security?.change24h !== undefined
      ? security.change24h
      : propChange24h !== undefined
      ? propChange24h
      : 2.84;

  const [timeframe, setTimeframe] = useState<Timeframe>("1D");
  const [hoverData, setHoverData] = useState<{
    index: number;
    x: number;
    y: number;
    price: number;
    time: string;
    volume: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Timeframe multipliers & realistic time labels
  const dataPoints = useMemo(() => {
    let multipliers: number[];
    let times: string[];

    if (timeframe === "1D") {
      multipliers = [0.988, 0.991, 0.985, 0.993, 0.997, 0.992, 1.004, 1.001, 1.013, 1.009, 1.018, 1.0];
      times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "현재 (Live)"];
    } else if (timeframe === "1W") {
      multipliers = [0.965, 0.972, 0.968, 0.982, 0.979, 0.991, 1.008, 1.0];
      times = ["08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "오늘"];
    } else if (timeframe === "1M") {
      multipliers = [0.92, 0.935, 0.918, 0.942, 0.955, 0.948, 0.968, 0.985, 0.975, 0.992, 1.01, 1.0];
      times = ["08-05", "08-08", "08-12", "08-15", "08-19", "08-22", "08-26", "08-29", "09-01", "오늘"];
    } else if (timeframe === "1Y") {
      multipliers = [0.78, 0.82, 0.81, 0.86, 0.89, 0.87, 0.92, 0.95, 0.93, 0.97, 1.02, 1.0];
      times = ["'25 10월", "'25 12월", "'26 02월", "'26 04월", "'26 06월", "'26 08월", "'26 09월"];
    } else {
      multipliers = [0.55, 0.62, 0.71, 0.68, 0.79, 0.85, 0.92, 0.96, 1.0];
      times = ["2023", "2024 H1", "2024 H2", "2025 H1", "2025 H2", "2026"];
    }

    return multipliers.map((m, i) => ({
      time: times[i] || `T-${i}`,
      price: basePrice * m,
      volume: Math.floor(2500 + i * 380 + (i % 2 === 0 ? 1200 : -400)),
    }));
  }, [basePrice, timeframe]);

  const width = 760;
  const height = 280;
  const paddingX = 24;
  const paddingY = 28;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2 - 35; // Leave bottom 35px for volume bars

  const minPrice = Math.min(...dataPoints.map((d) => d.price)) * 0.997;
  const maxPrice = Math.max(...dataPoints.map((d) => d.price)) * 1.003;
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...dataPoints.map((d) => d.volume)) || 1;

  const points = dataPoints.map((d, i) => {
    const x = paddingX + (i / (dataPoints.length - 1)) * chartWidth;
    const y = paddingY + (1 - (d.price - minPrice) / priceRange) * chartHeight;
    return { ...d, x, y };
  });

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

  // Closed area path for gradient fill
  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${curvePath} L ${last.x} ${height - 40} L ${first.x} ${height - 40} Z`;
  }, [curvePath, points, height]);

  // Active hover point calculations
  const activePoint = hoverData ? points[hoverData.index] : points[points.length - 1];
  const activePrice = activePoint.price;
  const startPrice = points[0].price;
  const activeDelta = ((activePrice - startPrice) / startPrice) * 100;
  const isUp = activeDelta >= 0;

  // Handle continuous mouse move for smooth crosshair HUD
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const relativeX = (mouseX / svgRect.width) * width;

    // Find closest point along x axis
    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - relativeX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const target = points[closestIdx];
    setHoverData({
      index: closestIdx,
      x: target.x,
      y: target.y,
      price: target.price,
      time: target.time,
      volume: target.volume,
    });
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  const latestPoint = points[points.length - 1];

  return (
    <div ref={containerRef} className="space-y-3 font-mono text-xs select-none">
      {/* 1. Header Toolbar: Active Price HUD + Linear Segmented Timeframe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        {/* Active Price HUD */}
        <div className="flex items-baseline gap-3">
          <div>
            <span className="text-[10.5px] text-slate-400 font-sans block">
              {hoverData ? `${hoverData.time} 호가` : "실시간 시세 (Live)"}
            </span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-bold text-slate-950 tabular-nums">
                ${activePrice.toFixed(2)}
              </strong>
              <span className="text-xs text-slate-400 font-normal">
                (₩{Math.round(activePrice * 1380.5).toLocaleString()})
              </span>
            </div>
          </div>

          <span
            className={clsx(
              "inline-flex items-center text-xs font-semibold tabular-nums",
              isUp ? "text-emerald-700" : "text-rose-700"
            )}
          >
            {isUp ? "+" : ""}{activeDelta.toFixed(2)}%
          </span>
        </div>

        {/* Linear Segmented Timeframe Switcher */}
        <SegmentedControl<Timeframe>
          size="sm"
          value={timeframe}
          onChange={(tf) => {
            setTimeframe(tf);
            setHoverData(null);
          }}
          options={[
            { id: "1D", label: "1D" },
            { id: "1W", label: "1W" },
            { id: "1M", label: "1M" },
            { id: "1Y", label: "1Y" },
            { id: "ALL", label: "ALL" },
          ]}
        />
      </div>

      {/* 2. Interactive SVG Canvas with Crosshairs, Glow & Volume */}
      <div className="relative w-full h-[280px] rounded-xl overflow-hidden bg-gradient-to-b from-slate-50/40 via-white to-slate-50/20 border border-slate-100/80">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Vivid Emerald Upward Gradient */}
            <linearGradient id="areaGradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
            </linearGradient>

            {/* Vivid Ruby Rose Downward Gradient */}
            <linearGradient id="areaGradientRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#F43F5E" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
            <line
              key={idx}
              x1={paddingX}
              y1={paddingY + ratio * chartHeight}
              x2={width - paddingX}
              y2={paddingY + ratio * chartHeight}
              stroke="#E2E8F0"
              strokeDasharray="3 3"
              strokeWidth="0.8"
              opacity="0.6"
            />
          ))}

          {/* Volume Histogram Bars */}
          {points.map((p, i) => {
            const barHeight = (p.volume / maxVolume) * 28;
            const barY = height - 10 - barHeight;
            const isHovered = hoverData?.index === i;

            return (
              <rect
                key={`vol-${i}`}
                x={p.x - 4}
                y={barY}
                width="8"
                height={barHeight}
                rx="1.5"
                fill={isHovered ? "#94A3B8" : "#E2E8F0"}
                opacity={isHovered ? "0.9" : "0.5"}
                className="transition-colors duration-150"
              />
            );
          })}

          {/* Glowing Area Fill under curve */}
          <path
            d={areaPath}
            fill={isUp ? "url(#areaGradientGreen)" : "url(#areaGradientRed)"}
            className="transition-all duration-300"
          />

          {/* Main Price Curve Line */}
          <path
            d={curvePath}
            fill="none"
            stroke={isUp ? "#059669" : "#E11D48"}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />

          {/* Live Market Beacon Dot at latest point (when not hovering) */}
          {!hoverData && (
            <g transform={`translate(${latestPoint.x}, ${latestPoint.y})`}>
              <circle r="7" fill={isUp ? "#10B981" : "#F43F5E"} opacity="0.25" className="animate-ping" />
              <circle r="4" fill={isUp ? "#059669" : "#E11D48"} stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          )}

          {/* Active Hover Crosshair Line & Coordinates */}
          {hoverData && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={hoverData.x}
                y1={paddingY}
                x2={hoverData.x}
                y2={height - 10}
                stroke="#64748B"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />

              {/* Horizontal Crosshair Line */}
              <line
                x1={paddingX}
                y1={hoverData.y}
                x2={width - paddingX}
                y2={hoverData.y}
                stroke="#64748B"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />

              {/* Hover Center Point Dot */}
              <circle
                cx={hoverData.x}
                cy={hoverData.y}
                r="4.5"
                fill={isUp ? "#059669" : "#E11D48"}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating Glass HUD Tooltip */}
        <AnimatePresence>
          {hoverData && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              style={{
                left: Math.min(Math.max(hoverData.x - 70, 10), width - 150),
                top: Math.max(hoverData.y - 65, 10),
              }}
              className="absolute pointer-events-none z-30 bg-slate-950/90 text-white backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/80 shadow-lg text-[11px] font-mono space-y-0.5 min-w-[130px]"
            >
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>{hoverData.time}</span>
                <span>Vol: {hoverData.volume.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-white">
                <span>${hoverData.price.toFixed(2)}</span>
                <span className={isUp ? "text-emerald-400" : "text-rose-400"}>
                  {isUp ? "+" : ""}{activeDelta.toFixed(2)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
