"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/ui/Navbar";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { RedemptionModal } from "@/components/domain/RedemptionModal";
import { Modal } from "@/components/ui/Modal";
import { UserCheck, ShieldCheck, Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function AccountPage() {
  const { user, positions, language } = useApp();
  const isKo = language === "KO";

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false);

  const [depositAmount, setDepositAmount] = useState("5000");
  const [depositMode, setDepositMode] = useState<"USD_WIRE" | "USDC_WEB3">("USD_WIRE");
  const [depositSuccess, setDepositSuccess] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState("2000");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositSuccess(true);
    setTimeout(() => {
      setDepositSuccess(false);
      setIsDepositModalOpen(false);
    }, 1500);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawModalOpen(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 40px" }}>
        {/* Shared Top Navigation Bar */}
        <Navbar />

        {/* Hero Header */}
        <section style={{ padding: "48px 0 32px" }}>
          <div className="eyebrow" style={{ marginBottom: "16px" }}>
            {isKo ? "04 — 계정 및 자금 관리 · 기관 원장 대치" : "04 — ACCOUNT & KYC · INSTITUTIONAL FUNDING LEDGER"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h1 className="disp" style={{ margin: 0, fontWeight: 700, fontSize: "36px" }}>
                  {user.name || "Alexander Vance"}
                </h1>
                <span className="mono" style={{ fontSize: "11.5px", background: "#C4F542", color: "#14151A", padding: "4px 12px", borderRadius: "999px", fontWeight: 700 }}>
                  {isKo ? "Tier 2 적격 전문 투자자" : "Tier 2 Accredited Institutional"}
                </span>
              </div>
              <p className="mono" style={{ margin: 0, fontSize: "13px", color: "#8A8C88" }}>
                {user.email} · LEI: LEI-SG-2026-992140 · KSD Omnibus: #KSD-882-9411
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="btn-a mono"
                style={{ cursor: "pointer", border: 0, background: "#14151A", color: "#F2F1EC", padding: "12px 22px", borderRadius: "999px", fontSize: "12.5px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}
              >
                <ArrowDownLeft style={{ width: "15px", height: "15px", color: "#C4F542" }} />
                {isKo ? "USD / USDC 자금 입금" : "Deposit USD / USDC"}
              </button>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="btn-a mono"
                style={{ cursor: "pointer", border: "1px solid rgba(0,0,0,0.15)", background: "#fff", color: "#14151A", padding: "12px 22px", borderRadius: "999px", fontSize: "12.5px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}
              >
                <ArrowUpRight style={{ width: "15px", height: "15px" }} />
                {isKo ? "USD 현금 출금" : "Withdraw Fiat"}
              </button>
              <button
                onClick={() => setIsRedemptionModalOpen(true)}
                className="btn-a mono"
                style={{ cursor: "pointer", border: 0, background: "#C4F542", color: "#14151A", padding: "12px 22px", borderRadius: "999px", fontSize: "13px", fontWeight: 700 }}
              >
                {isKo ? "1:1 실물 주식 상환 →" : "1:1 Share Redemption →"}
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", marginTop: "36px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,.1)" }}>
            <div style={{ background: "#14151A", color: "#F2F1EC", padding: "20px", borderRadius: "14px" }}>
              <div className="eyebrow" style={{ fontSize: "9.5px", color: "#9EA09B", marginBottom: "6px" }}>{isKo ? "USD 법화 원장 잔액" : "USD Fiat Cash Balance"}</div>
              <div className="mono" style={{ fontSize: "24px", fontWeight: 600, color: "#C4F542" }}>$12,480.90</div>
              <div className="mono" style={{ fontSize: "11px", color: "#9EA09B", marginTop: "4px" }}>₩17,226,138 KRW {isKo ? "원화 환산" : "Equivalent"}</div>
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", padding: "20px", borderRadius: "14px" }}>
              <div className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88", marginBottom: "6px" }}>{isKo ? "Web3 USDC 지갑 잔액" : "Web3 USDC Wallet"}</div>
              <div className="mono" style={{ fontSize: "24px", fontWeight: 600 }}>$50,000.00</div>
              <div className="mono" style={{ fontSize: "11px", color: "#128A54", marginTop: "4px" }}>✓ Connected (0x8821...9410)</div>
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", padding: "20px", borderRadius: "14px" }}>
              <div className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88", marginBottom: "6px" }}>{isKo ? "보유 토큰화 주식" : "Tokenized Securities"}</div>
              <div className="mono" style={{ fontSize: "24px", fontWeight: 600 }}>350 <span style={{ fontSize: "14px", color: "#8A8C88" }}>dShare</span></div>
              <div className="mono" style={{ fontSize: "11px", color: "#8A8C88", marginTop: "4px" }}>{isKo ? "5개 코스피 200 종목" : "5 KOSPI 200 Assets"}</div>
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", padding: "20px", borderRadius: "14px" }}>
              <div className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88", marginBottom: "6px" }}>{isKo ? "KYC 승인 상태" : "KYC Onboarding Status"}</div>
              <div className="mono" style={{ fontSize: "18px", fontWeight: 600, color: "#128A54", marginTop: "4px" }}>✓ Tier 2 {isKo ? "승인 완료" : "Verified"}</div>
              <Link href="/kyc" className="mono navlink" style={{ fontSize: "11px", color: "#14151A", display: "inline-block", marginTop: "6px" }}>{isKo ? "자격 증명 재인증 →" : "Re-verify Credentials →"}</Link>
            </div>
          </div>
        </section>

        {/* Institutional Accreditation Details */}
        <section style={{ padding: "20px 0 80px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "36px" }}>
          <div style={{ background: "#fff", padding: "28px", borderRadius: "18px", border: "1px solid rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 className="disp" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>{isKo ? "기관 투자자 자격 승인 및 결제 한도" : "Institutional Investor Verification & Limits"}</h3>
            <div className="mono" style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12.5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                <span style={{ color: "#8A8C88" }}>Investor ID</span>
                <span style={{ fontWeight: 600 }}>{user.foreignInvestorId || "INV-2026-99210"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                <span style={{ color: "#8A8C88" }}>Tax Residency</span>
                <span style={{ fontWeight: 600 }}>Singapore (DTA Treaty 15.4% Rate)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                <span style={{ color: "#8A8C88" }}>Daily DVP Order Limit</span>
                <span style={{ fontWeight: 600, color: "#128A54" }}>$5,000,000 USD ({isKo ? "무제한" : "Unlimited"})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8A8C88" }}>KSD Omnibus Custody Lock</span>
                <span style={{ fontWeight: 600, color: "#128A54" }}>✓ {isKo ? "신탁법 제22조 도산격리" : "Statutory Bankruptcy Remote"}</span>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "28px", borderRadius: "18px", border: "1px solid rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 className="disp" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>{isKo ? "빠른 실행 (Quick Actions)" : "Quick Actions"}</h3>
            <p style={{ fontSize: "14px", color: "#5B5D5A", margin: 0 }}>
              {isKo
                ? "USD 법화 또는 Web3 USDC 자금을 충전하고, 보유 주식을 1:1 실물로 인도하거나 기관 투자자 자격을 업데이트하세요."
                : "Seamlessly deposit USD fiat or USDC Web3 tokens, request 1:1 physical share delivery, or update your accredited institutional status."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              <Link href="/kyc" className="btn-a mono" style={{ cursor: "pointer", border: "1px solid rgba(0,0,0,0.12)", background: "#F8F9F7", color: "#14151A", padding: "12px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
                {isKo ? "기관 KYC 자격 갱신하기 →" : "Complete / Update Institutional KYC →"}
              </Link>
              <Link href="/rights" className="btn-a mono" style={{ cursor: "pointer", border: "1px solid rgba(0,0,0,0.12)", background: "#F8F9F7", color: "#14151A", padding: "12px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
                {isKo ? "1:1 KSD 수탁 증명서 확인하기 →" : "View 1:1 KSD Custody Attestation Certificates →"}
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(0,0,0,.1)", padding: "30px 0 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: "12px", color: "#9EA09B" }}>© 2026 KORE Markets · Tokenized securities. Capital at risk.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/rights" className="navlink mono" style={{ fontSize: "12px" }}>Disclosures</Link>
            <Link href="/rights" className="navlink mono" style={{ fontSize: "12px" }}>Custody</Link>
            <Link href="/support" className="navlink mono" style={{ fontSize: "12px" }}>Terms</Link>
          </div>
        </footer>
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        maxWidth="sm"
        title={isKo ? "자금 입금 및 충전 (Deposit Funding)" : "Deposit Funding"}
        subtitle={isKo ? "USD 은행 전송 또는 Web3 USDC 지갑을 통해 트레이딩 자금을 충전합니다." : "Deposit trading funds via USD bank wire or Web3 USDC wallet."}
      >
        <form onSubmit={handleDepositSubmit} className="mono" style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "12px" }}>
          {depositSuccess ? (
            <div style={{ textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <CheckCircle2 style={{ width: "36px", height: "36px", color: "#128A54" }} />
              <h4 className="disp" style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>${depositAmount} {isKo ? "입금 처리 완료" : "Deposit Completed"}</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#5B5D5A" }}>{isKo ? "가용한 USD 원장에 즉시 반영되었습니다." : "Credited to your available USD ledger balance."}</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "6px", background: "#EAEBE7", padding: "3px", borderRadius: "999px" }}>
                <button
                  type="button"
                  onClick={() => setDepositMode("USD_WIRE")}
                  style={{ flex: 1, border: 0, padding: "8px", borderRadius: "999px", background: depositMode === "USD_WIRE" ? "#14151A" : "transparent", color: depositMode === "USD_WIRE" ? "#F2F1EC" : "#5B5D5A", fontWeight: 600, cursor: "pointer" }}
                >
                  USD Bank Wire
                </button>
                <button
                  type="button"
                  onClick={() => setDepositMode("USDC_WEB3")}
                  style={{ flex: 1, border: 0, padding: "8px", borderRadius: "999px", background: depositMode === "USDC_WEB3" ? "#14151A" : "transparent", color: depositMode === "USDC_WEB3" ? "#F2F1EC" : "#5B5D5A", fontWeight: 600, cursor: "pointer" }}
                >
                  USDC Web3 Wallet
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ color: "#5B5D5A" }}>{isKo ? "입금 금액 (Amount USD)" : "Amount (USD)"}</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  style={{ padding: "10px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "14px", outline: "none" }}
                />
              </div>

              <button
                type="submit"
                className="btn-a"
                style={{ cursor: "pointer", border: 0, background: "#C4F542", color: "#14151A", padding: "12px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, marginTop: "6px" }}
              >
                ${depositAmount} {isKo ? "입금 확정 →" : "Confirm Deposit →"}
              </button>
            </>
          )}
        </form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        maxWidth="sm"
        title={isKo ? "USD 법화 출금 신청 (Withdraw USD)" : "Withdraw USD Fiat"}
        subtitle={isKo ? "등록된 전용 해외 계좌로 USD 자금을 인출합니다." : "Withdraw USD funds to your designated overseas bank account."}
      >
        <form onSubmit={handleWithdrawSubmit} className="mono" style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "12px" }}>
          {withdrawSuccess ? (
            <div style={{ textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <CheckCircle2 style={{ width: "36px", height: "36px", color: "#128A54" }} />
              <h4 className="disp" style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>${withdrawAmount} {isKo ? "출금 신청 승인" : "Withdrawal Approved"}</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#5B5D5A" }}>DBS Bank 해외 송금(T+1)이 전송되었습니다.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ color: "#5B5D5A" }}>{isKo ? "출금 신청 금액 (USD)" : "Amount (USD)"}</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{ padding: "10px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "14px", outline: "none" }}
                />
              </div>

              <button
                type="submit"
                className="btn-a"
                style={{ cursor: "pointer", border: 0, background: "#14151A", color: "#F2F1EC", padding: "12px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, marginTop: "6px" }}
              >
                ${withdrawAmount} {isKo ? "출금 실행 →" : "Execute Withdrawal →"}
              </button>
            </>
          )}
        </form>
      </Modal>

      {/* Share Redemption Modal */}
      <RedemptionModal
        isOpen={isRedemptionModalOpen}
        onClose={() => setIsRedemptionModalOpen(false)}
        position={positions[0]}
      />
    </div>
  );
}
