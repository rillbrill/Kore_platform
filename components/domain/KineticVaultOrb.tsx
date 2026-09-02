"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Landmark, Building2, Activity, Zap, Layers, Sparkles } from "lucide-react";
import { clsx } from "clsx";

export function KineticVaultOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<string>("KSD");

  // High frame-rate smooth kinetic rotation
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setRotateDeg((prev) => (prev + 0.3) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const institutionalNodes = [
    { id: "KSD", name: "한국예탁결제원 (KSD)", tag: "OMNIBUS CUSTODY", angle: 0, color: "#0052FF" },
    { id: "SHINHAN", name: "신한은행 신탁사업부", tag: "TRUST VAULT", angle: 90, color: "#059669" },
    { id: "HANA", name: "하나증권 글로벌본부", tag: "KRX ORDER EXEC", angle: 180, color: "#2563EB" },
    { id: "WINTERMUTE", name: "Wintermute Asia MM", tag: "24/7 OTC LP", angle: 270, color: "#7C3AED" },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[360px] sm:h-[400px] rounded-3xl bg-gradient-to-b from-white via-[#FAFBFD] to-[#F1F4F9] border border-slate-900/[0.08] shadow-card overflow-hidden flex items-center justify-center p-6 select-none group transition-all duration-300"
      style={{
        transform: `perspective(1200px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
      }}
    >
      {/* Precision Radial Glow & Hairline Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,82,255,0.06),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Top HUD Status Bar */}
      <div className="absolute top-4 left-5 right-5 flex items-center justify-between font-mono text-[10.5px] text-slate-500 z-20 border-b border-slate-200/70 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="font-bold text-slate-900 tracking-tight">ORAKLE ATOMIC DVP ENGINE</span>
          <span className="text-[9.5px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
            PROT-v2.4
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span>LATENCY: <strong className="text-blue-700 font-bold">4ms</strong></span>
          <span>·</span>
          <span>1:1 PROOF: <strong className="text-emerald-700 font-bold">100.00%</strong></span>
        </div>
      </div>

      {/* Center 3D Orbital Canvas */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center z-10">
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <linearGradient id="orbRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0052FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0D9488" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="orbRingGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0052FF" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Outer Orbital Ring 1 */}
          <ellipse
            cx="200"
            cy="200"
            rx="165"
            ry="75"
            fill="none"
            stroke="url(#orbRingGrad1)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            transform={`rotate(${rotateDeg} 200 200)`}
          />

          {/* Counter-Rotating Orbital Ring 2 */}
          <ellipse
            cx="200"
            cy="200"
            rx="150"
            ry="68"
            fill="none"
            stroke="url(#orbRingGrad2)"
            strokeWidth="1.2"
            transform={`rotate(${-rotateDeg * 0.75 + 60} 200 200)`}
          />

          {/* Precision Equatorial Coordinate Ring */}
          <ellipse
            cx="200"
            cy="200"
            rx="135"
            ry="135"
            fill="none"
            stroke="rgba(15, 23, 42, 0.07)"
            strokeWidth="0.8"
            strokeDasharray="2 4"
          />

          {/* Pulsing Radar Wave */}
          <circle
            cx="200"
            cy="200"
            r="85"
            fill="none"
            stroke="#0052FF"
            strokeWidth="0.75"
            opacity="0.2"
            className="animate-ping origin-center"
            style={{ animationDuration: "3.5s" }}
          />

          {/* 4 Interactive Nodes along the Orbit */}
          {institutionalNodes.map((node) => {
            const rad = ((node.angle + rotateDeg) * Math.PI) / 180;
            const nx = 200 + 165 * Math.cos(rad);
            const ny = 200 + 75 * Math.sin(rad);

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setActiveNode(node.id)}
              >
                <circle
                  cx={nx}
                  cy={ny}
                  r={activeNode === node.id ? "8.5" : "5.5"}
                  fill={node.color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="drop-shadow-md transition-all duration-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Central Floating Faceted Prism Crystal Jewel (ORAKLE Ω Core) */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-white via-sky-50 to-blue-50 border border-blue-200/80 shadow-[0_16px_48px_-8px_rgba(0,82,255,0.22),inset_0_1px_0_0_rgba(255,255,255,1)] flex flex-col items-center justify-center backdrop-blur-md group-hover:scale-105 transition-all duration-300">
          {/* Specular Prism Light Highlight */}
          <div className="absolute inset-1.5 rounded-[22px] bg-gradient-to-tr from-blue-500/10 via-transparent to-teal-500/15 pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-[#0B0F19] text-cyan-300 flex items-center justify-center font-mono font-black text-2xl shadow-[0_4px_16px_rgba(11,15,25,0.35)] border border-cyan-400/50">
            Ω
          </div>

          <span className="text-[9.5px] font-mono font-extrabold text-slate-900 tracking-wider mt-1.5 uppercase">
            ORAKLE DVP
          </span>
        </div>
      </div>

      {/* Bottom Node Inspector Bar */}
      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-xs z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 text-[11px]">인가 연계 기관:</span>
          <strong className="text-slate-950 font-bold text-xs">
            {institutionalNodes.find((n) => n.id === activeNode)?.name}
          </strong>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400">검증 상태:</span>
          <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            1:1 SIGNED & ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}
