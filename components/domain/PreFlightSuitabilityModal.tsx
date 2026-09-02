"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Security, OrderType, FundingMode, OrderSide } from "@/types/domain";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Coins,
  ArrowRight,
} from "lucide-react";

export interface PreFlightSuitabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  security: Security;
  orderType: OrderType;
  orderSide?: OrderSide;
  quantity: number;
  fundingMode: FundingMode;
  onProceedToSigning: () => void;
}

export function PreFlightSuitabilityModal({
  isOpen,
  onClose,
  security,
  orderType,
  orderSide = "BUY",
  quantity,
  fundingMode,
  onProceedToSigning,
}: PreFlightSuitabilityModalProps) {
  const [agreeRights, setAgreeRights] = useState(true);
  const [agreeRisk, setAgreeRisk] = useState(true);

  const estimatedSubtotalUsd = quantity * security.usdPrice;
  const estimatedFeeUsd = Math.max(1.0, estimatedSubtotalUsd * 0.0015);
  const estimatedTotalUsd =
    orderSide === "BUY" ? estimatedSubtotalUsd + estimatedFeeUsd : estimatedSubtotalUsd - estimatedFeeUsd;
  const estimatedTotalKrw = quantity * security.krwPrice;

  const isFormValid = agreeRights && agreeRisk;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="주문 검토 및 확인 (Order Confirmation)"
      subtitle="주문을 최종 제출하기 전 주문 내역 및 투자 유의사항을 확인해주세요."
    >
      <div className="space-y-5 font-sans text-xs">
        {/* 1. Order Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <strong className="text-sm font-bold text-slate-950 font-sans block">
                {security.name}
              </strong>
              <span className="text-[11px] text-slate-400">
                {security.symbol} · 한국 원주 KRX {security.krxCode}
              </span>
            </div>

            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold font-sans">
              {orderSide === "BUY" ? "매수 주문" : "매도 주문"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-sans">주문 수량</span>
              <strong className="text-slate-950 text-sm">{quantity}주 (Shares)</strong>
            </div>

            <div className="text-right">
              <span className="text-slate-400 block text-[11px] font-sans">적용 단가 (USD)</span>
              <strong className="text-slate-950 text-sm">${security.usdPrice.toFixed(2)}</strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-sans">
                {orderSide === "BUY" ? "결제 수단" : "정산 계좌"}
              </span>
              <strong className="text-slate-800">
                {orderSide === "BUY"
                  ? fundingMode === "USD_LEDGER" ? "USD 가용 잔고" : "USDC 지갑"
                  : "USD 현금계좌 입금"}
              </strong>
            </div>

            <div className="text-right">
              <span className="text-slate-400 block text-[11px] font-sans">
                {orderSide === "BUY" ? "예상 결제 금액" : "예상 순입금"}
              </span>
              <strong className="text-slate-950 text-sm font-bold text-emerald-700">
                ${estimatedTotalUsd.toFixed(2)} USD
              </strong>
            </div>
          </div>
        </div>

        {/* 2. Disclosures & Investor Confirmations */}
        <div className="space-y-2.5">
          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11.5px] text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block font-semibold mb-0.5">
                PoC 권리 구조 및 업무 추적 안내
              </strong>
              주문은 즉시 완료로 확정되지 않고 서버 workflow로 접수된다. 수량 상태, 책임 역할, 다음 조치는 timeline에서 확인한다.
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeRights}
                onChange={(e) => setAgreeRights(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 mt-0.5 cursor-pointer"
              />
              <span className="text-[11.5px] text-slate-700 leading-snug">
                취득하는 자산은 신탁 구조를 기반으로 한 <strong>주식 수탁 권리(Custody Rights)</strong>임을 이해했습니다.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeRisk}
                onChange={(e) => setAgreeRisk(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 mt-0.5 cursor-pointer"
              />
              <span className="text-[11.5px] text-slate-700 leading-snug">
                시장 시세 변동 및 환율 변동에 따른 <strong>투자 원금 손실 위험</strong>이 있음을 인지했습니다.
              </span>
            </label>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>

          <Button
            variant="primary"
            onClick={onProceedToSigning}
            disabled={!isFormValid}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            주문 최종 제출
          </Button>
        </div>
      </div>
    </Modal>
  );
}
