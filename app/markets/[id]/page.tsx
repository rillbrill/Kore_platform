"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ViewSwitcher } from "@/components/ui/ViewSwitcher";
import { DigitalCustodyCertificate } from "@/components/domain/DigitalCustodyCertificate";
import { CustodySummaryCard } from "@/components/domain/CustodySummaryCard";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";

export default function SecurityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { securities, language, setLanguage } = useApp();

  const security = securities.find((s) => s.id === resolvedParams.id);
  if (!security) return notFound();

  return (
    <div style={{ minHeight: "100vh", position: "relative", background: "#F1F3F0", color: "#14151A" }}>
      <ViewSwitcher />

      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 40px" }}>
        {/* Navigation Bar */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "82px", borderBottom: "1px solid rgba(0,0,0,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "44px" }}>
            <Link href="/" className="disp" style={{ fontWeight: 700, fontSize: "22px", letterSpacing: "-.02em" }}>
              KORE<span style={{ color: "#14151A", background: "#C4F542", padding: "0 4px", marginLeft: "1px", borderRadius: "3px" }}>.</span>
            </Link>
            <div style={{ display: "flex", gap: "30px" }}>
              <Link href="/markets" className="navlink" style={{ color: "#14151A", fontWeight: 600 }}>Markets</Link>
              <Link href="/trade" className="navlink">Trade</Link>
              <Link href="/portfolio" className="navlink">Portfolio</Link>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setLanguage(language === "KO" ? "EN" : "KO")}
              className="navlink mono"
              style={{ background: "none", border: 0, cursor: "pointer", fontSize: "12px", letterSpacing: ".06em" }}
            >
              {language === "KO" ? "KR · KRW" : "EN · USD"}
            </button>
            <Link href="/account" className="btn-a" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: 600, color: "#14151A", background: "#C4F542", padding: "11px 22px", borderRadius: "999px" }}>
              Deposit
            </Link>
          </div>
        </nav>

        {/* Back Link */}
        <div style={{ padding: "24px 0 12px" }}>
          <Link
            href="/markets"
            className="mono"
            style={{ fontSize: "12px", color: "#8A8C88", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ArrowLeft style={{ width: "14px", height: "14px" }} />
            <span>← Back to markets</span>
          </Link>
        </div>

        {/* Asset Header Strip */}
        <section style={{ padding: "24px 0 32px", borderBottom: "1px solid rgba(0,0,0,.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#14151A", color: "#C4F542", display: "flex", alignItems: "center", justifyContent: "center" }} className="disp font-bold text-xl">
                {security.symbol.slice(0, 1)}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 className="disp" style={{ margin: 0, fontSize: "28px", fontWeight: 600 }}>{security.nameEn}</h1>
                  <span className="kr" style={{ fontSize: "18px", color: "#9EA09B" }}>{security.name}</span>
                  <span className="mono" style={{ fontSize: "11px", color: "#128A54", background: "#E0F0E5", padding: "3px 9px", borderRadius: "999px" }}>
                    RWA · PoC rights
                  </span>
                </div>
                <div className="mono" style={{ fontSize: "12px", color: "#9EA09B", marginTop: "4px" }}>
                  {security.krxCode} · ISIN {security.isin} · Token m{security.symbol}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div className="eyebrow" style={{ fontSize: "9.5px" }}>Last price</div>
                <div className="mono" style={{ fontSize: "28px", fontWeight: 600 }}>₩{security.krwPrice.toLocaleString()}</div>
              </div>
              <Link
                href={`/trade?securityId=${security.id}`}
                className="btn-a"
                style={{ cursor: "pointer", fontSize: "14.5px", fontWeight: 700, color: "#14151A", background: "#C4F542", padding: "14px 28px", borderRadius: "999px" }}
              >
                Trade m{security.symbol} →
              </Link>
            </div>
          </div>
        </section>

        {/* Detailed Sections Grid */}
        <section style={{ padding: "36px 0 80px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: "12px" }}>About {security.nameEn}</div>
            <p style={{ fontSize: "15px", lineHeight: 1.65, color: "#3A3B38", marginBottom: "28px" }}>
              {security.description}
            </p>

            <div className="eyebrow" style={{ marginBottom: "16px" }}>Key Financial Specifications</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              <div style={{ background: "#fff", padding: "18px", borderRadius: "12px", border: "1px solid rgba(0,0,0,.06)" }}>
                <div className="eyebrow" style={{ fontSize: "9.5px", marginBottom: "6px" }}>Market Cap</div>
                <div className="mono" style={{ fontSize: "20px", fontWeight: 600 }}>{security.marketCapKrw}</div>
              </div>
              <div style={{ background: "#fff", padding: "18px", borderRadius: "12px", border: "1px solid rgba(0,0,0,.06)" }}>
                <div className="eyebrow" style={{ fontSize: "9.5px", marginBottom: "6px" }}>Dividend Yield</div>
                <div className="mono" style={{ fontSize: "20px", fontWeight: 600, color: "#128A54" }}>{security.dividendYield}%</div>
              </div>
            </div>

            {/* Rights Evidence Certificate */}
            <div className="eyebrow" style={{ marginBottom: "16px" }}>Rights State & Evidence</div>
            <CustodySummaryCard security={security} />
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: "16px" }}>Digital Evidence Certificate</div>
            <DigitalCustodyCertificate security={security} />
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
