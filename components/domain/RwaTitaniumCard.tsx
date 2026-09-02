"use client";

import React, { useState } from "react";
import { ShieldCheck, Landmark, Award, Zap, ArrowUpRight, Lock } from "lucide-react";
import { clsx } from "clsx";

interface RwaTitaniumCardProps {
  symbol?: string;
  name?: string;
  krxCode?: string;
  priceUsd?: number;
  change24h?: number;
  isin?: string;
  className?: string;
}

export function RwaTitaniumCard({
  symbol = "dSEC-200",
  name = "삼성전자 (Samsung Electronics)",
  krxCode = "005930",
  priceUsd = 58.4,
  change24h = 1.74,
  isin = "KR7005930003",
  className,
}: RwaTitaniumCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "relative w-full max-w-[420px] h-[250px] sm:h-[265px] rounded-[24px] p-6 flex flex-col justify-between select-none overflow-hidden transition-all duration-300 group shadow-[0_16px_40px_-10px_rgba(15,23,42,0.14),0_0_0_1px_rgba(15,23,42,0.06),inset_0_1px_0_0_rgba(255,255,255,1)]",
        "bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2F6]",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
      }}
    >
      {/* Specular Refractive Light Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/[0.04] via-transparent to-teal-500/[0.06] pointer-events-none" />
      
      {/* Holographic Prismatic Edge Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0052FF] to-transparent opacity-80" />

      {/* Top Card Row */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0B0F19] text-cyan-300 font-mono font-black text-base flex items-center justify-center border border-cyan-400/40 shadow-xs">
            Ω
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-900">
              <span>{symbol}</span>
              <span className="text-[9.5px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                1:1 KSD
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block tracking-tight">
              ISIN {isin}
            </span>
          </div>
        </div>

        {/* Golden Intaglio Stamp */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 border border-amber-300/80 font-mono text-[10px] text-amber-900 font-bold shadow-2xs">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>신한은행 신탁</span>
        </div>
      </div>

      {/* Center Asset Name & Price */}
      <div className="relative z-10 space-y-1 my-auto">
        <span className="text-[11px] font-sans font-bold text-slate-500 block">
          {name} · KRX {krxCode}
        </span>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-black text-slate-950 tracking-tight font-mono tabular-nums">
            ${priceUsd.toFixed(2)}
          </span>
          <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            +{change24h}%
          </span>
        </div>
      </div>

      {/* Bottom Technical Strip (Aptos / Kast / Abstract Style) */}
      <div className="relative z-10 pt-3 border-t border-slate-200/80 flex items-center justify-between font-mono text-[10px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-900">DVP T+0 ATOMIC</span>
        </div>

        <span className="tracking-widest text-slate-400 font-bold">
          [ 4MS // 100% RECONCILED ]
        </span>
      </div>
    </div>
  );
}
