const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/api/v1";

export const demoTokens = {
  investorA: "demo:investor-a",
  investorB: "demo:investor-b",
  denied: "demo:investor-denied",
  expired: "demo:investor-expired",
} as const;

export type DemoProfile = keyof typeof demoTokens;

export type PlatformMethod = "GET" | "POST";

export interface PlatformRequest {
  token?: string;
  method?: PlatformMethod;
  body?: unknown;
}

export interface PlatformErrorBody {
  code?: string;
  messageKo?: string;
  retryable?: boolean;
  responsibleRole?: string;
  nextActionKo?: string;
  requestId?: string;
  correlationId?: string;
  simulation?: true;
}

export class PlatformApiError extends Error {
  status: number;
  body: PlatformErrorBody;

  constructor(status: number, body: PlatformErrorBody) {
    super(body.messageKo ?? `요청 실패 (${status})`);
    this.name = "PlatformApiError";
    this.status = status;
    this.body = body;
  }
}

export async function platformFetch<T>(
  path: string,
  input: PlatformRequest = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (input.token) headers.Authorization = `Bearer ${input.token}`;
  if (input.method === "POST") {
    headers["Idempotency-Key"] = crypto.randomUUID();
    headers["X-Correlation-Id"] = crypto.randomUUID();
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: input.method ?? "GET",
    headers,
    ...(input.body === undefined ? {} : { body: JSON.stringify(input.body) }),
  });
  const data = (await response.json()) as T & PlatformErrorBody;
  if (!response.ok) throw new PlatformApiError(response.status, data);
  return data;
}

export interface BlockingReason {
  code: string;
  messageKo: string;
  nextActionKo?: string;
}

export interface Readiness {
  eligibility: string;
  investorProtection: string;
  wallet: string;
  activeWallet?: string;
  canPlaceNewOrder: boolean;
  canReceiveRights: boolean;
  blockingReasons: BlockingReason[];
}

export interface Session {
  actorId: string;
  role: string;
  customerReadiness?: Readiness;
  localPrimaryScenario?: LocalPrimaryScenario;
  localSecondaryScenario?: LocalSecondaryScenario;
  localRedemptionScenario?: LocalRedemptionScenario;
  localRightsScenario?: LocalRightsScenario;
  localInvestorJourney?: LocalInvestorJourney;
  projection: {
    projectionAsOf: string;
    lastEventSequence: number;
    projectionStatus: string;
  };
  simulation: true;
}

export interface LocalInvestorJourney {
  securityId: "990001";
  displayName: string;
  referenceSecurityId: "005930";
  referenceKrw: string;
  referenceUsdMinor: string;
  normalBidUsdMinor: string;
  normalAskUsdMinor: string;
  usdKrwRate: string;
  primary?: LocalPrimaryScenario;
  secondary?: LocalSecondaryScenario;
  redemption?: LocalRedemptionScenario;
  rights?: LocalRightsScenario;
  simulation: true;
}

export interface LocalPrimaryScenario {
  securityId: string;
  displayName: string;
  tokenSymbol: string;
  referenceLimitKrw: string;
  usdKrwRate: string;
  policyVersion: string;
  intentDomain: IntentDomain;
  cash?: {
    usdAvailableMinor: string;
    usdReservedMinor: string;
    usdcAvailableMinor: string;
  };
  notices: string[];
  simulation: true;
}

export interface LocalSecondaryScenario {
  securityId: string;
  displayName: string;
  tokenSymbol: string;
  tokenAddress: `0x${string}`;
  mockUsdcAddress: `0x${string}`;
  referenceSecurityId: string;
  referenceUsdMinor: string;
  normalAskUsdMinor: string;
  informationEffectiveAt: string;
  usdcUsd: string;
  halfSpreadBps: number;
  secondaryEnabled: boolean;
  policyVersion: string;
  intentDomain: IntentDomain;
  balances: {
    settledRights: string;
    pendingRights: string;
    reservedRights: string;
    usdAvailableMinor: string;
    usdReservedMinor: string;
    usdcAvailableMinor: string;
    usdcReservedMinor: string;
  };
  notices: string[];
  simulation: true;
}

export interface LocalRedemptionScenario {
  securityId: string;
  displayName: string;
  tokenSymbol: string;
  tokenAddress: `0x${string}`;
  referenceLimitKrw: string;
  policyVersion: string;
  intentDomain: IntentDomain;
  redeemableQuantity: string;
  notices: string[];
  simulation: true;
}

export interface LocalRightsScenario {
  securityId: string;
  dividend?: {
    eventId: string;
    recordDate: string;
    exDate: string;
    status: string;
    grossPerShareUsdMinor: string;
    domesticTotalUsdMinor: string;
    paymentId?: string;
    eligibleQuantity?: string;
    netUsdMinor?: string;
    paymentStatus?: string;
    quoteId?: string;
    quoteExpiresAt?: string;
    conversionStatus?: string;
    usdcPaidMinor?: string;
  };
  voting?: {
    meetingId: string;
    agendaId: string;
    titleKo: string;
    recordDate: string;
    instructionDeadline: string;
    eligibleQuantity: string;
    status: string;
    instruction?: "FOR" | "AGAINST" | "ABSTAIN";
    aggregateResult?: Record<string, string>;
    standingProxyResultEvidenceHash?: string;
  };
  recovery?: Record<string, unknown> & { status: string };
  corporateAction?: Record<string, unknown> & { status: string; security_id: string };
  notices: string[];
  simulation: true;
}

