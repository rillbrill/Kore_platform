"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Security } from "@/types/domain";
import { useApp } from "@/context/AppContext";

interface MarketHeatmapTreemapProps {
  securities: Security[];
}

function parseMarketCap(cap: string): number {
  if (!cap) return 100;
  const clean = cap.replace(/[\$,]/g, "").trim();
  if (clean.endsWith("B")) return parseFloat(clean) * 1000;
  if (clean.endsWith("M")) return parseFloat(clean);
  if (clean.endsWith("T")) return parseFloat(clean) * 1000000;
  const val = parseFloat(clean);
  return isNaN(val) ? 100 : val;
}

function getSectorFromTags(tags: string[]): string {
  return tags[1] || tags[0] || "기타";
}

function computeSquarifiedLayout<T extends { value: number }>(
  items: T[],
  x: number,
  y: number,
  w: number,
  h: number
): (T & { x: number; y: number; w: number; h: number })[] {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [{ ...items[0], x, y, w, h }];
  }

  const total = items.reduce((sum, item) => sum + Math.max(item.value, 1), 0);
  const results: (T & { x: number; y: number; w: number; h: number })[] = [];

  let currentX = x;
  let currentY = y;
  let remainingW = w;
  let remainingH = h;
  let remainingItems = [...items];

  while (remainingItems.length > 0) {
    const isHorizontal = remainingW >= remainingH;
    const currentTotal = remainingItems.reduce((sum, item) => sum + Math.max(item.value, 1), 0);

    const rowItems: T[] = [];
    let rowSum = 0;

    while (remainingItems.length > 0) {
      const nextItem = remainingItems[0];
      rowItems.push(nextItem);
      rowSum += Math.max(nextItem.value, 1);
      remainingItems.shift();

      if (rowItems.length >= 4 || remainingItems.length === 0) {
        break;
      }
    }

    const rowRatio = currentTotal > 0 ? rowSum / currentTotal : 1;

    if (isHorizontal) {
      const colWidth = Math.max(remainingW * rowRatio, 1);
      let subY = currentY;

      rowItems.forEach((item) => {
        const itemRatio = rowSum > 0 ? Math.max(item.value, 1) / rowSum : 1 / rowItems.length;
        const itemHeight = Math.max(remainingH * itemRatio, 1);
        results.push({
          ...item,
          x: currentX,
          y: subY,
          w: colWidth,
          h: itemHeight,
        });
        subY += itemHeight;
      });

      currentX += colWidth;
      remainingW = Math.max(remainingW - colWidth, 0);
    } else {
      const rowHeight = Math.max(remainingH * rowRatio, 1);
      let subX = currentX;

      rowItems.forEach((item) => {
        const itemRatio = rowSum > 0 ? Math.max(item.value, 1) / rowSum : 1 / rowItems.length;
        const itemWidth = Math.max(remainingW * itemRatio, 1);
        results.push({
          ...item,
          x: subX,
          y: currentY,
          w: itemWidth,
          h: rowHeight,
        });
        subX += itemWidth;
      });

      currentY += rowHeight;
      remainingH = Math.max(remainingH - rowHeight, 0);
    }
  }

  return results;
}

