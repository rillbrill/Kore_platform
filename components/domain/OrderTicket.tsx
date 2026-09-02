"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Security, OrderSide, FundingMode, Order } from "@/types/domain";
import { useApp } from "@/context/AppContext";
import { usePlatform } from "@/context/PlatformContext";
import { submitSecondaryOrderCommand } from "@/lib/platform-commands";
import { PreFlightSuitabilityModal } from "@/components/domain/PreFlightSuitabilityModal";
import { AuthorizationSigningModal } from "@/components/domain/AuthorizationSigningModal";
import {
  ShieldCheck,
  Plus,
  Minus,
  ArrowRight,
  Info,
  Check,
  RotateCcw,
} from "lucide-react";
import { AnimatedPrice } from "@/components/ui/AnimatedPrice";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export function OrderTicket({
  security,
  customPrice,
  onClearCustomPrice,
  onOrderCompleted,
}: {
  security: Security;
  customPrice?: number | null;
  onClearCustomPrice?: () => void;
  onOrderCompleted?: () => void;
  className?: string;
}) {
  const { user, positions, placeOrder, language, t } = useApp();
  const {
    connected,
    session,
    token,
    profile,
    secondaryQuotes,
    refresh,
  } = usePlatform();

  const [side, setSide] = useState<OrderSide>("BUY");
  const [fundingMode, setFundingMode] = useState<FundingMode>("USD_LEDGER");
  const [quantity, setQuantity] = useState<number>(10);
  const [isPreflightOpen, setIsPreflightOpen] = useState(false);
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmittingPlatformOrder, setIsSubmittingPlatformOrder] = useState(false);
  const [platformOrderStatus, setPlatformOrderStatus] = useState<{
    workflowId?: string;
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const selectedQuote = secondaryQuotes.find(
    (quote) =>
      quote.securityId === security.id &&
      quote.investorSide === side &&
      quote.fundingMode === fundingMode &&
      quote.status === "ACTIVE",
  );
  const quotePrice =
    selectedQuote
      ? Number(selectedQuote.unitPrice.amountMinor) / 10 ** selectedQuote.unitPrice.decimals
      : undefined;
  const priceToUse = quotePrice ?? customPrice ?? security.usdPrice;
  const subtotal = quantity * priceToUse;
  const fee = Math.max(1.0, subtotal * 0.0015); // 0.15% brokerage/custody fee, $1 minimum
  const total = subtotal + fee;
  const netProceeds = subtotal - fee;
  const currentPosition = positions.find((p) => p.securityId === security.id);
  const sellableShares = currentPosition?.settledShares || 0;

  const platformAvailableBalance =
    connected && session?.localSecondaryScenario
      ? fundingMode === "USD_LEDGER"
        ? Number(session.localSecondaryScenario.balances.usdAvailableMinor) / 100
        : Number(session.localSecondaryScenario.balances.usdcAvailableMinor) / 1_000_000
      : undefined;
  const availableBalance =
    platformAvailableBalance ??
    (fundingMode === "USD_LEDGER" ? user.usdLedgerBalance : user.usdcOnChainBalance);
  const quoteBlocked =
    connected &&
    (!session?.localSecondaryScenario ||
      !selectedQuote ||
      quantity > Number(selectedQuote.remainingQuantity));
  const orderBlocked =
    quoteBlocked || (side === "BUY" ? total > availableBalance : quantity > sellableShares);
  const maxQuantity =
    side === "BUY"
      ? Math.floor(availableBalance / (priceToUse * 1.0015))
      : sellableShares;

  const handlePercentage = (pct: number) => {
    const target = Math.max(1, Math.floor((maxQuantity * pct) / 100));
    setQuantity(target);
  };

  const handleStartOrder = () => {
    setIsPreflightOpen(true);
  };

  const handlePreflightSuccess = async () => {
    setIsPreflightOpen(false);
    if (connected) {
      if (!session?.localSecondaryScenario || !selectedQuote) {
        setPlatformOrderStatus({
          type: "error",
          message: "현재 선택 조건에 맞는 활성 지정 시장조성자 호가가 없다.",
        });
        return;
      }

      try {
        setIsSubmittingPlatformOrder(true);
        setPlatformOrderStatus({ type: "info", message: "24/7 주문 workflow를 접수하는 중이다." });
        const accepted = await submitSecondaryOrderCommand({
          scenario: session.localSecondaryScenario,
          token,
          profile,
          quote: selectedQuote,
          quantity,
        });
        await refresh();
        setPlatformOrderStatus({
          type: "success",
          workflowId: accepted.workflowId,
          message: "주문을 접수했다. 체결 확정은 workflow 상태에서 추적한다.",
        });
        if (onOrderCompleted) onOrderCompleted();
      } catch (error) {
        setPlatformOrderStatus({
          type: "error",
          message: error instanceof Error ? error.message : "24/7 주문 접수에 실패했다.",
        });
      } finally {
        setIsSubmittingPlatformOrder(false);
      }
      return;
    }

    const order = placeOrder({
      type: "SECONDARY_OTC",
      side,
      securityId: security.id,
      securitySymbol: security.symbol,
      securityName: security.name,
      quantity,
      krwPrice: Math.round(priceToUse * 1380.5),
      usdPrice: priceToUse,
      fundingMode,
    });
    setCreatedOrder(order);
    setIsSigningOpen(true);
  };

  const handleSigningSuccess = () => {
    setIsSigningOpen(false);
    if (onOrderCompleted) onOrderCompleted();
  };

  return (
    <div className="rounded-xl p-5 bg-white border border-slate-200 shadow-xs space-y-4 font-sans text-xs">
      {/* 1. Buy / Sell Toggle with Sliding Spring */}
      <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => setSide("BUY")}
          className={clsx(
            "relative py-2 rounded-lg font-semibold text-xs transition-colors z-10 flex items-center justify-center",
            side === "BUY"
              ? "text-white"
              : "text-slate-600 hover:text-slate-950"
          )}
        >
          {side === "BUY" && (
            <motion.div
              layoutId="order-ticket-side-pill"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
              className="absolute inset-0 bg-slate-900 rounded-lg -z-10 shadow-xs"
            />
          )}
          {t("trade", "buyTab")}
        </button>

        <button
          type="button"
          onClick={() => setSide("SELL")}
          className={clsx(
            "relative py-2 rounded-lg font-semibold text-xs transition-colors z-10 flex items-center justify-center",
            side === "SELL"
              ? "text-white"
              : "text-slate-600 hover:text-slate-950"
          )}
        >
          {side === "SELL" && (
            <motion.div
              layoutId="order-ticket-side-pill"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
              className="absolute inset-0 bg-rose-600 rounded-lg -z-10 shadow-xs"
            />
          )}
          {t("trade", "sellTab")}
        </button>
      </div>

      {/* 2. Order Price Strip (Clean & Seamless) */}
      <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 flex items-center justify-between font-mono">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10.5px] text-slate-400 font-sans block">
              {customPrice
                ? (language === "KO" ? "적용 단가 (지정가)" : "Order Price (Limit)")
                : (language === "KO" ? "적용 단가 (실시간)" : "Order Price (Market)")}
            </span>
            {customPrice && onClearCustomPrice && (
              <button
                type="button"
                onClick={onClearCustomPrice}
                className="text-[10px] text-slate-500 hover:text-slate-900 font-sans bg-slate-200/70 hover:bg-slate-200 px-1.5 py-0.2 rounded transition-colors"
              >
                {language === "KO" ? "시장가 복원" : "Reset"}
              </button>
            )}
          </div>

          <strong className="text-slate-950 text-sm font-bold block tabular-nums">
            ${priceToUse.toFixed(2)} <span className="text-slate-400 text-xs font-normal">USD</span>
          </strong>
          {connected && selectedQuote && (
            <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
              Quote {selectedQuote.quoteId.slice(0, 8)} · 잔여 {Number(selectedQuote.remainingQuantity).toLocaleString()}주
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-[10.5px] text-slate-400 font-sans block">
            {language === "KO" ? "원화 환산 기준" : "KRW Equivalent"}
          </span>
          <span className="text-slate-700 text-xs tabular-nums font-semibold">
            ≈ ₩{Math.round(priceToUse * 1380.5).toLocaleString()} KRW
          </span>
        </div>
      </div>

      {/* 3. Quantity Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <label htmlFor={`order-quantity-${security.id}`}>
            {language === "KO" ? "주문 수량 (Shares)" : "Order Shares"}
          </label>
          <span className="font-mono text-slate-400">
            {side === "BUY"
              ? (language === "KO" ? `가용 현금: $${availableBalance.toLocaleString()}` : `Cash: $${availableBalance.toLocaleString()}`)
              : (language === "KO" ? `매도 가능: ${sellableShares.toLocaleString()}주` : `Avail: ${sellableShares.toLocaleString()} Shs`)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id={`order-quantity-${security.id}`}
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-9 px-3 rounded-md bg-white border border-slate-200 text-xs font-mono font-medium text-slate-950 focus:outline-none focus:border-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Percentage Quick Pickers */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handlePercentage(pct)}
              className="py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-medium transition-colors"
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {connected && (
        <div
          className={clsx(
            "rounded-lg border px-3 py-2 text-[11px] leading-relaxed",
            platformOrderStatus?.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : platformOrderStatus?.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-slate-200 bg-slate-50 text-slate-600",
          )}
        >
          {platformOrderStatus?.message ??
            (selectedQuote
              ? "API 연결 상태에서는 주문이 즉시 확정되지 않고 workflow로 접수된다."
              : "현재 선택한 종목, 방향, 결제수단에 맞는 활성 호가가 없다.")}
          {platformOrderStatus?.workflowId && (
            <Link
              href={`/investor/orders/${platformOrderStatus.workflowId}`}
              className="ml-1 font-semibold text-slate-950 underline underline-offset-2"
            >
              상태 보기
            </Link>
          )}
        </div>
      )}

      {/* 4. Settlement Mode Selector */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100">
        <label className="text-[11px] font-medium text-slate-600 block">
          {language === "KO" ? "결제 수단" : "Funding Source"}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFundingMode("USD_LEDGER")}
            className={clsx(
              "p-2.5 rounded-lg border text-left transition-all",
              fundingMode === "USD_LEDGER"
                ? "border-slate-900 bg-slate-50/60 shadow-xs"
                : "border-slate-200 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <strong className="font-semibold text-slate-900">USD 잔고</strong>
              {fundingMode === "USD_LEDGER" && <Check className="w-3 h-3 text-slate-900" />}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              ${user.usdLedgerBalance.toLocaleString()}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFundingMode("USDC_ONCHAIN")}
            className={clsx(
              "p-2.5 rounded-lg border text-left transition-all",
              fundingMode === "USDC_ONCHAIN"
                ? "border-slate-900 bg-slate-50/60 shadow-xs"
                : "border-slate-200 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <strong className="font-semibold text-slate-900">USDC (지갑)</strong>
              {fundingMode === "USDC_ONCHAIN" && <Check className="w-3 h-3 text-slate-900" />}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              ${user.usdcOnChainBalance.toLocaleString()}
            </div>
          </button>
        </div>
      </div>

      {/* 5. Order Summary Breakdowns */}
      <div className="p-3 bg-slate-50/70 rounded-xl space-y-1.5 font-mono text-[11px] border border-slate-100">
        <div className="flex justify-between text-slate-500 font-sans">
          <span>{language === "KO" ? "주문 금액" : "Subtotal"}</span>
          <span className="font-mono text-slate-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500 font-sans">
          <span>{language === "KO" ? "수탁 및 거래 수수료 (0.15%)" : "Fee (0.15%)"}</span>
          <span className="font-mono text-slate-900">${fee.toFixed(2)}</span>
        </div>
        <div className="pt-1.5 border-t border-slate-200/60 flex justify-between font-bold text-xs font-sans">
          <span className="text-slate-900">{side === "BUY" ? (language === "KO" ? "최종 결제 금액" : "Total Cost") : (language === "KO" ? "최종 정산 입금액" : "Net Proceeds")}</span>
          <span className="font-mono text-slate-950">${(side === "BUY" ? total : netProceeds).toFixed(2)}</span>
        </div>
      </div>

      {/* 6. Execution Action Button */}
      <button
        type="button"
        disabled={orderBlocked || quantity <= 0 || isSubmittingPlatformOrder}
        onClick={handleStartOrder}
        className={clsx(
          "w-full py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs",
          orderBlocked || quantity <= 0 || isSubmittingPlatformOrder
            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            : side === "BUY"
            ? "bg-slate-900 hover:bg-slate-800 text-white"
            : "bg-rose-600 hover:bg-rose-500 text-white"
        )}
      >
        <span>
          {side === "BUY"
            ? connected
              ? isSubmittingPlatformOrder
                ? "매수 접수 중"
                : "24/7 매수 접수"
              : (customPrice ? (language === "KO" ? "지정가 매수 진행" : "Submit Limit Buy") : (language === "KO" ? "즉시 매수 진행" : "Submit Market Buy"))
            : connected
              ? isSubmittingPlatformOrder
                ? "매도 접수 중"
                : "24/7 매도 접수"
              : (customPrice ? (language === "KO" ? "지정가 매도 진행" : "Submit Limit Sell") : (language === "KO" ? "즉시 매도 진행" : "Submit Market Sell"))}
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Modals */}
      <PreFlightSuitabilityModal
        isOpen={isPreflightOpen}
        onClose={() => setIsPreflightOpen(false)}
        security={security}
        orderType="SECONDARY_OTC"
        orderSide={side}
        quantity={quantity}
        fundingMode={fundingMode}
        onProceedToSigning={handlePreflightSuccess}
      />

      {createdOrder && (
        <AuthorizationSigningModal
          isOpen={isSigningOpen}
          onClose={() => setIsSigningOpen(false)}
          order={createdOrder}
          security={security}
          onSuccess={handleSigningSuccess}
        />
      )}
    </div>
  );
}
