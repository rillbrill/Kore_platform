"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/ui/Navbar";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { LedgerEntry } from "@/types/domain";
import { AuditReceiptModal } from "@/components/domain/AuditReceiptModal";
import { activitiesToLedgerEntries } from "@/lib/platform-view-models";
import { Search, Download, FileCheck, ArrowDownLeft, ArrowUpRight, Coins, CheckCircle2, Copy, Check } from "lucide-react";

export default function TransactionsPage() {
  const { ledgerEntries, language } = useApp();
  const { activities, connected, message, session } = usePlatform();
  const isKo = language === "KO";
  const displayEntries = activitiesToLedgerEntries(activities, ledgerEntries);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedReceipt, setSelectedReceipt] = useState<LedgerEntry | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filters = [
    { id: "ALL", labelKo: "전체 내역", labelEn: "All Activity" },
    { id: "TRADES", labelKo: "매수 / 매도 (Trades)", labelEn: "Secondary Trades" },
    { id: "DIVIDENDS", labelKo: "배당금 수령 (Dividends)", labelEn: "Dividends" },
    { id: "COMPLETED", labelKo: "정산 완결 (Settled DVP)", labelEn: "Settled DVP" },
  ];

  const handleCopyHash = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportStatement = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(displayEntries, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `KORE_Transaction_Statement_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredEntries = useMemo(() => {
    return displayEntries.filter((entry) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        entry.receiptNumber.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.txHash.toLowerCase().includes(q) ||
        (entry.securitySymbol && entry.securitySymbol.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      const isBuy = entry.description.includes("매수") || entry.description.includes("청약") || entry.description.includes("Buy");
      const isDividend = entry.description.includes("배당") || entry.description.includes("Dividend");

      if (activeFilter === "TRADES") return isBuy && !isDividend;
      if (activeFilter === "DIVIDENDS") return isDividend;
      if (activeFilter === "COMPLETED") return entry.status === "CONFIRMED" || entry.status === "RECONCILED";

      return true;
    });
  }, [displayEntries, searchQuery, activeFilter]);

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 40px" }}>
        {/* Shared Top Navigation Bar */}
        <Navbar />

        {/* Hero Header */}
        <section style={{ padding: "40px 0 24px" }}>
          <div className="eyebrow" style={{ marginBottom: "12px" }}>
            {isKo ? "05 — 주문·활동 및 업무 추적" : "05 — ORDER ACTIVITY & WORKFLOW TRACE"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 className="disp" style={{ margin: 0, fontWeight: 500, fontSize: "48px", lineHeight: 1.08, letterSpacing: "-.03em" }}>
                {isKo ? "전체 거래 이력 및" : "Activity history &"}<br />
                <span style={{ color: "#9EA09B" }}>{isKo ? "업무 증거" : "workflow"}</span>{" "}
                <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: "48px" }}>
                  {isKo ? "흐름 확인." : "evidence trail."}
                </span>
              </h1>
              <p style={{ maxWidth: "580px", margin: "14px 0 0", fontSize: "15px", lineHeight: 1.6, color: "#5B5D5A" }}>
                {isKo
                  ? "주문, 권리, 자금, 토큰 활동을 같은 workflow ID로 추적하고 현재 projection 상태를 확인합니다."
                  : "Trace orders, rights, funds, and token activity through shared workflow IDs and current projections."}
              </p>
              <p className="mono" style={{ margin: "10px 0 0", fontSize: "12px", color: connected ? "#128A54" : "#7A5A00" }}>
                {connected
                  ? `${message} · ${session?.projection.projectionAsOf ?? ""}`
                  : isKo
                    ? "rwa-8th API가 꺼져 있어 기존 목업 전표로 표시 중"
                    : "Using local mock receipts until the rwa-8th API is available"}
              </p>
            </div>

            {/* Statement Export Button */}
            <button
              onClick={handleExportStatement}
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
              }}
            >
              <Download style={{ width: "16px", height: "16px" }} />
              {isKo ? "거래 명세서 다운로드 →" : "Export Statement →"}
            </button>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section style={{ paddingBottom: "80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "16px" }}>
            {/* Filter Pills */}
            <div style={{ display: "flex", gap: "6px", background: "#EAEBE7", padding: "4px", borderRadius: "999px" }}>
              {filters.map((f) => {
                const isSelected = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    className="mono"
                    style={{
                      cursor: "pointer",
                      border: 0,
                      fontSize: "12px",
                      padding: "6px 16px",
                      borderRadius: "999px",
                      background: isSelected ? "#14151A" : "transparent",
                      color: isSelected ? "#F2F1EC" : "#5B5D5A",
                      fontWeight: isSelected ? 600 : 400,
                      transition: "all 0.16s",
                    }}
                  >
                    {isKo ? f.labelKo : f.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div style={{ position: "relative", width: "320px" }}>
              <Search style={{ width: "14px", height: "14px", color: "#9EA09B", position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isKo ? "주문 내용, 전표번호 검색..." : "Search receipts, descriptions..."}
                className="mono"
                style={{ width: "100%", paddingLeft: "36px", paddingRight: "14px", paddingTop: "9px", paddingBottom: "9px", background: "#fff", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "999px", fontSize: "12px", outline: "none" }}
              />
            </div>
          </div>

          {/* Activity Table */}
          <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "16px", overflow: "hidden", background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 3.2fr 1.6fr 1.3fr 130px", padding: "14px 20px", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#9EA09B", background: "#F8F9F7", borderBottom: "1px solid rgba(0,0,0,0.08)" }} className="mono">
              <span>Date &amp; Time</span>
              <span>Activity &amp; Details</span>
              <span style={{ textAlign: "right" }}>{connected ? "Workflow" : "Amount (USD / KRW)"}</span>
              <span style={{ textAlign: "right" }}>{connected ? "Record Layer" : "Settlement Status"}</span>
              <span style={{ textAlign: "right" }}>{connected ? "Trace" : "Receipt"}</span>
            </div>

            <div>
              {filteredEntries.map((entry) => {
                const isBuy = entry.description.includes("매수") || entry.description.includes("청약") || entry.description.includes("Buy");
                const isDividend = entry.description.includes("배당") || entry.description.includes("Dividend");
                const approxKrw = Math.round(entry.amountUsd * 1380.5);
                const isCopied = copiedHash === entry.txHash;

                return (
                  <div
                    key={entry.id}
                    className="rowh"
                    onClick={() => setSelectedReceipt(entry)}
                    style={{ display: "grid", gridTemplateColumns: "1.5fr 3.2fr 1.6fr 1.3fr 130px", padding: "18px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", alignItems: "center", cursor: "pointer" }}
                  >
                    {/* Timestamp */}
                    <div className="mono" style={{ fontSize: "12.5px", color: "#5B5D5A" }}>
                      {entry.timestamp}
                    </div>

                    {/* Activity Details */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: isDividend ? "#E0F0E5" : isBuy ? "#14151A" : "#EAEBE7",
                          color: isDividend ? "#128A54" : isBuy ? "#C4F542" : "#14151A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isDividend ? (
                          <Coins style={{ width: "16px", height: "16px" }} />
                        ) : isBuy ? (
                          <ArrowDownLeft style={{ width: "16px", height: "16px" }} />
                        ) : (
                          <ArrowUpRight style={{ width: "16px", height: "16px" }} />
                        )}
                      </div>
                      <div>
                        <b className="disp" style={{ fontSize: "15px", fontWeight: 600, color: "#14151A" }}>
                          {entry.description}
                        </b>
                        <div className="mono" style={{ fontSize: "11px", color: "#9EA09B", marginTop: "2px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{connected ? "event" : entry.receiptNumber}</span>
                          <span>·</span>
                          <span style={{ color: "#128A54" }}>{connected ? "WF" : "TX"}: {entry.txHash.slice(0, 10)}...</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyHash(entry.txHash, e)}
                            style={{ background: "none", border: 0, cursor: "pointer", color: isCopied ? "#128A54" : "#9EA09B", padding: 0 }}
                            title="Copy TX Hash"
                          >
                            {isCopied ? <Check style={{ width: "12px", height: "12px" }} /> : <Copy style={{ width: "12px", height: "12px" }} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Amount USD / KRW */}
                    <div className="mono" style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "14px", color: isDividend ? "#128A54" : "#14151A" }}>
                        {connected ? entry.txHash.slice(0, 8) : `${isDividend ? "+" : "-"}$${entry.amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                      </strong>
                      <div style={{ fontSize: "11px", color: "#9EA09B", marginTop: "2px" }}>
                        {connected ? entry.securitySymbol ?? entry.securityName : `≈ ₩${approxKrw.toLocaleString()} KRW`}
                      </div>
                    </div>

                    {/* Settlement Status */}
                    <div style={{ textAlign: "right" }}>
                      <span className="mono" style={{ fontSize: "11px", color: "#128A54", background: "#E0F0E5", padding: "4px 10px", borderRadius: "999px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 style={{ width: "12px", height: "12px" }} />
                        {connected ? entry.ksdReference : (isKo ? "정산 완결" : "Settled")}
                      </span>
                    </div>

                    {/* View Receipt Button */}
                    <div style={{ textAlign: "right" }}>
                      <span className="mono btn-a" style={{ fontSize: "11.5px", color: "#14151A", background: "#EAEBE7", padding: "7px 14px", borderRadius: "999px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <FileCheck style={{ width: "12px", height: "12px", color: "#5B5D5A" }} />
                        {connected ? (isKo ? "흐름 보기" : "Trace") : (isKo ? "전표 확인" : "View Receipt")}
                      </span>
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

      {/* Audit Receipt Modal */}
      {selectedReceipt && (
        <AuditReceiptModal
          isOpen={!!selectedReceipt}
          entry={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
