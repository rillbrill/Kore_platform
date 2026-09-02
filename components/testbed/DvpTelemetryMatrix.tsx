"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Activity, Zap, ShieldCheck, Terminal, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

interface ExecutionLog {
  id: string;
  time: string;
  stage: string;
  entity: string;
  latencyMs: number;
  hash: string;
  status: "OK" | "SYNCED" | "FINALIZED";
}

export function DvpTelemetryMatrix() {
  const [logs, setLogs] = useState<ExecutionLog[]>([
    {
      id: "LOG-104",
      time: "01:15:00.412",
      stage: "DVP_ATOMIC_FINALITY",
      entity: "스마트 컨트랙트 에스크로",
      latencyMs: 0.8,
      hash: "0x7f4a...1d0b",
      status: "FINALIZED",
    },
    {
      id: "LOG-103",
      time: "01:15:00.411",
      stage: "SHINHAN_TRUST_ART22_LOCK",
      entity: "신한은행 신탁사업부",
      latencyMs: 1.2,
      hash: "0x39c8...44e1",
      status: "SYNCED",
    },
    {
      id: "LOG-102",
      time: "01:15:00.410",
      stage: "KSD_OMNIBUS_ELECTRONIC_RECON",
      entity: "한국예탁결제원 (KSD)",
      latencyMs: 1.4,
      hash: "0x98bb...01fa",
      status: "OK",
    },
    {
      id: "LOG-101",
      time: "01:15:00.408",
      stage: "HANA_KRX_T2_MATCH_RESERVE",
      entity: "하나증권 글로벌 데스크",
      latencyMs: 0.8,
      hash: "0x12ec...7742",
      status: "OK",
    },
  ]);

  return (
    <div className="rounded-2xl p-6 dex-card space-y-4 font-mono text-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-950 text-sm font-sans">
            DVP 실시간 텔레메트리 매트릭스 (Telemetry Stream)
          </span>
          <Badge variant="cobalt" size="sm">4.2ms LATENCY</Badge>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>블록 높이: <strong className="text-slate-900 font-bold">#19,842,104</strong></span>
          <span>·</span>
          <span>가스비: <strong className="text-emerald-700 font-bold">0.0001 USDC</strong></span>
        </div>
      </div>

      {/* High-Density Stream Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10.5px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-2">타임스탬프</th>
              <th className="py-2">실행 단계 (Stage)</th>
              <th className="py-2">인가 기관</th>
              <th className="py-2 text-right">소요 시간</th>
              <th className="py-2 text-right">암호화 해시</th>
              <th className="py-2 text-right">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 font-bold text-slate-700">{log.time}</td>
                <td className="py-2.5 font-bold text-slate-950 font-mono">{log.stage}</td>
                <td className="py-2.5 text-slate-600">{log.entity}</td>
                <td className="py-2.5 text-right font-bold text-blue-700">{log.latencyMs.toFixed(1)} ms</td>
                <td className="py-2.5 text-right text-slate-400">{log.hash}</td>
                <td className="py-2.5 text-right">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Latency Breakdown Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span>E2E 결제 시간 분해: <strong>인증 (19%) ➔ KRX (33%) ➔ KSD (29%) ➔ 신탁 (19%)</strong></span>
        </div>
        <span className="text-emerald-700 font-bold">100% 원자적 DVP 결제 완결 보장</span>
      </div>
    </div>
  );
}
