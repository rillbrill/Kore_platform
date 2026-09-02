export type AssetCategory = "EQUITY" | "INFRASTRUCTURE" | "REAL_ESTATE" | "PRIVATE_DEBT";

export type SecurityStatus = 
  | "TRADING_ACTIVE" 
  | "PRIMARY_OPEN" 
  | "SECONDARY_247" 
  | "RESTRICTED" 
  | "CORPORATE_ACTION_HALT";

export interface OwnershipStructure {
  underlyingAsset: string;
  custodyArrangement: string;
  legalEntitlement: string;
  transferRestriction: string;
  bankruptcyRemoteness: string;
  regulatorRegistration: string;
}

export interface Security {
  id: string;
  krxCode: string;
  isin: string;
  name: string;
  nameEn: string;
  symbol: string;
  category: AssetCategory;
  krwPrice: number;
  usdPrice: number;
  change24h: number;
  change24hAmount: number;
  fxRate: number;
  marketCapKrw: string;
  marketCapUsd: string;
  volume24hUsd: string;
  status: SecurityStatus;
  primaryEligible: boolean;
  secondary247Eligible: boolean;
  redemptionEligible: boolean;
  underlyingSharesCustodied: number;
  tokenSupply: number;
  custodianBank: string;
  brokerExecutionDesk: string;
  contractAddress: string;
  ksdOmnibusAccountId: string;
  dividendYield: number;
  nextDividendDate: string;
  dividendPerShareKrw: number;
  spreadBps: number;
  description: string;
  riskRating: "LOW" | "MODERATE" | "SIGNIFICANT" | "HIGH";
  ownershipStructure: OwnershipStructure;
  tags: string[];
}

export type OrderType = "PRIMARY_ISSUANCE" | "SECONDARY_OTC" | "REDEMPTION";
export type OrderSide = "BUY" | "SELL";
export type FundingMode = "USD_LEDGER" | "USDC_ONCHAIN";
export type OrderStatus = 
  | "DRAFT" 
  | "PREFLIGHT_CHECKED" 
  | "AUTHORIZATION_PENDING" 
  | "SUBMITTED" 
  | "KRX_MATCHED" 
  | "T2_SETTLEMENT_PENDING" 
  | "SETTLED" 
  | "REJECTED" 
  | "CANCELLED";

export interface Order {
  id: string;
  type: OrderType;
  side: OrderSide;
  securityId: string;
  securitySymbol: string;
  securityName: string;
  quantity: number;
  krwPrice: number;
  usdPrice: number;
  totalUsd: number;
  totalKrw: number;
  fundingMode: FundingMode;
  status: OrderStatus;
  createdAt: string;
  settlementEta: string;
  txHash?: string;
  ksdRefId?: string;
  feeUsd: number;
  investorId: string;
  responsibleEntity: string;
  notes?: string;
}

export interface Position {
  id: string;
  securityId: string;
  securitySymbol: string;
  securityName: string;
  category: AssetCategory;
  totalShares: number;
  settledShares: number;
  pendingT2Shares: number;
  redemptionLockedShares: number;
  corporateActionFrozenShares: number;
  avgBuyPriceUsd: number;
  currentPriceUsd: number;
  currentValueUsd: number;
  totalReturnUsd: number;
  totalReturnPercent: number;
  accruedDividendUsd: number;
  custodyVaultProofId: string;
  lastUpdated: string;
}

export type SettlementStage = 
  | "INTENT_FILED" 
  | "BROKER_APPROVED" 
  | "KRX_EXECUTED" 
  | "KSD_OMNIBUS_DEPOSITED" 
  | "TRUST_LOCKBOX_SECURED" 
  | "DVP_TOKEN_ISSUED" 
  | "COMPLETED";

export interface AuditStep {
  step: string;
  entity: string;
  timestamp: string;
  status: "DONE" | "PROCESSING" | "WAITING";
  details: string;
  hash?: string;
}

export interface SettlementEvent {
  id: string;
  orderId: string;
  securitySymbol: string;
  securityName: string;
  quantity: number;
  amountUsd: number;
  type: OrderType;
  currentStage: SettlementStage;
  stageProgress: number; // 0 to 100
  initiatedAt: string;
  estimatedCompletion: string;
  responsibleEntity: string;
  auditLog: AuditStep[];
}

export type CorporateActionType = "CASH_DIVIDEND" | "STOCK_SPLIT" | "SHAREHOLDER_VOTE" | "MERGER";

export interface CorporateAction {
  id: string;
  securityId: string;
  securitySymbol: string;
  securityName: string;
  type: CorporateActionType;
  title: string;
  description: string;
  recordDate: string;
  effectiveDate: string;
  status: "ANNOUNCED" | "RECORD_LOCKED" | "PROCESSING" | "DISTRIBUTED" | "COMPLETED";
  details: {
    dividendPerShareUsd?: number;
    dividendPerShareKrw?: number;
    splitRatio?: string;
    voteProposals?: Array<{
      id: string;
      title: string;
      description: string;
      options: string[];
    }>;
  };
  userEntitlement?: {
    eligibleShares: number;
    claimableUsd?: number;
    status: "UNCLAIMED" | "CLAIMED" | "VOTED";
    claimedAt?: string;
  };
}

export type LedgerEntryType = 
  | "PRIMARY_SUBSCRIPTION" 
  | "SECONDARY_TRADE" 
  | "REDEMPTION_PAYOUT" 
  | "DIVIDEND_PAYMENT" 
  | "USDC_DEPOSIT" 
  | "USD_WITHDRAWAL";

export interface LedgerEntry {
  id: string;
  timestamp: string;
  type: LedgerEntryType;
  securitySymbol?: string;
  securityName?: string;
  description: string;
  amountUsd: number;
  shares?: number;
  balanceAfterUsd: number;
  txHash: string;
  ksdReference: string;
  taxWithheldKrw: number;
  status: "CONFIRMED" | "PENDING_AUDIT" | "RECONCILED";
  receiptNumber: string;
}

export interface PreflightCheckResult {
  check: string;
  status: "PASS" | "WARN" | "FAIL";
  details: string;
}

export interface AgentPlan {
  id: string;
  intent: string;
  interpretedGoal: string;
  riskTier: "LOW" | "MODERATE" | "HIGH";
  preflightChecks: PreflightCheckResult[];
  proposedAction: {
    type: OrderType;
    securityId: string;
    securitySymbol: string;
    securityName: string;
    quantity: number;
    estimatedPriceUsd: number;
    estimatedAmountUsd: number;
    estimatedFeeUsd: number;
    settlementMode: string;
    estimatedSettlementHours: string;
    custodyBank: string;
  };
  executionSteps: Array<{
    order: number;
    title: string;
    entity: string;
    description: string;
  }>;
  userAuthorizationRequired: boolean;
}

export type InstitutionalRole = 
  | "INVESTOR" 
  | "PLATFORM_OPERATOR" 
  | "OVERSEAS_BROKER_OPERATOR" 
  | "CUSTODY_TRUSTEE" 
  | "MARKET_MAKER" 
  | "COMPLIANCE_AUDITOR";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  country: string;
  kycStatus: "VERIFIED" | "IN_REVIEW" | "EXPIRED" | "REJECTED";
  kycExpiryDate: string;
  investorTier: "QUALIFIED_RETAIL" | "ACCREDITED" | "INSTITUTIONAL";
  walletAddress: string;
  walletStatus: "CONNECTED_VERIFIED" | "PENDING_SIGNATURE" | "UNLINKED";
  usdLedgerBalance: number;
  usdcOnChainBalance: number;
  foreignInvestorId: string;
  riskToleranceScore: number;
}
