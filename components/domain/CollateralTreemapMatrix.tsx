"use client";

import React, { useState } from "react";
import { clsx } from "clsx";

interface CollateralTier {
  id: string;
  name: string;
  category: string;
  valueUsd: string;
  valueRaw: number;
  percentage: number;
  custodianBank: string;
  apy: string;
  desc: string;
}

export function CollateralTreemapMatrix() {
  const [selectedTier, setSelectedTier] = useState<string>("EQUITY");

  const collateralTiers: CollateralTier[] = [
    {
      id: "EQUITY",
      name: "코스피 200 우량 보통주 1:1 수탁",
      category: "KOSPI 200 EQUITIES",
      valueUsd: "$482.4M USD",
      valueRaw: 482.4,
      percentage: 52.0,
      custodianBank: "신한은행 신탁사업부",
      apy: "2.45% 배당수익",
      desc: "삼성전자, SK하이닉스, 현대차 등 코스피 우량주 1:1 실물 주식 전자등록 대사 완료 (신탁법 제22조 도산격리).",
    },
    {
      id: "INFRA",
      name: "서해안 해상풍력/태양광 인프라 펀드",
      category: "ESG INFRASTRUCTURE",
      valueUsd: "$214.8M USD",
      valueRaw: 214.8,
      percentage: 23.2,
      custodianBank: "하나은행 신탁사업부",
      apy: "7.20% 고정수익",
      desc: "한전 20년 고정가격 PPA 전력판매 계약 현금흐름 기초 실물 담보 신탁.",
    },
    {
      id: "PROP",
      name: "강남 테헤란로 프라임 오피스 CRE 채권",
      category: "PRIME REAL ESTATE",
      valueUsd: "$152.3M USD",
      valueRaw: 152.3,
      percentage: 16.4,
      custodianBank: "KB국민은행 신탁부",
      apy: "6.40% 임대배당",
      desc: "글로벌 빅테크 및 금융사 임차율 99.2% 오피스 타워 분기 임대료 직지급 신탁.",
    },
    {
      id: "BUFFER",
      name: "원화 환차익 버퍼 & 단기 국채",
      category: "SOVEREIGN BUFFER",
      valueUsd: "$78.0M USD",
      valueRaw: 78.0,
      percentage: 8.4,
      custodianBank: "한국은행 환매조건부채권",
      apy: "3.50% 환헤지",
      desc: "외국인 투자자 즉시 환전 및 T+0 원자적 결제 유동성을 위한 원화 초단기 유동성 풀.",
    },
  ];

  const active = collateralTiers.find((t) => t.id === selectedTier) || collateralTiers[0];

  return (
    <div className="rounded-lg p-5 bg-white border border-slate-200 shadow-xs space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="font-semibold text-xs text-slate-950 block font-sans">
            신탁 수탁 담보 총액 매트릭스 ($927.5M USD)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            신탁법 제22조 1:1 도산격리 · KSD 옴니버스 원장 연동
          </span>
        </div>

        <span className="text-[10.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
          100% 도산격리
        </span>
      </div>

      {/* Proportional Segmented Bar */}
      <div className="space-y-2 font-mono">
        <div className="flex h-9 w-full rounded-md overflow-hidden border border-slate-200">
          {collateralTiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              style={{ width: `${tier.percentage}%` }}
              className={clsx(
                "h-full transition-colors flex items-center justify-center border-r last:border-r-0 text-[10px] px-1 select-none font-medium",
                tier.id === "EQUITY" && "bg-slate-900 text-white hover:bg-slate-800",
                tier.id === "INFRA" && "bg-slate-700 text-white hover:bg-slate-600",
                tier.id === "PROP" && "bg-slate-500 text-white hover:bg-slate-400",
                tier.id === "BUFFER" && "bg-slate-300 text-slate-900 hover:bg-slate-200",
                selectedTier === tier.id && "ring-2 ring-inset ring-slate-900"
              )}
            >
              <span className="truncate">{tier.category.split(" ")[0]} ({tier.percentage}%)</span>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] text-slate-500 pt-1">
          {collateralTiers.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={clsx(
                "flex items-center gap-1.5 cursor-pointer",
                selectedTier === tier.id ? "text-slate-950 font-semibold" : "hover:text-slate-900"
              )}
            >
              <span
                className={clsx(
                  "w-2 h-2 rounded-full shrink-0",
                  tier.id === "EQUITY" && "bg-slate-900",
                  tier.id === "INFRA" && "bg-slate-700",
                  tier.id === "PROP" && "bg-slate-500",
                  tier.id === "BUFFER" && "bg-slate-300"
                )}
              />
              <span className="truncate">{tier.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Collateral Detail Card */}
      <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-2 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
          <div>
            <strong className="text-slate-950 font-semibold font-sans block text-xs">{active.name}</strong>
            <span className="text-[11px] text-slate-500 font-mono">수탁기관: {active.custodianBank}</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <strong className="text-slate-950 font-semibold">{active.valueUsd}</strong>
            <span className="text-emerald-700 font-medium">({active.apy})</span>
          </div>
        </div>

        <p className="text-slate-600 text-[11px] font-sans leading-relaxed">
          {active.desc}
        </p>
      </div>
    </div>
  );
}
