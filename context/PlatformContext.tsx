"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  allProducts,
  demoTokens,
  platformFetch,
  type Activity,
  type Complaint,
  type Consent,
  type DemoProfile,
  type Disclosure,
  type Position,
  type PrimaryOrder,
  type Product,
  type Redemption,
  type SecondaryOrder,
  type SecondaryQuote,
  type Session,
} from "@/lib/platform-api";

interface PlatformSnapshot {
  session?: Session;
  disclosure?: Disclosure;
  consent?: Consent;
  products: Product[];
  positions: Position[];
  activities: Activity[];
  primaryOrders: PrimaryOrder[];
  secondaryOrders: SecondaryOrder[];
  secondaryQuotes: SecondaryQuote[];
  redemptions: Redemption[];
  complaints: Complaint[];
}

interface PlatformContextType extends PlatformSnapshot {
  profile: DemoProfile;
  token: string;
  loading: boolean;
  connected: boolean;
  message: string;
  error: string | null;
  setProfile: (profile: DemoProfile) => void;
  refresh: () => Promise<void>;
}

const emptySnapshot: PlatformSnapshot = {
  products: [],
  positions: [],
  activities: [],
  primaryOrders: [],
  secondaryOrders: [],
  secondaryQuotes: [],
  redemptions: [],
  complaints: [],
};

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<DemoProfile>("investorA");
  const [snapshot, setSnapshot] = useState<PlatformSnapshot>(emptySnapshot);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("rwa-8th 플랫폼 API 연결을 준비하는 중이다.");
  const [error, setError] = useState<string | null>(null);
  const refreshSequence = useRef(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rwa_demo_profile") as DemoProfile | null;
      if (stored && stored in demoTokens) setProfileState(stored);
    } catch {
      // Storage is optional; the platform still works with the default synthetic profile.
    }
  }, []);

  const token = demoTokens[profile];

  const refresh = useCallback(async () => {
    const sequence = ++refreshSequence.current;
    setLoading(true);
    setError(null);

    try {
      const [
        session,
        disclosure,
        consent,
        products,
        positionPage,
        activityPage,
        primaryPage,
        secondaryPage,
        redemptionPage,
        complaintPage,
      ] = await Promise.all([
        platformFetch<Session>("/session", { token }),
        platformFetch<Disclosure>("/disclosures/current"),
        platformFetch<Consent>("/disclosure-consents/current", { token }),
        allProducts(),
        platformFetch<{ items: Position[] }>("/positions?limit=100", { token }),
        platformFetch<{ items: Activity[] }>("/activities?limit=100", { token }),
        platformFetch<{ items: PrimaryOrder[] }>("/primary-orders", { token }),
        platformFetch<{ items: SecondaryOrder[] }>("/secondary-orders", { token }),
        platformFetch<{ items: Redemption[] }>("/redemptions", { token }),
        platformFetch<{ items: Complaint[] }>("/complaints", { token }),
      ]);

      const quotePages = await Promise.all(
        (["USD_LEDGER", "USDC_ONCHAIN"] as const).flatMap((fundingMode) =>
          (["BUY", "SELL"] as const).map((investorSide) =>
            platformFetch<{ items: SecondaryQuote[] }>(
              `/quotes?securityId=990001&investorSide=${investorSide}&fundingMode=${fundingMode}`,
            ),
          ),
        ),
      );

      if (sequence !== refreshSequence.current) return;
      setSnapshot({
        session,
        disclosure,
        consent,
        products,
        positions: positionPage.items,
        activities: activityPage.items,
        primaryOrders: primaryPage.items,
        secondaryOrders: secondaryPage.items,
        secondaryQuotes: quotePages.flatMap((page) => page.items),
        redemptions: redemptionPage.items,
        complaints: complaintPage.items,
      });
      setConnected(true);
      setMessage("rwa-8th 플랫폼 projection을 최신 상태로 불러왔다.");
    } catch (nextError) {
      if (sequence !== refreshSequence.current) return;
      setConnected(false);
      setError(nextError instanceof Error ? nextError.message : "플랫폼 API 연결에 실패했다.");
      setMessage("플랫폼 API가 준비되지 않아 기존 목업 UI를 유지한다.");
    } finally {
      if (sequence === refreshSequence.current) setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setProfile = useCallback((nextProfile: DemoProfile) => {
    setProfileState(nextProfile);
    try {
      localStorage.setItem("rwa_demo_profile", nextProfile);
    } catch {
      // Ignore storage failures; the in-memory profile is enough for this session.
    }
  }, []);

  const value = useMemo<PlatformContextType>(
    () => ({
      ...snapshot,
      profile,
      token,
      loading,
      connected,
      message,
      error,
      setProfile,
      refresh,
    }),
    [connected, error, loading, message, profile, refresh, setProfile, snapshot, token],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) throw new Error("usePlatform must be used within PlatformProvider");
  return context;
}
