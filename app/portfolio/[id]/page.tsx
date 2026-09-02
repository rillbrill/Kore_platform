"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { CustodySummaryCard } from "@/components/domain/CustodySummaryCard";
import { DigitalCustodyCertificate } from "@/components/domain/DigitalCustodyCertificate";
import { GuillochePattern, TechnicalCornerBadge } from "@/components/domain/GuillochePattern";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { clsx } from "clsx";
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  Lock,
  Landmark,
  Coins,
  TrendingUp,
  FileCheck,
  Clock,
  ArrowRight,
  Vote,
} from "lucide-react";
import { CorporateActionModal } from "@/components/domain/CorporateActionModal";

export default function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { positions, securities, corporateActions, requestRedemption } = useApp();

  const position = positions.find((p) => p.securityId === resolvedParams.id);
  const security = securities.find((s) => s.id === resolvedParams.id);

  if (!position || !security) return notFound();

  const [redeemQty, setRedeemQty] = useState(10);
  const [redeemType, setRedeemType] = useState<"KRX_STOCK_WITHDRAWAL" | "USD_CASH_LIQUIDATION">("USD_CASH_LIQUIDATION");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [selectedCaModal, setSelectedCaModal] = useState<any>(null);

  const relatedCa = corporateActions.filter((ca) => ca.securityId === security.id);

  const handleExecuteRedemption = () => {
    setIsRedeeming(true);
    setTimeout(() => {
      requestRedemption(security.id, redeemQty);
      setIsRedeeming(false);
      setRedeemSuccess(true);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-950 transition-colors font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>수탁 포트폴리오 목록으로 돌아가기</span>
        </Link>
        <Badge variant="teal" size="sm">{security.category}</Badge>
      </div>

      {/* Key Visual 3: Digital Custody Certificate with Investor Holdings */}
      <DigitalCustodyCertificate security={security} position={position} />

      {/* Main Asset Header */}
      <div className="rounded-2xl p-6 sm:p-8 dex-card flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <GuillochePattern variant="wave" opacity={0.04} />

        <div className="space-y-2 relative z-10">
          <TechnicalCornerBadge label={`CUSTODY_PROOF // POSITION_ID: ${position.id}`} />

          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-mono font-black text-slate-950">{security.symbol}</span>
            <span className="text-xs font-mono text-slate-600 px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
              KRX {security.krxCode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            {security.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono">
            {security.nameEn} · KSD 외국인 통합계좌({security.ksdOmnibusAccountId}) 보관 중
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shrink-0 font-mono text-xs space-y-1 relative z-10">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">보유 총 가치</span>
          <strong className="text-2xl font-black text-sky-700 block tabular-nums">
            ${position.currentValueUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
          </strong>
          <span className="text-slate-500 tabular-nums block">
            총 {position.totalShares} dShare (가용 {position.settledShares}주)
          </span>
        </div>
      </div>

      {/* Grid: Redemption Console + Custody Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Trust Custody Proof */}
        <div className="lg:col-span-7 space-y-6">
          <CustodySummaryCard security={security} />

          {/* Corporate Actions list */}
          <div className="rounded-2xl p-5 dex-card space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-950 uppercase flex items-center gap-1.5">
                <Vote className="w-4 h-4 text-sky-600" />
                배당 및 주주 권리 행사 일정
              </span>
              <span className="text-sky-700 font-bold">연 {security.dividendYield}%</span>
            </div>

            {relatedCa.map((ca) => (
              <div key={ca.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-950 font-bold block">{ca.title}</strong>
                  <span className="text-slate-500 text-[11px] block mt-0.5">{ca.description}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedCaModal(ca)}>
                  권리 행사
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Legal Redemption Console */}
        <div className="lg:col-span-5 rounded-2xl p-5 dex-card space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-950 uppercase flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-600" />
              실물 주식 환매 / 원장 소각 신청
            </span>
            <Badge variant="pending" size="sm">T+2 KSD 결제</Badge>
          </div>

          {redeemSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600" />
              <strong className="font-bold block text-sm">환매 신청이 접수되었습니다</strong>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                KSD 외국인계좌 원장 소각 및 신한은행 신탁 해지가 완료되면 지정 계좌로 정산금이 입금됩니다.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Type Switcher */}
              <div className="space-y-1.5">
                <span className="text-slate-500 font-bold block">환매 방식 선택</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRedeemType("USD_CASH_LIQUIDATION")}
                    className={clsx(
                      "p-2.5 rounded-xl border text-center font-bold transition-all text-xs",
                      redeemType === "USD_CASH_LIQUIDATION"
                        ? "bg-sky-50 text-sky-800 border-sky-300 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600"
                    )}
                  >
                    USD 현금 정산
                  </button>
                  <button
                    type="button"
                    onClick={() => setRedeemType("KRX_STOCK_WITHDRAWAL")}
                    className={clsx(
                      "p-2.5 rounded-xl border text-center font-bold transition-all text-xs",
                      redeemType === "KRX_STOCK_WITHDRAWAL"
                        ? "bg-sky-50 text-sky-800 border-sky-300 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600"
                    )}
                  >
                    KRX 실물 주식 출고
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-500 font-bold">
                  <span>환매 수량</span>
                  <span>가용: {position.settledShares} dShare</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={position.settledShares}
                  value={redeemQty}
                  onChange={(e) => setRedeemQty(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 text-slate-950 border border-slate-300 rounded-xl py-2.5 px-3 font-bold text-base focus:outline-none focus:border-sky-600 tabular-nums shadow-inner"
                />
              </div>

              {/* Breakdown */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-500">
                  <span>예상 정산 단가</span>
                  <span className="text-slate-950 font-bold">${security.usdPrice.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>해지 및 결제 수수료</span>
                  <span className="text-slate-950 font-bold">$12.50 USD</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between text-xs">
                  <strong className="text-slate-950 font-bold">최종 환매 정산액</strong>
                  <span className="text-sky-700 font-black tabular-nums">
                    ${(redeemQty * security.usdPrice - 12.5).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleExecuteRedemption}
                isLoading={isRedeeming}
                disabled={redeemQty > position.settledShares || redeemQty <= 0}
                className="w-full font-bold shadow-md"
              >
                {redeemQty} dShare 실물 환매 확정
              </Button>
            </div>
          )}
        </div>
      </div>

      <CorporateActionModal
        isOpen={!!selectedCaModal}
        onClose={() => setSelectedCaModal(null)}
        action={selectedCaModal}
      />
    </div>
  );
}
