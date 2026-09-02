"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import {
  HelpCircle,
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
  Coins,
  ArrowLeftRight,
} from "lucide-react";
import { clsx } from "clsx";

export function AgentCommandCenter() {
  const {
    agentCommandOpen,
    setAgentCommandOpen,
    securities,
    unclaimedDividendsUsd,
  } = useApp();

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "agent"; text: string; link?: { label: string; href: string } }>
  >([
    {
      role: "agent",
      text: "안녕하세요! Hanchi 투자 가이드 도우미입니다. 한국 주식 수탁 권리(RWA)의 법적 구조, 배당금 수령 방법, 주문 경로 안내 등 궁금하신 점을 편하게 질문해주세요.",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!agentCommandOpen) return null;

  const quickPrompts = [
    "내가 보유하는 주식 권리는 법적으로 어떻게 보호되나요?",
    "배당금은 언제, 어떻게 수령하나요?",
    "실시간 주문 체결 방식은 어떻게 되나요?",
    "삼성전자 거래하러 가기",
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInputQuery("");
    setIsThinking(true);

    setTimeout(() => {
      if (q.includes("보호") || q.includes("법적") || q.includes("도산")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            text: "Hanchi의 모든 자산은 한국예탁결제원(KSD) 외국인통합계좌 내 공인 신탁 금고에 1:1로 실물 원주가 안전하게 보관됩니다. 신탁법 제22조에 따라 플랫폼이나 중개사가 어려움에 처하더라도 고객의 신탁 재산은 도산격리되어 안전하게 보호됩니다.",
            link: { label: "권리 및 수탁 안내 보기", href: "/rights" },
          },
        ]);
      } else if (q.includes("배당") || q.includes("dividend")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            text: `기초 실물 주식의 배당 기준일에 보유하고 계시면, 국내 배당금 지급 즉시 실시간 USD로 자동 환전되어 포트폴리오 잔고로 입금됩니다. 현재 미수령 배당금 $${unclaimedDividendsUsd.toFixed(2)} USD가 대기 중입니다.`,
            link: { label: "배당금 수령 화면으로 이동", href: "/rights" },
          },
        ]);
      } else if (q.includes("체결") || q.includes("방식") || q.includes("호가") || q.includes("주문")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            text: "지정 유동성 공급자(MM)의 실시간 호가를 통해 한국 정규장 운영 시간과 무관하게 USD 잔고로 편리하고 즉각적으로 매수·매도 주문을 체결할 수 있습니다.",
            link: { label: "거래 화면으로 이동", href: "/trade" },
          },
        ]);
      } else if (q.includes("삼성") || q.includes("005930")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            text: "삼성전자는 한국예탁결제원에 1:1 보관된 대한민국 대표 반도체 보통주입니다. 예상 배당수익률 약 2.45%이며 USD로 편리하게 매수·매도할 수 있습니다.",
            link: { label: "삼성전자 거래 화면으로 이동", href: "/trade?securityId=990001" },
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            text: `질문해주신 내용("${q}")에 대해 안내드립니다. Hanchi는 외국인 투자자가 미국 달러(USD)로 한국 우량 주식의 경제적 가치와 배당을 편리하게 향유할 수 있는 합법적 신탁 기반 플랫폼입니다.`,
            link: { label: "마켓 전체 종목 둘러보기", href: "/markets" },
          },
        ]);
      }
      setIsThinking(false);
    }, 600);
  };

  return (
    <Modal
      isOpen={agentCommandOpen}
      onClose={() => setAgentCommandOpen(false)}
      maxWidth="lg"
      title="Hanchi 투자 도우미 & 제도 가이드"
      subtitle="한국 주식 수탁 권리의 법적 성격, 배당금 수령, 주문 경로 등에 대해 안내해 드립니다."
    >
      <div className="space-y-4 font-sans text-xs">
        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={`quick-prompt-${idx}`}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="h-72 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          {messages.map((msg, idx) => (
            <div
              key={`chat-msg-${idx}-${msg.role}`}
              className={clsx(
                "flex flex-col space-y-1 max-w-[88%]",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={clsx(
                  "p-3 rounded-xl leading-relaxed whitespace-pre-line text-xs",
                  msg.role === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-800 border border-slate-200 shadow-2xs"
                )}
              >
                {msg.text}

                {msg.link && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <Link
                      href={msg.link.href}
                      onClick={() => setAgentCommandOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      <span>{msg.link.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="p-3 bg-white text-slate-400 rounded-xl border border-slate-200 text-xs flex items-center gap-2 max-w-[120px]">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
              <span>답변 작성 중...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="한국 주식 수탁 권리, 배당금, 주문 방식 등 질문을 입력하세요..."
            className="flex-1 h-9 px-3 rounded-md bg-white border border-slate-200 text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="h-9 px-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors disabled:bg-slate-200 disabled:text-slate-400 flex items-center gap-1.5"
          >
            <span>전송</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
