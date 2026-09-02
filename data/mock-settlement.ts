import { SettlementEvent } from "@/types/domain";

export const MOCK_SETTLEMENT_EVENTS: SettlementEvent[] = [
  {
    id: "SETTLE-2026-0902-001",
    orderId: "ORD-2026-0902-881",
    securitySymbol: "SEC",
    securityName: "삼성전자 (50주)",
    quantity: 50,
    amountUsd: 2843.50,
    type: "PRIMARY_ISSUANCE",
    currentStage: "KSD_OMNIBUS_DEPOSITED",
    stageProgress: 100,
    initiatedAt: "2026-09-01 15:40:22 KST",
    estimatedCompletion: "2026-09-01 15:40:25 KST",
    responsibleEntity: "국내 공인 수탁은행 & 인가 증권사",
    auditLog: [
      {
        step: "1. 투자자 주문 접수 및 위험한도 승인",
        entity: "Hanchi 글로벌 플랫폼",
        timestamp: "2026-09-01 15:40:22 KST",
        status: "DONE",
        details: "적격 투자자 KYC 유효 확인, USD 에스크로 2,843.50 USD 결제 완료.",
        hash: "0x9f8a...3312",
      },
      {
        step: "2. 24/7 즉시 유동성 매칭 및 DVP 결제",
        entity: "인가 증권사 및 지정 유동성 공급자",
        timestamp: "2026-09-01 15:40:23 KST",
        status: "DONE",
        details: "78,500 KRW 기준 50주 전량 즉시 체결 및 잔고 반영 완료.",
        hash: "0xaa32...bc88",
      },
      {
        step: "3. KSD 외국인 통합보관계좌 실물 1:1 대사 완료",
        entity: "한국예탁결제원(KSD) 및 공인 수탁은행",
        timestamp: "2026-09-01 15:40:24 KST",
        status: "DONE",
        details: "외국인 통합계좌 내 신탁 1:1 보관 증명 대사 완료.",
        hash: "0xfe99...4421",
      },
    ],
  },
];
