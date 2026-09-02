import React from "react";
import { SettlementEvent, SettlementStage } from "@/types/domain";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Clock, ShieldCheck, FileCheck, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

const DEFAULT_STAGES: Array<{ id: SettlementStage; title: string; entity: string }> = [
  { id: "INTENT_FILED", title: "주문 접수", entity: "하나증권" },
  { id: "KRX_EXECUTED", title: "KRX 체결", entity: "한국거래소" },
  { id: "KSD_OMNIBUS_DEPOSITED", title: "KSD 외국인계좌", entity: "한국예탁결제원" },
  { id: "TRUST_LOCKBOX_SECURED", title: "신탁 금고 실사", entity: "신한은행 신탁" },
  { id: "DVP_TOKEN_ISSUED", title: "dShare 토큰 인도", entity: "스마트 컨트랙트" },
];

export function SettlementTimeline({
  event,
  onViewReceipt,
  compact = false,
}: {
  event: SettlementEvent;
  onViewReceipt?: () => void;
  compact?: boolean;
}) {
  const currentStageIndex = DEFAULT_STAGES.findIndex((s) => s.id === event.currentStage);

  return (
    <div className="rounded-2xl p-5 space-y-4 dex-card font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-950 text-sm">{event.securityName}</span>
            <Badge variant="teal" size="sm">
              {event.securitySymbol}
            </Badge>
            <Badge
              variant={event.stageProgress === 100 ? "settled" : "pending"}
              size="sm"
            >
              {event.stageProgress === 100 ? "결제 완료 (T+0 DVP)" : "T+2 결제 대기 중"}
            </Badge>
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">
            결제 ID: {event.id} · 수량: {event.quantity} dShare (${event.amountUsd.toFixed(2)} USD)
          </span>
        </div>

        {onViewReceipt && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewReceipt}
            leftIcon={<FileCheck className="w-3.5 h-3.5 text-sky-600" />}
            className="text-xs font-semibold"
          >
            전자 전표 보기
          </Button>
        )}
      </div>

      {/* 5-Step Pipeline */}
      <div className="relative">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {DEFAULT_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex || event.stageProgress === 100;
            const isCurrent = idx === currentStageIndex && event.stageProgress < 100;

            return (
              <div key={idx} className="space-y-1.5 flex flex-col items-center">
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all",
                    isCompleted
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : isCurrent
                      ? "bg-amber-100 text-amber-900 border-amber-400 animate-pulse"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <strong
                    className={clsx(
                      "block text-[11px] leading-tight font-sans font-bold",
                      isCompleted ? "text-slate-900" : isCurrent ? "text-amber-800" : "text-slate-400"
                    )}
                  >
                    {stage.title}
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {stage.entity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated completion footer */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
        <span>예상 결제 완료 일시:</span>
        <strong className="text-sky-800 font-bold">{event.estimatedCompletion}</strong>
      </div>
    </div>
  );
}
