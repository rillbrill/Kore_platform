"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { usePlatform } from "@/context/PlatformContext";
import { type DemoProfile } from "@/lib/platform-api";
import { ChevronDown, ShieldCheck } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, setCurrencyPreference } = useApp();
  const { connected, error, loading, profile, setProfile, refresh, session } = usePlatform();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isKo = language === "KO";

  const navLinks = [
    { href: "/investor/markets", label: isKo ? "시장" : "Markets", activePattern: "/investor/markets" },
    { href: "/investor/orders/new", label: isKo ? "주문" : "Orders", activePattern: "/investor/orders" },
    { href: "/investor/positions", label: isKo ? "보유" : "Positions", activePattern: "/investor/positions" },
    { href: "/investor/activities", label: isKo ? "주문·활동" : "Activities", activePattern: "/investor/activities" },
    { href: "/investor/rights", label: isKo ? "권리" : "Rights", activePattern: "/investor/rights" },
    { href: "/investor/support", label: isKo ? "지원" : "Support", activePattern: "/investor/support" },
  ];

  const profiles: { profile: DemoProfile; labelKo: string; labelEn: string }[] = [
    { profile: "investorA", labelKo: "허용 고객 A", labelEn: "Allowed Investor A" },
    { profile: "investorB", labelKo: "허용 고객 B", labelEn: "Allowed Investor B" },
    { profile: "denied", labelKo: "거절 고객", labelEn: "Denied Investor" },
    { profile: "expired", labelKo: "만료 고객", labelEn: "Expired Investor" },
  ];
  const currentProfile = profiles.find((item) => item.profile === profile) ?? profiles[0];

  const toggleLang = () => {
    if (language === "KO") {
      setLanguage("EN");
      setCurrencyPreference("USD");
    } else {
      setLanguage("KO");
      setCurrencyPreference("KRW");
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "82px",
        borderBottom: "1px solid rgba(0,0,0,.08)",
        background: "transparent",
        position: "relative",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <Link href="/investor" className="disp" style={{ fontWeight: 700, fontSize: "22px", letterSpacing: "-.02em", textDecoration: "none", color: "#14151A" }}>
          KORE<span style={{ color: "#14151A", background: "#C4F542", padding: "0 4px", marginLeft: "1px", borderRadius: "3px" }}>.</span>
        </Link>

        <div style={{ display: "flex", gap: "24px" }}>
          {navLinks.map((link) => {
            const legacyActive =
              (link.href === "/investor/markets" && pathname.startsWith("/markets")) ||
              (link.href === "/investor/orders/new" && pathname.startsWith("/trade")) ||
              (link.href === "/investor/positions" && pathname.startsWith("/portfolio")) ||
              (link.href === "/investor/activities" && pathname.startsWith("/transactions")) ||
              (link.href === "/investor/rights" && pathname.startsWith("/rights")) ||
              (link.href === "/investor/support" && pathname.startsWith("/support"));
            const isActive =
              pathname === link.href || pathname.startsWith(link.activePattern) || legacyActive;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="navlink"
                style={{
                  color: isActive ? "#14151A" : "#8A8C88",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "14px",
                  textDecoration: "none",
                  borderBottom: isActive ? "2px solid #14151A" : "2px solid transparent",
                  paddingBottom: "4px",
                  transition: "all 0.16s",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mono"
          title={error ?? (connected ? "rwa-8th API connected" : "rwa-8th API unavailable")}
          style={{
            background: connected ? "#E0F0E5" : "#FFF4D6",
            color: connected ? "#128A54" : "#7A5A00",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "999px",
            padding: "6px 12px",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "API 확인 중" : connected ? "rwa-8th 연결" : "목업 유지"}
        </button>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="mono"
            style={{
              background: "#EAEBE7",
              color: "#14151A",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "999px",
              padding: "6px 14px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldCheck style={{ width: "13px", height: "13px", color: "#128A54" }} />
            <span>{isKo ? currentProfile.labelKo : currentProfile.labelEn}</span>
            <ChevronDown style={{ width: "12px", height: "12px" }} />
          </button>

          {profileMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "6px",
                background: "#14151A",
                color: "#F2F1EC",
                borderRadius: "12px",
                padding: "8px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                width: "250px",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
              className="mono"
            >
              <div style={{ fontSize: "10px", color: "#8A8C88", padding: "6px 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {isKo ? "합성 투자자 프로필" : "Synthetic investor profile"}
              </div>
              {profiles.map((item) => (
                <button
                  key={item.profile}
                  onClick={() => {
                    setProfile(item.profile);
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    background: profile === item.profile ? "#C4F542" : "transparent",
                    color: profile === item.profile ? "#14151A" : "#F2F1EC",
                    border: 0,
                    borderRadius: "6px",
                    padding: "8px 10px",
                    textAlign: "left",
                    fontSize: "11.5px",
                    cursor: "pointer",
                    fontWeight: profile === item.profile ? 700 : 400,
                  }}
                >
                  {isKo ? item.labelKo : item.labelEn}
                </button>
              ))}
              {session?.projection ? (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: "6px", padding: "8px", fontSize: "10.5px", color: "#9EA09B" }}>
                  projection {session.projection.projectionStatus} · seq {session.projection.lastEventSequence}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Language & Currency Toggle */}
        <button
          onClick={toggleLang}
          className="navlink mono"
          style={{
            background: "#EAEBE7",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "999px",
            cursor: "pointer",
            fontSize: "11.5px",
            fontWeight: 700,
            padding: "6px 14px",
            color: "#14151A",
          }}
        >
          {isKo ? "KO · KRW" : "EN · USD"}
        </button>

        <Link
          href="/investor/onboarding"
          className="btn-a"
          style={{
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 700,
            color: "#14151A",
            background: "#C4F542",
            padding: "10px 20px",
            borderRadius: "999px",
            textDecoration: "none",
          }}
        >
          {isKo ? "계정 준비" : "Readiness"}
        </Link>
      </div>
    </nav>
  );
}
