"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Position } from "@/types/domain";
import { Wallet, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export interface RedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: Position;
  onRedemptionSuccess?: () => void;
}

export function RedemptionModal({
  isOpen,
  onClose,
  position,
  onRedemptionSuccess,
}: RedemptionModalProps) {
  const [quantity, setQuantity] = useState<number>(Math.min(10, position.settledShares || 50));
  const [targetBroker, setTargetBroker] = useState("하나증권 글로벌 데스크 (Hana Securities)");
  const [accountNumber, setAccountNumber] = useState("302-881940-112");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableShares = position.settledShares || 50;
  const estimatedGrossUsd = quantity * position.currentPriceUsd;
  const redemptionFee = estimatedGrossUsd * 0.002; // 0.2% handling fee
  const estimatedNetUsd = estimatedGrossUsd - redemptionFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || quantity <= 0 || quantity > availableShares) return;

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      if (onRedemptionSuccess) onRedemptionSuccess();
      onClose();
    }, 1600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="1:1 실물 주식 인출 및 상환 신청 (Physical Share Redemption)"
      subtitle="온체인 RWA 토큰 소각 후 KSD 외국인 통합계좌에서 국내 위탁 증권사 계좌로 실물 주식을 1:1 인도합니다."
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="mono">
        {isSubmitted ? (
          <div style={{ textAlign: "center", padding: "32px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "999px", background: "#E0F0E5", color: "#128A54", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 style={{ width: "28px", height: "28px" }} />
            </div>
            <h3 className="disp" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>1:1 실물 주식 상환 접수 완료</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#5B5D5A" }}>
              KSD-DVP T+2 정산절차에 따라 선택하신 계좌({accountNumber})로 {quantity}주가 인도됩니다.
            </p>
          </div>
        ) : (
          <>
            {/* Asset Info Card */}
            <div style={{ background: "#F8F9F7", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "10.5px", color: "#9EA09B" }}>상환 대상 토큰화 증권</div>
                <div className="disp" style={{ fontSize: "16px", fontWeight: 700, color: "#14151A", marginTop: "2px" }}>
                  {position.securityName} (m{position.securitySymbol})
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10.5px", color: "#9EA09B" }}>보유 정산 수량</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#128A54", marginTop: "2px" }}>
                  {availableShares.toLocaleString()} dShare
                </div>
              </div>
            </div>

            {/* Quantity Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", color: "#5B5D5A" }}>상환 신청 수량 (Redemption Quantity)</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  min={1}
                  max={availableShares}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(availableShares, parseInt(e.target.value) || 0)))}
                  style={{ flex: 1, padding: "10px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "14px", outline: "none" }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(availableShares)}
                  style={{ background: "#EAEBE7", border: 0, padding: "0 16px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}
                >
                  Max ({availableShares})
                </button>
              </div>
            </div>

            {/* Target Broker & Account */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", color: "#5B5D5A" }}>인도 수령 증권사 (Target Custody Broker)</label>
                <select
                  value={targetBroker}
                  onChange={(e) => setTargetBroker(e.target.value)}
                  style={{ padding: "10px 12px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "12px", outline: "none" }}
                >
                  <option value="하나증권 글로벌 데스크">하나증권 글로벌 데스크</option>
                  <option value="미래에셋증권 WM">미래에셋증권 WM</option>
                  <option value="삼성증권 해외주식팀">삼성증권 해외주식팀</option>
                  <option value="KSD 직접 인출 계좌">KSD 직접 인출 계좌</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", color: "#5B5D5A" }}>증권 위탁 계좌번호</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  style={{ padding: "10px 12px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "12px", outline: "none" }}
                />
              </div>
            </div>

            {/* Settlement Fee Calculation */}
            <div style={{ background: "#F8F9F7", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8A8C88" }}>기초 실물 주식 금액</span>
                <span>${estimatedGrossUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8A8C88" }}>KSD-DVP 인도 처리 수수료 (0.2%)</span>
                <span style={{ color: "#E0402C" }}>-${redemptionFee.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>최종 인도 순 가치 (Net Value)</span>
                <span style={{ color: "#128A54" }}>${estimatedNetUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "11.5px", color: "#5B5D5A" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#14151A" }}
              />
              <span>본인 소유 온체인 토큰 소각 및 KSD 실물 주식 1:1 인출 정산 약관에 동의합니다.</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!agreed || quantity <= 0}
              className="btn-a"
              style={{
                cursor: agreed && quantity > 0 ? "pointer" : "not-allowed",
                border: 0,
                background: agreed && quantity > 0 ? "#C4F542" : "#EAEBE7",
                color: agreed && quantity > 0 ? "#14151A" : "#9EA09B",
                padding: "14px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 700,
                marginTop: "4px",
              }}
            >
              1:1 실물 주식 상환 실행 (Execute Redemption) →
            </button>
          </>
        )}
      </form>
    </Modal>
  );
}
