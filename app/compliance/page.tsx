"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Security } from "@/types/domain";
import {
  ShieldCheck,
  Landmark,
  Building2,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function CompliancePage() {
  const { user, securities } = useApp();

  const columns: Column<Security>[] = [
    {
      header: "자산 심볼",
      accessorKey: "symbol",
      sortable: true,
      cell: (item) => (
        <span className="font-mono font-bold text-slate-950 text-sm">{item.symbol}</span>
      ),
    },
    {
      header: "종목명",
      accessorKey: "name",
      cell: (item) => (
        <span className="font-sans font-bold text-slate-900 text-xs">{item.name}</span>
      ),
    },
    {
      header: "외국인 취득한도 (법정)",
      align: "right",
      cell: () => (
        <span className="font-mono text-slate-500 tabular-nums">
          100.00%
        </span>
      ),
    },
    {
      header: "현재 외인 소진율",
      align: "right",
      cell: () => (
        <span className="font-mono text-sky-700 font-bold tabular-nums">
          54.20%
        </span>
      ),
    },
    {
      header: "여유 한도율",
      align: "right",
      cell: () => (
        <span className="font-mono text-emerald-800 font-bold tabular-nums">
          +45.80%
        </span>
      ),
    },
    {
      header: "KSD 1:1 온체인 일치성",
      align: "center",
      cell: () => (
        <Badge variant="settled" size="sm" dot>
          1:1 RECONCILED
        </Badge>
      ),
    },
    {
      header: "수탁 감사 상태",
      align: "center",
      cell: (item) => (
        <Badge variant="teal" size="sm">
          {item.custodianBank.split(" ")[0]} 실사 통과
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="teal" size="sm">
              KSD 실시간 감사관 콘솔
            </Badge>
            <span className="text-xs font-mono text-slate-500">
              한국예탁결제원 외국인 한도 관리 & 온체인 1:1 대사
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
            규제 준수 및 한도 감사 (Compliance Console)
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            외국인투자관리시스템(FIMS) 및 전자증권법에 따른 종목별 취득 한도와 신탁 금고 실사 현황
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <Badge variant="settled" size="md" dot>
            감사 시스템 정상 가동 (LIVE)
          </Badge>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="rounded-2xl p-5 dex-card space-y-1">
          <span className="text-slate-400 uppercase font-bold text-[10px] block">전체 자산 1:1 대사율</span>
          <strong className="text-2xl font-black text-emerald-800 block tabular-nums">100.00%</strong>
          <span className="text-slate-500 text-[11px]">KSD 원장과 스마트컨트랙트 오차 0주</span>
        </div>

        <div className="rounded-2xl p-5 dex-card space-y-1">
          <span className="text-slate-400 uppercase font-bold text-[10px] block">외국인 투자등록(LEI) 유효성</span>
          <strong className="text-2xl font-black text-sky-700 block tabular-nums">100% PASS</strong>
          <span className="text-slate-500 text-[11px]">FATCA/CRS 및 AML/KYC 적격 승인</span>
        </div>

        <div className="rounded-2xl p-5 dex-card space-y-1">
          <span className="text-slate-400 uppercase font-bold text-[10px] block">도산격리 신탁 실사 주기</span>
          <strong className="text-2xl font-black text-slate-950 block tabular-nums">24/7 실시간</strong>
          <span className="text-slate-500 text-[11px]">신한은행 신탁부 블록체인 검증 노드</span>
        </div>
      </div>

      {/* Compliance Table */}
      <DataTable
        columns={columns}
        data={securities}
        keyExtractor={(item) => item.id}
      />
    </div>
  );
}
