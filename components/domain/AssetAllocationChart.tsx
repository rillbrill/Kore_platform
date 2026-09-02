"use client";

import React, { useState } from "react";
import { Position } from "@/types/domain";

export function AssetAllocationChart({ positions }: { positions: Position[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalVal = positions.reduce((acc, p) => acc + p.currentValueUsd, 0) || 1;

  // KORE Brand Palette
  const palette = [
    { color: "#14151A", bgLight: "#14151A", textFg: "#C4F542" }, // Carbon
    { color: "#128A54", bgLight: "#E0F0E5", textFg: "#128A54" }, // Emerald
    { color: "#8A8C88", bgLight: "#EAEBE7", textFg: "#14151A" }, // Stone
    { color: "#2563EB", bgLight: "#EFF6FF", textFg: "#1D4ED8" }, // Blue
    { color: "#7C3AED", bgLight: "#F5F3FF", textFg: "#6D28D9" }, // Violet
    { color: "#D97706", bgLight: "#FEF3C7", textFg: "#B45309" }, // Amber
  ];

  // Donut SVG Calculations using SVG stroke-dasharray (100% robust, zero glitch)
  const RADIUS = 42;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~263.89

  let accumulatedPct = 0;
  const segments = positions.map((p, i) => {
    const pct = Math.max(0, p.currentValueUsd / totalVal);
    const strokeDasharray = `${pct * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const strokeDashoffset = -accumulatedPct * CIRCUMFERENCE;
    accumulatedPct += pct;

    const styleInfo = palette[i % palette.length];

    return {
      symbol: p.securitySymbol,
      name: p.securityName,
      shares: p.totalShares,
      val: p.currentValueUsd,
      pctNum: pct * 100,
      pctStr: (pct * 100).toFixed(1),
      color: styleInfo.color,
      bgLight: styleInfo.bgLight,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSegment = hoveredIdx !== null ? segments[hoveredIdx] : null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "18px",
        padding: "24px",
      }}
      className="font-sans"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          paddingBottom: "14px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 className="disp" style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#14151A" }}>
            보유 자산 포트폴리오 비중 (Asset Allocation)
          </h3>
          <span className="mono" style={{ fontSize: "11.5px", color: "#8A8C88", marginTop: "2px", display: "block" }}>
            KSD 1:1 수탁 실물 증권 기준 자산 배분 현황
          </span>
        </div>

        <span className="mono" style={{ fontSize: "11px", color: "#128A54", background: "#E0F0E5", padding: "4px 12px", borderRadius: "999px", fontWeight: 600 }}>
          ✓ KSD 도산격리 100%
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "32px", alignItems: "center" }}>
        {/* SVG Donut Ring */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <svg viewBox="0 0 120 120" style={{ width: "200px", height: "200px", transform: "rotate(-90deg)", overflow: "visible" }}>
            {/* Background Base Ring */}
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#F1F3F0" strokeWidth="16" />

            {/* Segment Rings */}
            {segments.map((seg, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <circle
                  key={idx}
                  cx="60"
                  cy="60"
                  r={RADIUS}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHovered ? 20 : 16}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="butt"
                  style={{
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    opacity: hoveredIdx === null ? 1 : isHovered ? 1 : 0.35,
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Text Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              textAlign: "center",
            }}
          >
            {activeSegment ? (
              <>
                <span className="mono" style={{ fontSize: "11px", color: "#8A8C88", fontWeight: 600 }}>
                  {activeSegment.symbol}
                </span>
                <span className="mono" style={{ fontSize: "22px", fontWeight: 700, color: "#14151A", lineHeight: 1.1 }}>
                  {activeSegment.pctStr}%
                </span>
                <span className="mono" style={{ fontSize: "11px", color: "#128A54", marginTop: "2px" }}>
                  ${activeSegment.val.toLocaleString()}
                </span>
              </>
            ) : (
              <>
                <span className="eyebrow" style={{ fontSize: "9.5px", color: "#8A8C88" }}>
                  총 평가 자산
                </span>
                <span className="mono" style={{ fontSize: "18px", fontWeight: 700, color: "#14151A", lineHeight: 1.2 }}>
                  ${totalVal.toLocaleString()}
                </span>
                <span className="mono" style={{ fontSize: "10.5px", color: "#128A54", marginTop: "2px" }}>
                  {positions.length}개 KOSPI 종목
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend List Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} className="mono">
          {segments.map((seg, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: isHovered ? "1px solid #14151A" : "1px solid rgba(0,0,0,0.06)",
                  background: isHovered ? "#F8F9F7" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.16s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "3px",
                      background: seg.color,
                      display: "inline-block",
                    }}
                  />
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#14151A" }}>{seg.name}</span>
                    <span style={{ fontSize: "11px", color: "#8A8C88", marginLeft: "6px" }}>({seg.symbol})</span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#14151A" }}>{seg.pctStr}%</span>
                  <span style={{ fontSize: "11px", color: "#8A8C88", marginLeft: "8px" }}>${seg.val.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
