import { CorporateAction } from "@/types/domain";

export const MOCK_CORPORATE_ACTIONS: CorporateAction[] = [
  {
    id: "CA-2026-Q3-001",
    securityId: "990001",
    securitySymbol: "SEC",
    securityName: "삼성전자",
    type: "CASH_DIVIDEND",
    title: "2026년 3분기 정기 현금배당 (분기 주당 361원 / $0.261)",
    description: "KSD 배당 기준일(2026-09-30) 현재 확정된 보유 주식에 대해 고객 계좌로 USD 즉시 환전 지급됩니다.",
    recordDate: "2026-09-30",
    effectiveDate: "2026-10-20",
    status: "ANNOUNCED",
    details: {
      dividendPerShareUsd: 0.2615,
      dividendPerShareKrw: 361,
    },
    userEntitlement: {
      eligibleShares: 350,
      claimableUsd: 91.52,
      status: "UNCLAIMED",
    },
  },
  {
    id: "CA-2026-Q3-002",
    securityId: "990006",
    securitySymbol: "KB",
    securityName: "KB금융",
    type: "CASH_DIVIDEND",
    title: "2026년 3분기 분기배당 (주당 785원 / $0.568)",
    description: "밸류업 특별 주주환원 프로그램에 따른 분기 현금 분배입니다.",
    recordDate: "2026-09-30",
    effectiveDate: "2026-10-18",
    status: "ANNOUNCED",
    details: {
      dividendPerShareUsd: 0.5687,
      dividendPerShareKrw: 785,
    },
    userEntitlement: {
      eligibleShares: 200,
      claimableUsd: 113.74,
      status: "UNCLAIMED",
    },
  },
  {
    id: "CA-2026-VOTE-003",
    securityId: "990002",
    securitySymbol: "SKH",
    securityName: "SK하이닉스",
    type: "SHAREHOLDER_VOTE",
    title: "임시 주주총회 전자 의결권 행사 (용인 반도체 메가 클러스터 투자 승인의 건)",
    description: "보유 주식 수에 비례한 의결권을 인가 증권사 상임대리인을 통해 디지털 위임 투표할 수 있습니다.",
    recordDate: "2026-09-15",
    effectiveDate: "2026-09-28",
    status: "RECORD_LOCKED",
    details: {
      voteProposals: [
        {
          id: "PROP-01",
          title: "제1호 의안: 용인 클러스터 제1기 팹(Fab) 투자 계획 승인의 건",
          description: "2027년 준공 예정인 HBM 전용 클린룸 및 생산시설 조기 착공 투자안 승인",
          options: ["CH-01: 찬성 (For)", "CH-02: 반대 (Against)", "CH-03: 기권 (Abstain)"],
        },
      ],
    },
  },
];
