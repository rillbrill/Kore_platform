import { AgentPlan } from "@/types/domain";

export const PRESET_AGENT_INTENTS: Array<{ query: string; plan: AgentPlan }> = [
  {
    query: "삼성전자 50주 1차 발행 주문 준비해줘",
    plan: {
      id: "PLAN-SEC-BUY-50",
      intent: "삼성전자 50주 1차 발행 주문 준비해줘",
      interpretedGoal: "KRX 정규장 일괄 체결을 통한 삼성전자 보통주 수탁권리(dSEC) 50주 1차 발행 청약",
      riskTier: "MODERATE",
      preflightChecks: [
        {
          check: "외국인 투자자 적격성 & LEI 유효성",
          status: "PASS",
          details: "LEI-SG-2026-992140 싱가포르 거주 적격 전문개인투자자 확인 완료",
        },
        {
          check: "원화/달러 한도 및 USD 에스크로 가용잔액",
          status: "PASS",
          details: "필요금액: 2,843.50 USD / 가용잔액: 84,250.00 USD (충분)",
        },
        {
          check: "KOSPI 200 외국인 지분 취득 한도",
          status: "PASS",
          details: "삼성전자 현재 외인소진율 54.2% (한도 미초과)",
        },
        {
          check: "T+2 결제 위험 보증 한도",
          status: "PASS",
          details: "인가 증권사 일일 T+2 결제 허용 한도 내 승인 가능",
        },
      ],
      proposedAction: {
        type: "PRIMARY_ISSUANCE",
        securityId: "990001",
        securitySymbol: "dSEC",
        securityName: "삼성전자 수탁권리 dShare",
        quantity: 50,
        estimatedPriceUsd: 56.87,
        estimatedAmountUsd: 2843.50,
        estimatedFeeUsd: 4.25,
        settlementMode: "KRX T+2 정규 결제 (신한은행 신탁 보관)",
        estimatedSettlementHours: "T+2일 16:00 KST",
        custodyBank: "신한은행 신탁부",
      },
      executionSteps: [
        {
          order: 1,
          title: "USD 주문 증거금 예약",
          entity: "인가 해외 증권사",
          description: "고객 현금계좌에서 $2,847.75(수수료 포함) 임시 에스크로 홀드",
        },
        {
          order: 2,
          title: "KRX 장내 보통주 묶음 주문 집행",
          entity: "하나증권 글로벌 기관 데스크",
          description: "한국거래소 정규장에 78,500 KRW 지정가 50주 일괄 발주 및 체결",
        },
        {
          order: 3,
          title: "KSD 외국인 통합계좌 결제 및 신탁 기입",
          entity: "한국예탁결제원 & 신한은행",
          description: "한국 증권결제원 T+2 결제 완료 후 신탁재산 도산격리 확인서 발급",
        },
        {
          order: 4,
          title: "1:1 수탁권리 토큰(dSEC) 발행",
          entity: "오라클 RWA 스마트 컨트랙트",
          description: "고객 지갑으로 50 dSEC 발행 및 즉시 24/7 OTC 매매 권한 부여",
        },
      ],
      userAuthorizationRequired: true,
    },
  },
  {
    query: "현재 결제 대기 중인 자산 상태와 예상 완료 시점 알려줘",
    plan: {
      id: "PLAN-SETTLEMENT-WATCH",
      intent: "현재 결제 대기 중인 자산 상태와 예상 완료 시점 알려줘",
      interpretedGoal: "T+2 결제 파이프라인 및 KSD 통합계좌 실시간 DVP 진행 상황 감사 조회",
      riskTier: "LOW",
      preflightChecks: [
        {
          check: "실시간 노드 및 KSD 연계 상태",
          status: "PASS",
          details: "KSD 통합 인터페이스 정상 작동 중 (지연 12ms)",
        },
        {
          check: "신탁은행 실물 대사 현황",
          status: "PASS",
          details: "신한은행 신탁계정 일일 잔고 대조 100% 일치 확인",
        },
      ],
      proposedAction: {
        type: "PRIMARY_ISSUANCE",
        securityId: "990001",
        securitySymbol: "dSEC",
        securityName: "삼성전자 수탁권리 50주 결제 모니터링",
        quantity: 50,
        estimatedPriceUsd: 56.87,
        estimatedAmountUsd: 2843.50,
        estimatedFeeUsd: 0,
        settlementMode: "T+2 KSD 결제 진행 68%",
        estimatedSettlementHours: "내일 16:00 KST 결제 완료 예정",
        custodyBank: "신한은행 신탁부",
      },
      executionSteps: [
        {
          order: 1,
          title: "KSD 결제 대기열 확인",
          entity: "한국예탁결제원",
          description: "국내 결제 완료 D-1 단계 진입 확인됨",
        },
        {
          order: 2,
          title: "신탁 금고 증명서 생성",
          entity: "신한은행 신탁사업부",
          description: "도산격리 법적 실사 리포트 자동 첨부",
        },
      ],
      userAuthorizationRequired: false,
    },
  },
  {
    query: "이번 분기 미청구 배당금 전부 청구해줘",
    plan: {
      id: "PLAN-CLAIM-DIVIDENDS",
      intent: "이번 분기 미청구 배당금 전부 청구해줘",
      interpretedGoal: "dSEC, dKBF, dKREI 미청구 배당금 $713.79 일괄 USD 현금계좌 정산",
      riskTier: "LOW",
      preflightChecks: [
        {
          check: "배당 기준일 수탁권리 보유 확정 여부",
          status: "PASS",
          details: "3개 종목 배당 기준일 정기 스냅샷 적격 판정",
        },
        {
          check: "한-싱가포르 조세조약 외국인 원천징수율 적용",
          status: "PASS",
          details: "국제 조세협약에 따른 배당소득 원천징수(15%) 자동 공제 반영",
        },
      ],
      proposedAction: {
        type: "PRIMARY_ISSUANCE",
        securityId: "ALL",
        securitySymbol: "MULTI-DIVIDEND",
        securityName: "3개 자산 배당금 일괄 수령",
        quantity: 3,
        estimatedPriceUsd: 713.79,
        estimatedAmountUsd: 713.79,
        estimatedFeeUsd: 0,
        settlementMode: "USD Ledger 즉시 입금",
        estimatedSettlementHours: "승인 즉시 (T+0)",
        custodyBank: "신한은행 / 하나은행",
      },
      executionSteps: [
        {
          order: 1,
          title: "KSD 배당금 수령분 확정",
          entity: "인가 해외 증권사",
          description: "신탁계좌에 입금된 원화 배당금 실시간 FX 환전 ($713.79 USD)",
        },
        {
          order: 2,
          title: "고객 USD 원장 입금 및 영수증 발급",
          entity: "오라클 RWA 플랫폼",
          description: "고객 잔액 갱신 ($84,250 -> $84,963.79) 및 세무 서류 저장",
        },
      ],
      userAuthorizationRequired: true,
    },
  }
];

