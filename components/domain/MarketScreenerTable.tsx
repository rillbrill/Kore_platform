"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Security } from "@/types/domain";
import { useApp } from "@/context/AppContext";
import { SparklineChart } from "@/components/domain/SparklineChart";
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface MarketScreenerTableProps {
  securities: Security[];
}

export function MarketScreenerTable({ securities }: MarketScreenerTableProps) {
  const router = useRouter();
  const { language } = useApp();
  const isKo = language === "KO";

  const [activeSector, setActiveSector] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("MARKET_CAP_DESC");
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ "990001": true, "990002": true });

  const sectors = useMemo(() => [
    { id: "ALL", label: isKo ? "전체 (200)" : "All (200)" },
    { id: "반도체", label: isKo ? "반도체 / Tech" : "Semiconductors & Tech" },
    { id: "자동차", label: isKo ? "자동차 / 모빌리티" : "Automotive & Mobility" },
    { id: "2차전지", label: isKo ? "2차전지 / 배터리" : "EV Battery" },
    { id: "바이오", label: isKo ? "바이오 / 헬스케어" : "Biopharma" },
    { id: "인터넷", label: isKo ? "인터넷 / IT" : "Internet & Software" },
    { id: "금융", label: isKo ? "금융 / 지주" : "Financials" },
    { id: "조선", label: isKo ? "중공업 / 방산 / 조선" : "Defense & Shipping" },
    { id: "전력", label: isKo ? "원자력 / 전력" : "Energy & Power" },
    { id: "소재", label: isKo ? "철강 / 소재" : "Steel & Materials" },
  ], [isKo]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = useMemo(() => {
    return securities.filter((s) => {
      const matchesSector =
        activeSector === "ALL" ||
        s.tags.some((t) => t.includes(activeSector) || activeSector.includes(t));

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        s.name.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.symbol.toLowerCase().includes(q) ||
        s.krxCode.includes(q);

      return matchesSector && matchesSearch;
    });
  }, [securities, activeSector, searchQuery]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "CHANGE_DESC":
        return list.sort((a, b) => b.change24h - a.change24h);
      case "CHANGE_ASC":
        return list.sort((a, b) => a.change24h - b.change24h);
      case "PRICE_DESC":
        return list.sort((a, b) => b.krwPrice - a.krwPrice);
      case "PRICE_ASC":
        return list.sort((a, b) => a.krwPrice - b.krwPrice);
      case "DIVIDEND_DESC":
        return list.sort((a, b) => b.dividendYield - a.dividendYield);
      case "NAME_ASC":
        return list.sort((a, b) => (isKo ? a.name.localeCompare(b.name, "ko") : a.nameEn.localeCompare(b.nameEn)));
      case "MARKET_CAP_DESC":
      default:
        return list.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    }
  }, [filtered, sortBy, isKo]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = useMemo(() => {
    if (pageSize >= sorted.length) return sorted;
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Sector Filter Chips */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
        {sectors.map((sec) => {
          const isSelected = activeSector === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setActiveSector(sec.id);
                setCurrentPage(1);
              }}
              className="mono"
              style={{
                cursor: "pointer",
                border: 0,
                fontSize: "11.5px",
                padding: "6px 14px",
                borderRadius: "999px",
                whiteSpace: "nowrap",
                background: isSelected ? "#14151A" : "#EAEBE7",
                color: isSelected ? "#F2F1EC" : "#5B5D5A",
                fontWeight: isSelected ? 600 : 400,
                transition: "all 0.16s",
              }}
            >
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Control Strip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "240px", maxWidth: "360px" }}>
          <Search style={{ width: "14px", height: "14px", color: "#9EA09B", position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={isKo ? "종목명, 티커, KRX 코드 검색..." : "Search name, ticker, KRX code..."}
            className="mono"
            style={{ width: "100%", paddingLeft: "34px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "12.5px", outline: "none" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="mono" style={{ color: "#8A8C88", fontSize: "11px" }}>{isKo ? "정렬:" : "Sort:"}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mono"
              style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", outline: "none", cursor: "pointer" }}
            >
              <option value="MARKET_CAP_DESC">{isKo ? "시가총액 순" : "Market Cap"}</option>
              <option value="CHANGE_DESC">{isKo ? "24H 상승률 순" : "Top Gainers"}</option>
              <option value="CHANGE_ASC">{isKo ? "24H 하락률 순" : "Top Losers"}</option>
              <option value="DIVIDEND_DESC">{isKo ? "배당수익률 순" : "Dividend Yield"}</option>
              <option value="PRICE_DESC">{isKo ? "현재가 높은 순" : "Price (High)"}</option>
              <option value="NAME_ASC">{isKo ? "종목명 가나다순" : "Name (A-Z)"}</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="mono" style={{ color: "#8A8C88", fontSize: "11px" }}>{isKo ? "표시:" : "Show:"}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="mono"
              style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", outline: "none", cursor: "pointer" }}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">{isKo ? "전체 (200)" : "All (200)"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Screener Table */}
      <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "16px", overflow: "hidden", background: "#fff" }}>
        <div style={{ display: "grid", gridTemplateColumns: "36px 2.2fr 1.1fr 1.2fr 1fr 1.1fr 1fr 90px", padding: "12px 16px", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#9EA09B", background: "#F8F9F7", borderBottom: "1px solid rgba(0,0,0,0.08)" }} className="mono">
          <span></span>
          <span>{isKo ? "종목 / 티커 (Asset / Symbol)" : "Asset / Symbol"}</span>
          <span style={{ textAlign: "center" }}>{isKo ? "7일 추세" : "7D Trend"}</span>
          <span style={{ textAlign: "right" }}>{isKo ? "현재가" : "Price"}</span>
          <span style={{ textAlign: "right" }}>24h</span>
          <span style={{ textAlign: "right" }}>{isKo ? "시가총액" : "Market Cap"}</span>
          <span style={{ textAlign: "right" }}>{isKo ? "배당수익률" : "Div Yield"}</span>
          <span></span>
        </div>

        <div>
          {paginated.map((sec) => {
            const isPos = sec.change24h >= 0;
            const isFav = !!favorites[sec.id];
            const displayName = isKo ? sec.name : sec.nameEn;
            const subName = isKo ? sec.nameEn : sec.name;

            return (
              <div
                key={sec.id}
                className="rowh"
                onClick={() => router.push(`/trade?securityId=${sec.id}`)}
                style={{ display: "grid", gridTemplateColumns: "36px 2.2fr 1.1fr 1.2fr 1fr 1.1fr 1fr 90px", padding: "16px", borderBottom: "1px solid rgba(0,0,0,0.06)", alignItems: "center", cursor: "pointer" }}
              >
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(sec.id, e)}
                  style={{ background: "none", border: 0, cursor: "pointer", color: isFav ? "#EAB308" : "#CBD5E1", padding: 0 }}
                >
                  <Star style={{ width: "16px", height: "16px", fill: isFav ? "#EAB308" : "none" }} />
                </button>

                <div>
                  <b className="disp" style={{ fontSize: "15px", fontWeight: 600 }}>{displayName}</b>
                  <span className="mono kr" style={{ fontSize: "11px", color: "#9EA09B", marginLeft: "6px" }}>
                    {subName} · {sec.symbol}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <SparklineChart change24h={sec.change24h} width={80} height={24} />
                </div>

                <div className="mono" style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {isKo ? `₩${sec.krwPrice.toLocaleString()}` : `$${sec.usdPrice.toFixed(2)}`}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#9EA09B" }}>
                    {isKo ? `$${sec.usdPrice.toFixed(2)}` : `₩${sec.krwPrice.toLocaleString()}`}
                  </div>
                </div>

                <span className="mono" style={{ textAlign: "right", fontSize: "14px", fontWeight: 500, color: isPos ? "#128A54" : "#E0402C" }}>
                  {isPos ? "+" : ""}{sec.change24h.toFixed(2)}%
                </span>

                <span className="mono kr" style={{ textAlign: "right", fontSize: "13px", color: "#5B5D5A" }}>
                  {isKo ? sec.marketCapKrw : sec.marketCapUsd}
                </span>

                <span className="mono" style={{ textAlign: "right", fontSize: "13px" }}>
                  {sec.dividendYield}%
                </span>

                <span style={{ textAlign: "right" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "#14151A", background: "#C4F542", padding: "6px 14px", borderRadius: "999px", fontWeight: 600, display: "inline-block" }}>
                    {isKo ? "거래" : "Trade"}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px" }}>
        <span className="mono" style={{ fontSize: "12px", color: "#8A8C88" }}>
          Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} assets
        </span>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="mono"
            style={{
              background: "#EAEBE7",
              border: 0,
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            {isKo ? "이전" : "Prev"}
          </button>
          <span className="mono" style={{ fontSize: "12px", padding: "0 8px" }}>
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="mono"
            style={{
              background: "#EAEBE7",
              border: 0,
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              opacity: currentPage >= totalPages ? 0.5 : 1,
            }}
          >
            {isKo ? "다음" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
