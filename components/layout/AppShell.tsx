"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Search,
  HelpCircle,
  Home,
  TrendingUp,
  ArrowLeftRight,
  Wallet,
  Clock,
  ShieldCheck,
  UserCheck,
  LifeBuoy,
  Menu,
  X,
  LogIn,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { clsx } from "clsx";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setAgentCommandOpen, isLoggedIn, logout, user, language, setLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("nav", "home"), icon: Home },
    { href: "/markets", label: t("nav", "markets"), icon: TrendingUp },
    { href: "/trade", label: t("nav", "trade"), icon: ArrowLeftRight },
    { href: "/portfolio", label: t("nav", "portfolio"), icon: Wallet },
    { href: "/rights", label: t("nav", "rights"), icon: ShieldCheck },
    { href: "/transactions", label: t("nav", "transactions"), icon: Clock },
    { href: "/account", label: t("nav", "account"), icon: UserCheck },
    { href: "/support", label: t("nav", "support"), icon: LifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-slate-900 selection:text-white pb-16 md:pb-0">
      {/* 1. Consumer Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand Logo & Desktop Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded bg-slate-950 text-white font-mono font-bold text-xs flex items-center justify-center tracking-tighter shadow-xs">
                H
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-slate-950 font-sans">
                  Hanchi
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-medium">
                  RWA
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-0.5 text-xs font-medium">
              {navItems.map(({ href, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "px-2.5 py-1.5 rounded-md transition-colors",
                      isActive
                        ? "text-slate-950 font-semibold bg-slate-100"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Compact Nav for Large Screens */}
            <nav className="hidden md:flex xl:hidden items-center gap-0.5 text-xs font-medium">
              {navItems.slice(0, 6).map(({ href, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "px-2 py-1.5 rounded-md transition-colors",
                      isActive
                        ? "text-slate-950 font-semibold bg-slate-100"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Language Switch, Search, Auth / KYC Status */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono">
              <button
                type="button"
                onClick={() => setLanguage("KO")}
                className={clsx(
                  "px-2 py-1 rounded-md text-[11px] font-semibold transition-all",
                  language === "KO"
                    ? "bg-white text-slate-950 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                KO
              </button>
              <button
                type="button"
                onClick={() => setLanguage("EN")}
                className={clsx(
                  "px-2 py-1 rounded-md text-[11px] font-semibold transition-all",
                  language === "EN"
                    ? "bg-white text-slate-950 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                EN
              </button>
            </div>

            {/* Quick Search */}
            <button
              onClick={() => setAgentCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 text-xs font-mono transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === "KO" ? "종목 검색..." : "Search..."}</span>
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] text-slate-500 font-mono">⌘K</kbd>
            </button>

            {/* User Auth / KYC Status */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium transition-colors shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                    {user.name[0]}
                  </div>
                  <span className="hidden sm:inline font-sans text-xs text-slate-900 font-medium">{user.name.split(" ")[0]}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="KYC 승인 완료" />
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs space-y-1 font-sans">
                    <div className="p-2 border-b border-slate-100">
                      <strong className="text-slate-950 block text-xs">{user.name}</strong>
                      <span className="text-slate-400 text-[10.5px] font-mono">{user.foreignInvestorId}</span>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>내 계정 & 투자자 보호</span>
                    </Link>

                    <Link
                      href="/kyc"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>KYC 인증 정보 갱신</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="h-8 px-3 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors inline-flex items-center gap-1 shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>로그인</span>
                </Link>

                <Link
                  href="/register"
                  className="h-8 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors inline-flex items-center gap-1 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>회원가입 / KYC</span>
                </Link>
              </div>
            )}

            {/* Help Assistant */}
            <button
              onClick={() => setAgentCommandOpen(true)}
              className="h-8 px-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-sans font-medium transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">도움말</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (if open) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-1 text-xs">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md font-medium transition-colors",
                    isActive
                      ? "bg-slate-100 text-slate-950 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-rose-600 font-medium py-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 w-full pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center rounded-md border border-slate-200 text-slate-700 font-medium"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center rounded-md bg-slate-900 text-white font-medium"
                  >
                    회원가입 / KYC
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. Main Consumer Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* 3. Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around h-14 px-2">
        {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center justify-center w-14 h-full py-1 text-[10px] font-sans transition-colors",
                isActive ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700"
              )}
            >
              <Icon className={clsx("w-4 h-4 mb-0.5", isActive ? "text-slate-950" : "text-slate-400")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 4. Consumer Footer with Transparent Disclosures */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-xs font-sans text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-900">
                Hanchi · 글로벌 투자자를 위한 한국 주식 수탁 권리 플랫폼
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <Link href="/kyc" className="hover:text-slate-900 transition-colors">
                외국인 적격 투자자 인증 (KYC)
              </Link>
              <Link href="/support" className="hover:text-slate-900 transition-colors">
                고객센터 및 민원 접수
              </Link>
              <Link href="/account" className="hover:text-slate-900 transition-colors">
                투자자 보호 및 위험고지
              </Link>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed max-w-4xl space-y-1">
            <p>
              * 본 플랫폼에서 거래되는 자산은 한국예탁결제원(KSD) 외국인통합계좌 및 공인 신탁사에 1:1 보관된 실물 주식의 수탁 권리(Custodial Rights)입니다.
            </p>
            <p>
              * 투자자는 한국 법률상 주주명부에 직접 기재되지 않으며, 해외 인가 증권사 고객계좌를 통해 배당금 수령 및 경제적 권리를 향유합니다. 시장 가격 및 환율 변동에 따라 원금 손실 위험이 발생할 수 있습니다.
            </p>
          </div>

          <div className="pt-2 text-[10.5px] font-mono text-slate-400">
            © 2026 Hanchi Technologies Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
