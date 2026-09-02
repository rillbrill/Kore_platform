"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Landmark, ShieldCheck, CheckCircle2, RefreshCw, Layers } from "lucide-react";
import { clsx } from "clsx";

export function DvpReconciliationLedger() {
  const accounts = [
    {
      name: "삼성전자 (dSEC)",
      isin: "KR7005930003",
      krxShares: 1250000,
      ksdOmnibusShares: 1250000,
      onChainMintedShares: 1250000,
      delta: 0,
      custodian: "신한은행 신탁",
      status: "100% RECONCILED",
    },
    {
      name: "SK하이닉스 (dSKH)",
      isin: "KR7000660001",
      krxShares: 450000,
      ksdOmnibusShares: 450000,
      onChainMintedShares: 450000,
      delta: 0,
      custodian: "신한은행 신탁",
      status: "100% RECONCILED",
    },
    {
      name: "현대자동차 (dHYU)",
      isin: "KR7005380001",
      krxShares: 280000,
      ksdOmnibusShares: 280000,
      onChainMintedShares: 280000,
      delta: 0,
      custodian: "신한은행 신탁",
      status: "100% RECONCILED",
    },
    {
      name: "신재생인프라 1호 (dKREI)",
      isin: "KR7900070002",
      krxShares: 1200000,
      ksdOmnibusShares: 1200000,
      onChainMintedShares: 1200000,
      delta: 0,
      custodian: "하나은행 신탁",
      status: "100% RECONCILED",
    },
  ];

  return (
    <div className="rounded-2xl p-6 dex-card space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-950 text-sm font-sans">
            KSD 3자 간 실시간 원장 대사 (Triple-Entry Reconciliation)
          </span>
          <Badge variant="teal" size="sm">ZERO-DELTA</Badge>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>대사 주기: <strong className="text-blue-700 font-bold">실시간 (T+0 DVP)</strong></span>
          <span>·</span>
          <span>머클 루트: <strong className="text-slate-900 font-bold">0x992a...c01f</strong></span>
        </div>
      </div>

      {/* Triple-Entry Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10.5px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-2">자산명 / ISIN</th>
              <th className="py-2 text-right">① KRX 체결 원장</th>
              <th className="py-2 text-right">② KSD 외국인 보관</th>
              <th className="py-2 text-right">③ 토큰 발행 원장</th>
              <th className="py-2 text-right">오차 (Δ)</th>
              <th className="py-2 text-right">수탁 검증 상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px]">
            {accounts.map((acc) => (
              <tr key={acc.isin} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3">
                  <strong className="text-slate-950 font-bold block font-sans">{acc.name}</strong>
                  <span className="text-[10px] text-slate-400">{acc.isin}</span>
                </td>
                <td className="py-3 text-right font-bold text-slate-800 tabular-nums">
                  {acc.krxShares.toLocaleString()}
                </td>
                <td className="py-3 text-right font-bold text-blue-700 tabular-nums">
                  {acc.ksdOmnibusShares.toLocaleString()}
                </td>
                <td className="py-3 text-right font-bold text-emerald-700 tabular-nums">
                  {acc.onChainMintedShares.toLocaleString()}
                </td>
                <td className="py-3 text-right font-bold text-slate-400 tabular-nums">
                  0.00
                </td>
                <td className="py-3 text-right">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {acc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Statutory Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>신탁법 제22조 및 전자증권법 제24조에 따른 1:1 도산격리 실물 대사 일치 증명</span>
        </div>
        <span className="text-blue-700 font-bold">KSD 공인 전자등록 완료</span>
      </div>
    </div>
  );
}
