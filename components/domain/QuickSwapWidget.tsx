"use client";

import React, { useState } from "react";
import { Security } from "@/types/domain";
import {
  ArrowDownUp,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { clsx } from "clsx";

interface QuickSwapWidgetProps {
  securities: Security[];
  selectedSecurityId?: string;
  onSelectSecurity?: (id: string) => void;
  className?: string;
}

export function QuickSwapWidget({
  securities,
  selectedSecurityId,
  onSelectSecurity,
  className,
}: QuickSwapWidgetProps) {
  const [payAmount, setPayAmount] = useState<string>("5000");
  const [internalSecId, setInternalSecId] = useState<string>(securities[0]?.id || "990001");
  const [swapTab, setSwapTab] = useState<"SWAP" | "LIMIT">("SWAP");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapSuccess, setSwapSuccess] = useState<boolean>(false);

  const activeSecId = selectedSecurityId || internalSecId;
  const selectedSecurity = securities.find((s) => s.id === activeSecId) || securities[0];
  const price = selectedSecurity?.usdPrice || 56.87;
  const numPay = parseFloat(payAmount) || 0;
  const receiveShares = (numPay / price).toFixed(4);

  const handleSelect = (id: string) => {
    setInternalSecId(id);
    if (onSelectSecurity) onSelectSecurity(id);
  };

  const handleSwap = () => {
    setIsSwapping(true);
    setSwapSuccess(false);
    setTimeout(() => {
      setIsSwapping(false);
      setSwapSuccess(true);
      setTimeout(() => setSwapSuccess(false), 4000);
    }, 450);
  };

  return (
    <div className={clsx("rounded-lg p-5 bg-white border border-slate-200 shadow-xs space-y-4 font-sans", className)}>
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-xs font-medium">
          <button
            onClick={() => setSwapTab("SWAP")}
            className={clsx(
              "px-3 py-1 rounded transition-colors",
              swapTab === "SWAP"
                ? "bg-white text-slate-950 font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-950"
            )}
          >
            즉시 스왑
          </button>
          <button
            onClick={() => setSwapTab("LIMIT")}
            className={clsx(
              "px-3 py-1 rounded transition-colors",
              swapTab === "LIMIT"
                ? "bg-white text-slate-950 font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-950"
            )}
          >
            지정가
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
          KSD 1:1 수탁 DVP
        </span>
      </div>

      {/* Pay Input Block */}
      <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-2 focus-within:border-slate-400 focus-within:bg-white transition-colors">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>지불 (Pay)</span>
          <span>잔고: <strong className="text-slate-900 font-semibold tabular-nums">$250,000.00</strong></span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="w-full bg-transparent text-2xl font-semibold text-slate-950 focus:outline-none font-mono tabular-nums"
            placeholder="0.00"
          />

          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-mono font-medium text-slate-900">
            <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
              $
            </span>
            <span>USDC</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>≈ ₩{(numPay * 1380).toLocaleString()} KRW</span>
          <div className="flex items-center gap-1">
            {["1K", "5K", "10K", "MAX"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPayAmount(preset === "MAX" ? "250000" : preset.replace("K", "000"))}
                className="px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-[10px] font-mono"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Direction Separator */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-400 flex items-center justify-center">
          <ArrowDownUp className="w-3 h-3" />
        </div>
      </div>

      {/* Receive Input Block */}
      <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>수령 (Receive)</span>
          <span className="text-slate-500">1:1 실물 원주 보증</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl font-semibold text-slate-950 font-mono tabular-nums">
            {receiveShares}
          </span>

          <div className="relative">
            <select
              value={selectedSecurity.id}
              onChange={(e) => handleSelect(e.target.value)}
              className="appearance-none bg-white font-mono text-xs font-medium rounded pl-2.5 pr-7 py-1.5 border border-slate-200 text-slate-950 focus:outline-none cursor-pointer"
            >
              {securities.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.symbol} ({s.name})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>단가: <strong className="text-slate-800 font-medium">${price.toFixed(2)}</strong></span>
          <span className="text-slate-500">슬리피지: &lt; 0.01%</span>
        </div>
      </div>

      {/* Settlement Parameters Strip */}
      <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">결제 소요 시간</span>
          <span className="font-semibold text-slate-900">4.2 ms (T+0 원자적 DVP)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">네트워크 수수료</span>
          <span className="font-semibold text-emerald-700">0.00 USDC (면제)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">수탁 금고</span>
          <span className="font-semibold text-slate-900">신한은행 신탁 1:1 도산격리</span>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        onClick={handleSwap}
        disabled={isSwapping || numPay <= 0}
        className={clsx(
          "w-full h-10 rounded-md font-medium text-xs text-white transition-colors flex items-center justify-center gap-2",
          isSwapping
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-slate-900 hover:bg-slate-800 active:bg-slate-950"
        )}
      >
        {isSwapping ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>원자적 DVP 결제 처리 중...</span>
          </>
        ) : (
          <span>스왑 실행 ({receiveShares} {selectedSecurity.symbol})</span>
        )}
      </button>

      {/* Success Banner */}
      {swapSuccess && (
        <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 text-emerald-900 font-mono text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>DVP 결제 완결 (4.1ms)</span>
          </div>
          <div className="text-[11px] text-emerald-700">
            {receiveShares} {selectedSecurity.symbol}가 신탁 계좌에 1:1 배정되었습니다.
          </div>
        </div>
      )}
    </div>
  );
}
