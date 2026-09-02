"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/ui/Navbar";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { AssetAllocationChart } from "@/components/domain/AssetAllocationChart";
import { RedemptionModal } from "@/components/domain/RedemptionModal";
import { Position } from "@/types/domain";
import { platformPositionsToPositions, productsToSecurities } from "@/lib/platform-view-models";
import { Wallet, TrendingUp, Coins, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function PortfolioPage() {
  const {
    user,
    positions,
    securities,
    totalPortfolioValueUsd,
    totalPortfolioReturnUsd,
    totalPortfolioReturnPercent,
    unclaimedDividendsUsd,
    claimDividend,
    language,
  } = useApp();
  const { connected, products, positions: platformPositions, session, message } = usePlatform();

  const isKo = language === "KO";
  const displaySecurities = productsToSecurities(products, securities);
  const displayPositions = platformPositionsToPositions(platformPositions, displaySecurities, positions);
  const displayPortfolioValueUsd = connected
    ? displayPositions.reduce((sum, position) => sum + position.currentValueUsd, 0)
    : totalPortfolioValueUsd;
  const displayPortfolioReturnUsd = connected ? 0 : totalPortfolioReturnUsd;
  const displayPortfolioReturnPercent = connected ? 0 : totalPortfolioReturnPercent;
  const displayUnclaimedDividendsUsd = connected
    ? displayPositions.reduce((sum, position) => sum + position.accruedDividendUsd, 0)
    : unclaimedDividendsUsd;

  const [selectedPositionForRedemption, setSelectedPositionForRedemption] = useState<Position | null>(null);
  const [claimedSuccess, setClaimedSuccess] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);

  const handleClaimAll = () => {
    if (connected) return;
    claimDividend("ca-1");
    setClaimedSuccess(true);
    setTimeout(() => setClaimedSuccess(false), 4000);
  };

  const totalValueKrw = Math.round(displayPortfolioValueUsd * 1380.5);

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 40px" }}>
        {/* Shared Top Navigation Bar */}
        <Navbar />

        {/* Hero Header */}
        <section style={{ padding: "40px 0 24px" }}>
          <div className="eyebrow" style={{ marginBottom: "12px" }}>
            {isKo ? "03 — 보유 자산 및 현물 수탁 잔고" : "03 — PORTFOLIO & CUSTODIAL HOLDINGS LEDGER"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 className="disp" style={{ margin: 0, fontWeight: 500, fontSize: "48px", lineHeight: 1.08, letterSpacing: "-.03em" }}>
                {isKo ? "포트폴리오 자산 현황 및" : "Portfolio &"}<br />
                <span style={{ color: "#9EA09B" }}>{isKo ? "수량 상태" : "rights"}</span>{" "}
                <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: "48px" }}>
                  {isKo ? "분리 장부." : "state ledger."}
                </span>
              </h1>
              <p style={{ maxWidth: "580px", margin: "14px 0 0", fontSize: "15px", lineHeight: 1.6, color: "#5B5D5A" }}>
                {isKo
                  ? "거래 가능, 국내 결제 대기, 잠금, 소각 대기, USD 지급청구를 분리해 확인합니다."
                  : "Review settled, pending, locked, burn-pending, and USD claim quantities separately."}
              </p>
              <p className="mono" style={{ margin: "10px 0 0", fontSize: "12px", color: connected ? "#128A54" : "#7A5A00" }}>
                {connected
                  ? `${message} · ${session?.projection.projectionStatus ?? ""}`
                  : isKo
                    ? "rwa-8th API가 꺼져 있어 기존 목업 보유 데이터로 표시 중"
                    : "Using local mock positions until the rwa-8th API is available"}
              </p>
            </div>

            {/* Buy More Assets Button */}
            <Link
              href="/trade"
              className="btn-a mono"
              style={{
                cursor: "pointer",
                border: 0,
                background: "#C4F542",
                color: "#14151A",
                padding: "12px 24px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              {isKo ? "추가 자산 매수하기 →" : "Buy More Assets →"}
            </Link>
          </div>

          {/* Alert Banners */}
          {claimedSuccess && (
            <div style={{ marginTop: "20px", padding: "14px 20px", background: "#E0F0E5", borderRadius: "12px", border: "1px solid #128A54", display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle2 style={{ width: "18px", height: "18px", color: "#128A54" }} />
              <span className="mono" style={{ fontSize: "13px", fontWeight: 600, color: "#128A54" }}>
                {isKo ? "✓ 미수령 배당금이 가용한 USD 계좌 잔고로 즉시 입금되었습니다." : "✓ Unclaimed dividends have been credited to your available USD balance."}
              </span>
            </div>
          )}

          {redemptionSuccess && (
            <div style={{ marginTop: "20px", padding: "14px 20px", background: "#E0F0E5", borderRadius: "12px", border: "1px solid #128A54", display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle2 style={{ width: "18px", height: "18px", color: "#128A54" }} />
              <span className="mono" style={{ fontSize: "13px", fontWeight: 600, color: "#128A54" }}>
                {isKo ? "✓ 실물 주식 상환 신청이 성공적으로 접수되었습니다. T+2 영업일 이내 출고됩니다." : "✓ Share redemption request submitted. Delivery settles within T+2 business days."}
              </span>
            </div>
          )}

          {/* 4 Summary Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", marginTop: "32px" }}>
            {/* Card 1: Total Assets */}
            <div style={{ background: "#14151A", color: "#F2F1EC", padding: "22px", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="eyebrow" style={{ fontSize: "9.5px", color: "#9EA09B" }}>{isKo ? "총 평가 자산" : "Total Portfolio Value"}</span>
                <Wallet style={{ width: "16px", height: "16px", color: "#C4F542" }} />
              </div>
              <div style={{ marginTop: "16px" }}>
                <div className="mono" style={{ fontSize: "28px", fontWeight: 600, color: "#C4F542", letterSpacing: "-.02em" }}>
                  ${displayPortfolioValueUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="mono" style={{ fontSize: "11.5px", color: "#9EA09B", marginTop: "4px" }}>
                  ≈ ₩{totalValueKrw.toLocaleString()} KRW
                </div>
              </div>
            </div>

            {/* Card 2: Total Return */}
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", padding: "22px", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88" }}>{isKo ? "누적 평가 손익" : "Total Return"}</span>
                <TrendingUp style={{ width: "16px", height: "16px", color: "#128A54" }} />
              </div>
              <div style={{ marginTop: "16px" }}>
                <div className="mono" style={{ fontSize: "28px", fontWeight: 600, color: "#128A54", letterSpacing: "-.02em" }}>
                  +${displayPortfolioReturnUsd.toLocaleString()}
                </div>
                <div className="mono" style={{ fontSize: "12px", color: "#128A54", fontWeight: 600, marginTop: "4px" }}>
                  ▲ +{displayPortfolioReturnPercent.toFixed(2)}% {isKo ? "누적 수익률" : "Return"}
                </div>
              </div>
            </div>

            {/* Card 3: Unclaimed Dividends with Claim CTA */}
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", padding: "22px", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88" }}>{isKo ? "미수령 배당금" : "Unclaimed Dividends"}</span>
                <Coins style={{ width: "16px", height: "16px", color: "#128A54" }} />
              </div>
              <div style={{ marginTop: "12px" }}>
                <div className="mono" style={{ fontSize: "24px", fontWeight: 600, color: "#14151A" }}>
                  ${displayUnclaimedDividendsUsd.toFixed(2)} USD
                </div>
                <button
                  onClick={handleClaimAll}
                  disabled={connected || displayUnclaimedDividendsUsd <= 0}
                  className="mono btn-a"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    border: 0,
                    background: !connected && displayUnclaimedDividendsUsd > 0 ? "#14151A" : "#EAEBE7",
                    color: !connected && displayUnclaimedDividendsUsd > 0 ? "#C4F542" : "#9EA09B",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    cursor: !connected && displayUnclaimedDividendsUsd > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  {connected ? (isKo ? "권리 화면에서 전환 요청" : "Use rights workflow") : (isKo ? "배당금 1-Click 수령 →" : "Claim All Dividends →")}
                </button>
              </div>
            </div>

            {/* Card 4: USD Ledger Cash Balance */}
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", padding: "22px", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88" }}>{isKo ? "가용 USD 원장 잔액" : "Available Cash Balance"}</span>
                <ShieldCheck style={{ width: "16px", height: "16px", color: "#128A54" }} />
              </div>
              <div style={{ marginTop: "16px" }}>
                <div className="mono" style={{ fontSize: "28px", fontWeight: 600, color: "#14151A", letterSpacing: "-.02em" }}>
                  ${user.usdLedgerBalance.toLocaleString()}
                </div>
                <div className="mono" style={{ fontSize: "11px", color: "#128A54", marginTop: "4px" }}>
                  ✓ {isKo ? "즉시 매수 주문 가능" : "Instant Trading Available"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asset Allocation Chart Section */}
        <section style={{ padding: "16px 0 32px" }}>
          <AssetAllocationChart positions={displayPositions} />
        </section>

        {/* Holdings Table */}
        <section style={{ padding: "0 0 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 className="disp" style={{ margin: 0, fontSize: "22px", fontWeight: 600 }}>
              {isKo ? "보유 주식 명세 (Holdings Ledger)" : "Holdings Ledger"}
            </h2>
            <span className="mono" style={{ fontSize: "12px", color: "#5B5D5A" }}>
              {isKo ? `총 ${displayPositions.length}개 수탁권리 포지션` : `Holding ${displayPositions.length} rights positions`}
            </span>
          </div>

          <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "16px", overflow: "hidden", background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.3fr 1.2fr 1.3fr 1.2fr 180px", padding: "14px 20px", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#9EA09B", background: "#F8F9F7", borderBottom: "1px solid rgba(0,0,0,0.08)" }} className="mono">
              <span>Asset / Symbol</span>
              <span style={{ textAlign: "right" }}>Shares Owned</span>
              <span style={{ textAlign: "right" }}>Price (USD)</span>
              <span style={{ textAlign: "right" }}>Total Value</span>
              <span style={{ textAlign: "right" }}>Unrealized PnL</span>
              <span style={{ textAlign: "right" }}>Management</span>
            </div>

            <div>
              {displayPositions.map((pos) => {
                const sec = displaySecurities.find((s) => s.id === pos.securityId);
                const displayName = isKo ? (sec?.name || pos.securityName) : (sec?.nameEn || pos.securityName);
                const isPos = pos.totalReturnUsd >= 0;
                const valueKrw = Math.round(pos.currentValueUsd * 1380.5);

                return (
                  <div
                    key={pos.id}
                    className="rowh"
                    style={{ display: "grid", gridTemplateColumns: "2.2fr 1.3fr 1.2fr 1.3fr 1.2fr 180px", padding: "18px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", alignItems: "center" }}
                  >
                    {/* Asset Name & Ticker */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#14151A", color: "#C4F542", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }} className="disp">
                        {pos.securitySymbol.slice(0, 1)}
                      </div>
                      <div>
                        <b className="disp" style={{ fontSize: "15.5px", fontWeight: 600, color: "#14151A" }}>{displayName}</b>
                        <div className="mono" style={{ fontSize: "11.5px", color: "#9EA09B", marginTop: "2px" }}>
                          {pos.securitySymbol} · {connected ? "platform projection" : "mock custody"}
                        </div>
                      </div>
                    </div>

                    {/* Shares Owned */}
                    <div className="mono" style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#14151A" }}>
                        {pos.totalShares.toLocaleString()} {isKo ? "주" : "Shs"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#9EA09B", marginTop: "2px" }}>
                        {isKo ? `가용: ${pos.settledShares.toLocaleString()}주` : `Avail: ${pos.settledShares.toLocaleString()}`}
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="mono" style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#14151A" }}>
                        ${pos.currentPriceUsd.toFixed(2)}
                      </div>
                      <div style={{ fontSize: "11px", color: "#9EA09B", marginTop: "2px" }}>
                        ₩{Math.round(pos.currentPriceUsd * 1380.5).toLocaleString()}
                      </div>
                    </div>

                    {/* Total Value */}
                    <div className="mono" style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#14151A" }}>
                        ${pos.currentValueUsd.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "11px", color: "#9EA09B", marginTop: "2px" }}>
                        ₩{valueKrw.toLocaleString()}
                      </div>
                    </div>

                    {/* Unrealized PnL */}
                    <div className="mono" style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: isPos ? "#128A54" : "#E0402C" }}>
                        {isPos ? "+" : ""}${pos.totalReturnUsd.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: isPos ? "#128A54" : "#E0402C", marginTop: "2px" }}>
                        {isPos ? "+" : ""}{pos.totalReturnPercent.toFixed(2)}%
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <Link
                        href={`/investor/orders/new?securityId=${pos.securityId}`}
                        className="mono btn-a"
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          color: "#14151A",
                          background: "#C4F542",
                          padding: "7px 14px",
                          borderRadius: "999px",
                          textDecoration: "none",
                        }}
                      >
                        {isKo ? "거래" : "Trade"}
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          if (!connected) setSelectedPositionForRedemption(pos);
                        }}
                        disabled={connected}
                        title={connected ? "rwa-8th API 환매 명령 연결은 다음 단계에서 진행한다." : undefined}
                        className="mono btn-a"
                        style={{
                          cursor: connected ? "not-allowed" : "pointer",
                          border: "1px solid rgba(0,0,0,0.12)",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          color: connected ? "#9EA09B" : "#14151A",
                          background: connected ? "#F8F9F7" : "#fff",
                          padding: "7px 14px",
                          borderRadius: "999px",
                        }}
                      >
                        {connected ? (isKo ? "환매 준비" : "Redemption") : (isKo ? "상환" : "Redeem")}
                      </button>
                    </div>
                  </div>
                );
              })}
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

      {/* Redemption Modal */}
      {selectedPositionForRedemption && (
        <RedemptionModal
          isOpen={!!selectedPositionForRedemption}
          onClose={() => setSelectedPositionForRedemption(null)}
          position={selectedPositionForRedemption}
          onRedemptionSuccess={() => {
            setSelectedPositionForRedemption(null);
            setRedemptionSuccess(true);
            setTimeout(() => setRedemptionSuccess(false), 5000);
          }}
        />
      )}
    </div>
  );
}
