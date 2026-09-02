"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Bot,
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Building2,
  Clock,
  Coins,
} from "lucide-react";
import { clsx } from "clsx";

export default function AgentPage() {
  const {
    user,
    securities,
    positions,
    totalPortfolioValueUsd,
    unclaimedDividendsUsd,
    claimDividend,
    placeOrder,
  } = useApp();

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "agent"; text: string; plan?: any }>>([
    {
      role: "agent",
      text: "안녕하세요! 오라클 RWA 자율 금융 에이전트 OS입니다. 코스피 200 청약, 24/7 OTC 주문, 배당금 자동 정산, 외국인 취득 한도 감사 등을 자연어로 실행할 수 있습니다.",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInputQuery("");
    setIsThinking(true);

    setTimeout(() => {
      if (q.includes("배당") || q.includes("dividend")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            text: `고객님의 3분기 미청구 배당금 $${unclaimedDividendsUsd.toFixed(2)} USD에 대해 15% 한-싱 조세협약 원천징수 분리과세 사전 검증을 완료했습니다. 지금 즉시 신한은행 USD 원장으로 일괄 정산하시겠습니까?`,
            plan: { type: "CLAIM_DIVIDEND", amount: unclaimedDividendsUsd },
          },
        ]);
      } else if (q.includes("삼성") || q.includes("005930") || q.includes("dSEC")) {
        const sec = securities.find((s) => s.symbol === "dSEC") || securities[0];
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            text: `삼성전자(KRX 005930) 50주에 대한 사전 규제 감사를 수행했습니다. 외국인 취득한도 여유율 45.8%, 신탁 도산격리 요건 충족. 예상 총 소요액 $3,500.00 USD입니다.`,
            plan: { type: "PLACE_ORDER", security: sec, quantity: 50 },
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            text: `명령을 접수했습니다: "${q}". KSD 외국인통합계좌 실사 규정과 신탁법 적합성 검증 엔진을 구동하여 최적의 DVP 실행 경로를 생성했습니다.`,
          },
        ]);
      }
      setIsThinking(false);
    }, 900);
  };

  const handleExecutePlan = (plan: any) => {
    if (plan.type === "CLAIM_DIVIDEND") {
      claimDividend("ca-1");
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: `배당금 정산이 완결되어 신한은행 USD 원장 잔액이 $${(user.usdLedgerBalance + plan.amount).toFixed(2)} USD로 갱신되었습니다.`,
        },
      ]);
    } else if (plan.type === "PLACE_ORDER") {
      placeOrder({
        type: "SECONDARY_OTC",
        side: "BUY",
        securityId: plan.security.id,
        securitySymbol: plan.security.symbol,
        securityName: plan.security.name,
        quantity: plan.quantity,
        krwPrice: plan.security.krwPrice,
        usdPrice: plan.security.usdPrice,
        fundingMode: "USD_LEDGER",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: `24/7 OTC 매수 주문(${plan.quantity}주)이 체결되었습니다. 포트폴리오 원장에 반영되었습니다.`,
        },
      ]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="teal" size="sm">
              AUTONOMOUS RWA AGENT
            </Badge>
            <span className="text-xs font-mono text-slate-500 font-bold">
              자본시장법 사전 적격성 AI 감사 엔진
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
            에이전트 금융 운영체제 (Agentic Financial OS)
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            외인 취득한도, 도산격리 신탁, 원천징수 세무를 자동으로 계산하며 자연어로 주문을 집행합니다.
          </p>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="h-[480px] overflow-y-auto custom-scrollbar p-5 rounded-2xl dex-card space-y-4 font-mono text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={clsx(
              "p-4 rounded-xl text-xs font-sans leading-relaxed max-w-[85%]",
              m.role === "user"
                ? "bg-sky-600 text-white ml-auto shadow-xs"
                : "bg-slate-50 text-slate-800 border border-slate-200"
            )}
          >
            <div className="flex items-center gap-1.5 mb-1 font-mono text-[10px] text-slate-400">
              {m.role === "agent" ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-sky-700 font-bold">ORAKLE FINANCIAL AGENT</span>
                </>
              ) : (
                <>
                  <span className="text-sky-100 font-bold">INVESTOR</span>
                </>
              )}
            </div>
            <p>{m.text}</p>

            {m.plan && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between font-mono">
                <span className="text-sky-700 text-[11px] font-bold">실행 준비 완료</span>
                <Button
                  variant="buy"
                  size="sm"
                  onClick={() => handleExecutePlan(m.plan)}
                  className="text-xs font-bold"
                >
                  1-Click 승인 및 실행
                </Button>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="p-3 rounded-xl bg-slate-50 text-slate-500 border border-slate-200 flex items-center gap-2 text-xs">
            <Bot className="w-4 h-4 text-sky-600 animate-spin" />
            <span>자본시장법 규제 및 오더북 최선집행 경로 분석 중...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="예: '삼성전자 50주 1차 청약 진행' 또는 '배당금 전액 정산'..."
          className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl py-3.5 pl-4 pr-24 text-xs font-mono focus:outline-none focus:border-sky-600 shadow-inner"
        />
        <div className="absolute right-2 flex items-center gap-1">
          <Button variant="primary" size="md" onClick={() => handleSend()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
