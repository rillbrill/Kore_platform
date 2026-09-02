"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { InstitutionalRole } from "@/types/domain";
import { ShieldCheck, Info, X } from "lucide-react";

export function RoleBanner() {
  const { selectedRole, setSelectedRole } = useApp();

  if (selectedRole === "INVESTOR") return null;

  const roleDescriptions: Record<InstitutionalRole, { label: string; desc: string }> = {
    INVESTOR: { label: "적격 투자자", desc: "외국인 비거주자 전문투자자 시점" },
    OVERSEAS_BROKER_OPERATOR: {
      label: "하나증권 글로벌 데스크",
      desc: "KRX 정규장 호가 접수 및 실시간 최선주문 집행(Best Execution) 모니터링",
    },
    CUSTODY_TRUSTEE: {
      label: "신한은행 신탁사업부",
      desc: "수탁 금고 1:1 도산격리 재산 실사 및 KSD 외국인 통합계좌 실시간 대사",
    },
    MARKET_MAKER: {
      label: "Wintermute Asia (LP / MM)",
      desc: "24/7 OTC 양방향 호가 스프레드(15bps) 공급 및 유동성 뎁스 관리",
    },
    COMPLIANCE_AUDITOR: {
      label: "한국예탁결제원 (KSD 감사)",
      desc: "외국인 지분 취득 한도 소진율 및 온체인 토큰 1:1 일치성 실시간 감사",
    },
    PLATFORM_OPERATOR: {
      label: "오라클 인프라 운영자",
      desc: "DVP 원자적 스마트 컨트랙트 및 다자간 결제 파이프라인 관제",
    },
  };

  const current = roleDescriptions[selectedRole];

  return (
    <div className="bg-sky-50 border-b border-sky-200 text-sky-950 px-4 py-2 text-xs font-mono flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-sky-600 shadow-[0_0_6px_rgba(2,132,199,0.5)] animate-pulse" />
        <strong className="text-sky-800">[{current.label}] 시연 모드 활성화:</strong>
        <span className="text-slate-700">{current.desc}</span>
      </div>

      <button
        type="button"
        onClick={() => setSelectedRole("INVESTOR")}
        className="text-xs text-sky-700 hover:text-sky-900 underline font-semibold ml-4"
      >
        투자자 시점으로 복귀
      </button>
    </div>
  );
}
