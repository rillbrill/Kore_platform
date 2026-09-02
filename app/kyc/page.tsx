"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { usePlatform } from "@/context/PlatformContext";
import {
  acceptDisclosureCommand,
  linkDemoWalletCommand,
  type AcceptedCommand,
} from "@/lib/platform-commands";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { Navbar } from "@/components/ui/Navbar";
import { ShieldCheck, UserCheck, CheckCircle2, ArrowRight, ArrowLeft, Lock, FileCheck } from "lucide-react";

export default function KycOnboardingPage() {
  const router = useRouter();
  const { user, completeKycOnboarding } = useApp();
  const {
    connected,
    session,
    disclosure,
    consent,
    token,
    profile,
    refresh,
    message: platformMessage,
    error: platformError,
  } = usePlatform();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [platformAction, setPlatformAction] = useState<AcceptedCommand | null>(null);
  const [platformActionError, setPlatformActionError] = useState<string | null>(null);

  // Step 1: Identity & LEI
  const [fullName, setFullName] = useState(user.name || "Alexander Vance");
  const [passportNumber, setPassportNumber] = useState("E88219401");
  const [country, setCountry] = useState("싱가포르 (Singapore / Non-Resident)");
  const [taxId, setTaxId] = useState("LEI-SG-2026-992140");

  // Step 2: Financial Standing
  const [experience, setExperience] = useState("OVER_3Y");
  const [incomeLevel, setIncomeLevel] = useState("TIER_HIGH");

  // Step 3: Statutory Disclosures
  const [agreedCustody, setAgreedCustody] = useState(false);
  const [agreedTaxReport, setAgreedTaxReport] = useState(false);

  // Step 4: Settlement Mode
  const [isFinishing, setIsFinishing] = useState(false);

  const handleNext = async () => {
    setPlatformActionError(null);

    if (currentStep === 1) {
      if (!fullName.trim() || !passportNumber.trim()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!agreedCustody || !agreedTaxReport) return;
      if (connected && disclosure) {
        try {
          setIsFinishing(true);
          const accepted = await acceptDisclosureCommand({ disclosure, token });
          setPlatformAction(accepted);
          await refresh();
        } catch (error) {
          setPlatformActionError(error instanceof Error ? error.message : "공시 동의 접수에 실패했다.");
          return;
        } finally {
          setIsFinishing(false);
        }
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setIsFinishing(true);
      if (connected && session) {
        try {
          const accepted = await linkDemoWalletCommand({ session, token, profile });
          setPlatformAction(accepted);
          await refresh();
          setCurrentStep(5);
        } catch (error) {
          setPlatformActionError(error instanceof Error ? error.message : "지갑 연결 요청에 실패했다.");
        } finally {
          setIsFinishing(false);
        }
        return;
      }
      setTimeout(() => {
        completeKycOnboarding({
          name: fullName,
          country,
        });
        setIsFinishing(false);
        setCurrentStep(5);
      }, 1400);
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 40px" }}>
        {/* Shared Top Navigation Bar */}
        <Navbar />

        {/* Hero Section */}
        <section style={{ padding: "48px 0 32px", maxWidth: "800px", margin: "0 auto" }}>
          <div className="eyebrow" style={{ textAlign: "center", marginBottom: "12px" }}>INVESTOR ACCOUNT READINESS</div>
          <h1 className="disp" style={{ textAlign: "center", margin: 0, fontSize: "42px", fontWeight: 700 }}>
            투자자 계정 준비
          </h1>
          <p style={{ textAlign: "center", margin: "12px 0 32px", fontSize: "15px", color: "#5B5D5A" }}>
            `rwa-8th`의 공시 동의, 적격성, 보호한도, 지갑 연결 상태를 확인하고 업무 요청을 접수한다.
          </p>

          <div className="mono" style={{ marginBottom: "18px", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", background: connected ? "#F8FFF0" : "#FFF7EA", color: "#3A3B38", fontSize: "12px", lineHeight: 1.5 }}>
            <strong>{connected ? "rwa-8th API 연결됨" : "목업 모드"}</strong>
            <span style={{ display: "block", marginTop: "4px" }}>
              {connected
                ? `Projection ${session?.projection.projectionStatus ?? "UNKNOWN"} · ${session?.projection.projectionAsOf ?? ""}`
                : platformError ?? platformMessage}
            </span>
            {platformAction && (
              <Link href={`/investor/orders/${platformAction.workflowId}`} style={{ display: "inline-block", marginTop: "6px", color: "#14151A", fontWeight: 700 }}>
                접수 workflow 보기: {platformAction.workflowId.slice(0, 8)}
              </Link>
            )}
            {platformActionError && <span style={{ display: "block", marginTop: "6px", color: "#A03A3A" }}>{platformActionError}</span>}
          </div>

          {/* Stepper Progress Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", marginBottom: "40px" }} className="mono">
            {[1, 2, 3, 4, 5].map((step) => {
              const isDone = currentStep > step;
              const isCurrent = currentStep === step;

              return (
                <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", zIndex: 10 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "999px",
                      background: isCurrent ? "#14151A" : isDone ? "#C4F542" : "#EAEBE7",
                      color: isCurrent ? "#F2F1EC" : "#14151A",
                      fontWeight: 700,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isDone ? "✓" : step}
                  </div>
                  <span style={{ fontSize: "11px", color: isCurrent ? "#14151A" : "#9EA09B", fontWeight: isCurrent ? 600 : 400 }}>
                    {step === 1 ? "Identity" : step === 2 ? "Standing" : step === 3 ? "Legal" : step === 4 ? "Review" : "Complete"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.09)", borderRadius: "20px", padding: "36px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            {currentStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="mono">
                <h3 className="disp" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>투자자 프로필 확인</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#5B5D5A" }}>데모 투자자 이름</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ padding: "12px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "14px", outline: "none" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", color: "#5B5D5A" }}>데모 신원 참조값</label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      style={{ padding: "12px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "14px", outline: "none" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", color: "#5B5D5A" }}>데모 고객 식별자</label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      style={{ padding: "12px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "14px", outline: "none" }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-a"
                  style={{ cursor: "pointer", border: 0, background: "#C4F542", color: "#14151A", padding: "14px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, marginTop: "8px" }}
                >
                  적격성 상태 확인 →
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="mono">
                <h3 className="disp" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>적격성 및 보호한도</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#5B5D5A" }}>투자 경험</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    style={{ padding: "12px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                  >
                    <option value="OVER_3Y">3년 이상 전문 기관 운용 경력 (Professional &gt; 3 Years)</option>
                    <option value="OVER_1Y">1년 이상 전문 거래 경력 (Experienced &gt; 1 Year)</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#5B5D5A" }}>투자자 보호한도 구간</label>
                  <select
                    value={incomeLevel}
                    onChange={(e) => setIncomeLevel(e.target.value)}
                    style={{ padding: "12px 14px", background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                  >
                    <option value="TIER_HIGH">USD $1,000,000 이상 (Accredited Tier A)</option>
                    <option value="TIER_INSTITUTIONAL">USD $10,000,000 이상 (Institutional Qualified)</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{ background: "#EAEBE7", border: 0, padding: "14px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-a"
                    style={{ flex: 1, cursor: "pointer", border: 0, background: "#C4F542", color: "#14151A", padding: "14px", borderRadius: "999px", fontSize: "14px", fontWeight: 700 }}
                  >
                    공시 확인 →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="mono">
                <h3 className="disp" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>위험공시 및 모의 약관 동의</h3>
                {disclosure && (
                  <div style={{ padding: "14px", background: "#F1F3F0", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", color: "#3A3B38", fontSize: "12px", lineHeight: 1.6 }}>
                    <strong>{disclosure.titleKo}</strong>
                    <span style={{ display: "block", marginTop: "6px" }}>{disclosure.bodyKo}</span>
                    <span style={{ display: "block", marginTop: "6px", color: "#5B5D5A" }}>책임 역할: {disclosure.responsibleRole} · 버전: {disclosure.version}</span>
                  </div>
                )}
                
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "#F8F9F7", padding: "14px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={agreedCustody}
                    onChange={(e) => setAgreedCustody(e.target.checked)}
                    style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#14151A" }}
                  />
                  <span style={{ fontSize: "12px", lineHeight: 1.5, color: "#3A3B38" }}>
                    [필수] 이 화면은 PoC 시뮬레이션이며, 실제 예탁·결제·권리 발생을 확정하지 않는다는 점을 확인합니다.
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "#F8F9F7", padding: "14px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={agreedTaxReport}
                    onChange={(e) => setAgreedTaxReport(e.target.checked)}
                    style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#14151A" }}
                  />
                  <span style={{ fontSize: "12px", lineHeight: 1.5, color: "#3A3B38" }}>
                    [필수] 주문과 권리 업무는 접수 후 workflow 상태, 책임 역할, 복구 조치로 추적된다는 점을 확인합니다.
                  </span>
                </label>

                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    style={{ background: "#EAEBE7", border: 0, padding: "14px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!agreedCustody || !agreedTaxReport}
                    className="btn-a"
                    style={{ flex: 1, cursor: agreedCustody && agreedTaxReport ? "pointer" : "not-allowed", border: 0, background: agreedCustody && agreedTaxReport ? "#C4F542" : "#EAEBE7", color: agreedCustody && agreedTaxReport ? "#14151A" : "#9EA09B", padding: "14px", borderRadius: "999px", fontSize: "14px", fontWeight: 700 }}
                  >
                    {isFinishing ? "공시 동의 접수 중..." : consent?.status === "ACTIVE" ? "동의 상태 확인됨 →" : "공시 동의 접수 →"}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div style={{ textAlign: "center", padding: "32px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }} className="mono">
                <div style={{ width: "56px", height: "56px", borderRadius: "999px", background: "#14151A", color: "#C4F542", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck style={{ width: "32px", height: "32px" }} />
                </div>
                <h3 className="disp" style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>지갑 연결 요청</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#5B5D5A", maxWidth: "420px" }}>
                  demo signer로 자기보관 지갑 ownership message에 서명하고, 서버에 연결 요청을 접수한다.
                </p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-a"
                  style={{ cursor: "pointer", border: 0, background: "#C4F542", color: "#14151A", padding: "14px 28px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, marginTop: "12px" }}
                >
                  {isFinishing ? "요청 접수 중..." : "지갑 연결 요청 →"}
                </button>
              </div>
            )}

            {currentStep === 5 && (
              <div style={{ textAlign: "center", padding: "32px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }} className="mono">
                <div style={{ width: "56px", height: "56px", borderRadius: "999px", background: "#E0F0E5", color: "#128A54", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 style={{ width: "36px", height: "36px" }} />
                </div>
                <h3 className="disp" style={{ margin: 0, fontSize: "26px", fontWeight: 700 }}>계정 준비 요청 접수 완료</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#5B5D5A", maxWidth: "480px" }}>
                  API 연결 상태에서는 서버 projection을 새로고침해 동의, 지갑, 보호한도 상태를 계속 확인한다.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/investor/positions")}
                  className="btn-a"
                  style={{ cursor: "pointer", border: 0, background: "#14151A", color: "#F2F1EC", padding: "14px 32px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, marginTop: "12px" }}
                >
                  포트폴리오 확인 →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(0,0,0,.1)", padding: "30px 0 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: "12px", color: "#9EA09B" }}>© 2026 KORE Markets · Tokenized securities. Capital at risk.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/investor/rights" className="navlink mono" style={{ fontSize: "12px" }}>권리</Link>
            <Link href="/investor/activities" className="navlink mono" style={{ fontSize: "12px" }}>활동</Link>
            <Link href="/investor/support" className="navlink mono" style={{ fontSize: "12px" }}>지원</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
