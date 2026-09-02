"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { LandingNavbar } from "@/components/ui/LandingNavbar";

export default function LandingPage() {
  const router = useRouter();
  const { securities, language, setLanguage } = useApp();
  const isKo = language === "KO";

  const featured = securities.slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#EAECE7", color: "#14151A" }}>
      {/* Floating View Switcher */}
      <ViewSwitcher />

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 40px" }}>
        {/* Landing Page Top Navigation Bar */}
        <LandingNavbar />

        {/* Hero Section */}
        <section style={{ padding: "88px 0 64px", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "56px", alignItems: "end" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: "26px" }}>Real-world assets · Seoul → Global</div>
              <h1 className="disp" style={{ margin: 0, fontWeight: 500, fontSize: "92px", lineHeight: 1.04, letterSpacing: "-.035em" }}>
                Korean equities,<br />
                <span style={{ color: "#9EA09B" }}>tokenized</span>{" "}
                <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: "92px" }}>for the world.</span>
              </h1>
              <p style={{ maxWidth: "520px", margin: "34px 0 0", fontSize: "17px", lineHeight: 1.62, color: "#5B5D5A" }}>
                Own the KOSPI 200 as 1:1 on-chain shares. Regulated custody in Korea, instant settlement everywhere — the bridge between the world's most advanced manufacturers and global capital.
              </p>
              <div style={{ display: "flex", gap: "14px", marginTop: "38px" }}>
                <Link href="/markets" className="btn-a" style={{ cursor: "pointer", fontSize: "14.5px", fontWeight: 600, color: "#14151A", background: "#C4F542", padding: "15px 30px", borderRadius: "999px", textDecoration: "none" }}>
                  Explore markets →
                </Link>
                <Link href="/rights" className="btn-a" style={{ cursor: "pointer", fontSize: "14.5px", fontWeight: 500, color: "#14151A", border: "1px solid rgba(0,0,0,.2)", padding: "15px 30px", borderRadius: "999px", textDecoration: "none" }}>
                  How custody works
                </Link>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(0,0,0,.14)" }}>
              <div className="rowh" style={{ padding: "22px 0", borderBottom: "1px solid rgba(0,0,0,.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "4px" }}>Custodian</div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>Korea Securities Depository (KSD)</div>
                </div>
                <span className="mono" style={{ fontSize: "12px", color: "#128A54" }}>1:1 Omnibus</span>
              </div>
              <div className="rowh" style={{ padding: "22px 0", borderBottom: "1px solid rgba(0,0,0,.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "4px" }}>Legal structure</div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>Trust Act Art. 22 Bankruptcy-Remote</div>
                </div>
                <span className="mono" style={{ fontSize: "12px", color: "#128A54" }}>Statutory Lock</span>
              </div>
              <div className="rowh" style={{ padding: "22px 0", borderBottom: "1px solid rgba(0,0,0,.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "4px" }}>Trading currency</div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>USD Fiat Ledger / USDC On-Chain</div>
                </div>
                <span className="mono" style={{ fontSize: "12px", color: "#14151A" }}>Instant FX</span>
              </div>
              <div className="rowh" style={{ padding: "22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "4px" }}>Dividends</div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>Cash paid directly in USD/USDC</div>
                </div>
                <span className="mono" style={{ fontSize: "12px", color: "#128A54" }}>Pass-Through</span>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Ticker Tape */}
        <section style={{ margin: "40px -40px 80px", background: "#14151A", color: "#F2F1EC", padding: "18px 0", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "40px", whiteSpace: "nowrap", animation: "marq 35s linear infinite" }}>
            {securities.slice(0, 15).concat(securities.slice(0, 15)).map((s, idx) => (
              <div key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontWeight: 600 }} className="disp">{s.nameEn} ({s.symbol})</span>
                <span className="mono" style={{ fontSize: "13px" }}>₩{s.krwPrice.toLocaleString()}</span>
                <span className="mono" style={{ fontSize: "12px", color: s.change24h >= 0 ? "#C4F542" : "#FF6B6B" }}>
                  {s.change24h >= 0 ? "+" : ""}{s.change24h.toFixed(2)}%
                </span>
                <span style={{ opacity: .3 }}>·</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stat Grid */}
        <section style={{ padding: "0 0 100px", borderBottom: "1px solid rgba(0,0,0,.1)" }}>
          <div className="eyebrow" style={{ marginBottom: "28px" }}>Platform statistics</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            <div>
              <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "8px" }}>Total custody value</div>
              <div className="mono" style={{ fontSize: "44px", fontWeight: 500, letterSpacing: "-.02em" }}>₩8.42T</div>
              <div style={{ fontSize: "13px", color: "#5B5D5A", marginTop: "6px" }}>Backed 1:1 at KSD</div>
            </div>
            <div>
              <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "8px" }}>Tokenized issuers</div>
              <div className="mono" style={{ fontSize: "44px", fontWeight: 500, letterSpacing: "-.02em" }}>200</div>
              <div style={{ fontSize: "13px", color: "#5B5D5A", marginTop: "6px" }}>Entire KOSPI 200 universe</div>
            </div>
            <div>
              <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "8px" }}>24h Trading volume</div>
              <div className="mono" style={{ fontSize: "44px", fontWeight: 500, letterSpacing: "-.02em" }}>$42.8M</div>
              <div style={{ fontSize: "13px", color: "#5B5D5A", marginTop: "6px" }}>Institutional liquidity</div>
            </div>
            <div>
              <div className="eyebrow" style={{ fontSize: "10px", marginBottom: "8px" }}>Attestation audit</div>
              <div className="mono" style={{ fontSize: "44px", fontWeight: 500, letterSpacing: "-.02em", color: "#128A54" }}>Daily</div>
              <div style={{ fontSize: "13px", color: "#5B5D5A", marginTop: "6px" }}>Samil PwC &amp; EY verified</div>
            </div>
          </div>
        </section>

        {/* Most Traded Today Table */}
        <section style={{ padding: "90px 0 120px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: "10px" }}>Most traded today</div>
              <h2 className="disp" style={{ margin: 0, fontSize: "42px", fontWeight: 500, letterSpacing: "-.02em" }}>
                Korea's tech &amp; industrial titans.
              </h2>
            </div>
            <Link href="/markets" className="navlink mono" style={{ fontSize: "14px" }}>
              View all 200 markets →
            </Link>
          </div>

          <div style={{ borderTop: "2px solid #14151A" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr 120px", padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,.15)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5B5D5A" }} className="mono">
              <span>Security</span>
              <span style={{ textAlign: "right" }}>Price (KRW / USD)</span>
              <span style={{ textAlign: "right" }}>24h Change</span>
              <span style={{ textAlign: "right" }}>24h Volume</span>
              <span></span>
            </div>

            {featured.map((s) => (
              <div
                key={s.id}
                className="rowh"
                onClick={() => router.push(`/trade?securityId=${s.id}`)}
                style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr 120px", padding: "24px 0", borderBottom: "1px solid rgba(0,0,0,.08)", alignItems: "center", cursor: "pointer" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <b className="disp" style={{ fontSize: "20px", fontWeight: 600 }}>{s.nameEn}</b>
                    <span className="mono kr" style={{ fontSize: "13px", color: "#5B5D5A" }}>{s.name}</span>
                    <span className="mono" style={{ fontSize: "11px", color: "#128A54", background: "#E0F0E5", padding: "3px 9px", borderRadius: "999px" }}>
                      1:1 KSD
                    </span>
                  </div>
                  <div className="mono" style={{ fontSize: "12px", color: "#9EA09B", marginTop: "4px" }}>
                    {s.symbol} · KRX {s.krxCode}
                  </div>
                </div>

                <div className="mono" style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "18px", fontWeight: 500 }}>₩{s.krwPrice.toLocaleString()}</div>
                  <div style={{ fontSize: "12px", color: "#9EA09B" }}>${s.usdPrice.toFixed(2)}</div>
                </div>

                <div className="mono" style={{ textAlign: "right", fontSize: "17px", fontWeight: 500, color: s.change24h >= 0 ? "#128A54" : "#E0402C" }}>
                  {s.change24h >= 0 ? "+" : ""}{s.change24h.toFixed(2)}%
                </div>

                <div className="mono" style={{ textAlign: "right", fontSize: "15px", color: "#5B5D5A" }}>
                  {s.volume24hUsd}
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className="btn-a mono" style={{ fontSize: "12.5px", fontWeight: 600, color: "#14151A", background: "#C4F542", padding: "8px 18px", borderRadius: "999px", display: "inline-block" }}>
                    Trade
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(0,0,0,.1)", padding: "40px 0 80px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: "13px", color: "#5B5D5A" }}>© 2026 KORE Markets Inc. Regulated under Korea FSC Sandbox.</span>
          <div style={{ display: "flex", gap: "32px" }}>
            <Link href="/rights" className="navlink mono" style={{ fontSize: "13px" }}>Disclosures</Link>
            <Link href="/rights" className="navlink mono" style={{ fontSize: "13px" }}>Custody framework</Link>
            <Link href="/support" className="navlink mono" style={{ fontSize: "13px" }}>Institutional API</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
