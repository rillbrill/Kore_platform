export interface InstitutionInfo {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  jurisdiction: string;
  licenseNumber: string;
  description: string;
  status: "ONLINE" | "SYNCHRONIZED" | "STANDBY";
  assignedAssets: string[];
}

export const MOCK_INSTITUTIONS: InstitutionInfo[] = [
  {
    id: "INST-KSD",
    name: "한국예탁결제원 (KSD)",
    nameEn: "Korea Securities Depository",
    role: "법정 중앙예탁기관 & 외국인 통합계좌 관리",
    jurisdiction: "대한민국 (South Korea / FSC)",
    licenseNumber: "KSD-REG-0001",
    description: "대한민국 전자증권법상 중앙 전자등록기관으로 KOSPI 200 기초 원주에 대한 법적 고객계좌부 및 외국인 통합계좌(Omnibus Account)를 총괄 관리합니다.",
    status: "SYNCHRONIZED",
    assignedAssets: ["KOSPI 200 전 종목", "한국 실물 자산 신탁"],
  },
  {
    id: "INST-SHINHAN-TRUST",
    name: "신한은행 신탁부",
    nameEn: "Shinhan Bank Trust Custody",
    role: "실물 수탁 및 도산격리(Bankruptcy-Remote) 금고",
    jurisdiction: "대한민국 (South Korea / FSS)",
    licenseNumber: "BANK-TRUST-SH-088",
    description: "KSD 통합계좌에 입고된 보통주에 대해 1:1 실물 자산 신탁계약을 체결하고, 발행사 파산 시에도 투자자 재산을 100% 안전하게 보호하는 도산격리 금고 역할을 수행합니다.",
    status: "SYNCHRONIZED",
    assignedAssets: ["삼성전자 (dSEC)", "SK하이닉스 (dSKH)", "현대자동차 (dHYU)", "KB금융 (dKBF)"],
  },
  {
    id: "INST-HANA-SEC",
    name: "하나증권 글로벌 파트너스",
    nameEn: "Hana Securities Global Desk",
    role: "국내 주문집행 및 KRX 회원사 브로커리지",
    jurisdiction: "대한민국 (South Korea / KRX Member)",
    licenseNumber: "KRX-MBR-HANA-021",
    description: "해외 투자자의 1차 청약 요청을 수신하여 KRX 코스피 정규장 최선 집행(Best Execution)을 담당하며, T+2 국내 결제 대금을 정산합니다.",
    status: "ONLINE",
    assignedAssets: ["KOSPI 200 1차 발행 묶음 집행"],
  },
  {
    id: "INST-WINTERMUTE",
    name: "윈터뮤트 아시아 (Wintermute Asia)",
    nameEn: "Wintermute Asia Designated MM",
    role: "24/7 OTC 지정 시장조성자 (Designated Market Maker)",
    jurisdiction: "싱가포르 (MAS RFMC / Exemption)",
    licenseNumber: "MAS-MM-WM-2024",
    description: "국내 결제가 완료된 정품 수탁권리 재고(Settled Inventory)를 기반으로 KRX 야간/휴일에도 15bps 이내의 양방향 24/7 매수·매도 호가를 상시 공급합니다.",
    status: "ONLINE",
    assignedAssets: ["dSEC 24/7", "dSKH 24/7", "dHYU 24/7"],
  },
  {
    id: "INST-ORAKLE-PLATFORM",
    name: "오라클 RWA 인프라 OS",
    nameEn: "Orakle RWA Financial OS",
    role: "에이전트 오케스트레이션 & DVP 결제 엔진",
    jurisdiction: "글로벌 / 대한민국 특례",
    licenseNumber: "ORAKLE-OS-V2-2026",
    description: "자연어 의도 해석, 실시간 사전 적격성 검증, 다자간 전자서명, 온체인 DVP 결제 및 실시간 이중원장 대사 시스템을 제공하는 코어 플랫폼입니다.",
    status: "ONLINE",
    assignedAssets: ["전체 플랫폼 토큰화 자산 및 에이전트 레이어"],
  }
];
