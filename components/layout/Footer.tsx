import React from "react";
import { ShieldCheck, Landmark, Building2, Globe, FileCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-900/[0.08] mt-16 text-xs text-slate-500 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                Ω
              </div>
              <span className="font-black text-slate-950 tracking-tight">ORAKLE RWA ORDERBOOK DEX</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-lg">
              대한민국 자본시장법 및 전자증권법에 기반한 실물자산(RWA) 토큰화 금융 인프라입니다. 한국예탁결제원(KSD) 외국인통합계좌 및 신한은행 신탁 보관을 통해 1:1 완전 수탁 및 도산격리된 코스피(KOSPI 200) 및 신재생에너지 인프라 자산의 24/7 DVP 2차거래를 지원합니다.
            </p>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">연계 인가 금융기관</span>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-1.5">
                <Landmark className="w-3 h-3 text-blue-600" /> 한국예탁결제원 (KSD 전자등록)
              </li>
              <li className="flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-emerald-600" /> 신한은행 (신탁 수탁 금고)
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-blue-600" /> 하나증권 (KRX 주문 집행)
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-purple-600" /> Wintermute (지정 시장조성)
              </li>
            </ul>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">규제 및 공시</span>
            <ul className="space-y-1.5 text-slate-600">
              <li>외국인 투자등록증(LEI) 인증 정책</li>
              <li>도산격리(Bankruptcy-Remote) 신탁 약관</li>
              <li>T+2 결제 및 환매 위험 고지서</li>
              <li>개인정보 처리방침 및 자금세탁방지(AML)</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-400">
          <p>© 2026 Orakle RWA Financial Operating System. All rights reserved. Registered under FSC Guidelines.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">기준일자: 2026-09-02 KST</span>
            <span className="text-blue-700 font-bold">DEX Latency: 4ms (Live)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
