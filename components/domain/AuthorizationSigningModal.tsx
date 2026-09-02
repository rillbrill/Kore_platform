"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Security, Order } from "@/types/domain";
import { useApp } from "@/context/AppContext";
import {
  KeyRound,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock,
  Layers,
  FileCheck,
  Lock,
} from "lucide-react";
import { clsx } from "clsx";

export interface AuthorizationSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  security: Security;
  onSuccess: () => void;
}

export function AuthorizationSigningModal({
  isOpen,
  onClose,
  order,
  security,
  onSuccess,
}: AuthorizationSigningModalProps) {
  const { authorizeOrder } = useApp();
  const [step, setStep] = useState<"SIGNING" | "BROKER_MATCHING" | "DVP_CONFIRMING" | "COMPLETED">("SIGNING");
  const [passkeyInput, setPasskeyInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!order) return null;

  const handleSign = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStep("BROKER_MATCHING");
      setTimeout(() => {
        setStep("DVP_CONFIRMING");
        setTimeout(() => {
          setStep("COMPLETED");
          setIsProcessing(false);
        }, 1000);
      }, 1000);
    }, 1200);
  };

  const handleDone = async () => {
    const authorized = await authorizeOrder(order.id);
    if (authorized) {
      onSuccess();
      setStep("SIGNING");
      setPasskeyInput("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="기관급 전자 서명 및 DVP 원자적 발주 (Atomic Signing)"
      subtitle="FIDO2 생체인증 / Passkey를 통해 이중원장 체결 트랜잭션에 서명합니다."
    >
      <div className="space-y-5 font-mono text-xs">
        {step === "SIGNING" && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">주문 대상 자산:</span>
                <strong className="text-slate-950">{security.name} ({security.symbol})</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">주문 방향 / 수량 / 단가:</span>
                <strong className="text-slate-950 tabular-nums">
                  {order.side === "BUY" ? "매수" : "매도"} {order.quantity} dShare @ ${order.usdPrice.toFixed(2)} USD
                </strong>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-700 font-bold">
                  {order.side === "BUY" ? "최종 결제 금액:" : "예상 순입금:"}
                </span>
                <strong className="text-sky-700 text-sm font-black tabular-nums">
                  ${(order.side === "BUY" ? order.totalUsd + order.feeUsd : order.totalUsd - order.feeUsd).toFixed(2)} USD
                </strong>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-700 font-bold">
                기관 전용 서명 패스키 (Passkey / PIN)
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="6자리 보안 PIN 번호 입력"
                className="w-full bg-slate-50 text-slate-950 border border-slate-300 rounded-xl py-3 px-4 text-center font-black tracking-widest text-lg focus:outline-none focus:border-sky-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" size="md" onClick={onClose}>
                취소
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSign}
                isLoading={isProcessing}
                disabled={passkeyInput.length < 4}
                leftIcon={<KeyRound className="w-4 h-4" />}
              >
                전자 서명 및 체결 실행
              </Button>
            </div>
          </div>
        )}

        {(step === "BROKER_MATCHING" || step === "DVP_CONFIRMING") && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-300 text-sky-600 flex items-center justify-center mx-auto animate-pulse shadow-xs">
              <Layers className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-950">
                {step === "BROKER_MATCHING"
                  ? "하나증권 / Wintermute OTC 오더북 호가 매칭 중..."
                  : "신한은행 신탁 금고 실사 및 KSD 원장 토큰 인도 중..."}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                원자적 동시결제(DVP) 스마트 컨트랙트를 집행하고 있습니다.
              </p>
            </div>
          </div>
        )}

        {step === "COMPLETED" && (
          <div className="py-4 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-950">
                DVP 주문 체결 및 토큰 인도 완료!
              </h4>
              <p className="text-xs text-slate-600 mt-1 font-sans">
                {order.quantity}주의 {security.symbol} 주식이 정상적으로 {order.side === "BUY" ? "고객 계정에 입고" : "매도 정산"}되었습니다.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">체결 영수증 번호:</span>
                <span className="text-sky-700 font-bold">{order.id}-EXEC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">결제 모드:</span>
                <Badge variant="settled" size="sm" dot>체결 및 정산 완료</Badge>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleDone}
              className="w-full font-bold shadow-md"
            >
              체결 결과 확인하기
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
