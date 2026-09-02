"use client";

import React, { useState } from "react";
import { Security, Position } from "@/types/domain";
import { ShieldCheck, Copy, Check, Printer, Download } from "lucide-react";

interface DigitalCustodyCertificateProps {
  security: Security;
  position?: Position;
}

export function DigitalCustodyCertificate({
  security,
  position,
}: DigitalCustodyCertificateProps) {
  const [isCopied, setIsCopied] = useState(false);
  const sharesCount = position?.totalShares || security.underlyingSharesCustodied || 350;

  const handleCopyIsin = () => {
    navigator.clipboard.writeText(security.isin);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        border: "1px solid rgba(0,0,0,0.09)",
        padding: "26px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "18px", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
            <span className="mono" style={{ fontSize: "10.5px", fontWeight: 600, background: "#EAEBE7", color: "#14151A", padding: "3px 9px", borderRadius: "999px" }}>
              PoC 기준정보
            </span>
            <span className="mono" style={{ fontSize: "10.5px", fontWeight: 600, background: "#E0F0E5", color: "#128A54", padding: "3px 9px", borderRadius: "999px" }}>
              simulation evidence
            </span>
          </div>

          <h3 className="disp" style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>
            {security.name} ({security.symbol})
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#5B5D5A" }}>
            {security.nameEn} · 기초자산: 한국거래소(KRX {security.krxCode}) 보통주 실물
          </p>
        </div>

        <div className="mono" style={{ textAlign: "right", flexShrink: 0 }}>
          <span style={{ fontSize: "10.5px", color: "#9EA09B", display: "block" }}>데모 참조 번호</span>
          <strong style={{ fontSize: "14px", fontWeight: 700, color: "#14151A" }}>
            KSD-2026-{security.isin.slice(-6)}
          </strong>
        </div>
      </div>

      {/* Specifications Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        <div style={{ background: "#F8F9F7", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88" }}>공인 국제증권식별번호 (ISIN)</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong className="mono" style={{ fontSize: "13.5px", fontWeight: 700, color: "#14151A" }}>{security.isin}</strong>
            <button
              onClick={handleCopyIsin}
              style={{ background: "none", border: 0, cursor: "pointer", color: isCopied ? "#128A54" : "#9EA09B", padding: "2px" }}
              title="Copy ISIN"
            >
              {isCopied ? <Check style={{ width: "14px", height: "14px" }} /> : <Copy style={{ width: "14px", height: "14px" }} />}
            </button>
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "#9EA09B" }}>ISIN 표준 코드</span>
        </div>

        <div style={{ background: "#F8F9F7", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88" }}>참조 계좌</span>
          <strong className="mono" style={{ fontSize: "13.5px", fontWeight: 700, color: "#14151A" }}>{security.ksdOmnibusAccountId || "KSD-OMNI-VAULT-01"}</strong>
          <span className="mono" style={{ fontSize: "10.5px", color: "#9EA09B" }}>PoC 기준정보</span>
        </div>

        <div style={{ background: "#F8F9F7", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88" }}>수탁 관리 신탁은행</span>
          <strong className="mono" style={{ fontSize: "13px", fontWeight: 700, color: "#14151A" }}>{security.custodianBank || "신한은행 신탁사업부"}</strong>
          <span className="mono" style={{ fontSize: "10.5px", color: "#9EA09B" }}>책임 역할 확인 대상</span>
        </div>

        <div style={{ background: "#F8F9F7", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88" }}>표시 수량</span>
          <strong className="mono" style={{ fontSize: "14px", fontWeight: 700, color: "#128A54" }}>{sharesCount.toLocaleString()} dShare</strong>
          <span className="mono" style={{ fontSize: "10.5px", color: "#9EA09B" }}>projection 기준</span>
        </div>
      </div>

      {/* Statutory Statement */}
      <div style={{ background: "#F8F9F7", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "12px" }}>
          <ShieldCheck style={{ width: "16px", height: "16px", color: "#128A54" }} />
          <span>PoC simulation disclosure</span>
        </div>
        <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.6, color: "#5B5D5A" }}>
          본 카드는 `rwa-8th` PoC projection을 시각화한 것이다. 실제 예탁, 결제, 권리 발생 또는 법적 효력을 확정하지 않는다.
        </p>
      </div>

      {/* Actions Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.08)", flexWrap: "wrap", gap: "12px" }}>
        <div className="mono" style={{ fontSize: "11.5px", color: "#8A8C88" }}>
          검증 상태: <strong style={{ color: "#14151A", fontWeight: 700 }}>서버 projection과 workflow timeline으로 확인</strong>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => window.print()}
            className="mono btn-a"
            style={{
              cursor: "pointer",
              border: "1px solid rgba(0,0,0,0.15)",
              background: "#fff",
              color: "#14151A",
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Printer style={{ width: "14px", height: "14px" }} />
            인쇄
          </button>

          <button
            onClick={() => alert(`[${security.name}] PoC 증거 카드 저장 요청입니다.`)}
            className="mono btn-a"
            style={{
              cursor: "pointer",
              border: 0,
              background: "#C4F542",
              color: "#14151A",
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Download style={{ width: "14px", height: "14px" }} />
            PDF 다운로드 →
          </button>
        </div>
      </div>
    </div>
  );
}
