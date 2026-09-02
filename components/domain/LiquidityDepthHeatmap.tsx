"use client";

import React, { useEffect, useRef, useState } from "react";
import { Security } from "@/types/domain";
import { Activity, Zap, TrendingUp, Layers } from "lucide-react";
import { clsx } from "clsx";

interface LiquidityDepthHeatmapProps {
  security: Security;
  className?: string;
}

export function LiquidityDepthHeatmap({
  security,
  className,
}: LiquidityDepthHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverData, setHoverData] = useState<{
    price: number;
    depthUsd: number;
    type: "BID" | "ASK";
    percent: number;
  } | null>(null);

  const basePrice = security.usdPrice;

  const generateDepthPoints = () => {
    const bidPoints: Array<{ price: number; depth: number }> = [];
    const askPoints: Array<{ price: number; depth: number }> = [];

    const steps = 40;
    let cumBid = 0;
    let cumAsk = 0;

    for (let i = steps; i >= 1; i--) {
      const price = basePrice * (1 - (i / steps) * 0.04);
      const vol = (Math.sin(i * 0.2) + 1.2) * 18000 + i * 4000;
      cumBid += vol;
      bidPoints.push({ price, depth: cumBid });
    }

    for (let i = 1; i <= steps; i++) {
      const price = basePrice * (1 + (i / steps) * 0.04);
      const vol = (Math.cos(i * 0.25) + 1.1) * 17500 + i * 4200;
      cumAsk += vol;
      askPoints.push({ price, depth: cumAsk });
    }

    return { bidPoints, askPoints, maxDepth: Math.max(cumBid, cumAsk) };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = (canvas.width = rect.width * dpr);
    const height = (canvas.height = rect.height * dpr);
    ctx.scale(dpr, dpr);

    const displayWidth = rect.width;
    const displayHeight = rect.height;

    const { bidPoints, askPoints, maxDepth } = generateDepthPoints();

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const paddingBottom = 26;
    const paddingTop = 16;
    const plotHeight = displayHeight - paddingBottom - paddingTop;
    const centerX = displayWidth / 2;

    ctx.strokeStyle = "#e4e8ef";
    ctx.lineWidth = 1;

    for (let i = 1; i <= 4; i++) {
      const y = paddingTop + (plotHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(displayWidth, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(23, 104, 229, 0.3)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, paddingTop);
    ctx.lineTo(centerX, displayHeight - paddingBottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Bids (Green)
    ctx.beginPath();
    ctx.moveTo(0, displayHeight - paddingBottom);
    bidPoints.forEach((pt, idx) => {
      const x = (idx / (bidPoints.length - 1)) * centerX;
      const y = displayHeight - paddingBottom - (pt.depth / maxDepth) * plotHeight;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(centerX, displayHeight - paddingBottom);
    ctx.closePath();

    const bidGrad = ctx.createLinearGradient(0, paddingTop, 0, displayHeight - paddingBottom);
    bidGrad.addColorStop(0, "rgba(9, 143, 103, 0.22)");
    bidGrad.addColorStop(1, "rgba(9, 143, 103, 0.02)");
    ctx.fillStyle = bidGrad;
    ctx.fill();

    ctx.strokeStyle = "#098f67";
    ctx.lineWidth = 2;
    ctx.beginPath();
    bidPoints.forEach((pt, idx) => {
      const x = (idx / (bidPoints.length - 1)) * centerX;
      const y = displayHeight - paddingBottom - (pt.depth / maxDepth) * plotHeight;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Asks (Red)
    ctx.beginPath();
    ctx.moveTo(centerX, displayHeight - paddingBottom);
    askPoints.forEach((pt, idx) => {
      const x = centerX + (idx / (askPoints.length - 1)) * centerX;
      const y = displayHeight - paddingBottom - (pt.depth / maxDepth) * plotHeight;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(displayWidth, displayHeight - paddingBottom);
    ctx.closePath();

    const askGrad = ctx.createLinearGradient(0, paddingTop, 0, displayHeight - paddingBottom);
    askGrad.addColorStop(0, "rgba(216, 58, 75, 0.22)");
    askGrad.addColorStop(1, "rgba(216, 58, 75, 0.02)");
    ctx.fillStyle = askGrad;
    ctx.fill();

    ctx.strokeStyle = "#d83a4b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    askPoints.forEach((pt, idx) => {
      const x = centerX + (idx / (askPoints.length - 1)) * centerX;
      const y = displayHeight - paddingBottom - (pt.depth / maxDepth) * plotHeight;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#667085";
    ctx.font = "10px Inter, monospace";
    ctx.textAlign = "left";
    ctx.fillText(`$${(basePrice * 0.96).toFixed(2)} (-4%)`, 8, displayHeight - 8);

    ctx.textAlign = "center";
    ctx.fillStyle = "#1768e5";
    ctx.font = "bold 10px Inter, monospace";
    ctx.fillText(`중간가: $${basePrice.toFixed(2)}`, centerX, displayHeight - 8);

    ctx.textAlign = "right";
    ctx.fillStyle = "#667085";
    ctx.font = "10px Inter, monospace";
    ctx.fillText(`$${(basePrice * 1.04).toFixed(2)} (+4%)`, displayWidth - 8, displayHeight - 8);
  }, [basePrice]);

  return (
    <div className={clsx("panel font-sans space-y-0", className)}>
      <div className="panel-head">
        <div>
          <span className="section-kicker">24/7 OTC ORDER BOOK DEPTH</span>
          <h2>누적 유동성 호가 뎁스 ({security.symbol})</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="status-pill good">스프레드 15 bps</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="relative w-full h-[220px] bg-slate-50 rounded-md border border-slate-200 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-md">
            <span className="text-[10px] text-emerald-800 block">매수 호가 잔량 (Bids)</span>
            <strong className="text-emerald-950 font-bold text-sm">$4.82M USD</strong>
          </div>

          <div className="p-2 bg-slate-50 border border-slate-200 rounded-md text-center">
            <span className="text-[10px] text-slate-500 block">지정보증 LP</span>
            <strong className="text-slate-900 font-bold text-sm">Wintermute</strong>
          </div>

          <div className="p-2 bg-rose-50 border border-rose-200 rounded-md text-right">
            <span className="text-[10px] text-rose-800 block">매도 호가 잔량 (Asks)</span>
            <strong className="text-rose-950 font-bold text-sm">$4.65M USD</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
