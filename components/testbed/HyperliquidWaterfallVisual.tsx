"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { clsx } from "clsx";

interface TimelineStage {
  id: string;
  name: string;
  entity: string;
  startMs: number;
  durationMs: number;
  barColor: string;
  hash: string;
  status: string;
  details: string;
}

export function HyperliquidWaterfallVisual() {
  const [activeStageId, setActiveStageId] = useState<string>("STAGE_4");

  const stages: TimelineStage[] = [
    {
      id: "STAGE_1",
      name: "1. EIP-712 주문 인가 서명",
      entity: "외국인 투자자 지갑 (LEI)",
      startMs: 0.0,
      durationMs: 0.8,
      barColor: "bg-slate-800",
      hash: "0x8fa4...29c1",
      status: "SIG_VERIFIED",
      details: "비거주자 투자자 타원곡선 서명 검증 및 원장 잔고 슬리피지 한도 잠금",
    },
    {
      id: "STAGE_2",
      name: "2. KRX 원주 매칭 대사",
      entity: "하나증권 글로벌 데스크",
      startMs: 0.8,
      durationMs: 1.4,
      barColor: "bg-slate-700",
      hash: "0x12ec...7742",
      status: "KRX_MATCHED",
      details: "한국거래소 호가창 매칭 확인 및 T+2 국내 결제원 예약 완료",
    },
    {
      id: "STAGE_3",
      name: "3. KSD 외국인통합계좌 대사",
      entity: "한국예탁결제원 (KSD)",
      startMs: 2.2,
      durationMs: 1.2,
      barColor: "bg-slate-900",
      hash: "0x98bb...01fa",
      status: "KSD_OMNIBUS_SYNC",
      details: "KSD 옴니버스 계좌(KSD-OMNI-2026) 1:1 실물 보통주 전자등록 대사 완결",
    },
    {
      id: "STAGE_4",
      name: "4. 신탁 1:1 도산격리 & DVP",
      entity: "신한은행 신탁사업부",
      startMs: 3.4,
      durationMs: 0.8,
      barColor: "bg-emerald-700",
      hash: "0x7f4a...1d0b",
      status: "DVP_FINALIZED",
      details: "신탁법 제22조에 의거한 실물 원주 법적 도산격리 완료 및 dShare 스마트 컨트랙트 발행",
    },
  ];

  const totalMs = 4.2;
  const activeStage = stages.find((s) => s.id === activeStageId) || stages[3];

  return (
    <div className="rounded-lg p-5 bg-white border border-slate-200 shadow-xs space-y-4 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="font-semibold text-xs text-slate-950 block font-sans">
            원자적 DVP 결제 파이프라인 (Execution Latency)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            총 소요시간: <strong className="text-slate-900 font-medium">4.2 ms</strong> · 완결률: <strong className="text-emerald-700 font-medium">100.00%</strong>
          </span>
        </div>

        <span className="text-[10.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
          T+0 즉시 대사
        </span>
      </div>

      {/* Visual Gantt Stage */}
      <div className="space-y-2 bg-slate-50 rounded-md p-3.5 border border-slate-200 font-mono">
        {/* Time Scale Axis */}
        <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-200 pb-1.5">
          <span>0.0 ms</span>
          <span>1.0 ms</span>
          <span>2.0 ms</span>
          <span>3.0 ms</span>
          <span className="text-slate-900 font-semibold">4.2 ms (완결)</span>
        </div>

        {/* 4 Waterfall Bars */}
        <div className="space-y-2 pt-1">
          {stages.map((stage) => {
            const leftPercent = (stage.startMs / totalMs) * 100;
            const widthPercent = (stage.durationMs / totalMs) * 100;
            const isSelected = activeStageId === stage.id;

            return (
              <div
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className="space-y-1 cursor-pointer group select-none"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className={clsx("transition-colors font-sans", isSelected ? "text-slate-950 font-semibold" : "text-slate-600 group-hover:text-slate-900")}>
                    {stage.name} · <span className="text-slate-400 font-mono text-[10px]">{stage.entity}</span>
                  </span>
                  <span className="text-slate-600 font-mono text-[10.5px]">
                    +{stage.durationMs.toFixed(1)} ms
                  </span>
                </div>

                {/* Bar Track */}
                <div className="h-4 w-full bg-slate-200/80 rounded relative overflow-hidden">
                  <div
                    className={clsx(
                      "absolute top-0 bottom-0 rounded transition-all flex items-center px-1.5 text-white text-[9px] font-mono",
                      stage.barColor,
                      isSelected ? "ring-1 ring-slate-900" : "opacity-90 hover:opacity-100"
                    )}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  >
                    <span className="truncate">{stage.durationMs}ms</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Inspector */}
      <div className="p-3 bg-white rounded-md border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <strong className="text-slate-950 font-medium font-sans text-xs">{activeStage.name}</strong>
            <span className="text-[10.5px] text-slate-500 font-mono">({activeStage.durationMs}ms)</span>
          </div>
          <p className="text-slate-500 text-[11px] font-sans">
            {activeStage.details}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3 font-mono text-[10.5px]">
          <span className="text-slate-400">{activeStage.hash}</span>
          <span className="text-emerald-700 font-medium">
            {activeStage.status}
          </span>
        </div>
      </div>
    </div>
  );
}
