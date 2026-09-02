import type { Activity, Product, Position as PlatformPosition } from "@/lib/platform-api";
import type { LedgerEntry, Position, Security, SecurityStatus } from "@/types/domain";

function numberFromText(value: string | undefined, fallback = 0) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function statusFromAvailability(product: Product): SecurityStatus {
  if (product.availability.secondary === "ENABLED") return "SECONDARY_247";
  if (product.availability.primary === "ENABLED") return "PRIMARY_OPEN";
  if (product.blockingReasons.length > 0) return "RESTRICTED";
  return "TRADING_ACTIVE";
}

export function productToSecurity(product: Product, fallback?: Security): Security {
  const status = statusFromAvailability(product);
  return {
    id: product.securityId,
    krxCode: fallback?.krxCode ?? product.securityId,
    isin: fallback?.isin ?? "",
    name: product.nameKo,
    nameEn: fallback?.nameEn ?? product.nameKo,
    symbol: fallback?.symbol ?? product.securityId,
    category: fallback?.category ?? "EQUITY",
    krwPrice: fallback?.krwPrice ?? 0,
    usdPrice: fallback?.usdPrice ?? 0,
    change24h: fallback?.change24h ?? 0,
    change24hAmount: fallback?.change24hAmount ?? 0,
    fxRate: fallback?.fxRate ?? 1380.3,
    marketCapKrw: fallback?.marketCapKrw ?? "-",
    marketCapUsd: fallback?.marketCapUsd ?? "-",
    volume24hUsd: fallback?.volume24hUsd ?? "-",
    status,
    primaryEligible: product.availability.primary === "ENABLED",
    secondary247Eligible: product.availability.secondary === "ENABLED",
    redemptionEligible: product.availability.redemption === "ENABLED",
    underlyingSharesCustodied: fallback?.underlyingSharesCustodied ?? 0,
    tokenSupply: fallback?.tokenSupply ?? 0,
    custodianBank: fallback?.custodianBank ?? "모의 수탁기관 응답",
    brokerExecutionDesk: fallback?.brokerExecutionDesk ?? "인가 해외 증권사",
    contractAddress: fallback?.contractAddress ?? "",
    ksdOmnibusAccountId: fallback?.ksdOmnibusAccountId ?? "모의 외부 응답",
    dividendYield: fallback?.dividendYield ?? 0,
    nextDividendDate: fallback?.nextDividendDate ?? "-",
    dividendPerShareKrw: fallback?.dividendPerShareKrw ?? 0,
    spreadBps: fallback?.spreadBps ?? 0,
    description:
      product.notices?.summary ??
      fallback?.description ??
      "모의 한국주식 수탁권리 상품. 기능별 가능 여부와 차단 사유는 플랫폼 기준정보를 따른다.",
    riskRating: fallback?.riskRating ?? "SIGNIFICANT",
    ownershipStructure:
      fallback?.ownershipStructure ?? {
        underlyingAsset: product.nameKo,
        custodyArrangement: "모의 기관 응답으로 수탁 확인",
        legalEntitlement: "인가 해외 증권사의 고객별 수탁권리 기록",
        transferRestriction: "허용된 업무 흐름 외 직접 이전 제한",
        bankruptcyRemoteness: "PoC 설명용 구조. 실제 법적 효력 주장 아님",
        regulatorRegistration: "모의 환경",
      },
    tags: [
      product.representative ? "PoC 대표 종목" : "KOSPI200 후보",
      product.candidateStatus,
      status,
    ],
  };
}

export function productsToSecurities(products: Product[], fallbacks: Security[]) {
  if (!products.length) return fallbacks;
  return products.map((product) => {
    const fallback =
      fallbacks.find((item) => item.id === product.securityId) ??
      fallbacks.find((item) => item.krxCode === product.securityId);
    return productToSecurity(product, fallback);
  });
}

export function platformPositionToPosition(
  item: PlatformPosition,
  security?: Security,
): Position {
  const settled = numberFromText(item.settledRights);
  const pending = numberFromText(item.pendingRights);
  const locked = numberFromText(item.lockedRights);
  const burnPending = numberFromText(item.burnPendingTokens);
  const totalShares = settled + pending + locked + burnPending;
  const currentPriceUsd = security?.usdPrice ?? 0;
  return {
    id: `PLATFORM-POS-${item.securityId}`,
    securityId: item.securityId,
    securitySymbol: security?.symbol ?? item.referenceSecurityId ?? item.securityId,
    securityName: item.displayName,
    category: security?.category ?? "EQUITY",
    totalShares,
    settledShares: settled,
    pendingT2Shares: pending,
    redemptionLockedShares: locked,
    corporateActionFrozenShares: burnPending,
    avgBuyPriceUsd: currentPriceUsd,
    currentPriceUsd,
    currentValueUsd: totalShares * currentPriceUsd,
    totalReturnUsd: 0,
    totalReturnPercent: 0,
    accruedDividendUsd: item.cashClaim ? numberFromText(item.cashClaim.amountMinor) / 100 : 0,
    custodyVaultProofId: `WORKFLOW-PROJECTION-${item.projection.lastEventSequence}`,
    lastUpdated: item.projection.projectionAsOf,
  };
}

export function platformPositionsToPositions(
  positions: PlatformPosition[],
  securities: Security[],
  fallback: Position[],
) {
  if (!positions.length) return fallback;
  return positions.map((item) =>
    platformPositionToPosition(
      item,
      securities.find((security) => security.id === item.securityId),
    ),
  );
}

export function activityToLedgerEntry(activity: Activity): LedgerEntry {
  return {
    id: activity.eventId,
    timestamp: activity.occurredAt ?? "",
    type: "SECONDARY_TRADE",
    securitySymbol: activity.securityId,
    securityName: activity.workflowType,
    description: activity.labelKo,
    amountUsd: 0,
    balanceAfterUsd: 0,
    txHash: activity.workflowId,
    ksdReference: activity.recordLayerKo,
    taxWithheldKrw: 0,
    status: activity.category === "AUDIT" ? "RECONCILED" : "CONFIRMED",
    receiptNumber: activity.eventId,
  };
}

export function activitiesToLedgerEntries(activities: Activity[], fallback: LedgerEntry[]) {
  if (!activities.length) return fallback;
  return activities.map(activityToLedgerEntry);
}