export interface IntentDomain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: `0x${string}`;
}

export interface Product {
  securityId: string;
  nameKo: string;
  referenceVersion: string;
  representative: boolean;
  candidateStatus: string;
  availability: {
    primary: string;
    secondary: string;
    redemption: string;
  };
  blockingReasons: BlockingReason[];
  notices: Record<string, string>;
  simulation: true;
}

export interface ProductPage {
  items: Product[];
  nextCursor?: string;
}

export interface Disclosure {
  disclosureId: string;
  version: string;
  titleKo: string;
  bodyKo: string;
  effectiveFrom: string;
  expiresAt?: string;
  responsibleRole: string;
  simulation: true;
}

export interface Consent {
  consentId?: string;
  disclosureId?: string;
  version?: string;
  status: string;
  consentedAt?: string;
  expiresAt?: string;
  simulation: true;
}

export interface Position {
  securityId: string;
  displayName: string;
  referenceSecurityId?: string;
  settledRights: string;
  pendingRights: string;
  lockedRights: string;
  burnPendingTokens: string;
  cashClaim?: { currency: "USD"; amountMinor: string; decimals: 2 };
  projection: Session["projection"];
}

export interface Activity {
  eventId: string;
  workflowId: string;
  workflowType: string;
  securityId?: string;
  eventType: string;
  category: "REQUEST" | "INSTITUTION_FACT" | "STATE" | "CHAIN" | "FUNDS" | "AUDIT";
  actorRoleKo: string;
  recordLayerKo: string;
  labelKo: string;
  occurredAt?: string;
  nextActionKo: string;
  simulation: true;
}

export interface Workflow {
  workflowId: string;
  workflowType: string;
  states: Array<{ axis: string; code: string; labelKo: string }>;
  simulation: true;
}

export interface WorkflowTimeline {
  workflowId: string;
  items: Array<{
    eventId: string;
    eventType: string;
    category: "REQUEST" | "INSTITUTION_FACT" | "STATE" | "CHAIN" | "FUNDS" | "AUDIT";
    actorRole?: string;
    actorRoleKo: string;
    recordLayerKo: string;
    sourceOrganization?: string;
    labelKo: string;
    occurredAt: string;
    nextActionKo: string;
    evidenceReference?: string;
    transactionHash?: string;
    simulation: true;
  }>;
  projection: Session["projection"];
}

export interface PrimaryOrder {
  orderId: string;
  securityId: string;
  shareQuantity: string;
  krwLimitPrice: string;
  fundingMode: string;
  requestedUsdMinor: string;
  convertedUsdcMinor: string;
  filledQuantity: string;
  allocatedQuantity: string;
  status: string;
  rightsStatus: string;
  tokenStatus: string;
  settlementStatus: string;
  quarantineReason?: string;
}

export interface SecondaryQuote {
  quoteId: string;
  securityId: string;
  designatedMarketMaker: string;
  marketMakerSide: "BUY" | "SELL";
  investorSide: "BUY" | "SELL";
  fundingMode: "USD_LEDGER" | "USDC_ONCHAIN";
  paymentAssetId: `0x${string}`;
  tokenAddress: `0x${string}`;
  remainingQuantity: string;
  unitPrice: { currency: "USD" | "USDC"; amountMinor: string; decimals: 2 | 6 };
  halfSpreadBps: number;
  status: string;
  expiresAt: string;
  simulation: true;
}

export interface SecondaryOrder {
  orderId: string;
  quoteId: string;
  securityId: string;
  investorSide: "BUY" | "SELL";
  fundingMode: "USD_LEDGER" | "USDC_ONCHAIN";
  requestedQuantity: string;
  fillQuantity: string;
  status: string;
  rightsStatus?: string;
  tokenStatus?: string;
  cashStatus?: string;
  quarantineReason?: string;
  [key: string]: unknown;
}

export interface Redemption {
  redemptionId: string;
  securityId: string;
  shareQuantity: string;
  krwLimitPrice: string;
  status: string;
  rightsStatus?: string;
  tokenStatus?: string;
  payoutStatus?: string;
  [key: string]: unknown;
}

export interface Complaint {
  complaintId: string;
  type: string;
  titleKo: string;
  descriptionKo?: string;
  status: string;
  responsibleRole?: string;
  relatedWorkflowId?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export async function allProducts(): Promise<Product[]> {
  const products: Product[] = [];
  let cursor: string | undefined;
  do {
    const page: ProductPage = await platformFetch(
      `/products?limit=100${cursor ? `&cursor=${cursor}` : ""}`,
    );
    products.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);
  return products;
}

export async function demoProducts(): Promise<Product[]> {
  const page = await platformFetch<ProductPage>("/products?scope=demo&limit=10");
  return page.items;
}
