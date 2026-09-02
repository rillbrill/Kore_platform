"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Coins, RefreshCw, RotateCcw, Vote } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { usePlatform } from "@/context/PlatformContext";
import {
  submitDividendConversionCommand,
  submitRedemptionCommand,
  submitVotingInstructionCommand,
  type AcceptedCommand,
} from "@/lib/platform-commands";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { Navbar } from "@/components/ui/Navbar";
import { DigitalCustodyCertificate } from "@/components/domain/DigitalCustodyCertificate";

type ActionState = {
  type: "success" | "error" | "info";
  message: string;
  workflowId?: string;
};

function usdMinor(value?: string) {
  if (!value) return "0.00";
  return (Number(value) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function RightsPage() {
  const { positions: fallbackPositions, securities, language } = useApp();
  const {
    connected,
    session,
    token,
    profile,
    positions,
    refresh,
    message: platformMessage,
    error: platformError,
  } = usePlatform();
  const [activeTab, setActiveTab] = useState<"rights" | "evidence">("rights");
  const [redemptionQuantity, setRedemptionQuantity] = useState("1");
  const [actionState, setActionState] = useState<ActionState | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const isKo = language === "KO";

  const rights = session?.localRightsScenario;
  const dividend = rights?.dividend;
  const voting = rights?.voting;
  const redemption = session?.localRedemptionScenario;
  const displayPositions = connected && positions.length ? positions : [];
  const selectedSecurity = securities.find((s) => s.id === rights?.securityId) || securities[0];
  const fallbackValueKrw = fallbackPositions.reduce((sum, p) => sum + Math.round(p.currentValueUsd * 1380.5), 0);

  async function runCommand(label: string, command: () => Promise<AcceptedCommand>) {
    try {
      setSubmitting(label);
      setActionState({ type: "info", message: `${label} workflow를 접수하는 중이다.` });
      const accepted = await command();
      await refresh();
      setActionState({
        type: "success",
        workflowId: accepted.workflowId,
        message: `${label} 요청을 접수했다. 이후 상태는 workflow timeline에서 확인한다.`,
      });
    } catch (error) {
      setActionState({
        type: "error",
        message: error instanceof Error ? error.message : `${label} 요청에 실패했다.`,
      });
    } finally {
      setSubmitting(null);
    }
  }

  const canConvertDividend = Boolean(dividend?.paymentId && dividend?.quoteId);
  const canVote = Boolean(voting && Number(voting.eligibleQuantity ?? "0") > 0);
  const canRedeem = Boolean(redemption && Number(redemption.redeemableQuantity) > 0);

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 40px" }}>
        <Navbar />

        <section style={{ padding: "42px 0 28px", borderBottom: "1px solid rgba(0,0,0,.1)" }}>
          <div className="eyebrow" style={{ marginBottom: "14px" }}>
            {isKo ? "권리 · 상환 · 업무 추적" : "RIGHTS · REDEMPTION · WORKFLOW TRACE"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px" }}>
            <div>
              <h1 className="disp" style={{ margin: 0, fontWeight: 600, fontSize: "46px", lineHeight: 1.08 }}>
                {isKo ? "권리 업무를 접수하고 상태를 확인한다" : "Submit rights actions and trace status"}
              </h1>
              <p style={{ maxWidth: "680px", margin: "14px 0 0", fontSize: "15px", lineHeight: 1.6, color: "#5B5D5A" }}>
                {isKo
                  ? "배당 전환, 의결권 지시, 환매는 즉시 완료가 아니라 `rwa-8th` workflow로 접수된다."
                  : "Dividend conversion, voting, and redemption are accepted as rwa-8th workflows, not instant final states."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void refresh()}
              className="btn-a mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                border: 0,
                background: "#C4F542",
                color: "#14151A",
                padding: "12px 18px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Projection 새로고침
            </button>
          </div>

          <div
            className="mono"
            style={{
              marginTop: "20px",
              padding: "13px 15px",
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,.08)",
              background: connected ? "#F8FFF0" : "#FFF7EA",
              color: "#3A3B38",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            <strong>{connected ? "rwa-8th API projection" : "목업 fallback"}</strong>
            <span style={{ display: "block", marginTop: "4px" }}>
              {connected
                ? `${session?.projection.projectionStatus ?? "UNKNOWN"} · ${session?.projection.projectionAsOf ?? ""}`
                : platformError ?? platformMessage}
            </span>
            {actionState && (
              <span
                style={{
                  display: "block",
                  marginTop: "7px",
                  color: actionState.type === "error" ? "#A03A3A" : "#3A3B38",
                }}
              >
                {actionState.message}
                {actionState.workflowId && (
                  <Link
                    href={`/investor/orders/${actionState.workflowId}`}
                    style={{ marginLeft: "8px", color: "#14151A", fontWeight: 700, textDecoration: "underline" }}
                  >
                    workflow 보기
                  </Link>
                )}
              </span>
            )}
          </div>
        </section>

        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(0,0,0,.1)", marginBottom: "28px", marginTop: "20px" }}>
          {(["rights", "evidence"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="disp"
              style={{
                fontSize: "15px",
                fontWeight: 600,
                padding: "12px 20px",
                cursor: "pointer",
                border: 0,
                background: "transparent",
                borderBottom: activeTab === tab ? "2px solid #14151A" : "2px solid transparent",
                color: activeTab === tab ? "#14151A" : "#9EA09B",
              }}
            >
              {tab === "rights" ? "권리 업무" : "증거 카드"}
            </button>
          ))}
        </div>

        {activeTab === "rights" ? (
          <section style={{ paddingBottom: "80px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "18px" }}>
            <article style={{ background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#E0F0E5", color: "#128A54", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <div className="eyebrow" style={{ fontSize: "9.5px" }}>CASH DIVIDEND</div>
                  <h2 className="disp" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>배당 전환</h2>
                </div>
              </div>
              <p style={{ margin: 0, color: "#5B5D5A", fontSize: "13px", lineHeight: 1.55 }}>
                USD 지급이 완료된 뒤 선택형 USDC 전환을 접수한다. 실제 배당이나 세금 정책을 확정하지 않는다.
              </p>
              <div className="mono" style={{ display: "grid", gap: "6px", fontSize: "12px", color: "#3A3B38" }}>
                <span>상태: {dividend?.conversionStatus ?? dividend?.paymentStatus ?? dividend?.status ?? "준비 전"}</span>
                <span>기준수량: {dividend?.eligibleQuantity ?? "0"}주</span>
                <span>USD 지급액: ${usdMinor(dividend?.netUsdMinor)}</span>
              </div>
              <button
                type="button"
                disabled={!connected || !canConvertDividend || submitting !== null}
                onClick={() =>
                  void runCommand("배당 전환", () =>
                    submitDividendConversionCommand({
                      token,
                      dividendPaymentId: dividend!.paymentId!,
                      quoteId: dividend!.quoteId!,
                    }),
                  )
                }
                className="btn-a mono"
                style={{
                  marginTop: "auto",
                  cursor: connected && canConvertDividend && submitting === null ? "pointer" : "not-allowed",
                  border: 0,
                  background: connected && canConvertDividend && submitting === null ? "#14151A" : "#EAEBE7",
                  color: connected && canConvertDividend && submitting === null ? "#F2F1EC" : "#9EA09B",
                  padding: "12px 16px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {submitting === "배당 전환" ? "접수 중" : "USDC 전환 접수"}
              </button>
            </article>

            <article style={{ background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#14151A", color: "#C4F542", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Vote className="w-5 h-5" />
                </div>
                <div>
                  <div className="eyebrow" style={{ fontSize: "9.5px" }}>VOTING INSTRUCTION</div>
                  <h2 className="disp" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>의결권 지시</h2>
                </div>
              </div>
              <p style={{ margin: 0, color: "#5B5D5A", fontSize: "13px", lineHeight: 1.55 }}>
                기준수량이 확정된 안건에 대해 찬성, 반대, 기권 지시를 제출한다. 미응답 수량은 행사하지 않는다.
              </p>
              <div className="mono" style={{ display: "grid", gap: "6px", fontSize: "12px", color: "#3A3B38" }}>
                <span>안건: {voting?.titleKo ?? "준비 중"}</span>
                <span>기준수량: {voting?.eligibleQuantity ?? "0"}주</span>
                <span>현재 지시: {voting?.instruction ?? "미응답"}</span>
              </div>
              <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {(["FOR", "AGAINST", "ABSTAIN"] as const).map((instruction) => (
                  <button
                    key={instruction}
                    type="button"
                    disabled={!connected || !canVote || submitting !== null}
                    onClick={() =>
                      void runCommand("의결권 지시", () =>
                        submitVotingInstructionCommand({
                          token,
                          meetingId: voting!.meetingId,
                          agendaId: voting!.agendaId,
                          instruction,
                        }),
                      )
                    }
                    style={{
                      cursor: connected && canVote && submitting === null ? "pointer" : "not-allowed",
                      border: "1px solid rgba(0,0,0,.12)",
                      background: "#F8F9F7",
                      color: connected && canVote && submitting === null ? "#14151A" : "#9EA09B",
                      padding: "10px 8px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {instruction === "FOR" ? "찬성" : instruction === "AGAINST" ? "반대" : "기권"}
                  </button>
                ))}
              </div>
            </article>

            <article style={{ background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#FFF1E5", color: "#A45A22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <div className="eyebrow" style={{ fontSize: "9.5px" }}>REDEMPTION</div>
                  <h2 className="disp" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>환매 요청</h2>
                </div>
              </div>
              <p style={{ margin: 0, color: "#5B5D5A", fontSize: "13px", lineHeight: 1.55 }}>
                환매는 국내 매도, T+2, 권리 종료, 토큰 소각을 거치는 별도 workflow로 추적한다.
              </p>
              <div className="mono" style={{ display: "grid", gap: "6px", fontSize: "12px", color: "#3A3B38" }}>
                <span>대상: {redemption?.displayName ?? "준비 중"}</span>
                <span>환매 가능: {redemption?.redeemableQuantity ?? "0"}주</span>
                <span>기준 지정가: ₩{redemption?.referenceLimitKrw ?? "-"}</span>
              </div>
              <label className="mono" style={{ display: "grid", gap: "6px", fontSize: "11px", color: "#5B5D5A" }}>
                환매 수량
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={redemptionQuantity}
                  onChange={(event) => setRedemptionQuantity(event.target.value)}
                  style={{ width: "100%", border: "1px solid rgba(0,0,0,.14)", borderRadius: "10px", padding: "11px 12px", fontSize: "13px", color: "#14151A" }}
                />
              </label>
              <button
                type="button"
                disabled={!connected || !canRedeem || submitting !== null}
                onClick={() =>
                  void runCommand("환매", () =>
                    submitRedemptionCommand({
                      scenario: redemption!,
                      token,
                      profile,
                      quantity: Math.max(1, Math.floor(Number(redemptionQuantity) || 1)),
                    }),
                  )
                }
                className="btn-a mono"
                style={{
                  marginTop: "auto",
                  cursor: connected && canRedeem && submitting === null ? "pointer" : "not-allowed",
                  border: 0,
                  background: connected && canRedeem && submitting === null ? "#14151A" : "#EAEBE7",
                  color: connected && canRedeem && submitting === null ? "#F2F1EC" : "#9EA09B",
                  padding: "12px 16px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                {submitting === "환매" ? "접수 중" : "환매 workflow 접수"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>
          </section>
        ) : (
          <section style={{ paddingBottom: "80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", alignItems: "start" }}>
            <DigitalCustodyCertificate security={selectedSecurity} />
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: "16px", padding: "22px" }}>
              <h2 className="disp" style={{ margin: "0 0 14px", fontSize: "22px", fontWeight: 700 }}>수량 상태</h2>
              <div style={{ display: "grid", gap: "10px" }}>
                {displayPositions.length ? (
                  displayPositions.map((position) => (
                    <div key={position.securityId} className="mono" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: "10px", fontSize: "12px" }}>
                      <strong style={{ gridColumn: "1 / -1", fontSize: "13px" }}>{position.displayName}</strong>
                      <span>거래 가능 {position.settledRights}</span>
                      <span>대기 {position.pendingRights}</span>
                      <span>잠금 {position.lockedRights}</span>
                      <span>소각 대기 {position.burnPendingTokens}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ margin: 0, color: "#5B5D5A", fontSize: "13px", lineHeight: 1.6 }}>
                    API projection이 없을 때는 기존 목업 평가액 ₩{fallbackValueKrw.toLocaleString()}만 참고용으로 표시된다.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <footer style={{ borderTop: "1px solid rgba(0,0,0,.1)", padding: "30px 0 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: "12px", color: "#9EA09B" }}>© 2026 KORE Markets · PoC simulation · Capital at risk.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/investor/activities" className="navlink mono" style={{ fontSize: "12px" }}>활동</Link>
            <Link href="/investor/orders/new" className="navlink mono" style={{ fontSize: "12px" }}>주문</Link>
            <Link href="/investor/support" className="navlink mono" style={{ fontSize: "12px" }}>지원</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
