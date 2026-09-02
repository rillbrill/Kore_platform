"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bot,
  ClipboardCheck,
  DatabaseZap,
  Landmark,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { clsx } from "clsx";

const consoleNavItems = [
  {
    href: "/console",
    label: "콘솔 홈",
    eyebrow: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/settlement",
    label: "정산 운영",
    eyebrow: "Broker/Ops",
    icon: Activity,
  },
  {
    href: "/compliance",
    label: "감사·규제",
    eyebrow: "Compliance",
    icon: ClipboardCheck,
  },
  {
    href: "/agent",
    label: "운영 에이전트",
    eyebrow: "Ops AI",
    icon: Bot,
  },
  {
    href: "/testbed",
    label: "시스템 검증",
    eyebrow: "Lab",
    icon: DatabaseZap,
  },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/console" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[11px] font-bold text-slate-950">
              H
            </div>
            <div>
              <strong className="block text-sm font-semibold leading-none tracking-tight">
                Hanchi Console
              </strong>
              <span className="text-[10px] text-slate-500">
                Institutional operations
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-2 text-[11px] text-slate-400 md:flex">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              운영 시스템 정상
            </span>
            <Link
              href="/"
              className="rounded-md border border-slate-700 px-2.5 py-1 text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
            >
              소비자 앱으로
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-slate-800 bg-slate-950 px-3 py-3 md:min-h-[calc(100dvh-3.5rem)] md:border-b-0 md:border-r">
          <div className="mb-3 hidden px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 md:block">
            Role Consoles
          </div>
          <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {consoleNavItems.map(({ href, label, eyebrow, icon: Icon }) => {
              const isActive = href === "/console" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex min-w-max items-center gap-2 rounded-md px-2.5 py-2 text-xs transition-colors md:min-w-0",
                    isActive
                      ? "border border-slate-700 bg-slate-900 text-white"
                      : "text-slate-400 hover:bg-slate-900/70 hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">{label}</span>
                    <span className="hidden text-[10px] text-slate-500 md:block">{eyebrow}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 hidden rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[11px] leading-relaxed text-slate-400 md:block">
            <div className="mb-2 flex items-center gap-1.5 font-semibold text-slate-200">
              <Landmark className="h-3.5 w-3.5" />
              책임 분리
            </div>
            소비자 화면은 투자 행동 중심으로 유지하고, 기관 정산·수탁·감사 상태는 이 콘솔에서 관리합니다.
          </div>
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-6 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
