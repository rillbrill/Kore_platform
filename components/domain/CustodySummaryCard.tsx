"use client";

import React from "react";
import { Security } from "@/types/domain";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Landmark, Building2, Lock, FileCheck, ExternalLink } from "lucide-react";

export function CustodySummaryCard({ security }: { security: Security }) {
  const struct = security.ownershipStructure;

  return (
    <div className="rounded-2xl p-5 sm:p-6 font-mono text-xs space-y-4 dex-card relative">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-slate-950 font-sans">
            권리 상태 및 증거 구조
          </h3>
        </div>
        <Badge variant="teal" size="sm" dot>
          PoC projection
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            기준 종목
          </span>
          <strong className="text-slate-950 block font-bold">{struct.underlyingAsset}</strong>
          <span className="text-[11px] text-sky-700 font-semibold">참조 기준정보</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            책임 역할
          </span>
          <strong className="text-slate-950 block font-bold">{struct.custodyArrangement}</strong>
          <span className="text-[11px] text-emerald-700 font-semibold">업무 단계별 확인</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            토큰화 권리 표시
          </span>
          <strong className="text-slate-950 block font-bold">{struct.legalEntitlement}</strong>
          <span className="text-[11px] text-slate-500">서버 projection 기준</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            복구 및 차단 사유
          </span>
          <strong className="text-purple-700 block font-bold">{struct.bankruptcyRemoteness}</strong>
          <span className="text-[11px] text-slate-500">blocked reason과 다음 조치로 표시</span>
        </div>
      </div>

      <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-200 text-slate-700 text-[11px] leading-relaxed font-sans">
        * 본 카드는 `rwa-8th` PoC projection을 설명하는 UI이며, 실제 예탁·결제·권리 발생을 확정하는 법적 증명서가 아니다.
      </div>
    </div>
  );
}
