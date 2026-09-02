"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Security,
  Order,
  Position,
  SettlementEvent,
  CorporateAction,
  LedgerEntry,
  InstitutionalRole,
  UserProfile,
  AgentPlan,
} from "@/types/domain";
import { MOCK_SECURITIES } from "@/data/mock-securities";
import { INITIAL_USER_PROFILE, INITIAL_POSITIONS } from "@/data/mock-portfolio";
import { MOCK_ORDERS } from "@/data/mock-orders";
import { MOCK_SETTLEMENT_EVENTS } from "@/data/mock-settlement";
import { MOCK_CORPORATE_ACTIONS } from "@/data/mock-corporate-actions";
import { MOCK_LEDGER_ENTRIES } from "@/data/mock-ledger";
import { Language, DICTIONARY, getTranslation } from "@/lib/i18n";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warn" | "error";
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  isLoggedIn: boolean;
  login: (email?: string) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  completeKycOnboarding: (data: Partial<UserProfile>) => void;
  user: UserProfile;
  securities: Security[];
  positions: Position[];
  orders: Order[];
  settlementEvents: SettlementEvent[];
  corporateActions: CorporateAction[];
  ledgerEntries: LedgerEntry[];
  selectedRole: InstitutionalRole;
  setSelectedRole: (role: InstitutionalRole) => void;
  agentCommandOpen: boolean;
  setAgentCommandOpen: (open: boolean) => void;
  activeAgentPlan: AgentPlan | null;
  setActiveAgentPlan: (plan: AgentPlan | null) => void;
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  placeOrder: (orderData: Partial<Order>) => Order;
  authorizeOrder: (orderId: string) => Promise<boolean>;
  claimDividend: (actionId: string) => Promise<boolean>;
  submitProxyVote: (actionId: string, proposalId: string, option: string) => Promise<boolean>;
  requestRedemption: (securityId: string, quantity: number) => Promise<boolean>;
  totalPortfolioValueUsd: number;
  totalPortfolioReturnUsd: number;
  totalPortfolioReturnPercent: number;
  unclaimedDividendsUsd: number;
  currencyPreference: "USD" | "KRW";
  setCurrencyPreference: (c: "USD" | "KRW") => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: keyof typeof DICTIONARY, key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);

  const login = (email?: string) => {
    setIsLoggedIn(true);
    if (email) {
      setUser((prev) => ({ ...prev, email }));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const completeKycOnboarding = (data: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...data,
      kycStatus: "VERIFIED",
      investorTier: "ACCREDITED",
      foreignInvestorId: data.foreignInvestorId || `LEI-GLOBAL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      kycExpiryDate: "2027-12-31",
    }));
    setIsLoggedIn(true);
  };

  const [securities, setSecurities] = useState<Security[]>(MOCK_SECURITIES);
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);

  // Live market micro-tick simulation engine (Speedy 1400ms pacing)
  useEffect(() => {
    const interval = setInterval(() => {
      setSecurities((prevSecurities) => {
        // Pick 3 random stocks to update with subtle realistic ticks (+/- 0.05% ~ 0.1%)
        const next = [...prevSecurities];
        const numUpdates = 3;
        for (let i = 0; i < numUpdates; i++) {
          const randIdx = Math.floor(Math.random() * Math.min(next.length, 35));
          const currentSec = next[randIdx];
          if (!currentSec) continue;
          const deltaPct = (Math.random() * 0.16 - 0.08) / 100; // -0.08% to +0.08%
          const newUsdPrice = Math.max(0.5, Number((currentSec.usdPrice * (1 + deltaPct)).toFixed(2)));
          const newKrwPrice = Math.round(newUsdPrice * 1380.5);
          const newChange24h = Number((currentSec.change24h + deltaPct * 10).toFixed(2));

          next[randIdx] = {
            ...currentSec,
            usdPrice: newUsdPrice,
            krwPrice: newKrwPrice,
            change24h: newChange24h,
          };
        }
        return next;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, []);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [settlementEvents, setSettlementEvents] = useState<SettlementEvent[]>(MOCK_SETTLEMENT_EVENTS);
  const [corporateActions, setCorporateActions] = useState<CorporateAction[]>(MOCK_CORPORATE_ACTIONS);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(MOCK_LEDGER_ENTRIES);
  const [selectedRole, setSelectedRole] = useState<InstitutionalRole>("INVESTOR");
  const [agentCommandOpen, setAgentCommandOpen] = useState<boolean>(false);
  const [activeAgentPlan, setActiveAgentPlan] = useState<AgentPlan | null>(null);
  const [currencyPreference, setCurrencyPreference] = useState<"USD" | "KRW">("USD");
  const [language, setLanguageState] = useState<Language>("KO");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("hanchi_language") as Language;
      if (savedLang === "KO" || savedLang === "EN") {
        setLanguageState(savedLang);
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("hanchi_language", lang);
    } catch (e) {}
  };

  const t = (section: keyof typeof DICTIONARY, key: string): string => {
    return getTranslation(language, section, key);
  };

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "NOTIF-01",
      title: "T+2 결제 대기 진행 중 (dSEC)",
      message: "삼성전자 50주 1차 발행 주문이 KSD 통합계좌에 입고되어 실물 대사 중입니다.",
      type: "info",
      timestamp: "10분 전",
      read: false,
    },
    {
      id: "NOTIF-02",
      title: "2026년 3분기 분기배당 수령 가능",
      message: "보유 중인 3개 종목에 대한 총 $713.79 상당의 배당금 청구가 가능합니다.",
      type: "success",
      timestamp: "1시간 전",
      read: false,
    },
  ]);

  // Keyboard shortcut Cmd+K / Ctrl+K for Agent Command Bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setAgentCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addNotification = (n: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const newNotif: AppNotification = {
      ...n,
      id: `NOTIF-${Date.now()}`,
      timestamp: "방금 전",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  // Compute portfolio aggregates
  const totalPortfolioValueUsd = positions.reduce(
    (acc, pos) => acc + pos.currentValueUsd,
    0
  );
  const totalPortfolioReturnUsd = positions.reduce(
    (acc, pos) => acc + pos.totalReturnUsd,
    0
  );
  const totalPortfolioCostUsd = totalPortfolioValueUsd - totalPortfolioReturnUsd;
  const totalPortfolioReturnPercent =
    totalPortfolioCostUsd > 0
      ? (totalPortfolioReturnUsd / totalPortfolioCostUsd) * 100
      : 0;

  const unclaimedDividendsUsd = corporateActions.reduce((acc, ca) => {
    if (ca.userEntitlement && ca.userEntitlement.status === "UNCLAIMED" && ca.userEntitlement.claimableUsd) {
      return acc + ca.userEntitlement.claimableUsd;
    }
    return acc;
  }, 0);

  // Place order
  const placeOrder = (orderData: Partial<Order>): Order => {
    const id = `ORD-2026-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id,
      type: orderData.type || "PRIMARY_ISSUANCE",
      side: orderData.side || "BUY",
      securityId: orderData.securityId || "990001",
      securitySymbol: orderData.securitySymbol || "dSEC",
      securityName: orderData.securityName || "삼성전자 보통주 수탁권리",
      quantity: orderData.quantity || 1,
      krwPrice: orderData.krwPrice || 78500,
      usdPrice: orderData.usdPrice || 56.87,
      totalUsd: (orderData.quantity || 1) * (orderData.usdPrice || 56.87),
      totalKrw: (orderData.quantity || 1) * (orderData.krwPrice || 78500),
      fundingMode: orderData.fundingMode || "USD_LEDGER",
      status: "AUTHORIZATION_PENDING",
      createdAt: "2026-09-02 " + new Date().toLocaleTimeString("ko-KR", { hour12: false }) + " KST",
      settlementEta:
        orderData.type === "SECONDARY_OTC"
          ? "즉시 (3초 내 원자적 DVP 완료)"
          : "T+2일 16:00 KST (KRX 정규 결제)",
      feeUsd: Math.max(1.0, ((orderData.quantity || 1) * (orderData.usdPrice || 56.87)) * 0.0015),
      investorId: user.id,
      responsibleEntity: "하나증권 (주문집행) × 신한은행 (신탁보관)",
      notes: "사전 적격성(Suitability) 검증 완료. 전자서명 및 다자간 승인 대기 중입니다.",
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Authorize order
  const authorizeOrder = async (orderId: string): Promise<boolean> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    // Simulate multi-party signing & settlement stage transition
    const totalCost = targetOrder.totalUsd + targetOrder.feeUsd;
    const netProceeds = targetOrder.totalUsd - targetOrder.feeUsd;
    const isBuy = targetOrder.side === "BUY";
    const isOtc = targetOrder.type === "SECONDARY_OTC";

    if (!isBuy) {
      const targetPosition = positions.find((p) => p.securityId === targetOrder.securityId);
      if (!targetPosition || targetPosition.settledShares < targetOrder.quantity) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "REJECTED",
                  notes: "매도 가능 수량을 초과하여 주문이 거절되었습니다.",
                }
              : o
          )
        );
        addNotification({
          title: `${targetOrder.securitySymbol} 매도 주문 거절`,
          message: "현재 매도 가능한 수량보다 큰 주문입니다. 보유 수량을 다시 확인해주세요.",
          type: "error",
        });
        return false;
      }
    }

    // Settle cash in the correct direction.
    if (isBuy) {
      if (targetOrder.fundingMode === "USD_LEDGER") {
        setUser((prev) => ({
          ...prev,
          usdLedgerBalance: Math.max(0, prev.usdLedgerBalance - totalCost),
        }));
      } else {
        setUser((prev) => ({
          ...prev,
          usdcOnChainBalance: Math.max(0, prev.usdcOnChainBalance - totalCost),
        }));
      }
    } else {
      setUser((prev) => ({
        ...prev,
        usdLedgerBalance: prev.usdLedgerBalance + netProceeds,
      }));
    }

    const nextStatus = isOtc ? "SETTLED" : "T2_SETTLEMENT_PENDING";

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: nextStatus,
              txHash: "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6),
              ksdRefId: isOtc ? `INTERNAL-MM-${Date.now()}` : `KSD-TR-${Date.now()}`,
              notes: isOtc
                ? "지정 시장조성자 재고 즉시 매칭 및 DVP 원장 이전 완료."
                : "KRX 정규장 묶음 집행 승인. 현재 KSD 외국인 통합보관계좌 결제 대기 중입니다.",
            }
          : o
      )
    );

    // Update or add position
    setPositions((prev) => {
      const existing = prev.find((p) => p.securityId === targetOrder.securityId);
      if (existing) {
        return prev.map((p) => {
          if (p.securityId === targetOrder.securityId) {
            const shareDelta = isBuy ? targetOrder.quantity : -targetOrder.quantity;
            const newTotal = Math.max(0, p.totalShares + shareDelta);
            const newSettled = isOtc
              ? Math.max(0, p.settledShares + shareDelta)
              : p.settledShares;
            const newPending =
              !isOtc && isBuy
                ? p.pendingT2Shares + targetOrder.quantity
                : p.pendingT2Shares;
            const newTotalValue = newTotal * p.currentPriceUsd;
            return {
              ...p,
              totalShares: newTotal,
              settledShares: newSettled,
              pendingT2Shares: newPending,
              currentValueUsd: newTotalValue,
              lastUpdated: "2026-09-02 " + new Date().toLocaleTimeString("ko-KR", { hour12: false }) + " KST",
            };
          }
          return p;
        });
      } else if (isBuy) {
        const sec = securities.find((s) => s.id === targetOrder.securityId);
        const newPos: Position = {
          id: `POS-${Date.now().toString().slice(-4)}`,
          securityId: targetOrder.securityId,
          securitySymbol: targetOrder.securitySymbol,
          securityName: targetOrder.securityName,
          category: sec?.category || "EQUITY",
          totalShares: targetOrder.quantity,
          settledShares: isOtc ? targetOrder.quantity : 0,
          pendingT2Shares: !isOtc ? targetOrder.quantity : 0,
          redemptionLockedShares: 0,
          corporateActionFrozenShares: 0,
          avgBuyPriceUsd: targetOrder.usdPrice,
          currentPriceUsd: targetOrder.usdPrice,
          currentValueUsd: targetOrder.quantity * targetOrder.usdPrice,
          totalReturnUsd: 0,
          totalReturnPercent: 0,
          accruedDividendUsd: 0,
          custodyVaultProofId: `SHINHAN-TRUST-VAULT-${targetOrder.securityId}-NEW`,
          lastUpdated: "2026-09-02 " + new Date().toLocaleTimeString("ko-KR", { hour12: false }) + " KST",
        };
        return [...prev, newPos];
      }
      return prev;
    });

    // Create Settlement event
    const newSettle: SettlementEvent = {
      id: `SETTLE-2026-${Date.now().toString().slice(-6)}`,
      orderId: targetOrder.id,
      securitySymbol: targetOrder.securitySymbol,
      securityName: `${targetOrder.securityName} (${targetOrder.quantity}주)`,
      quantity: targetOrder.quantity,
      amountUsd: targetOrder.totalUsd,
      type: targetOrder.type,
      currentStage: isOtc ? "COMPLETED" : "KRX_EXECUTED",
      stageProgress: isOtc ? 100 : 45,
      initiatedAt: "2026-09-02 " + new Date().toLocaleTimeString("ko-KR", { hour12: false }) + " KST",
      estimatedCompletion: isOtc ? "즉시 완료" : "T+2일 16:00 KST",
      responsibleEntity: isOtc ? "지정 시장조성자 × 오라클 OS" : "한국예탁결제원(KSD) & 신한은행",
      auditLog: [
        {
          step: "1. 전자서명 및 다자간 승인 완료",
          entity: "투자자 & 인가 증권사",
          timestamp: "방금 전",
          status: "DONE",
          details: isBuy
            ? "KYC 인증 키 서명 및 $ " + totalCost.toFixed(2) + " 에스크로 증거금 동결 확인."
            : "KYC 인증 키 서명 및 " + targetOrder.quantity + "주 매도 가능 수량 잠금 확인.",
        },
        {
          step: isOtc ? "2. 24/7 OTC DVP 권리 이전" : "2. KRX 정규장 묶음 집행",
          entity: isOtc ? "스마트 컨트랙트 원장" : "하나증권 글로벌 데스크",
          timestamp: "방금 전",
          status: "DONE",
          details: isOtc ? "원자적 스왑 완료" : "KRX 주문 접수 및 장내 체결 확인 완료",
        },
      ],
    };

    setSettlementEvents((prev) => [newSettle, ...prev]);

    // Create Ledger entry
    const newLedger: LedgerEntry = {
      id: `LEDGER-20260902-${Date.now().toString().slice(-4)}`,
      timestamp: "2026-09-02 " + new Date().toLocaleTimeString("ko-KR", { hour12: false }) + " KST",
      type: isOtc ? "SECONDARY_TRADE" : "PRIMARY_SUBSCRIPTION",
      securitySymbol: targetOrder.securitySymbol,
      securityName: `${targetOrder.securityName} ${targetOrder.quantity}주`,
      description: `${targetOrder.securitySymbol} ${targetOrder.quantity}주 ${isOtc ? `24/7 OTC ${isBuy ? "매수" : "매도"}` : "1차 발행 청약"} 승인`,
      amountUsd: isBuy ? -totalCost : netProceeds,
      shares: isBuy ? targetOrder.quantity : -targetOrder.quantity,
      balanceAfterUsd: isBuy ? user.usdLedgerBalance - totalCost : user.usdLedgerBalance + netProceeds,
      txHash: "0x" + Math.random().toString(16).slice(2, 12),
      ksdReference: isOtc ? `INTERNAL-MM-${Date.now()}` : `KSD-TR-${Date.now()}`,
      taxWithheldKrw: 0,
      status: isOtc ? "RECONCILED" : "CONFIRMED",
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
    };

    setLedgerEntries((prev) => [newLedger, ...prev]);

    addNotification({
      title: `${targetOrder.securitySymbol} ${targetOrder.quantity}주 주문 승인 완료`,
      message: isOtc
        ? isBuy
          ? "24/7 즉시 결제가 완료되어 지갑에 수탁권리가 즉시 반영되었습니다."
          : "24/7 즉시 매도가 완료되어 USD 현금계좌에 정산금이 반영되었습니다."
        : "KRX 정규장 체결이 완료되었습니다. T+2 결제 대기 상태로 진행됩니다.",
      type: "success",
    });

    return true;
  };

  // Claim dividend
  const claimDividend = async (actionId: string): Promise<boolean> => {
    const ca = corporateActions.find((c) => c.id === actionId);
    if (!ca || !ca.userEntitlement?.claimableUsd) return false;

    const payoutUsd = ca.userEntitlement.claimableUsd;

    setUser((prev) => ({
      ...prev,
      usdLedgerBalance: prev.usdLedgerBalance + payoutUsd,
    }));

    setCorporateActions((prev) =>
      prev.map((c) =>
        c.id === actionId
          ? {
              ...c,
              userEntitlement: {
                ...c.userEntitlement!,
                status: "CLAIMED",
                claimedAt: "2026-09-02 " + new Date().toLocaleTimeString("ko-KR", { hour12: false }) + " KST",
              },
            }
          : c
      )
    );

    const newLedger: LedgerEntry = {
      id: `LEDGER-DIV-${Date.now().toString().slice(-4)}`,
      timestamp: "2026-09-02 " + new Date().toLocaleTimeString("ko-KR", { hour12: false }) + " KST",
      type: "DIVIDEND_PAYMENT",
      securitySymbol: ca.securitySymbol,
      securityName: ca.securityName,
      description: `${ca.securityName} 정기 분기 배당금 수령 (${payoutUsd.toFixed(2)} USD)`,
      amountUsd: payoutUsd,
      balanceAfterUsd: user.usdLedgerBalance + payoutUsd,
      txHash: "0x" + Math.random().toString(16).slice(2, 12),
      ksdReference: `KSD-DIV-${Date.now().toString().slice(-6)}`,
      taxWithheldKrw: Math.round(payoutUsd * 1380.3 * 0.15),
      status: "RECONCILED",
      receiptNumber: `REC-DIV-${Date.now().toString().slice(-6)}`,
    };

    setLedgerEntries((prev) => [newLedger, ...prev]);

    addNotification({
      title: `${ca.securitySymbol} 배당금 수령 완료`,
      message: `$${payoutUsd.toFixed(2)} USD가 고객 현금계좌로 즉시 입금되었습니다.`,
      type: "success",
    });

    return true;
  };

  // Submit proxy vote
  const submitProxyVote = async (
    actionId: string,
    proposalId: string,
    option: string
  ): Promise<boolean> => {
    setCorporateActions((prev) =>
      prev.map((c) =>
        c.id === actionId
          ? {
              ...c,
              userEntitlement: {
                ...c.userEntitlement!,
                status: "VOTED",
              },
            }
          : c
      )
    );

    addNotification({
      title: "주주총회 전자 의결권 행사 접수",
      message: `상임대리인(신한은행)을 통한 주총 안건 투표(${option})가 접수되었습니다.`,
      type: "success",
    });

    return true;
  };

  // Request redemption (T+2 KRX sale and USD payout)
  const requestRedemption = async (
    securityId: string,
    quantity: number
  ): Promise<boolean> => {
    const pos = positions.find((p) => p.securityId === securityId);
    if (!pos || pos.settledShares < quantity) return false;

    const sec = securities.find((s) => s.id === securityId);
    const estPayoutUsd = quantity * (sec?.usdPrice || 50);

    // Lock position shares in redemption
    setPositions((prev) =>
      prev.map((p) =>
        p.securityId === securityId
          ? {
              ...p,
              settledShares: p.settledShares - quantity,
              redemptionLockedShares: p.redemptionLockedShares + quantity,
              lastUpdated: "2026-09-02 " + new Date().toLocaleTimeString("ko-KR", { hour12: false }) + " KST",
            }
          : p
      )
    );

    const newOrder: Order = {
      id: `RED-2026-${Date.now().toString().slice(-6)}`,
      type: "REDEMPTION",
      side: "SELL",
      securityId,
      securitySymbol: pos.securitySymbol,
      securityName: pos.securityName,
      quantity,
      krwPrice: sec?.krwPrice || 78500,
      usdPrice: sec?.usdPrice || 56.87,
      totalUsd: estPayoutUsd,
      totalKrw: quantity * (sec?.krwPrice || 78500),
      fundingMode: "USD_LEDGER",
      status: "T2_SETTLEMENT_PENDING",
      createdAt: "2026-09-02 " + new Date().toLocaleTimeString("ko-KR", { hour12: false }) + " KST",
      settlementEta: "T+2일 16:00 KST (KRX 장내 매도 후 USD 송금)",
      feeUsd: estPayoutUsd * 0.002,
      investorId: user.id,
      responsibleEntity: "하나증권 (KRX 장내 매도) × 신한은행 (신탁 소각)",
      notes: "기초주식 KRX 장내 매도 및 토큰 소각 신청 완료. T+2 결제 대금 수령 즉시 USD 현금계좌로 지급됩니다.",
    };

    setOrders((prev) => [newOrder, ...prev]);

    addNotification({
      title: `${pos.securitySymbol} ${quantity}주 환매 신청 접수`,
      message: "토큰 소각 및 기초주식 KRX 매도 절차가 시작되었습니다. T+2일 정산됩니다.",
      type: "info",
    });

    return true;
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        updateUserProfile,
        completeKycOnboarding,
        user,
        securities,
        positions,
        orders,
        settlementEvents,
        corporateActions,
        ledgerEntries,
        selectedRole,
        setSelectedRole,
        agentCommandOpen,
        setAgentCommandOpen,
        activeAgentPlan,
        setActiveAgentPlan,
        notifications,
        addNotification,
        markNotificationRead,
        placeOrder,
        authorizeOrder,
        claimDividend,
        submitProxyVote,
        requestRedemption,
        totalPortfolioValueUsd,
        totalPortfolioReturnUsd,
        totalPortfolioReturnPercent,
        unclaimedDividendsUsd,
        currencyPreference,
        setCurrencyPreference,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