export function parseNaturalLanguageIntent(query: string): AgentPlan {
  const trimmed = query.trim().toLowerCase();
  
  if (trimmed.includes("삼성") || trimmed.includes("sec") || trimmed.includes("samsung") || trimmed.includes("50주")) {
    return PRESET_AGENT_INTENTS[0].plan;
  }
  if (trimmed.includes("결제") || trimmed.includes("대기") || trimmed.includes("진행") || trimmed.includes("settle")) {
    return PRESET_AGENT_INTENTS[1].plan;
  }
  if (trimmed.includes("배당") || trimmed.includes("청구") || trimmed.includes("dividend")) {
    return PRESET_AGENT_INTENTS[2].plan;
  }

  return {
    id: `PLAN-CUSTOM-${Date.now().toString().slice(-6)}`,
    intent: query,
    interpretedGoal: `사용자 자연어 요청 분석: "${query}"에 대한 규제 준수형 실행 계획 수립`,
    riskTier: "MODERATE",
    preflightChecks: [
      {
        check: "고객 KYC/AML 유효 상태",
        status: "PASS",
        details: "적격 투자자 (Accredited Non-Resident) 인증 유효",
      },
      {
        check: "KOSPI 200 외국인 투자한도 및 수탁 가능성",
        status: "PASS",
        details: "신한은행 신탁부 1:1 수탁 및 KSD 계좌 연계 정상",
      },
      {
        check: "유동성 및 시장조성자 재고 검증",
        status: "PASS",
        details: "24/7 OTC 스프레드 12bps 이내, 지정 MM 호가 유효",
      },
    ],
    proposedAction: {
      type: "SECONDARY_OTC",
      securityId: "990001",
      securitySymbol: "dSEC",
      securityName: "삼성전자 수탁권리 dShare",
      quantity: 10,
      estimatedPriceUsd: 56.87,
      estimatedAmountUsd: 568.70,
      estimatedFeeUsd: 1.20,
      settlementMode: "24/7 즉시 DVP (Internal Omnibus Ledger)",
      estimatedSettlementHours: "즉시 (3초 내 완료)",
      custodyBank: "신한은행 신탁부",
    },
    executionSteps: [
      {
        order: 1,
        title: "호가 고정 및 슬리피지 방지 락",
        entity: "오라클 Settlement Engine",
        description: "30초 유효 지정가 호가 체결 보증",
      },
      {
        order: 2,
        title: "DVP 원자적 자금-토큰 교환",
        entity: "인가 증권사 원장",
        description: "원장 기입과 온체인 dShare 잔고 동시 갱신",
      },
    ],
    userAuthorizationRequired: true,
  };
}
