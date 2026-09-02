"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export function LandingNavbar() {
  const pathname = usePathname();
  const { language, setLanguage, setCurrencyPreference } = useApp();
  const isKo = language === "KO";

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
      <div style={{ display: "flex", alignItems: "center", gap: "44px" }}>
        {/* Brand Logo - Navigates to / (Landing Page) */}
        <Link href="/" className="disp" style={{ fontWeight: 700, fontSize: "22px", letterSpacing: "-.02em", textDecoration: "none", color: "#14151A" }}>
          KORE<span style={{ color: "#14151A", background: "#C4F542", padding: "0 4px", marginLeft: "1px", borderRadius: "3px" }}>.</span>
        </Link>

        {/* Marketing / Info Navigation Links */}
        <div style={{ display: "flex", gap: "28px" }}>
          <Link
            href="/support"
            className="navlink"
            style={{
              color: pathname === "/support" ? "#14151A" : "#5B5D5A",
              fontWeight: pathname === "/support" ? 700 : 500,
              fontSize: "14px",
              textDecoration: "none",
              borderBottom: pathname === "/support" ? "2px solid #14151A" : "2px solid transparent",
              paddingBottom: "4px",
              transition: "all 0.16s",
            }}
          >
            {isKo ? "작동 방식 (How it works)" : "How it works"}
          </Link>
          <Link
            href="/rights"
            className="navlink"
            style={{
              color: pathname === "/rights" ? "#14151A" : "#5B5D5A",
              fontWeight: pathname === "/rights" ? 700 : 500,
              fontSize: "14px",
              textDecoration: "none",
              borderBottom: pathname === "/rights" ? "2px solid #14151A" : "2px solid transparent",
              paddingBottom: "4px",
              transition: "all 0.16s",
            }}
          >
            {isKo ? "예탁원 수탁 & 법률 (Custody)" : "Custody & Legal"}
          </Link>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button
          onClick={toggleLang}
          className="navlink mono"
          style={{
            background: "#E2E5DF",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "999px",
            cursor: "pointer",
            fontSize: "11.5px",
            fontWeight: 700,
            padding: "6px 14px",
            letterSpacing: ".04em",
            color: "#14151A",
          }}
        >
          {isKo ? "🇰🇷 KR · KRW" : "🇺🇸 EN · USD"}
        </button>
        <Link
          href="/trade"
          className="btn-a"
          style={{
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: 700,
            color: "#14151A",
            background: "#C4F542",
            padding: "11px 22px",
            borderRadius: "999px",
            textDecoration: "none",
          }}
        >
          {isKo ? "앱 가동하기 (Launch app) →" : "Launch app →"}
        </Link>
      </div>
    </nav>
  );
}
