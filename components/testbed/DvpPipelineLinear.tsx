"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, CheckCircle2, Clock, ArrowRight, FileCode, Copy, Check } from "lucide-react";
import { clsx } from "clsx";

export function DvpPipelineLinear() {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const steps = [
    {
      step: "01",
      title: "주문 인가 (EIP-712)",
      entity: "적격 투자자 지갑",
      latency: "0.8 ms",
      proof: "SIG_VERIFIED",
      desc: "비거주자 LEI 적격 투자자 EIP-712 오프체인 서명 암호학적 검증 완료",
    },
    {
      step: "02",
      title: "KRX 체결 대사",
      entity: "하나증권 글로벌 데스크",
      latency: "1.4 ms",
      proof: "KRX_MATCHED",
      desc: "KRX 한국거래소 정규장 실물 보통주 호가 매칭 및 T+2 정산 예약",
    },
    {
      step: "03",
      title: "KSD 외국인계좌 등록",
      entity: "한국예탁결제원 (KSD)",
      latency: "1.2 ms",
      proof: "KSD_OMNIBUS_SYNC",
      desc: "외국인 통합계좌(KSD-OMNI-2026) 내 1:1 실물 주식 전자등록 대사",
    },
    {
      step: "04",
      title: "신탁 1:1 도산격리",
      entity: "신한은행 신탁사업부",
      latency: "0.8 ms",
      proof: "TRUST_ACT_22_LOCKED",
      desc: "신탁법 제22조에 의거한 특수목적 신탁 금고 실물 원주 1:1 격리 보관",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText("0x7f4a9b2c8e1d3f6a5b0c9e8d7a6b5c4e3f2a1d0b");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl p-6 dex-card space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-950 font-bold text-sm font-sans">
              원자적 DVP 결제 파이프라인 (Linear Execution Flow)
            </span>
            <Badge variant="cobalt" size="sm">T+0 ATOMIC</Badge>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
            전체 E2E 체결 지연율: <strong className="text-blue-700 font-bold">4.2 ms</strong> · 누적 정산 검증률: <strong className="text-emerald-700 font-bold">100.00%</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 transition-colors text-[11px] font-bold"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>TX: 0x7f4a...1d0b</span>
          </button>
          <button
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 transition-colors text-[11px] font-bold"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600" />
            <span>{showJson ? "로그 닫기" : "JSON 텔레메트리"}</span>
          </button>
        </div>
      </div>

      {/* 4-Step Modular Flow Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {steps.map((s, idx) => (
          <div
            key={s.step}
            className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5 relative group hover:border-blue-400 hover:bg-white transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                STEP {s.step}
              </span>
              <span className="text-[10.5px] font-bold text-blue-700 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {s.latency}
              </span>
            </div>

            <div>
              <strong className="text-slate-950 font-bold text-xs block font-sans">
                {s.title}
              </strong>
              <span className="text-[10px] text-slate-500 block truncate">
                {s.entity}
              </span>
            </div>

            <p className="text-[10.5px] text-slate-600 font-sans leading-relaxed">
              {s.desc}
            </p>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[9.5px]">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {s.proof}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable JSON Telemetry Payload */}
      {showJson && (
        <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1">
          <div className="text-slate-500 font-bold pb-1 border-b border-slate-800">
            // CRYPTOGRAPHIC DVP EXECUTION ATTESTATION LOG
          </div>
          <pre className="text-cyan-300">
{`{
  "txHash": "0x7f4a9b2c8e1d3f6a5b0c9e8d7a6b5c4e3f2a1d0b",
  "blockNumber": 19842104,
  "timestamp": "2026-09-02T01:15:00.412Z",
  "isin": "KR7005930003",
  "shares": 350,
  "ksdOmnibusAccountId": "KSD-OMNI-2026-KRX01",
  "trusteeJurisdiction": "신탁법 제22조 (Bankruptcy-Remote)",
  "e2eLatencyMs": 4.2,
  "status": "ATOMIC_DVP_FINALIZED"
}`}
          </pre>
        </div>
      )}
    </div>
  );
}
