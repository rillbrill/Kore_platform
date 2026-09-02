"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CorporateAction } from "@/types/domain";
import { useApp } from "@/context/AppContext";
import {
  Vote,
  Coins,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  FileCheck,
} from "lucide-react";
import { clsx } from "clsx";

export function CorporateActionModal({
  isOpen,
  onClose,
  action,
}: {
  isOpen: boolean;
  onClose: () => void;
  action: CorporateAction | null;
}) {
  const { claimDividend, submitProxyVote } = useApp();

  const [voteChoice, setVoteChoice] = useState<"FOR" | "AGAINST" | "ABSTAIN">("FOR");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!action) return null;

  const isDividend = action.type === "CASH_DIVIDEND";

  const handleExecute = () => {
    if (isDividend) {
      claimDividend(action.id);
    } else {
      submitProxyVote(action.id, "prop-1", voteChoice);
    }
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={isDividend ? "배당금 수령 및 세무 정산 (Dividend Claim)" : "정기주주총회 전자 의결권 행사 (Proxy Voting)"}
      subtitle="KSD 외국인 통합계좌 신탁 지분에 비례한 주주 권리를 온체인으로 직접 행사합니다."
    >
      <div className="space-y-5 font-mono text-xs">
        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <strong className="text-slate-950 font-bold block text-sm">
              {isDividend ? "배당금이 성공적으로 수령되었습니다!" : "의결권 투표가 정상 집행되었습니다!"}
            </strong>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">안건 / 배당 항목:</span>
                <strong className="text-slate-950 font-sans">{action.title}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">기준일자 (Record Date):</span>
                <strong className="text-slate-950">{action.recordDate}</strong>
              </div>
              {action.details.dividendPerShareKrw && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-700 font-bold">주당 배당금:</span>
                  <strong className="text-emerald-800 font-black text-sm">
                    ₩{action.details.dividendPerShareKrw.toLocaleString()} KRW
                  </strong>
                </div>
              )}
            </div>

            {action.type === "SHAREHOLDER_VOTE" && (
              <div className="space-y-2">
                <span className="text-slate-800 font-bold block">의결권 찬반 선택</span>
                <div className="grid grid-cols-3 gap-2 font-sans">
                  {(["FOR", "AGAINST", "ABSTAIN"] as const).map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setVoteChoice(choice)}
                      className={clsx(
                        "py-2.5 rounded-xl border font-bold text-xs transition-all",
                        voteChoice === choice
                          ? choice === "FOR"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                            : choice === "AGAINST"
                            ? "bg-rose-50 text-rose-800 border-rose-300 shadow-xs"
                            : "bg-slate-200 text-slate-900 border-slate-300"
                          : "bg-white border-slate-200 text-slate-600 hover:text-slate-950"
                      )}
                    >
                      {choice === "FOR" ? "찬성 (For)" : choice === "AGAINST" ? "반대 (Against)" : "기권 (Abstain)"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-slate-700 text-[11px] font-sans leading-relaxed">
              * 신한은행 신탁부가 주주총회에 고객의 의결권을 1:1로 위임 행사하며, 온체인 투표 증명서가 발행됩니다.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" size="md" onClick={onClose}>
                취소
              </Button>
              <Button variant="primary" size="md" onClick={handleExecute}>
                {isDividend ? "배당금 정산 확정" : "의결권 전자 투표 제출"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
