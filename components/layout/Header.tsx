"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { InstitutionalRole } from "@/types/domain";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  Building2,
  Clock,
  Landmark,
  Bot,
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  Sparkles,
  Zap,
  Globe2,
  Wallet,
} from "lucide-react";
import { clsx } from "clsx";

export function Header() {
  const pathname = usePathname();
  const {
    selectedRole,
    setSelectedRole,
    user,
    notifications,
    setAgentCommandOpen,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/markets", label: "Market" },
    { href: "/trade", label: "Trade" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/transactions", label: "History" },
    { href: "/testbed", label: "Testbed" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* 1. Top Demo Bar (rwa_demo Signature) */}
      <div className="demo-bar">
        <div className="demo-context">
          <span className="demo-label">ORAKLE</span>
          <span className="hidden sm:inline text-slate-300 font-medium">
            KSD 외국인통합계좌 1:1 수탁 · 원자적 DVP 거래소
          </span>
        </div>

        <div className="demo-controls">
          <label className="text-slate-300">
            <span>관제 역할:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as InstitutionalRole)}
              className="font-bold text-white"
            >
              <option value="INVESTOR">적격 외국인 투자자 (Investor)</option>
              <option value="OVERSEAS_BROKER_OPERATOR">하나증권 글로벌 데스크 (Broker)</option>
              <option value="KSD_OPERATOR">한국예탁결제원 (KSD Custody)</option>
              <option value="TRUSTEE_OPERATOR">신한은행 신탁사업부 (Trustee)</option>
            </select>
          </label>

          <div className="demo-time hidden md:flex text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>24/7 OTC DVP (T+0) 가동 중</span>
          </div>
        </div>
      </div>

      {/* 2. Main Utility Bar (rwa_demo Signature) */}
      <div className="utility-bar">
        {/* Left: Brand & Main Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="brand-mark">
              O
            </div>
            <div className="flex flex-col">
              <strong className="text-sm font-black tracking-tight text-slate-900 leading-none">
                ORAKLE
              </strong>
              <span className="text-[8px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                RWA DEX
              </span>
            </div>
          </Link>

          {/* Nav Links in rwa_demo Style */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-3 py-1.5 rounded-md transition-all font-semibold",
                    isActive
                      ? "text-blue-700 bg-blue-50 font-bold border border-blue-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Balance & Agent Buttons */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setAgentCommandOpen(true)}
            className="search-trigger hidden sm:flex"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>종목, ISIN, 원장 검색...</span>
            <span className="text-[9px] font-mono">⌘K</span>
          </button>

          {/* Account Balance Display */}
          <Link href="/portfolio" className="balance-button hidden sm:grid">
            <span>보유 자산 (USD)</span>
            <strong className="text-slate-950 font-mono font-bold tabular-nums">
              $250,000.00
            </strong>
          </Link>

          {/* Agent Action Button */}
          <button
            onClick={() => setAgentCommandOpen(true)}
            className="primary-button compact font-mono"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI 에이전트 OS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
