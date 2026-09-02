"use client";

import { keccak256, toHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  platformFetch,
  type DemoProfile,
  type Disclosure,
  type LocalPrimaryScenario,
  type LocalRedemptionScenario,
  type LocalSecondaryScenario,
  type SecondaryQuote,
  type Session,
} from "@/lib/platform-api";

export interface AcceptedCommand {
  requestId: string;
  workflowId: string;
  status: "ACCEPTED";
  statusUrl?: string;
  simulation: true;
}

export function walletOwnershipMessage(
  principalId: string,
  wallet: string,
  purpose: "LINK" | "REPLACE",
): string {
  return `K-EQUITY:${purpose}:${principalId}:${wallet.toLowerCase()}`;
}

export function demoOrderAccount(profile: DemoProfile) {
  if (profile === "investorA") return privateKeyToAccount(keccak256(toHex("PRIMARY-DEMO-A")));
  if (profile === "investorB") return privateKeyToAccount(keccak256(toHex("PRIMARY-DEMO-B")));
  return undefined;
}

function uuidToBytes16(id: string): `0x${string}` {
  return `0x${id.replaceAll("-", "")}` as `0x${string}`;
}

export async function acceptDisclosureCommand(input: {
  disclosure: Disclosure;
  token: string;
}): Promise<AcceptedCommand> {
  return platformFetch<AcceptedCommand>("/disclosure-consents", {
    token: input.token,
    method: "POST",
    body: {
      disclosureId: input.disclosure.disclosureId,
      version: input.disclosure.version,
      consentedAt: new Date().toISOString(),
    },
  });
}

export async function linkDemoWalletCommand(input: {
  session: Session;
  token: string;
  profile: DemoProfile;
  replaceExisting?: boolean;
}): Promise<AcceptedCommand> {
  const account =
    input.replaceExisting || input.session.customerReadiness?.activeWallet
      ? privateKeyToAccount(generatePrivateKey())
      : (demoOrderAccount(input.profile) ?? privateKeyToAccount(generatePrivateKey()));
  const signature = await account.signMessage({
    message: walletOwnershipMessage(input.session.actorId, account.address, "LINK"),
  });

  return platformFetch<AcceptedCommand>("/wallet-link-requests", {
    token: input.token,
    method: "POST",
    body: { wallet: account.address, ownershipSignature: signature },
  });
}

export async function requestWalletReplacementCommand(input: {
  session: Session;
  token: string;
  oldWallet: string;
  reasonKo?: string;
}): Promise<AcceptedCommand> {
  const account = privateKeyToAccount(generatePrivateKey());
  const signature = await account.signMessage({
    message: walletOwnershipMessage(input.session.actorId, account.address, "REPLACE"),
  });

  return platformFetch<AcceptedCommand>("/wallet-replacement-requests", {
    token: input.token,
    method: "POST",
    body: {
      oldWallet: input.oldWallet,
      newWallet: account.address,
      reasonKo: input.reasonKo ?? "시험 전용 지갑 교체",
      newWalletSignature: signature,
    },
  });
}

