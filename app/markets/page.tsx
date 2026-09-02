"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { usePlatform } from "@/context/PlatformContext";
import { Navbar } from "@/components/ui/Navbar";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { MarketScreenerTable } from "@/components/domain/MarketScreenerTable";
import { MarketHeatmapTreemap } from "@/components/domain/MarketHeatmapTreemap";
import { productsToSecurities } from "@/lib/platform-view-models";
import { LayoutGrid, Table } from "lucide-react";

export default function MarketsPage() {
  const { securities, language } = useApp();
  const { connected, products, session, message } = usePlatform();
  const [viewMode, setViewMode] = useState<"table" | "heatmap">("table");
  const isKo = language === "KO";
  const displaySecurities = productsToSecurities(products, securities);
  const representativeCount = products.filter((product) => product.representative).length;
  const enabledCount = products.filter(
    (product) =>
      product.availability.primary === "ENABLED" ||
      product.availability.secondary === "ENABLED" ||
      product.availability.redemption === "ENABLED",
  ).length;

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 40px" }}>
        {/* Unified App Top Navigation */}
        <Navbar />

        {/* Hero Header */}
        <section style={{ padding: "48px 0 32px" }}>
          <div className="eyebrow" style={{ marginBottom: "16px" }}>
            {isKo ? "02 — 시장 · PoC 상품과 KOSPI 200 후보" : "02 — MARKETS · POC PRODUCTS & KOSPI 200 CANDIDATES"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 className="disp" style={{ margin: 0, fontWeight: 500, fontSize: "56px", lineHeight: 1.05, letterSpacing: "-.03em" }}>
                {isKo ? "한국 대표 우량주," : "Korean equities,"}<br />
                <span style={{ color: "#9EA09B" }}>{isKo ? "가능 상태를" : "checked by"}</span>{" "}
                <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: "56px" }}>
                  {isKo ? "먼저 확인." : "platform rules."}
                </span>
              </h1>
              <p style={{ maxWidth: "560px", margin: "16px 0 0", fontSize: "16px", lineHeight: 1.6, color: "#5B5D5A" }}>
                {isKo
                  ? "모의 기준정보, 기능별 가능 여부, 차단 사유를 확인하고 PoC 대표 상품과 거래 불가 후보를 구분합니다."
                  : "Review simulated reference data, functional availability, blocking reasons, and the separation between PoC products and inactive candidates."}
              </p>
              <p className="mono" style={{ margin: "10px 0 0", fontSize: "12px", color: connected ? "#128A54" : "#7A5A00" }}>
                {connected
                  ? `${message} · ${session?.projection.projectionAsOf ?? ""}`
                  : isKo
                    ? "rwa-8th API가 꺼져 있어 기존 목업 데이터로 표시 중"
                    : "Using local mock data until the rwa-8th API is available"}
              </p>
            </div>

            {/* View Mode Switcher Pills */}
            <div style={{ display: "flex", gap: "4px", background: "#E5E7E3", borderRadius: "999px", padding: "4px" }}>
              <button
                onClick={() => setViewMode("table")}
                className="mono"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  border: 0,
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "8px 18px",
                  borderRadius: "999px",
                  background: viewMode === "table" ? "#14151A" : "transparent",
                  color: viewMode === "table" ? "#F2F1EC" : "#8A8C88",
                  transition: "all 0.18s",
                }}
              >
                <Table style={{ width: "14px", height: "14px" }} />
                {isKo ? "목록 스크리너" : "Table View"}
              </button>
              <button
                onClick={() => setViewMode("heatmap")}
                className="mono"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  border: 0,
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "8px 18px",
                  borderRadius: "999px",
                  background: viewMode === "heatmap" ? "#14151A" : "transparent",
                  color: viewMode === "heatmap" ? "#F2F1EC" : "#8A8C88",
                  transition: "all 0.18s",
                }}
              >
                <LayoutGrid style={{ width: "14px", height: "14px" }} />
                {isKo ? "시가총액 트리맵" : "Treemap Heatmap"}
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", marginTop: "36px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,.1)" }}>
            <div>
              <div className="eyebrow" style={{ fontSize: "9.5px", marginBottom: "6px" }}>{isKo ? "코스피 200 시가총액" : "Total KOSPI 200 Cap"}</div>
              <div className="mono" style={{ fontSize: "24px", fontWeight: 600 }}>₩2,480.5T</div>
            </div>
            <div>
              <div className="eyebrow" style={{ fontSize: "9.5px", marginBottom: "6px" }}>{isKo ? "PoC 대표 상품" : "PoC Products"}</div>
              <div className="mono" style={{ fontSize: "24px", fontWeight: 600 }}>{connected ? representativeCount : 1}<span style={{ color: "#9EA09B", fontSize: "15px" }}> demo</span></div>
            </div>
            <div>
              <div className="eyebrow" style={{ fontSize: "9.5px", marginBottom: "6px" }}>{isKo ? "기능 가능 상품" : "Function Enabled"}</div>
              <div className="mono" style={{ fontSize: "24px", fontWeight: 600 }}>{connected ? enabledCount : securities.length}</div>
            </div>
            <div>
              <div className="eyebrow" style={{ fontSize: "9.5px", marginBottom: "6px" }}>{isKo ? "데이터 출처" : "Data Source"}</div>
              <div className="mono" style={{ fontSize: "24px", fontWeight: 600, color: connected ? "#128A54" : "#7A5A00" }}>{connected ? "API" : "MOCK"}</div>
            </div>
          </div>
        </section>

        {/* View Mode Content */}
        <section style={{ padding: "12px 0 80px" }}>
          {viewMode === "table" ? (
            <MarketScreenerTable securities={displaySecurities} />
          ) : (
            <MarketHeatmapTreemap securities={displaySecurities} />
          )}
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
    </div>
  );
}
