"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { SettlementTimeline } from "@/components/domain/SettlementTimeline";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Activity,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function SettlementPage() {
  const { settlementEvents } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="teal" size="sm">
              KSD 24/7 DVP 원자적 결제 엔진
            </Badge>
            <span className="text-xs font-mono text-slate-500 font-bold">
              스마트 컨트랙트 기반 동시결제 파이프라인
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
            DVP 결제 및 청산 관제 (Settlement Console)
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            한국예탁결제원 외국인통합계좌 주식 입고 및 신한은행 USD 에스크로 대금의 원자적 교환(Delivery Versus Payment)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <Badge variant="settled" size="md" dot>
            결제 엔진 가동 중 (NORMAL)
          </Badge>
        </div>
      </div>

      {/* 3 Pipeline Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="rounded-2xl p-5 dex-card space-y-1">
          <span className="text-slate-400 uppercase font-bold text-[10px] block">24/7 OTC 평균 결제 시간</span>
          <strong className="text-2xl font-black text-emerald-800 block tabular-nums">즉시 (T+0 4ms)</strong>
          <span className="text-slate-500 text-[11px]">온체인 원자적 스마트 컨트랙트 DVP</span>
        </div>

        <div className="rounded-2xl p-5 dex-card space-y-1">
          <span className="text-slate-400 uppercase font-bold text-[10px] block">1차 청약 정규 정산 주기</span>
          <strong className="text-2xl font-black text-sky-700 block tabular-nums">T+2 15:30 KST</strong>
          <span className="text-slate-500 text-[11px]">KSD 외국인 통합계좌 일괄 배치 정산</span>
        </div>

        <div className="rounded-2xl p-5 dex-card space-y-1">
          <span className="text-slate-400 uppercase font-bold text-[10px] block">결제 불이행(Default) 리스크</span>
          <strong className="text-2xl font-black text-slate-950 block tabular-nums">0.00% (완전 차단)</strong>
          <span className="text-slate-500 text-[11px]">신한은행 1:1 사전 증거금 에스크로</span>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 block">
          실시간 DVP 결제 파이프라인 목록 ({settlementEvents.length}건)
        </span>
        {settlementEvents.map((evt) => (
          <SettlementTimeline key={evt.id} event={evt} />
        ))}
      </div>
    </div>
  );
}
