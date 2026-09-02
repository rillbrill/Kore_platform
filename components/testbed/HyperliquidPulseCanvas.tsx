"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Activity, Zap, Cpu, Server, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";

export function HyperliquidPulseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTps, setCurrentTps] = useState<number>(24850);
  const [currentLatency, setCurrentLatency] = useState<number>(4.2);

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

    // Generate rolling latency history buffer
    const bufferLength = 60;
    const latencyHistory: number[] = Array.from({ length: bufferLength }, () => 4.2 + (Math.random() - 0.5) * 0.4);

    let animId: number;
    let tick = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      tick++;

      // Shift buffer every 6 frames
      if (tick % 6 === 0) {
        const nextVal = 4.2 + (Math.sin(tick * 0.05) * 0.3 + (Math.random() - 0.5) * 0.2);
        latencyHistory.shift();
        latencyHistory.push(nextVal);
        setCurrentLatency(parseFloat(nextVal.toFixed(2)));
        setCurrentTps(Math.floor(24000 + Math.sin(tick * 0.04) * 1200 + Math.random() * 300));
      }

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // 1. Grid Lines
      ctx.strokeStyle = "rgba(15, 23, 42, 0.06)";
      ctx.lineWidth = 1;

      for (let i = 1; i <= 3; i++) {
        const y = (displayHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(displayWidth, y);
        ctx.stroke();
      }

      // 2. Render Latency Sparkline Area & Stroke
      const minL = 3.5;
      const maxL = 5.0;
      const stepX = displayWidth / (bufferLength - 1);

      // Gradient Fill
      const grad = ctx.createLinearGradient(0, 0, 0, displayHeight);
      grad.addColorStop(0, "rgba(0, 82, 255, 0.2)");
      grad.addColorStop(1, "rgba(0, 82, 255, 0.01)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, displayHeight);

      latencyHistory.forEach((val, idx) => {
        const x = idx * stepX;
        const norm = (val - minL) / (maxL - minL);
        const y = displayHeight - norm * (displayHeight - 20) - 10;
        ctx.lineTo(x, y);
      });

      ctx.lineTo(displayWidth, displayHeight);
      ctx.closePath();
      ctx.fill();

      // Stroke Line
      ctx.strokeStyle = "#0052FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      latencyHistory.forEach((val, idx) => {
        const x = idx * stepX;
        const norm = (val - minL) / (maxL - minL);
        const y = displayHeight - norm * (displayHeight - 20) - 10;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // 3. Leading Head Dot
      const lastX = displayWidth;
      const lastNorm = (latencyHistory[latencyHistory.length - 1] - minL) / (maxL - minL);
      const lastY = displayHeight - lastNorm * (displayHeight - 20) - 10;

      ctx.fillStyle = "#0052FF";
      ctx.shadowColor = "#0052FF";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(lastX - 2, lastY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="rounded-2xl p-6 dex-card space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-950 text-sm font-sans">
            L1 실시간 초당 체결량 & 지연율 파동 캔버스 (L1 Telemetry Canvas)
          </span>
          <Badge variant="cobalt" size="sm">60 FPS LIVE</Badge>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>평균 지연율: <strong className="text-blue-700 font-bold">{currentLatency} ms</strong></span>
          <span>·</span>
          <span>초당 처리량: <strong className="text-emerald-700 font-bold">{currentTps.toLocaleString()} TPS</strong></span>
        </div>
      </div>

      {/* Canvas Plot */}
      <div className="relative w-full h-40 bg-slate-50/70 rounded-xl border border-slate-200/80 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        <div className="absolute top-2.5 left-3 text-[10px] text-slate-400">
          실시간 DVP E2E 레이턴시 파동 (Target: 4.2ms)
        </div>
        <div className="absolute bottom-2 right-3 text-[10px] text-emerald-700 font-bold bg-white/80 px-2 py-0.5 rounded border border-slate-200">
          100% T+0 원자적 결제 가동 중
        </div>
      </div>

      {/* Micro Telemetry Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
          <span className="text-slate-400 block text-[10px]">P50 / P95 / P99 지연율</span>
          <strong className="text-slate-900 font-bold">3.8ms / 4.2ms / 4.6ms</strong>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
          <span className="text-slate-400 block text-[10px]">초당 EIP-712 서명 검증</span>
          <strong className="text-blue-700 font-bold">32,400 Signatures/sec</strong>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
          <span className="text-slate-400 block text-[10px]">KSD 옴니버스 대사 큐</span>
          <strong className="text-emerald-700 font-bold">0 Pending (T+0 즉시대사)</strong>
        </div>
      </div>
    </div>
  );
}