export function MarketHeatmapTreemap({ securities }: MarketHeatmapTreemapProps) {
  const { language } = useApp();
  const isKo = language === "KO";

  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [hoveredNode, setHoveredNode] = useState<Security | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const layoutWidth = 1200;
  const layoutHeight = 580;

  const sectorGroups = useMemo(() => {
    const map = new Map<string, Security[]>();

    securities.forEach((s) => {
      const sec = getSectorFromTags(s.tags);
      if (selectedSector !== "ALL" && sec !== selectedSector) return;
      if (!map.has(sec)) map.set(sec, []);
      map.get(sec)!.push(s);
    });

    const sectors: { sector: string; value: number; totalValue: number; items: Security[] }[] = [];

    map.forEach((items, sector) => {
      const totalVal = items.reduce((acc, it) => acc + parseMarketCap(it.marketCapUsd), 0);
      sectors.push({
        sector,
        value: totalVal,
        totalValue: totalVal,
        items,
      });
    });

    sectors.sort((a, b) => b.value - a.value);

    return computeSquarifiedLayout(sectors, 0, 0, layoutWidth, layoutHeight);
  }, [securities, selectedSector]);

  const layoutSectors = useMemo(() => {
    return sectorGroups.map((sec) => {
      const headerHeight = 20;
      const padding = 2;
      const innerX = sec.x + padding;
      const innerY = sec.y + headerHeight;
      const innerW = Math.max(sec.w - padding * 2, 10);
      const innerH = Math.max(sec.h - headerHeight - padding * 2, 8);

      const positionedNodes = computeSquarifiedLayout(
        sec.items.map((it: any) => ({ ...it })),
        innerX,
        innerY,
        innerW,
        innerH
      );

      return {
        ...sec,
        nodes: positionedNodes,
      };
    });
  }, [sectorGroups]);

  const getNodeColor = (change24h: number) => {
    if (change24h >= 3.0) return { bg: "#336344", fg: "#f1f7f3" };
    if (change24h >= 1.5) return { bg: "#558466", fg: "#f8faf9" };
    if (change24h >= 0.5) return { bg: "#7fa890", fg: "#0f2416" };
    if (change24h >= 0.1) return { bg: "#b8d6c5", fg: "#142e1d" };
    if (change24h > -0.1 && change24h < 0.1) return { bg: "#cbd5e1", fg: "#334155" };
    if (change24h > -0.5) return { bg: "#ead6d6", fg: "#3b1818" };
    if (change24h > -1.5) return { bg: "#d49999", fg: "#290d0d" };
    if (change24h > -3.0) return { bg: "#b86161", fg: "#fdf6f6" };
    return { bg: "#8c3535", fg: "#fff5f5" };
  };

  const allSectorsList = useMemo(() => {
    const set = new Set<string>();
    securities.forEach((s) => set.add(getSectorFromTags(s.tags)));
    return Array.from(set);
  }, [securities]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", userSelect: "none" }}>
      {/* Heatmap Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", background: "#fff", padding: "12px 18px", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.08)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="mono" style={{ fontSize: "11px", color: "#8A8C88" }}>
            {isKo ? "업종 필터:" : "Sector Filter:"}
          </span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="mono"
            style={{ background: "#F1F3F0", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", outline: "none", cursor: "pointer" }}
          >
            <option value="ALL">{isKo ? "전체 섹터 (200개사)" : "All Sectors (200 Stocks)"}</option>
            {allSectorsList.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="mono" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px" }}>
          <span style={{ color: "#8A8C88" }}>{isKo ? "당일 등락률" : "24h Return"}</span>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <span style={{ background: "#8c3535", color: "#fff", padding: "2px 6px", borderRadius: "3px" }}>-3%</span>
            <span style={{ background: "#d49999", color: "#290d0d", padding: "2px 6px", borderRadius: "3px" }}>-1%</span>
            <span style={{ background: "#cbd5e1", color: "#334155", padding: "2px 6px", borderRadius: "3px" }}>0%</span>
            <span style={{ background: "#7fa890", color: "#0f2416", padding: "2px 6px", borderRadius: "3px" }}>+1%</span>
            <span style={{ background: "#336344", color: "#fff", padding: "2px 6px", borderRadius: "3px" }}>+3%</span>
          </div>
        </div>
      </div>

      {/* Treemap Canvas Container */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "580px",
          background: "#EAEBE7",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.1)",
          padding: "2px",
        }}
      >
        {layoutSectors.map((sectorSec, sIdx) => {
          const sLeft = (sectorSec.x / layoutWidth) * 100;
          const sTop = (sectorSec.y / layoutHeight) * 100;
          const sWidth = (sectorSec.w / layoutWidth) * 100;
          const sHeight = (sectorSec.h / layoutHeight) * 100;

          return (
            <div
              key={`sector-${sIdx}`}
              style={{
                position: "absolute",
                left: `${sLeft}%`,
                top: `${sTop}%`,
                width: `${sWidth}%`,
                height: `${sHeight}%`,
                padding: "1px",
              }}
            >
              <div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,0.03)", borderRadius: "8px", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
                <div style={{ height: "18px", padding: "0 6px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, fontSize: "10px" }} className="mono">
                  <span style={{ fontWeight: 600, color: "#5B5D5A" }}>{sectorSec.sector}</span>
                  <span style={{ color: "#9EA09B" }}>${(sectorSec.totalValue / 1000).toFixed(1)}B</span>
                </div>

                <div style={{ position: "relative", flex: 1, width: "100%", height: "100%", overflow: "hidden" }}>
                  {sectorSec.nodes.map((node: any) => {
                    const nodeLeft = ((node.x - sectorSec.x) / sectorSec.w) * 100;
                    const nodeTop = ((node.y - (sectorSec.y + 20)) / (sectorSec.h - 20)) * 100;
                    const nodeWidth = (node.w / sectorSec.w) * 100;
                    const nodeHeight = (node.h / (sectorSec.h - 20)) * 100;

                    const color = getNodeColor(node.change24h);
                    const isTooSmall = node.w < 48 || node.h < 26;

                    return (
                      <Link
                        key={node.id}
                        href={`/trade?securityId=${node.id}`}
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                        style={{
                          position: "absolute",
                          left: `${nodeLeft}%`,
                          top: `${nodeTop}%`,
                          width: `${nodeWidth}%`,
                          height: `${nodeHeight}%`,
                          padding: "1px",
                          textDecoration: "none",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: color.bg,
                            color: color.fg,
                            borderRadius: "4px",
                            padding: "4px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            transition: "transform 0.16s, box-shadow 0.16s",
                          }}
                        >
                          {!isTooSmall && (
                            <>
                              <span className="disp" style={{ fontWeight: 700, fontSize: node.w > 75 ? "13px" : "11px", lineHeight: 1.1, textAlign: "center" }}>
                                {isKo ? node.name : node.symbol}
                              </span>
                              <span className="mono" style={{ fontSize: "10px", marginTop: "2px", opacity: 0.95 }}>
                                {node.change24h >= 0 ? "+" : ""}{node.change24h.toFixed(1)}%
                              </span>
                            </>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Hover Tooltip Box */}
        {hoveredNode && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              background: "#14151A",
              color: "#F2F1EC",
              padding: "12px 18px",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              zIndex: 60,
              pointerEvents: "none",
            }}
            className="mono"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <strong style={{ fontSize: "14px" }} className="disp">{isKo ? hoveredNode.name : hoveredNode.nameEn} ({hoveredNode.symbol})</strong>
              <span style={{ fontSize: "11px", color: "#C4F542" }}>{hoveredNode.krxCode}</span>
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "6px", fontSize: "12px" }}>
              <span>{isKo ? `현재가: ₩${hoveredNode.krwPrice.toLocaleString()}` : `Price: $${hoveredNode.usdPrice.toFixed(2)}`}</span>
              <span style={{ color: hoveredNode.change24h >= 0 ? "#8BE0A8" : "#FF8A8A" }}>
                24h: {hoveredNode.change24h >= 0 ? "+" : ""}{hoveredNode.change24h.toFixed(2)}%
              </span>
              <span>{isKo ? `시가총액: ${hoveredNode.marketCapKrw}` : `Cap: ${hoveredNode.marketCapUsd}`}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
