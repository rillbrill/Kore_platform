"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { usePlatform } from "@/context/PlatformContext";
import { platformFetch } from "@/lib/platform-api";
import { Button } from "@/components/ui/Button";
import {
  LifeBuoy,
  MessageSquare,
  HelpCircle,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Building2,
} from "lucide-react";
import { clsx } from "clsx";

export default function SupportPage() {
  const { language, t } = useApp();
  const { connected, complaints, disclosure, token, refresh, message } = usePlatform();

  const inquiryCategories = [
    { id: "TRADE", label: language === "KO" ? "주문·체결" : "Trading", category: language === "KO" ? "주문 및 체결" : "Trading & Orders" },
    { id: "DIVIDEND", label: language === "KO" ? "배당·권리" : "Dividends", category: language === "KO" ? "배당 및 권리" : "Dividends & Rights" },
    { id: "ACCOUNT", label: language === "KO" ? "계좌·KYC" : "Account & KYC", category: language === "KO" ? "계좌 및 KYC" : "Account & KYC" },
    { id: "COMPLAINT", label: language === "KO" ? "규제·민원" : "Compliance", category: language === "KO" ? "규제 민원" : "Regulatory & Dispute" },
  ];

  const faqs = [
    {
      q: language === "KO" ? "배당금은 언제, 어떻게 지급되나요?" : "When and how are dividends paid out?",
      a: language === "KO"
        ? "기초 실물 주식의 배당 기준일에 수탁권리를 보유하고 계시면, 국내 배당금 지급 즉시 실시간 USD로 자동 환전되어 포트폴리오 잔고로 입금됩니다."
        : "Holders of record date automatically receive Korean cash dividends converted into USD cash balance at 1:1 audited rates.",
    },
    {
      q: language === "KO" ? "환매 신청 후 USD 정산까지 얼마나 걸리나요?" : "How long does USD redemption settlement take?",
      a: language === "KO"
        ? "환매 신청은 USD 현금 정산 방식으로 처리되며, 신청 접수 후 국내 시장 결제 일정을 거쳐 통상 T+2 영업일 이내에 USD 잔고로 입금 완료됩니다."
        : "Redemption requests settle in USD cash within standard T+2 business days via institutional broker liquidation.",
    },
    {
      q: language === "KO" ? "내가 보유한 수탁권리는 법적으로 어떻게 보호되나요?" : "How are my custodial rights legally protected?",
      a: language === "KO"
        ? "수탁권리는 한국예탁결제원(KSD) 및 공인 신탁사에 1:1로 실물 주식이 신탁 보관되며, 신탁법 제22조에 따라 플랫폼이나 발행사의 재정 위기 시에도 독립적으로 보호됩니다."
        : "Underlying shares are held 1:1 in bankruptcy-remote omnibus custody at KSD, fully segregated under Trust Law Article 22.",
    },
    {
      q: language === "KO" ? "실시간 주문의 호가 기준은 무엇인가요?" : "What prices are market orders executed at?",
      a: language === "KO"
        ? "지정 유동성 공급자가 실시간으로 제공하는 매수·매도 호가를 기준으로 즉시 체결되며, 체결 즉시 포트폴리오와 잔고에 반영됩니다."
        : "Executed immediately against live bid/ask inventory provided by designated institutional market makers.",
    },
  ];

  const recentInquiriesSeed = [
    {
      id: "INQ-2026-9901",
      category: language === "KO" ? "주문 및 체결" : "Trading & Orders",
      title: language === "KO" ? "삼성전자 수탁권리 체결 영수증 발급 문의" : "Institutional trade receipt inquiry for SEC",
      date: "2026-08-28",
      status: language === "KO" ? "답변 완료" : "Resolved",
      responsible: "Hanchi Support Team",
    },
    {
      id: "INQ-2026-8842",
      category: language === "KO" ? "계좌 및 KYC" : "Account & KYC",
      title: language === "KO" ? "싱가포르 세무 거주자 인증 갱신 확인" : "Singapore accredited investor renewal confirmation",
      date: "2026-08-15",
      status: language === "KO" ? "처리 완료" : "Resolved",
      responsible: "Compliance Desk",
    },
  ];

  const [inquiryType, setInquiryType] = useState("TRADE");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [inquiries, setInquiries] = useState(recentInquiriesSeed);
  const displayInquiries = connected
    ? complaints.map((complaint) => ({
        id: complaint.complaintId,
        category: complaint.type,
        title: complaint.titleKo,
        date: complaint.createdAt?.slice(0, 10) ?? "-",
        status: complaint.status,
        responsible: complaint.responsibleRole ?? "책임기관 배정 대기",
      }))
    : inquiries;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!title.trim() || !content.trim()) return;
    if (connected) {
      await platformFetch("/complaints", {
        token,
        method: "POST",
        body: {
          type: inquiryType,
          titleKo: title.trim(),
          descriptionKo: content.trim(),
          disclosureVersion: disclosure?.version ?? "SIM-RISK-2",
        },
      });
      await refresh();
      setSubmitted(true);
      setSubmitAttempted(false);
      setTitle("");
      setContent("");
      return;
    }
    const newInquiry = {
      id: `INQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: inquiryCategories.find((type) => type.id === inquiryType)?.category || "Trading",
      title: title.trim(),
      date: "2026-09-02",
      status: language === "KO" ? "접수 완료" : "Submitted",
      responsible: inquiryType === "COMPLAINT" ? "Compliance Desk" : "Hanchi Support Team",
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    setSubmitted(true);
    setSubmitAttempted(false);
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-950 tracking-tight">
            {t("support", "headerTitle")}
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            {t("support", "headerSub")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{language === "KO" ? "고객지원 운영 중" : "Live Support Active"}</span>
          </span>
        </div>
      </div>

      {submitted && (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 font-sans text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === "KO"
              ? "문의가 접수되었습니다. 책임기관 배정과 처리상태는 민원 내역에 반영됩니다."
              : "Complaint received. Responsible role and status are reflected in the inquiry list."}
          </span>
        </div>
      )}

      {/* 2. Form & FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Inquiry Submission Form */}
        <div className="lg:col-span-7 p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-950">
              {t("support", "submitInquiry")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === "KO" ? "문의 유형, 제목, 상세 내용을 접수하면 플랫폼이 책임기관 배정 상태를 기록합니다." : "Submit type, subject, and details so the platform can track responsible-role assignment."}
            </p>
            <p className="mt-2 text-[11px] font-mono text-slate-500">
              {connected ? `rwa-8th API · ${message}` : language === "KO" ? "API 미연결: 목업 문의 내역 표시 중" : "API offline: showing mock inquiries"}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Category Chips */}
            <div className="space-y-1.5">
              <label className="text-slate-600 font-medium block">
                {language === "KO" ? "문의 분야" : "Category"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {inquiryCategories.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInquiryType(type.id)}
                    className={clsx(
                      "py-2 px-3 rounded-lg border text-center font-medium text-xs transition-colors",
                      inquiryType === type.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label htmlFor="inquiry-title" className="text-slate-600 font-medium block">
                {language === "KO" ? "문의 제목" : "Subject"}
              </label>
              <input
                id="inquiry-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === "KO" ? "문의하실 내용을 간략히 요약해 주세요..." : "Summarize your request..."}
                className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
              />
              {submitAttempted && !title.trim() && (
                <p className="text-[11px] text-rose-600">
                  {language === "KO" ? "문의 제목을 입력해 주세요." : "Subject is required."}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="inquiry-content" className="text-slate-600 font-medium block">
                {language === "KO" ? "상세 내용" : "Details"}
              </label>
              <textarea
                id="inquiry-content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={language === "KO" ? "상세한 주문 번호, 일자, 오류 내용 등을 적어주시면 빠른 처리가 가능합니다..." : "Provide order numbers, timestamps, or descriptions..."}
                className="w-full p-3 rounded-lg bg-white border border-slate-200 text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-slate-400 leading-relaxed resize-none"
              />
              {submitAttempted && !content.trim() && (
                <p className="text-[11px] text-rose-600">
                  {language === "KO" ? "문의 내용을 입력해 주세요." : "Details are required."}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === "KO" ? "문의 접수하기" : "Submit Ticket"}</span>
            </button>
          </form>
        </div>

        {/* Right 5 Cols: FAQ & Recent Inquiries */}
        <div className="lg:col-span-5 space-y-6">
          {/* FAQ Accordion */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs font-sans">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <HelpCircle className="w-4 h-4 text-slate-700" />
              <h2 className="font-semibold text-slate-950 text-sm">
                {t("support", "faqTitle")}
              </h2>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              {faqs.map((faq, idx) => (
                <div key={idx} className={clsx("space-y-1", idx > 0 && "pt-3")}>
                  <strong className="text-slate-900 font-semibold block text-xs">
                    Q. {faq.q}
                  </strong>
                  <p className="text-slate-500 text-[11.5px] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Inquiries Card */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-950 text-sm">
                {language === "KO" ? "내 최근 문의 내역" : "My Recent Inquiries"}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {language === "KO" ? `총 ${displayInquiries.length}건` : `${displayInquiries.length} total`}
              </span>
            </div>

            <div className="space-y-2 font-mono">
              {displayInquiries.map((inq) => (
                <div key={inq.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-slate-400 font-mono">{inq.id}</span>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {inq.status}
                    </span>
                  </div>
                  <strong className="font-sans font-medium text-slate-900 block text-xs truncate">
                    {inq.title}
                  </strong>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-0.5 font-sans">
                    <span>{inq.category}</span>
                    <span className="font-mono text-slate-400">{inq.date}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-sans">
                    {inq.responsible}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