export async function submitPrimaryOrderCommand(input: {
  scenario: LocalPrimaryScenario;
  token: string;
  profile: DemoProfile;
  quantity: number | string;
  fundingMode: string;
  targetTradingDate?: string;
}): Promise<AcceptedCommand> {
  const account = demoOrderAccount(input.profile);
  if (!account) throw new Error("이 demo profile은 signed order intent를 만들 수 없다.");

  const quantity = String(input.quantity);
  const limit = input.scenario.referenceLimitKrw;
  const orderId = crypto.randomUUID();
  const fundingAmountMinor = (
    (BigInt(quantity) * BigInt(limit) * 1000n + 13802n) /
    13803n
  ).toString();
  const expiresAt = String(Math.floor(Date.now() / 1000) + 3600);
  const policyVersion = keccak256(toHex(input.scenario.policyVersion));
  const targetTradingDate = input.targetTradingDate ?? "2026-08-31";
  const message = {
    orderId,
    investor: account.address,
    securityId: input.scenario.securityId,
    shareQuantity: quantity,
    krwLimitPrice: limit,
    targetTradingDate,
    fundingMode: input.fundingMode,
    fundingAmountMinor,
    nonce: String(Date.now()),
    expiresAt,
    policyVersion,
  };

  const signature = await account.signTypedData({
    domain: input.scenario.intentDomain,
    types: {
      PrimaryOrderIntent: [
        { name: "orderId", type: "bytes16" },
        { name: "investor", type: "address" },
        { name: "securityId", type: "string" },
        { name: "shareQuantity", type: "uint256" },
        { name: "krwLimitPrice", type: "uint256" },
        { name: "targetTradingDate", type: "string" },
        { name: "fundingMode", type: "string" },
        { name: "fundingAmountMinor", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "expiresAt", type: "uint256" },
        { name: "policyVersion", type: "bytes32" },
      ],
    },
    primaryType: "PrimaryOrderIntent",
    message: {
      ...message,
      orderId: uuidToBytes16(orderId),
      shareQuantity: BigInt(quantity),
      krwLimitPrice: BigInt(limit),
      fundingAmountMinor: BigInt(fundingAmountMinor),
      nonce: BigInt(message.nonce),
      expiresAt: BigInt(expiresAt),
    },
  });

  return platformFetch<AcceptedCommand>("/primary-orders", {
    token: input.token,
    method: "POST",
    body: {
      securityId: message.securityId,
      shareQuantity: quantity,
      krwLimitPrice: limit,
      targetTradingDate,
      fundingMode: input.fundingMode,
      signedIntent: {
        domain: input.scenario.intentDomain,
        primaryType: "PrimaryOrderIntent",
        message,
        signer: account.address,
        signature,
      },
    },
  });
}

export async function submitSecondaryOrderCommand(input: {
  scenario: LocalSecondaryScenario;
  token: string;
  profile: DemoProfile;
  quote: SecondaryQuote;
  quantity: number | string;
}): Promise<AcceptedCommand> {
  const account = demoOrderAccount(input.profile);
  if (!account) throw new Error("이 demo profile은 signed order intent를 만들 수 없다.");

  const quantity = String(input.quantity);
  const orderId = crypto.randomUUID();
  const paymentAmountMinor = (BigInt(input.quote.unitPrice.amountMinor) * BigInt(quantity)).toString();
  const expiresAt = String(Math.floor(new Date(input.quote.expiresAt).getTime() / 1000));
  const message = {
    orderId,
    quoteId: input.quote.quoteId,
    investor: account.address,
    token: input.quote.tokenAddress,
    investorSide: input.quote.investorSide,
    paymentMode: input.quote.fundingMode,
    paymentAssetId: input.quote.paymentAssetId,
    shareQuantity: quantity,
    paymentAmountMinor,
    nonce: String(Date.now()),
    expiresAt,
    policyVersion: keccak256(toHex(input.scenario.policyVersion)),
  };

  const signature = await account.signTypedData({
    domain: input.scenario.intentDomain,
    types: {
      SecondaryOrderIntent: [
        { name: "orderId", type: "bytes16" },
        { name: "quoteId", type: "bytes16" },
        { name: "investor", type: "address" },
        { name: "token", type: "address" },
        { name: "investorSide", type: "string" },
        { name: "paymentMode", type: "string" },
        { name: "paymentAssetId", type: "bytes32" },
        { name: "shareQuantity", type: "uint256" },
        { name: "paymentAmountMinor", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "expiresAt", type: "uint256" },
        { name: "policyVersion", type: "bytes32" },
      ],
    },
    primaryType: "SecondaryOrderIntent",
    message: {
      ...message,
      orderId: uuidToBytes16(orderId),
      quoteId: uuidToBytes16(input.quote.quoteId),
      shareQuantity: BigInt(quantity),
      paymentAmountMinor: BigInt(paymentAmountMinor),
      nonce: BigInt(message.nonce),
      expiresAt: BigInt(expiresAt),
    },
  });

  return platformFetch<AcceptedCommand>("/secondary-orders", {
    token: input.token,
    method: "POST",
    body: {
      quoteId: input.quote.quoteId,
      shareQuantity: quantity,
      investorSide: input.quote.investorSide,
      fundingMode: input.quote.fundingMode,
      signedIntent: {
        domain: input.scenario.intentDomain,
        primaryType: "SecondaryOrderIntent",
        message,
        signer: account.address,
        signature,
      },
    },
  });
}

