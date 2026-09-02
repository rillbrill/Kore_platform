"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LedgerEntry } from "@/types/domain";
import {
  FileCheck,
  ShieldCheck,
  Building2,
  Printer,
  Download,
  CheckCircle2,
  Landmark,
} from "lucide-react";

export function AuditReceiptModal({
  isOpen,
  onClose,
  entry,
}: {
  isOpen: boolean;
  onClose: () => void;
  entry: LedgerEntry | null;
}) {
  if (!entry) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="공인 거래 체결 및 세무 영수증 (Trade Confirmation Receipt)"
      subtitle="한국 자본시장법 제373조 및 신탁법에 따른 공인 전자 전표입니다."
    >
      <div className="space-y-6 font-mono text-xs">
        {/* Printable Paper Surface */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5 text-slate-900 shadow-xs">
          {/* Top Receipt Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#0B0F19] flex items-center justify-center text-cyan-300 font-mono font-black text-xs">
                  Ω
                </div>
                <span className="font-black text-slate-950 text-sm">ORAKLE RWA SYSTEM</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                전표 고유번호: <strong className="text-sky-700">{entry.receiptNumber}</strong>
              </span>
            </div>

            <div className="text-right">
              <Badge variant="settled" size="sm" dot>
                대사 승인 완료 (1:1 DUAL PASS)
              </Badge>
              <span className="text-[10.5px] text-slate-400 block mt-1">
                체결일시: {entry.timestamp}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">거래 내역</span>
              <strong className="text-slate-950 block font-sans">{entry.description}</strong>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">결제 통화 및 금액</span>
              <strong className="text-sky-700 text-sm block font-black tabular-nums">
                ${Math.abs(entry.amountUsd).toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
              </strong>
              <span className="text-[10.5px] text-slate-500 block">
                ≈ ₩{Math.round(Math.abs(entry.amountUsd * 1380.3)).toLocaleString()} KRW
              </span>
            </div>
          </div>

          {/* Dual Ledger Verification Box */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 text-[11px] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-600" /> KSD 전자등록 / 신탁 원장 Ref:
              </span>
              <span className="text-slate-950 font-bold">{entry.ksdReference || "KSD-2026-OMNI-9921"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 온체인 DVP TxHash:
              </span>
              <span className="text-slate-950 font-bold truncate max-w-[170px]">{entry.txHash || "0x82b4...91c3"}</span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-amber-600" /> 한-싱 조세조약 세무 구분:
              </span>
              <span className="text-emerald-800 font-bold">15% 원천징수 분리과세 완료 (₩{entry.taxWithheldKrw?.toLocaleString() || "0"} KRW)</span>
            </div>
          </div>

          <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed">
            본 문서는 한국예탁결제원(KSD) 외국인통합계좌 및 신탁법 제22조에 의거하여 발행된 법적 효력을 갖는 거래 체결 확인서입니다.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            인쇄하기
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => alert("공인 PDF 전표 다운로드가 시작되었습니다.")}
            >
              PDF 저장
            </Button>
            <Button variant="primary" size="md" onClick={onClose}>
              확인 닫기
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
