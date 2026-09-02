"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HyperliquidWaterfallVisual } from "@/components/testbed/HyperliquidWaterfallVisual";
import { HyperliquidPulseCanvas } from "@/components/testbed/HyperliquidPulseCanvas";
import { HyperliquidHybridCockpit } from "@/components/testbed/HyperliquidHybridCockpit";
import { DvpPipelineLinear } from "@/components/testbed/DvpPipelineLinear";
import { DvpTelemetryMatrix } from "@/components/testbed/DvpTelemetryMatrix";
import { DvpCircuitGraph } from "@/components/testbed/DvpCircuitGraph";
import { DvpReconciliationLedger } from "@/components/testbed/DvpReconciliationLedger";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Terminal,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Cpu,
  Clock,
  Landmark,
} from "lucide-react";
import { clsx } from "clsx";

export default function DvpTestbedPage() {
  const [visualTab, setVisualTab] = useState<"WATERFALL" | "PULSE" | "HYBRID">("WATERFALL");
  const [originalTab, setOriginalTab] = useState<"LINEAR" | "MATRIX" | "CIRCUIT" | "LEDGER">("MATRIX");

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cobalt" size="sm">
              HYPERLIQUID R&D TESTBED
            </Badge>
            <span className="text-xs font-mono text-slate-500 font-bold">
              실시간 DVP 텔레메트리 그래픽 시각화 랩
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1 font-sans">
            Hyperliquid 실시간 텔레메트리 비주얼 시각화
          </h1>
          <p className="text-slate-600 text-sm mt-1 font-sans">
            기존 2번(텔레메트리 스트림)을 바탕으로, 촌스럽지 않은 하이엔드 시계열 간트 차트 및 60fps 파동 캔버스로 시각화한 프로토타입
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Link href="/">
            <Button variant="outline" size="sm">
              메인 플랫폼으로 이동
            </Button>
          </Link>
        </div>
      </div>

      {/* SECTION 1: 🌟 NEW Hyperliquid Visualized Prototypes */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-lg font-black text-slate-950 font-sans">
              1. Hyperliquid 텔레메트리 그래픽 시각화 모델 (신규 제작)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            아래 3가지 비주얼 모드를 클릭하여 실시간 인터랙션을 확인해보세요
          </span>
        </div>

        {/* 3 Visual Option Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setVisualTab("WATERFALL")}
            className={clsx(
              "p-4 rounded-2xl border text-left transition-all space-y-2 relative overflow-hidden",
              visualTab === "WATERFALL"
                ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10"
                : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-950 font-sans flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                A. 워터폴 시계열 간트 차트
              </span>
              {visualTab === "WATERFALL" && <Badge variant="cobalt" size="sm">선택됨</Badge>}
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              0.0ms ➔ 4.2ms 결제 전 과정을 마이크로초 단위 비주얼 간트 바로 표시 + 실시간 레이저 스캔 라인
            </p>
          </button>

          <button
            onClick={() => setVisualTab("PULSE")}
            className={clsx(
              "p-4 rounded-2xl border text-left transition-all space-y-2 relative overflow-hidden",
              visualTab === "PULSE"
                ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10"
                : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-950 font-sans flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                B. 60fps TPS & 레이턴시 파동
              </span>
              {visualTab === "PULSE" && <Badge variant="cobalt" size="sm">선택됨</Badge>}
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              초당 24,000+ TPS 처리량 및 4.2ms 실시간 E2E 지연율 스파크라인 캔버스 렌더링
            </p>
          </button>

          <button
            onClick={() => setVisualTab("HYBRID")}
            className={clsx(
              "p-4 rounded-2xl border text-left transition-all space-y-2 relative overflow-hidden",
              visualTab === "HYBRID"
                ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10"
                : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-950 font-sans flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                C. 하이브리드 복합 콕핏 (추천)
              </span>
              {visualTab === "HYBRID" && <Badge variant="cobalt" size="sm">선택됨</Badge>}
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              상단: 비주얼 워터폴 간트 + 하단: 실시간 텔레메트리 이벤트 워터폴 표 동시 배치
            </p>
          </button>
        </div>

        {/* Active Visual Render Area */}
        <div className="pt-2">
          {visualTab === "WATERFALL" && <HyperliquidWaterfallVisual />}
          {visualTab === "PULSE" && <HyperliquidPulseCanvas />}
          {visualTab === "HYBRID" && <HyperliquidHybridCockpit />}
        </div>
      </div>

      {/* SECTION 2: Original 4 Architecture Options (Preserved) */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-sans">
            2. 기존 4가지 DVP 결제 아키텍처 대안 (보존됨)
          </h2>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-mono text-xs">
            {[
              { id: "LINEAR", label: "1. Linear 파이프라인" },
              { id: "MATRIX", label: "2. 텔레메트리 표" },
              { id: "CIRCUIT", label: "3. 제도권 4자 회로" },
              { id: "LEDGER", label: "4. KSD 3자 대사 원장" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setOriginalTab(t.id as any)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg font-bold transition-all",
                  originalTab === t.id
                    ? "bg-white text-slate-950 shadow-2xs font-black"
                    : "text-slate-500 hover:text-slate-950"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {originalTab === "LINEAR" && <DvpPipelineLinear />}
          {originalTab === "MATRIX" && <DvpTelemetryMatrix />}
          {originalTab === "CIRCUIT" && <DvpCircuitGraph />}
          {originalTab === "LEDGER" && <DvpReconciliationLedger />}
        </div>
      </div>
    </div>
  );
}
