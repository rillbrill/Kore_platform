"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Landmark, Building2, UserCheck, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

export function DvpCircuitGraph() {
  const [activeNode, setActiveNode] = useState<string>("KSD");

  const nodes = [
    {
      id: "INVESTOR",
      title: "적격 외국인 투자자 (LEI)",
      role: "EIP-712 주문 인가 서명",
      legal: "외국인 투자등록 관리지침(FIMS) 적격 투자자 인증",
      color: "border-blue-300 bg-blue-50/50 text-blue-950",
      icon: <UserCheck className="w-4 h-4 text-blue-600" />,
      proof: "SIG: 0x8a...4b",
    },
    {
      id: "BROKER",
      title: "하나증권 글로벌 데스크",
      role: "KRX 정규장 원주 체결 대사",
      legal: "한국거래소 회원사 자본시장법 정산 중개 규정",
      color: "border-sky-300 bg-sky-50/50 text-sky-950",
      icon: <Zap className="w-4 h-4 text-sky-600" />,
      proof: "KRX_ORD_MATCHED",
    },
    {
      id: "KSD",
      title: "한국예탁결제원 (KSD)",
      role: "외국인 옴니버스 계좌 대사",
      legal: "전자증권법 제24조 고객계좌부 1:1 전자등록 완결",
      color: "border-emerald-300 bg-emerald-50/50 text-emerald-950",
      icon: <Landmark className="w-4 h-4 text-emerald-600" />,
      proof: "KSD-OMNI-2026",
    },
    {
      id: "TRUST",
      title: "신한은행 신탁사업부",
      role: "신탁법 제22조 1:1 도산격리",
      legal: "특수목적 신탁 재산 완결 분리 및 법적 압류 금지",
      color: "border-teal-300 bg-teal-50/50 text-teal-950",
      icon: <ShieldCheck className="w-4 h-4 text-teal-600" />,
      proof: "TRUST_ACT_22",
    },
  ];

  const active = nodes.find((n) => n.id === activeNode) || nodes[2];

  return (
    <div className="rounded-2xl p-6 dex-card space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-slate-950 font-bold text-sm font-sans">
              제도권 4자 간 신탁 결제 회로망 (Vector Circuit Architecture)
            </span>
            <Badge variant="teal" size="sm">4-PARTY TRUST</Badge>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
            국가 공인 수탁기관 연계 1:1 원자적 DVP(Delivery Versus Payment) 아키텍처
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>암호학적 대사 상태: <strong className="text-emerald-700 font-bold">100% 동기화</strong></span>
        </div>
      </div>

      {/* High-Craft Circuit Chips & Clean Vector Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {nodes.map((n, i) => (
          <button
            key={n.id}
            onClick={() => setActiveNode(n.id)}
            className={clsx(
              "p-4 rounded-xl border text-left transition-all space-y-2.5 relative group",
              activeNode === n.id
                ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  {n.icon}
                </div>
                <strong className="text-slate-950 font-bold text-xs font-sans">
                  {n.title.split(" (")[0]}
                </strong>
              </div>
              <span className="text-[9.5px] font-bold text-slate-400">
                0{i + 1}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
              {n.role}
            </p>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
              <span className="text-blue-700 font-bold">{n.proof}</span>
              <span className="text-emerald-700 font-bold">ACTIVE</span>
            </div>
          </button>
        ))}
      </div>

      {/* Statutory Legal Trust Proof Detail Card */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <strong className="text-slate-950 font-bold text-xs font-sans">{active.title}</strong>
            <Badge variant="cobalt" size="sm">{active.proof}</Badge>
          </div>
          <p className="text-slate-600 font-sans text-xs">
            {active.legal}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 font-mono text-[10.5px]">
          <span className="text-slate-400">인가 검증:</span>
          <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            1:1 CUSTODY ATTESTED
          </span>
        </div>
      </div>
    </div>
  );
}