export async function submitRedemptionCommand(input: {
  scenario: LocalRedemptionScenario;
  token: string;
  profile: DemoProfile;
  quantity: number | string;
  targetTradingDate?: string;
}): Promise<AcceptedCommand> {
  const account = demoOrderAccount(input.profile);
  if (!account) throw new Error("이 demo profile은 signed redemption intent를 만들 수 없다.");

  const quantity = String(input.quantity);
  const redemptionId = crypto.randomUUID();
  const expiresAt = String(Math.floor(Date.now() / 1000) + 3600);
  const targetTradingDate = input.targetTradingDate ?? "2026-08-31";
  const message = {
    redemptionId,
    investor: account.address,
    token: input.scenario.tokenAddress,
    shareQuantity: quantity,
    krwLimitPrice: input.scenario.referenceLimitKrw,
    targetTradingDate,
    nonce: String(Date.now()),
    expiresAt,
    policyVersion: keccak256(toHex(input.scenario.policyVersion)),
  };

  const signature = await account.signTypedData({
    domain: input.scenario.intentDomain,
    types: {
      RedemptionIntent: [
        { name: "redemptionId", type: "bytes16" },
        { name: "investor", type: "address" },
        { name: "token", type: "address" },
        { name: "shareQuantity", type: "uint256" },
        { name: "krwLimitPrice", type: "uint256" },
        { name: "targetTradingDate", type: "string" },
        { name: "nonce", type: "uint256" },
        { name: "expiresAt", type: "uint256" },
        { name: "policyVersion", type: "bytes32" },
      ],
    },
    primaryType: "RedemptionIntent",
    message: {
      ...message,
      redemptionId: uuidToBytes16(redemptionId),
      shareQuantity: BigInt(quantity),
      krwLimitPrice: BigInt(message.krwLimitPrice),
      nonce: BigInt(message.nonce),
      expiresAt: BigInt(expiresAt),
    },
  });

  return platformFetch<AcceptedCommand>("/redemptions", {
    token: input.token,
    method: "POST",
    body: {
      securityId: input.scenario.securityId,
      shareQuantity: quantity,
      krwLimitPrice: message.krwLimitPrice,
      targetTradingDate,
      signedIntent: {
        domain: input.scenario.intentDomain,
        primaryType: "RedemptionIntent",
        message,
        signer: account.address,
        signature,
      },
    },
  });
}

export async function submitDividendConversionCommand(input: {
  token: string;
  dividendPaymentId: string;
  quoteId: string;
}): Promise<AcceptedCommand> {
  return platformFetch<AcceptedCommand>("/dividend-conversions", {
    token: input.token,
    method: "POST",
    body: {
      dividendPaymentId: input.dividendPaymentId,
      quoteId: input.quoteId,
    },
  });
}

export async function submitVotingInstructionCommand(input: {
  token: string;
  meetingId: string;
  agendaId: string;
  instruction: "FOR" | "AGAINST" | "ABSTAIN";
}): Promise<AcceptedCommand> {
  return platformFetch<AcceptedCommand>("/voting-instructions", {
    token: input.token,
    method: "POST",
    body: {
      meetingId: input.meetingId,
      agendaId: input.agendaId,
      instruction: input.instruction,
    },
  });
}

export async function cancelRedemptionCommand(input: {
  token: string;
  redemptionId: string;
  reasonKo?: string;
}): Promise<AcceptedCommand> {
  return platformFetch<AcceptedCommand>(`/redemptions/${input.redemptionId}/cancellations`, {
    token: input.token,
    method: "POST",
    body: { reasonKo: input.reasonKo ?? "국내 제출 전 투자자 취소" },
  });
}
