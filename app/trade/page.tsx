"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { usePlatform } from "@/context/PlatformContext";
import {
  submitPrimaryOrderCommand,
  submitSecondaryOrderCommand,
} from "@/lib/platform-commands";
import { Security, OrderSide, Order } from "@/types/domain";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { Navbar } from "@/components/ui/Navbar";
import { PreFlightSuitabilityModal } from "@/components/domain/PreFlightSuitabilityModal";
import { AuthorizationSigningModal } from "@/components/domain/AuthorizationSigningModal";
import { ChevronDown, Search } from "lucide-react";
import { clsx } from "clsx";

function TradeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { securities, positions, orders, placeOrder, language, user } = useApp();
  const {
    connected,
    session,
    token,
    profile,
    secondaryQuotes,
    refresh,
  } = usePlatform();
  const isKo = language === "KO";

  const securityIdFromQuery = searchParams.get("securityId");
  const [selectedSecurityId, setSelectedSecurityId] = useState<string>(
    securityIdFromQuery || securities[0]?.id || "990001"
  );

  const [stockDropdownOpen, setStockDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [side, setSide] = useState<OrderSide>("BUY");
  const [orderMode, setOrderMode] = useState<"MARKET" | "LIMIT">("MARKET");
  const [amountKrw, setAmountKrw] = useState<number>(50000);
  const [customPriceUsd, setCustomPriceUsd] = useState<number | null>(null);

  const [timeframe, setTimeframe] = useState<"1H" | "1D" | "1W" | "1M" | "1Y">("1W");
  const [companyTab, setCompanyTab] = useState<"overview" | "financials" | "rwa">("overview");
  const [bottomTab, setBottomTab] = useState<"positions" | "orders" | "history">("positions");

  const [isPreflightOpen, setIsPreflightOpen] = useState(false);
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmittingPlatformOrder, setIsSubmittingPlatformOrder] = useState(false);
  const [platformOrderStatus, setPlatformOrderStatus] = useState<{
    workflowId?: string;
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (securityIdFromQuery) {
      setSelectedSecurityId(securityIdFromQuery);
    }
  }, [securityIdFromQuery]);

  useEffect(() => {
    setCustomPriceUsd(null);
  }, [selectedSecurityId]);

  const currentSecurity = securities.find((s) => s.id === selectedSecurityId) || securities[0];
  const currentPosition = positions.find((p) => p.securityId === currentSecurity.id);
  const currentOrders = orders.filter((o) => o.securityId === currentSecurity.id);
  const selectedQuote = secondaryQuotes.find(
    (quote) =>
      quote.securityId === currentSecurity.id &&
      quote.investorSide === side &&
      quote.fundingMode === "USD_LEDGER" &&
      quote.status === "ACTIVE",
  );
  const quotePriceUsd =
    selectedQuote
      ? Number(selectedQuote.unitPrice.amountMinor) / 10 ** selectedQuote.unitPrice.decimals
      : undefined;

  const priceUsdToUse = quotePriceUsd ?? customPriceUsd ?? currentSecurity.usdPrice;
  const priceKrwToUse = Math.round(priceUsdToUse * 1380.5);

  const calculatedShares = amountKrw > 0 ? parseFloat((amountKrw / priceKrwToUse).toFixed(4)) : 0;
  const platformOrderQuantity = Math.max(1, Math.floor(calculatedShares));
  const feeKrw = Math.max(75, Math.round(amountKrw * 0.0015));
  const platformOrderBlocked =
    connected &&
    (!session?.localSecondaryScenario ||
      !selectedQuote ||
      platformOrderQuantity > Number(selectedQuote.remainingQuantity));
  const canSubmitPrimaryOrder =
    connected &&
    side === "BUY" &&
    Boolean(session?.localPrimaryScenario) &&
    currentSecurity.id === session?.localPrimaryScenario?.securityId;

  const filteredSecurities = securities.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.krxCode.includes(searchQuery)
  );

  const handlePercentagePicker = (pct: number) => {
    const maxBalance = user.usdLedgerBalance * 1380.5;
    const calc = Math.round((maxBalance * pct) / 100);
    setAmountKrw(calc);
  };

  const handleStartOrder = () => {
    if (calculatedShares <= 0) return;
    setIsPreflightOpen(true);
  };

  const handlePreflightPassed = async () => {
    setIsPreflightOpen(false);
    if (connected) {
      if (!session?.localSecondaryScenario || !selectedQuote) {
        setPlatformOrderStatus({
          type: "error",
          message: "현재 조건에 맞는 활성 지정 시장조성자 호가가 없다.",
        });
        return;
      }

      try {
        setIsSubmittingPlatformOrder(true);
        setPlatformOrderStatus({ type: "info", message: "24/7 주문 workflow를 접수하는 중이다." });
        const accepted = await submitSecondaryOrderCommand({
          scenario: session.localSecondaryScenario,
          token,
          profile,
          quote: selectedQuote,
          quantity: platformOrderQuantity,
        });
        await refresh();
        setPlatformOrderStatus({
          type: "success",
          workflowId: accepted.workflowId,
          message: "주문을 접수했다. 체결과 정산 확정은 workflow에서 추적한다.",
        });
      } catch (error) {
        setPlatformOrderStatus({
          type: "error",
          message: error instanceof Error ? error.message : "24/7 주문 접수에 실패했다.",
        });
      } finally {
        setIsSubmittingPlatformOrder(false);
      }
      return;
    }

    const newOrd = placeOrder({
      securityId: currentSecurity.id,
      securitySymbol: currentSecurity.symbol,
      securityName: currentSecurity.name,
      side,
      type: "SECONDARY_OTC",
      quantity: calculatedShares,
      usdPrice: priceUsdToUse,
      krwPrice: priceKrwToUse,
    });

    setCreatedOrder(newOrd);
    setIsSigningOpen(true);
  };

  const handlePrimaryOrder = async () => {
    if (!session?.localPrimaryScenario || !canSubmitPrimaryOrder) return;
    try {
      setIsSubmittingPlatformOrder(true);
      setPlatformOrderStatus({ type: "info", message: "1차 발행 주문 workflow를 접수하는 중이다." });
      const accepted = await submitPrimaryOrderCommand({
        scenario: session.localPrimaryScenario,
        token,
        profile,
        quantity: platformOrderQuantity,
        fundingMode: "USD_LEDGER",
      });
      await refresh();
      setPlatformOrderStatus({
        type: "success",
        workflowId: accepted.workflowId,
        message: "1차 발행 주문을 접수했다. 취합, 모의 KRX 체결, T+2 상태를 workflow에서 확인한다.",
      });
    } catch (error) {
      setPlatformOrderStatus({
        type: "error",
        message: error instanceof Error ? error.message : "1차 발행 주문 접수에 실패했다.",
      });
    } finally {
      setIsSubmittingPlatformOrder(false);
    }
  };

  const handleSigningCompleted = () => {
    setIsSigningOpen(false);
  };

  const asks = [
    { price: Math.round(priceKrwToUse * 1.004), qty: 140, total: 140 * Math.round(priceKrwToUse * 1.004), widthPct: 75 },
    { price: Math.round(priceKrwToUse * 1.003), qty: 95, total: 95 * Math.round(priceKrwToUse * 1.003), widthPct: 52 },
    { price: Math.round(priceKrwToUse * 1.002), qty: 210, total: 210 * Math.round(priceKrwToUse * 1.002), widthPct: 88 },
    { price: Math.round(priceKrwToUse * 1.001), qty: 45, total: 45 * Math.round(priceKrwToUse * 1.001), widthPct: 25 },
  ];

  const bids = [
    { price: Math.round(priceKrwToUse * 0.999), qty: 180, total: 180 * Math.round(priceKrwToUse * 0.999), widthPct: 80 },
    { price: Math.round(priceKrwToUse * 0.998), qty: 320, total: 320 * Math.round(priceKrwToUse * 0.998), widthPct: 95 },
    { price: Math.round(priceKrwToUse * 0.997), qty: 60, total: 60 * Math.round(priceKrwToUse * 0.997), widthPct: 30 },
    { price: Math.round(priceKrwToUse * 0.996), qty: 110, total: 110 * Math.round(priceKrwToUse * 0.996), widthPct: 60 },
  ];

  const buy = side === "BUY";
  const buyTabBg = buy ? "#128A54" : "transparent";
  const buyTabFg = buy ? "#fff" : "#5B5D5A";
  const sellTabBg = !buy ? "#E0402C" : "transparent";
  const sellTabFg = !buy ? "#fff" : "#5B5D5A";
  const ctaBg = buy ? "#128A54" : "#E0402C";
  const ctaFg = "#fff";
  const ctaLabel = connected
    ? buy
      ? isSubmittingPlatformOrder ? "매수 접수 중" : "24/7 매수 접수"
      : isSubmittingPlatformOrder ? "매도 접수 중" : "24/7 매도 접수"
    : buy
      ? (isKo ? "매수 주문 검토 →" : "Review buy order →")
      : (isKo ? "매도 주문 검토 →" : "Review sell order →");

  const displayName = isKo ? currentSecurity.name : currentSecurity.nameEn;
  const subName = isKo ? currentSecurity.nameEn : currentSecurity.name;

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 28px" }}>
        {/* Shared Top Navigation Bar */}
        <Navbar />

        {/* Asset Selector & Live Quote Strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 4px", borderBottom: "1px solid rgba(0,0,0,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#14151A", color: "#C4F542", display: "flex", alignItems: "center", justifyContent: "center" }} className="disp" title={displayName}>
              {currentSecurity.symbol.slice(0, 1)}
            </div>
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setStockDropdownOpen(!stockDropdownOpen)}
                style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
              >
                <span className="disp" style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-.015em" }}>
                  {displayName}
                </span>
                <span className="kr" style={{ fontSize: "15px", color: "#9EA09B" }}>
                  {subName}
                </span>
                <span className="mono" style={{ fontSize: "11px", color: "#128A54", background: "#E0F0E5", padding: "3px 9px", borderRadius: "999px" }}>
                  RWA · 1:1
                </span>
                <ChevronDown style={{ width: "16px", height: "16px", color: "#9EA09B" }} />
              </div>

              <div className="mono" style={{ fontSize: "12px", color: "#9EA09B", marginTop: "3px" }}>
                {currentSecurity.krxCode} · KRX · Token m{currentSecurity.symbol}
              </div>
              {connected && selectedQuote && (
                <div className="mono" style={{ fontSize: "11px", color: "#5B5D5A", marginTop: "3px" }}>
                  Quote {selectedQuote.quoteId.slice(0, 8)} · 잔여 {Number(selectedQuote.remainingQuantity).toLocaleString()}주
                </div>
              )}

              {/* Stock Picker Dropdown */}
              {stockDropdownOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, marginTop: "8px", width: "340px", maxHeight: "380px", background: "#fff", border: "1px solid rgba(0,0,0,.15)", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,.12)", zIndex: 50, padding: "8px", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", padding: "4px", borderBottom: "1px solid rgba(0,0,0,.1)", marginBottom: "4px" }}>
                    <Search style={{ width: "14px", height: "14px", position: "absolute", left: "12px", top: "12px", color: "#9EA09B" }} />
                    <input
                      type="text"
                      placeholder={isKo ? "KOSPI 200 종목 검색..." : "Search KOSPI 200..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mono"
                      style={{ width: "100%", paddingLeft: "28px", paddingRight: "10px", paddingTop: "6px", paddingBottom: "6px", fontSize: "12px", background: "#F1F3F0", border: 0, borderRadius: "6px" }}
                    />
                  </div>
                  <div style={{ overflowY: "auto" }}>
                    {filteredSecurities.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedSecurityId(s.id);
                          setStockDropdownOpen(false);
                        }}
                        style={{ padding: "8px 10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "6px", borderBottom: "1px solid rgba(0,0,0,.04)" }}
                      >
                        <div>
                          <strong style={{ fontSize: "12px", display: "block" }}>{isKo ? s.name : s.nameEn} ({s.symbol})</strong>
                          <span className="mono" style={{ fontSize: "10px", color: "#9EA09B" }}>{s.krxCode}</span>
                        </div>
                        <span className="mono" style={{ fontSize: "12px" }}>₩{s.krwPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
            <div><div className="eyebrow" style={{ fontSize: "9.5px" }}>{isKo ? "현재가" : "Last price"}</div><div className="mono" style={{ fontSize: "24px", fontWeight: 600, marginTop: "2px" }}>₩{currentSecurity.krwPrice.toLocaleString()}</div></div>
            <div><div className="eyebrow" style={{ fontSize: "9.5px" }}>{isKo ? "24H 변동" : "24h change"}</div><div className="mono" style={{ fontSize: "16px", color: currentSecurity.change24h >= 0 ? "#128A54" : "#E0402C", marginTop: "5px" }}>{currentSecurity.change24h >= 0 ? "+" : ""}₩{Math.round(currentSecurity.krwPrice * (currentSecurity.change24h / 100))} &nbsp;{currentSecurity.change24h >= 0 ? "+" : ""}{currentSecurity.change24h.toFixed(2)}%</div></div>
            <div><div className="eyebrow" style={{ fontSize: "9.5px" }}>{isKo ? "고가" : "24h high"}</div><div className="mono" style={{ fontSize: "16px", marginTop: "5px" }}>₩{Math.round(currentSecurity.krwPrice * 1.012).toLocaleString()}</div></div>
            <div><div className="eyebrow" style={{ fontSize: "9.5px" }}>{isKo ? "저가" : "24h low"}</div><div className="mono" style={{ fontSize: "16px", marginTop: "5px" }}>₩{Math.round(currentSecurity.krwPrice * 0.988).toLocaleString()}</div></div>
            <div><div className="eyebrow" style={{ fontSize: "9.5px" }}>{isKo ? "거래대금" : "24h volume"}</div><div className="mono" style={{ fontSize: "16px", marginTop: "5px" }}>₩1.94T</div></div>
          </div>
        </div>

        {/* Terminal Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 268px 340px", gap: 0, borderBottom: "1px solid rgba(0,0,0,.08)" }}>

          {/* Col 1: Chart & Info */}
          <div style={{ borderRight: "1px solid rgba(0,0,0,.08)", padding: "16px 22px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ display: "flex", gap: "3px" }}>
                {(["1H", "1D", "1W", "1M", "1Y"] as const).map((tf) => (
                  <span
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className="mono"
                    style={{
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "6px 11px",
                      borderRadius: "7px",
                      background: timeframe === tf ? "#14151A" : "transparent",
                      color: timeframe === tf ? "#F2F1EC" : "#9EA09B",
                    }}
                  >
                    {tf}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "14px" }} className="mono">
                <span style={{ fontSize: "11px", color: "#9EA09B" }}>O {Math.round(currentSecurity.krwPrice * 0.992).toLocaleString()}</span>
                <span style={{ fontSize: "11px", color: "#9EA09B" }}>H {Math.round(currentSecurity.krwPrice * 1.012).toLocaleString()}</span>
                <span style={{ fontSize: "11px", color: "#9EA09B" }}>L {Math.round(currentSecurity.krwPrice * 0.988).toLocaleString()}</span>
                <span style={{ fontSize: "11px", color: "#128A54" }}>C {currentSecurity.krwPrice.toLocaleString()}</span>
              </div>
            </div>

            <svg width="100%" height="300" viewBox="0 0 820 300" preserveAspectRatio="none">
              <line x1="0" y1="60" x2="820" y2="60" stroke="rgba(0,0,0,.06)" />
              <line x1="0" y1="120" x2="820" y2="120" stroke="rgba(0,0,0,.06)" />
              <line x1="0" y1="180" x2="820" y2="180" stroke="rgba(0,0,0,.06)" />
              <line x1="0" y1="240" x2="820" y2="240" stroke="rgba(0,0,0,.06)" />
              <g strokeWidth="1">
                <line x1="40" y1="150" x2="40" y2="230" stroke="#128A54" /><rect x="32" y="170" width="16" height="45" fill="#128A54" />
                <line x1="90" y1="140" x2="90" y2="200" stroke="#128A54" /><rect x="82" y="155" width="16" height="38" fill="#128A54" />
                <line x1="140" y1="150" x2="140" y2="215" stroke="#E0402C" /><rect x="132" y="165" width="16" height="40" fill="#E0402C" />
                <line x1="190" y1="130" x2="190" y2="190" stroke="#128A54" /><rect x="182" y="145" width="16" height="35" fill="#128A54" />
                <line x1="240" y1="120" x2="240" y2="175" stroke="#128A54" /><rect x="232" y="132" width="16" height="34" fill="#128A54" />
                <line x1="290" y1="135" x2="290" y2="185" stroke="#E0402C" /><rect x="282" y="145" width="16" height="32" fill="#E0402C" />
                <line x1="340" y1="110" x2="340" y2="165" stroke="#128A54" /><rect x="332" y="122" width="16" height="35" fill="#128A54" />
                <line x1="390" y1="100" x2="390" y2="150" stroke="#128A54" /><rect x="382" y="112" width="16" height="30" fill="#128A54" />
                <line x1="440" y1="115" x2="440" y2="165" stroke="#E0402C" /><rect x="432" y="122" width="16" height="34" fill="#E0402C" />
                <line x1="490" y1="95" x2="490" y2="145" stroke="#128A54" /><rect x="482" y="105" width="16" height="30" fill="#128A54" />
                <line x1="540" y1="85" x2="540" y2="130" stroke="#128A54" /><rect x="532" y="95" width="16" height="27" fill="#128A54" />
                <line x1="590" y1="98" x2="590" y2="140" stroke="#E0402C" /><rect x="582" y="105" width="16" height="28" fill="#E0402C" />
                <line x1="640" y1="80" x2="640" y2="122" stroke="#128A54" /><rect x="632" y="90" width="16" height="26" fill="#128A54" />
                <line x1="690" y1="70" x2="690" y2="112" stroke="#128A54" /><rect x="682" y="80" width="16" height="24" fill="#128A54" />
                <line x1="740" y1="82" x2="740" y2="120" stroke="#128A54" /><rect x="732" y="88" width="16" height="24" fill="#128A54" />
                <line x1="790" y1="62" x2="790" y2="100" stroke="#128A54" /><rect x="782" y="70" width="16" height="24" fill="#128A54" />
              </g>
              <line x1="0" y1="70" x2="820" y2="70" stroke="#14151A" strokeDasharray="3 3" strokeWidth="1" />
            </svg>

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px" }} className="mono">
              <span style={{ fontSize: "10.5px", color: "#BEC0BB" }}>Mon</span>
              <span style={{ fontSize: "10.5px", color: "#BEC0BB" }}>Tue</span>
              <span style={{ fontSize: "10.5px", color: "#BEC0BB" }}>Wed</span>
              <span style={{ fontSize: "10.5px", color: "#BEC0BB" }}>Thu</span>
              <span style={{ fontSize: "10.5px", color: "#BEC0BB" }}>Fri</span>
            </div>

            <div style={{ display: "flex", gap: "28px", borderBottom: "1px solid rgba(0,0,0,.08)", marginTop: "26px" }}>
              <span onClick={() => setCompanyTab("overview")} className="disp" style={{ fontSize: "14px", fontWeight: 600, padding: "0 0 12px", borderBottom: companyTab === "overview" ? "2px solid #14151A" : "none", color: companyTab === "overview" ? "#14151A" : "#9EA09B", cursor: "pointer", marginBottom: "-1px" }}>
                {isKo ? "종목 개요 (Overview)" : "Overview"}
              </span>
              <span onClick={() => setCompanyTab("financials")} className="disp" style={{ fontSize: "14px", fontWeight: 500, color: companyTab === "financials" ? "#14151A" : "#9EA09B", cursor: "pointer", padding: "0 0 12px", borderBottom: companyTab === "financials" ? "2px solid #14151A" : "none" }}>
                {isKo ? "재무 지표 (Financials)" : "Financials"}
              </span>
              <span onClick={() => setCompanyTab("rwa")} className="disp" style={{ fontSize: "14px", fontWeight: 500, color: companyTab === "rwa" ? "#14151A" : "#9EA09B", cursor: "pointer", padding: "0 0 12px", borderBottom: companyTab === "rwa" ? "2px solid #14151A" : "none" }}>
                {isKo ? "RWA 법률 수탁 (Legal)" : "The RWA"}
              </span>
            </div>

            <div style={{ paddingTop: "20px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "32px" }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: "8px" }}>{isKo ? "기업 설명" : "What is this company?"}</div>
                <p style={{ margin: "0 0 20px", fontSize: "14.5px", lineHeight: 1.62, color: "#3A3B38" }}>
                  {currentSecurity.description}
                </p>
                <div className="eyebrow" style={{ marginBottom: "12px" }}>{isKo ? "KOSPI 200 위상" : "Why it matters in Korea"}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
                  <div><div className="mono" style={{ fontSize: "19px", fontWeight: 600 }}>24.3%</div><div style={{ fontSize: "11px", color: "#9EA09B", marginTop: "2px" }}>of KOSPI 200</div></div>
                  <div><div className="mono" style={{ fontSize: "19px", fontWeight: 600 }}>#1</div><div style={{ fontSize: "11px", color: "#9EA09B", marginTop: "2px" }}>by market cap</div></div>
                  <div><div className="mono" style={{ fontSize: "19px", fontWeight: 600 }}>54%</div><div style={{ fontSize: "11px", color: "#9EA09B", marginTop: "2px" }}>foreign-owned</div></div>
                </div>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: "12px" }}>{isKo ? "주요 지표" : "Key figures"}</div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(0,0,0,.07)" }}><span style={{ fontSize: "13px", color: "#5B5D5A" }}>{isKo ? "시가총액" : "Market cap"}</span><span className="mono" style={{ fontSize: "13px" }}>{isKo ? currentSecurity.marketCapKrw : currentSecurity.marketCapUsd}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(0,0,0,.07)" }}><span style={{ fontSize: "13px", color: "#5B5D5A" }}>P/E (TTM)</span><span className="mono" style={{ fontSize: "13px" }}>14.8×</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(0,0,0,.07)" }}><span style={{ fontSize: "13px", color: "#5B5D5A" }}>{isKo ? "배당수익률" : "Dividend yield"}</span><span className="mono" style={{ fontSize: "13px" }}>{currentSecurity.dividendYield}%</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0" }}><span style={{ fontSize: "13px", color: "#5B5D5A" }}>{isKo ? "52주 범위" : "52-week range"}</span><span className="mono" style={{ fontSize: "13px" }}>68,300 – 92,800</span></div>
              </div>
            </div>
          </div>

          {/* Col 2: Order Book */}
          <div style={{ borderRight: "1px solid rgba(0,0,0,.08)", padding: "16px 16px 20px" }}>
            <div className="eyebrow" style={{ marginBottom: "14px" }}>{isKo ? "실시간 호가창 (Order book)" : "Order book"}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#BEC0BB", marginBottom: "8px" }} className="mono">
              <span>{isKo ? "호가 (₩)" : "Price (₩)"}</span><span>{isKo ? "잔량" : "Size"}</span><span>{isKo ? "누적" : "Total"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {asks.map((ask, idx) => (
                <div
                  key={`ask-${idx}`}
                  onClick={() => setCustomPriceUsd(parseFloat((ask.price / 1380.5).toFixed(2)))}
                  className="mono"
                  style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "3px 2px", cursor: "pointer" }}
                >
                  <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${ask.widthPct}%`, background: "rgba(224,64,44,.09)" }} />
                  <span style={{ fontSize: "12px", color: "#E0402C", zIndex: 1 }}>{ask.price.toLocaleString()}</span>
                  <span style={{ fontSize: "12px", zIndex: 1 }}>{ask.qty}</span>
                  <span style={{ fontSize: "12px", color: "#9EA09B", zIndex: 1 }}>{ask.total.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", padding: "11px 2px", borderTop: "1px solid rgba(0,0,0,.08)", borderBottom: "1px solid rgba(0,0,0,.08)", margin: "8px 0" }} className="mono">
              <span style={{ fontSize: "18px", fontWeight: 600, color: "#128A54" }}>{priceKrwToUse.toLocaleString()}</span>
              <span style={{ fontSize: "11px", color: "#9EA09B" }}>≈ spread 0.13%</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {bids.map((bid, idx) => (
                <div
                  key={`bid-${idx}`}
                  onClick={() => setCustomPriceUsd(parseFloat((bid.price / 1380.5).toFixed(2)))}
                  className="mono"
                  style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "3px 2px", cursor: "pointer" }}
                >
                  <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${bid.widthPct}%`, background: "rgba(18,138,84,.1)" }} />
                  <span style={{ fontSize: "12px", color: "#128A54", zIndex: 1 }}>{bid.price.toLocaleString()}</span>
                  <span style={{ fontSize: "12px", zIndex: 1 }}>{bid.qty}</span>
                  <span style={{ fontSize: "12px", color: "#9EA09B", zIndex: 1 }}>{bid.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Order Ticket */}
          <div style={{ padding: "16px 20px 22px" }}>
            <div style={{ display: "flex", gap: "4px", background: "#E5E7E3", borderRadius: "10px", padding: "4px", marginBottom: "18px" }}>
              <button onClick={() => setSide("BUY")} style={{ flex: 1, cursor: "pointer", border: 0, fontSize: "13.5px", fontWeight: 600, padding: "10px 0", borderRadius: "7px", background: buyTabBg, color: buyTabFg }}>
                {isKo ? "매수 (Buy)" : "Buy"}
              </button>
              <button onClick={() => setSide("SELL")} style={{ flex: 1, cursor: "pointer", border: 0, fontSize: "13.5px", fontWeight: 600, padding: "10px 0", borderRadius: "7px", background: sellTabBg, color: sellTabFg }}>
                {isKo ? "매도 (Sell)" : "Sell"}
              </button>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
              <span onClick={() => setOrderMode("MARKET")} className="disp" style={{ fontSize: "12.5px", fontWeight: 600, borderBottom: orderMode === "MARKET" ? "2px solid #14151A" : "none", color: orderMode === "MARKET" ? "#14151A" : "#9EA09B", cursor: "pointer", paddingBottom: "6px" }}>
                {isKo ? "시장가 (Market)" : "Market"}
              </span>
              <span onClick={() => setOrderMode("LIMIT")} className="disp" style={{ fontSize: "12.5px", fontWeight: 500, color: orderMode === "LIMIT" ? "#14151A" : "#9EA09B", cursor: "pointer", paddingBottom: "6px" }}>
                {isKo ? "지정가 (Limit)" : "Limit"}
              </span>
            </div>

            <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "7px" }}>{isKo ? "주문 금액 (KRW)" : "Amount (KRW)"}</div>
            <div style={{ border: "1px solid rgba(0,0,0,.16)", borderRadius: "10px", padding: "13px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
              <input
                type="number"
                value={amountKrw}
                onChange={(e) => setAmountKrw(Math.max(0, parseInt(e.target.value) || 0))}
                className="mono"
                style={{ fontSize: "20px", fontWeight: 500, border: 0, outline: "none", width: "100%" }}
              />
              <span style={{ fontSize: "12px", color: "#9EA09B", flexShrink: 0 }}>KRW ▾</span>
            </div>

            <div style={{ display: "flex", gap: "6px", marginTop: "9px" }}>
              {[25, 50, 75, 100].map((pct) => (
                <span
                  key={pct}
                  onClick={() => handlePercentagePicker(pct)}
                  className="mono"
                  style={{ flex: 1, textAlign: "center", fontSize: "11px", color: "#5B5D5A", background: "#E5E7E3", borderRadius: "7px", padding: "6px 0", cursor: "pointer" }}
                >
                  {pct === 100 ? (isKo ? "최대" : "Max") : `${pct}%`}
                </span>
              ))}
            </div>

            <div style={{ textAlign: "center", fontSize: "15px", color: "#BEC0BB", margin: "14px 0" }}>↓</div>

            <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "7px" }}>{isKo ? "수령 예정 토큰 수량" : "You receive"}</div>
            <div style={{ border: "1px solid rgba(0,0,0,.16)", borderRadius: "10px", padding: "13px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
              <span className="mono" style={{ fontSize: "20px", fontWeight: 500 }}>{calculatedShares.toLocaleString()}</span>
              <span style={{ fontSize: "12px", color: "#9EA09B" }}>m{currentSecurity.symbol}</span>
            </div>

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#5B5D5A" }}><span>{isKo ? "추정 체결가" : "Est. price"}</span><span className="mono">₩{priceKrwToUse.toLocaleString()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#5B5D5A" }}><span>{isKo ? "수수료 (0.15%)" : "Fee (0.15%)"}</span><span className="mono">₩{feeKrw.toLocaleString()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#5B5D5A" }}><span>{isKo ? "결제 방식" : "Settlement"}</span><span className="mono">T+0 · on-chain</span></div>
            </div>

            <button
              onClick={handleStartOrder}
              disabled={platformOrderBlocked || isSubmittingPlatformOrder || calculatedShares <= 0}
              className="btn-a"
              style={{
                width: "100%",
                cursor: platformOrderBlocked || isSubmittingPlatformOrder || calculatedShares <= 0 ? "not-allowed" : "pointer",
                border: 0,
                marginTop: "18px",
                fontSize: "14.5px",
                fontWeight: 700,
                color: platformOrderBlocked || isSubmittingPlatformOrder || calculatedShares <= 0 ? "#9EA09B" : ctaFg,
                background: platformOrderBlocked || isSubmittingPlatformOrder || calculatedShares <= 0 ? "#EAEBE7" : ctaBg,
                borderRadius: "10px",
                padding: "14px 0",
              }}
            >
              {ctaLabel}
            </button>

            {connected && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  background:
                    platformOrderStatus?.type === "error"
                      ? "#FFF0F0"
                      : platformOrderStatus?.type === "success"
                        ? "#F0FFF6"
                        : "#F8F9F7",
                  border: "1px solid rgba(0,0,0,.08)",
                  borderRadius: "10px",
                  color:
                    platformOrderStatus?.type === "error"
                      ? "#A03A3A"
                      : "#3A3B38",
                  fontSize: "11.5px",
                  lineHeight: 1.5,
                }}
              >
                {platformOrderStatus?.message ??
                  (selectedQuote
                    ? "API 연결 상태에서는 주문을 즉시 완료로 처리하지 않고 workflow로 접수한다."
                    : "선택 조건에 맞는 활성 quote가 없다. 방향 또는 종목을 바꿔 확인한다.")}
                {platformOrderStatus?.workflowId && (
                  <Link
                    href={`/investor/orders/${platformOrderStatus.workflowId}`}
                    className="mono"
                    style={{ display: "block", marginTop: "6px", color: "#14151A", fontWeight: 700, textDecoration: "underline" }}
                  >
                    workflow 상태 보기
                  </Link>
                )}
              </div>
            )}

            <div style={{ marginTop: "12px", padding: "12px", background: "#EAEBE7", borderRadius: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "#5B5D5A" }}><span>{isKo ? "권리 수량 상태" : `1 m${currentSecurity.symbol} rights`}</span><span className="mono" style={{ color: "#14151A" }}>{isKo ? "projection 기준" : "projection state"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "#5B5D5A", marginTop: "6px" }}><span>{isKo ? "업무 추적" : "Trace"}</span><span style={{ color: "#128A54" }}>{isKo ? "workflow로 확인" : "via workflow"}</span></div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Positions & Recent Trades */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 0, borderBottom: "1px solid rgba(0,0,0,.08)" }}>
          <div style={{ borderRight: "1px solid rgba(0,0,0,.08)", padding: "18px 22px 26px" }}>
            <div style={{ display: "flex", gap: "26px", marginBottom: "16px" }}>
              <span onClick={() => setBottomTab("positions")} className="disp" style={{ fontSize: "14px", fontWeight: 600, borderBottom: bottomTab === "positions" ? "2px solid #14151A" : "none", color: bottomTab === "positions" ? "#14151A" : "#9EA09B", cursor: "pointer", paddingBottom: "10px", marginBottom: "-1px" }}>
                {isKo ? "내 포지션 (Positions)" : "Your position"}
              </span>
              <span onClick={() => setBottomTab("orders")} className="disp" style={{ fontSize: "14px", color: bottomTab === "orders" ? "#14151A" : "#9EA09B", cursor: "pointer" }}>
                {isKo ? "미체결 주문 (Open orders)" : "Open orders"}
              </span>
              <span onClick={() => setBottomTab("history")} className="disp" style={{ fontSize: "14px", color: bottomTab === "history" ? "#14151A" : "#9EA09B", cursor: "pointer" }}>
                {isKo ? "체결 내역 (History)" : "History"}
              </span>
            </div>

            {bottomTab === "positions" ? (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "0 4px 10px", borderBottom: "1px solid rgba(0,0,0,.08)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#BEC0BB" }} className="mono">
                  <span>{isKo ? "종목" : "Asset"}</span><span style={{ textAlign: "right" }}>{isKo ? "수량" : "Qty"}</span><span style={{ textAlign: "right" }}>{isKo ? "평단가" : "Avg cost"}</span><span style={{ textAlign: "right" }}>{isKo ? "평가금액" : "Value"}</span><span style={{ textAlign: "right" }}>{isKo ? "손익" : "P/L"}</span>
                </div>
                {currentPosition ? (
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "14px 4px", alignItems: "center" }}>
                    <span><b className="disp" style={{ fontSize: "14px", fontWeight: 600 }}>m{currentSecurity.symbol}</b> <span className="mono" style={{ fontSize: "11px", color: "#9EA09B" }}>{displayName}</span></span>
                    <span className="mono" style={{ textAlign: "right", fontSize: "13px" }}>{currentPosition.totalShares}</span>
                    <span className="mono" style={{ textAlign: "right", fontSize: "13px" }}>₩{Math.round(currentPosition.avgBuyPriceUsd * 1380.5).toLocaleString()}</span>
                    <span className="mono" style={{ textAlign: "right", fontSize: "13px" }}>₩{Math.round(currentPosition.currentValueUsd * 1380.5).toLocaleString()}</span>
                    <span className="mono" style={{ textAlign: "right", fontSize: "13px", color: currentPosition.totalReturnUsd >= 0 ? "#128A54" : "#E0402C" }}>{currentPosition.totalReturnUsd >= 0 ? "+" : ""}₩{Math.round(currentPosition.totalReturnUsd * 1380.5).toLocaleString()}</span>
                  </div>
                ) : (
                  <div style={{ padding: "24px 0", textAlign: "center", color: "#9EA09B" }} className="mono">{isKo ? `${displayName} 보유 포지션이 없습니다.` : `No active position in ${displayName}.`}</div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {currentOrders.map((o) => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between" }} className="mono">
                    <span style={{ color: o.side === "BUY" ? "#128A54" : "#E0402C" }}>{o.side} {o.quantity} shares</span>
                    <span>₩{o.krwPrice.toLocaleString()}</span>
                    <span style={{ color: "#9EA09B" }}>{o.createdAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: "18px 20px 26px" }}>
            <div className="eyebrow" style={{ marginBottom: "14px" }}>{isKo ? "실시간 체결 (Recent trades)" : "Recent trades"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }} className="mono"><span style={{ fontSize: "12px", color: "#128A54" }}>74,200</span><span style={{ fontSize: "12px" }}>12</span><span style={{ fontSize: "11px", color: "#9EA09B" }}>15:29:58</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }} className="mono"><span style={{ fontSize: "12px", color: "#128A54" }}>74,200</span><span style={{ fontSize: "12px" }}>5</span><span style={{ fontSize: "11px", color: "#9EA09B" }}>15:29:41</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }} className="mono"><span style={{ fontSize: "12px", color: "#E0402C" }}>74,100</span><span style={{ fontSize: "12px" }}>40</span><span style={{ fontSize: "11px", color: "#9EA09B" }}>15:29:12</span></div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <PreFlightSuitabilityModal
          isOpen={isPreflightOpen}
          onClose={() => setIsPreflightOpen(false)}
          onProceedToSigning={handlePreflightPassed}
          security={currentSecurity}
          orderType="SECONDARY_OTC"
          orderSide={side}
          quantity={connected ? platformOrderQuantity : calculatedShares}
          fundingMode="USD_LEDGER"
        />

        <AuthorizationSigningModal
          isOpen={isSigningOpen}
          onClose={() => setIsSigningOpen(false)}
          order={createdOrder}
          security={currentSecurity}
          onSuccess={handleSigningCompleted}
        />

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
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading Trade Terminal...</div>}>
      <TradeContent />
    </Suspense>
  );
}
