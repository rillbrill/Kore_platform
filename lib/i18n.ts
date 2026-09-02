export type Language = "KO" | "EN";

export const DICTIONARY = {
  // Navigation
  nav: {
    home: { KO: "홈", EN: "Home" },
    markets: { KO: "마켓", EN: "Markets" },
    trade: { KO: "거래", EN: "Trade" },
    portfolio: { KO: "포트폴리오", EN: "Portfolio" },
    rights: { KO: "배당 및 의결권", EN: "Dividends & Rights" },
    transactions: { KO: "거래 내역", EN: "Activity" },
    account: { KO: "계정 및 보호", EN: "Account & KYC" },
    support: { KO: "고객지원", EN: "Support" },
  },

  // Common UI
  common: {
    searchPlaceholder: { KO: "종목명, 티커, 종목코드 검색...", EN: "Search stock, ticker, code..." },
    usd: { KO: "USD", EN: "USD" },
    krw: { KO: "KRW", EN: "KRW" },
    buy: { KO: "매수", EN: "Buy" },
    sell: { KO: "매도", EN: "Sell" },
    instantBuy: { KO: "매수", EN: "Buy" },
    instantSell: { KO: "매도", EN: "Sell" },
    trade: { KO: "거래", EN: "Trade" },
    details: { KO: "상세보기", EN: "Details" },
    cancel: { KO: "취소", EN: "Cancel" },
    confirm: { KO: "확인", EN: "Confirm" },
    close: { KO: "닫기", EN: "Close" },
    status: { KO: "상태", EN: "Status" },
    action: { KO: "거래", EN: "Action" },
    shares: { KO: "주", EN: "Shares" },
    price: { KO: "현재가", EN: "Price" },
    change24h: { KO: "24H 등락률", EN: "24h Change" },
    marketCap: { KO: "시가총액", EN: "Market Cap" },
    divYield: { KO: "배당수익률", EN: "Div Yield" },
    availableBalance: { KO: "가용 잔고", EN: "Available Balance" },
    kycVerified: { KO: "KYC 인증 완료", EN: "KYC Verified" },
    liveTracking: { KO: "실시간 추적 중", EN: "Live Tracking" },
    all200: { KO: "전체 200개 종목", EN: "All 200 Equities" },
  },

  // Home Page
  home: {
    heroTag: { KO: "KSD 외국인 통합계좌 1:1 수탁 기반 주식 마켓", EN: "KSD Omnibus Custody Backed Equity Platform" },
    heroTitleLine1: { KO: "미국 달러(USD)로 간편하게 거래하는", EN: "Trade Top Korean Equities (KOSPI 200)" },
    heroTitleLine2: { KO: "한국 우량 대표 주식 (KOSPI 200)", EN: "Easily with US Dollars (USD)" },
    heroDesc: {
      KO: "복잡한 현지 계좌 개설 없이, 한국예탁결제원(KSD) 및 공인 신탁사에 1:1 보관된 삼성전자, SK하이닉스, 현대차 등 코스피 200 주식을 미국 달러(USD)로 편리하게 거래하고 배당금을 수령하세요.",
      EN: "Without opening complex local brokerage accounts, easily invest in 200 KOSPI equities backed 1:1 in custody at Korea Securities Depository (KSD), with US Dollar settlement and quarterly dividends.",
    },
    browseMarkets: { KO: "종목 둘러보기", EN: "Explore Markets" },
    tradeNow: { KO: "거래하기", EN: "Trade Now" },
    kycAuth: { KO: "투자자 인증 (KYC)", EN: "Investor KYC" },
    guide: { KO: "제도 가이드", EN: "Regulation Guide" },
    accountStatusTitle: { KO: "내 계정 상태 (Account Status)", EN: "My Account Status" },
    kycStep: { KO: "1. 신원인증(KYC) 완료", EN: "1. KYC Verification Completed" },
    kycStepSub: { KO: "싱가포르 거주 적격 투자자 승인 (2027년까지 유효)", EN: "Approved Accredited Investor (Valid thru 2027)" },
    balanceStep: { KO: "2. 가용 잔고", EN: "2. Available USD Balance" },
    balanceStepSub: { KO: "주문 체결 가능", EN: "Available for trading" },
    custodyStep: { KO: "3. 신탁 도산격리 보호", EN: "3. Bankruptcy-Remote Custody" },
    custodyStepSub: { KO: "KSD 및 공인 신탁사 1:1 실물 보관", EN: "1:1 physical share custody at KSD & Trust Bank" },
    featuredTitle: { KO: "대표 종목 (Featured Equities)", EN: "Featured Equities" },
    featuredSub: { KO: "한국 증시 대표 우량주 실시간 시세 및 7일 가격 추세", EN: "Live Quotes & 7-Day Price Trends of Blue-Chip Equities" },
    viewAllMarkets: { KO: "전체 200개 종목 보기", EN: "View All 200 Stocks" },
    pillar1Title: { KO: "① 편리한 실시간 체결", EN: "① Seamless Execution" },
    pillar1Desc: { KO: "지정 유동성 공급자(MM)의 호가를 통해 USD 및 USDC로 원활하게 매수·매도할 수 있습니다.", EN: "Trade smoothly in USD or USDC against institutional market maker liquidity." },
    pillar2Title: { KO: "② 분기 배당금 USD 지급", EN: "② USD Dividend Payouts" },
    pillar2Desc: { KO: "원주 배당 발생 시 기준일에 따라 고객 계좌로 USD가 자동 정산 입금되며, USDC 전환도 지원합니다.", EN: "Korean cash dividends are automatically converted and credited to your USD ledger, with optional USDC swap." },
    pillar3Title: { KO: "③ 투명한 1:1 신탁 보관", EN: "③ 1:1 Audited Custody Vault" },
    pillar3Desc: { KO: "한국예탁결제원(KSD) 외국인통합계좌 내 공인 신탁사에 1:1로 실물 주식이 보관되어 안전하게 보호됩니다.", EN: "1:1 underlying shares are held in bankruptcy-remote omnibus custody at KSD with full legal protection." },
  },

  // Markets Page
  markets: {
    headerTitle: { KO: "코스피 200 전 종목 마켓 (KOSPI 200)", EN: "KOSPI 200 Equity Screener" },
    headerSub: { KO: "한국 대표 200대 기업 보통주 실시간 시세 및 거래 마켓", EN: "Real-time quotes, sector screener, and trading for 200 Korean leaders" },
    indexLabel: { KO: "코스피 200 지수", EN: "KOSPI 200 Index" },
    fxLabel: { KO: "기준 환율 (USD/KRW)", EN: "FX Rate (USD/KRW)" },
    topGainers: { KO: "오늘의 급등 종목 (Top Gainers)", EN: "Top Gainers (24h)" },
    topLosers: { KO: "오늘의 조정 종목 (Top Decliners)", EN: "Top Decliners (24h)" },
    sectors: {
      all: { KO: "전체 (200)", EN: "All (200)" },
      tech: { KO: "반도체 / Tech", EN: "Semiconductors & Tech" },
      auto: { KO: "자동차 / 모빌리티", EN: "Automotive & Mobility" },
      battery: { KO: "2차전지 / 배터리", EN: "EV Battery & Materials" },
      bio: { KO: "바이오 / 헬스케어", EN: "Biopharma & Healthcare" },
      it: { KO: "인터넷 / IT", EN: "Internet & Software" },
      finance: { KO: "금융 / 지주", EN: "Financials & Holdings" },
      heavy: { KO: "중공업 / 조선 / 방산", EN: "Heavy Industry & Defense" },
      energy: { KO: "원자력 / 전력", EN: "Nuclear & Energy" },
      steel: { KO: "철강 / 소재", EN: "Steel & Materials" },
      chem: { KO: "화학 / 정유", EN: "Chemicals & Refining" },
      retail: { KO: "유통 / 소비재", EN: "Consumer & Retail" },
      construct: { KO: "건설 / 운송", EN: "Construction & Shipping" },
    },
    tableHeaders: {
      asset: { KO: "종목명 (Asset)", EN: "Asset / Symbol" },
      trend: { KO: "7일 추세 (7D Trend)", EN: "7D Trend" },
      price: { KO: "현재가 (Price)", EN: "Price (USD / KRW)" },
      change: { KO: "24H 변동", EN: "24h Change" },
      marketCap: { KO: "시가총액", EN: "Market Cap" },
      divYield: { KO: "배당수익률", EN: "Dividend Yield" },
      action: { KO: "거래", EN: "Action" },
    },
  },

  // Asset Detail Page
  assetDetail: {
    backToMarkets: { KO: "← 마켓 목록으로 돌아가기", EN: "← Back to Markets" },
    krxUnderlying: { KO: "한국 원주 KRX", EN: "Underlying KRX" },
    instantTradeCta: { KO: "거래하기", EN: "Trade" },
    chartTab7D: { KO: "7일 (7D)", EN: "7D" },
    chartTab1M: { KO: "1개월 (1M)", EN: "1M" },
    chartTab1Y: { KO: "1년 (1Y)", EN: "1Y" },
    orderBookTitle: { KO: "실시간 호가창 (Order Book)", EN: "Live Order Book" },
    businessTitle: { KO: "기업 개요 및 주요 사업 부문 (Business Overview)", EN: "Business Overview & Operations" },
    custodyInfoTitle: { KO: "1:1 수탁 및 도산격리 구조 (Custody & Legal)", EN: "1:1 Custody & Legal Protections" },
    custodyKsdBadge: { KO: "KSD 1:1 보관 연계", EN: "1:1 KSD Backed" },
    tradeTicketHeader: { KO: "주문 (Order)", EN: "Order Terminal" },
  },

  // Trade Page
  trade: {
    headerTitle: { KO: "거래 터미널 (Trade Terminal)", EN: "Trading Terminal" },
    headerSub: { KO: "코스피 200 실물 연계 주식 실시간 호가 및 주문", EN: "Live execution terminal for KOSPI 200 equities" },
    switchAsset: { KO: "종목 변경", EN: "Change Asset" },
    buyTab: { KO: "매수", EN: "Buy" },
    sellTab: { KO: "매도", EN: "Sell" },
    fundingLedger: { KO: "USD 현금 잔고", EN: "USD Balance" },
    fundingOnchain: { KO: "USDC 온체인 지갑", EN: "USDC Wallet" },
    orderAmount: { KO: "주문 수량", EN: "Order Quantity" },
    subtotal: { KO: "주문 금액", EN: "Order Subtotal" },
    fee: { KO: "수수료 (0.15%)", EN: "Trading Fee (0.15%)" },
    total: { KO: "총 결제 금액", EN: "Total Execution Amount" },
    submitBuy: { KO: "매수 주문", EN: "Place Buy Order" },
    submitSell: { KO: "매도 주문", EN: "Place Sell Order" },
  },

  // Portfolio Page
  portfolio: {
    headerTitle: { KO: "내 포트폴리오 (My Portfolio)", EN: "Portfolio Overview" },
    headerSub: { KO: "보유 중인 한국 우량 주식 실시간 평가액, 배당 수익 및 자산 배분 현황", EN: "Real-time holdings value, dividend earnings, asset allocation, and redemption" },
    totalAssets: { KO: "총 평가 자산", EN: "Total Portfolio Value" },
    totalReturn: { KO: "누적 평가 손익", EN: "Total Unrealized Return" },
    unclaimedDiv: { KO: "미수령 배당금", EN: "Unclaimed Dividends" },
    claimAllDiv: { KO: "배당금 일괄 수령", EN: "Claim All Dividends" },
    cashBalance: { KO: "가용 현금 잔고", EN: "Available Cash (USD)" },
    allocationTitle: { KO: "보유 자산 비중 (Asset Allocation)", EN: "Asset Allocation" },
    holdingsTitle: { KO: "보유 자산 상세 목록 (My Holdings)", EN: "Holdings Breakdown" },
    sharesOwned: { KO: "보유 수량", EN: "Quantity" },
    totalValue: { KO: "총 평가액", EN: "Current Value" },
    unrealizedPnL: { KO: "평가 손익", EN: "Return (P&L)" },
    redeemBtn: { KO: "환매 신청", EN: "Redeem" },
  },

  // Rights & Governance Page
  rights: {
    headerTitle: { KO: "권리, 배당 및 주총 의결 (Rights & Governance)", EN: "Dividends & Shareholder Rights" },
    headerSub: { KO: "수탁 실물 주식의 현금 배당금 수령 및 상임대리인을 통한 주주총회 전자 의결권 행사", EN: "Claim quarterly cash dividends and exercise digital voting rights through custodian trust" },
    tabDividends: { KO: "현금 배당금 (Dividends)", EN: "Cash Dividends" },
    tabVoting: { KO: "주주총회 의결권 (Voting)", EN: "Shareholder Voting" },
    tabCompliance: { KO: "월별 규제 보고 (Regulatory Reports)", EN: "Regulatory Filings" },
    voteAction: { KO: "의결권 행사하기", EN: "Cast Proxy Vote" },
    recordDate: { KO: "배당 기준일", EN: "Record Date" },
    payableDate: { KO: "지급 예정일", EN: "Payment Date" },
  },

  // Activity / Transactions Page
  transactions: {
    headerTitle: { KO: "거래 및 정산 내역 (Activity & Receipts)", EN: "Activity & Settlement History" },
    headerSub: { KO: "주문 체결, 배당금 입금 및 공인 정산 영수증 조회", EN: "Track trades, dividend credits, and audited institutional receipts" },
    filterAll: { KO: "전체 내역", EN: "All Activity" },
    filterTrades: { KO: "주문 체결", EN: "Trades" },
    filterDividends: { KO: "배당금 수령", EN: "Dividends" },
    filterSettled: { KO: "정산 완료", EN: "Settled" },
    dateCol: { KO: "일시 (Date)", EN: "Date & Time" },
    typeCol: { KO: "활동 유형 및 종목", EN: "Activity / Security" },
    amountCol: { KO: "금액 (USD / KRW)", EN: "Amount (USD / KRW)" },
    statusCol: { KO: "상태 (Status)", EN: "Status" },
    receiptCol: { KO: "증빙 영수증", EN: "Receipt" },
    viewReceipt: { KO: "영수증 보기", EN: "View Receipt" },
    settledBadge: { KO: "체결 완료", EN: "Completed" },
  },

  // Account Page
  account: {
    headerTitle: { KO: "계정 정보 및 투자자 보호 (Account & Protection)", EN: "Account & Investor Protection" },
    headerSub: { KO: "외국인 적격 투자자 인증 상태, 위험 고지 동의 내역 및 전용 결제 지갑 관리", EN: "Accredited investor KYC status, risk disclosure logs, and designated settlement wallets" },
    kycCardTitle: { KO: "신원확인(KYC) 상태", EN: "KYC Verification" },
    leiCardTitle: { KO: "외국인 투자자 등록(LEI)", EN: "Foreign Investor ID (LEI)" },
    riskCardTitle: { KO: "투자자 위험 성향", EN: "Risk Tolerance Score" },
    walletCardTitle: { KO: "전용 결제 지갑", EN: "Settlement Wallet" },
    profileSection: { KO: "투자자 등록 기본 정보 (Investor Profile)", EN: "Investor Registered Profile" },
    protectionSection: { KO: "투자자 보호 및 법적 도산격리 (Legal Safeguards)", EN: "Legal Safeguards & Custody Protection" },
  },

  // Support Page
  support: {
    headerTitle: { KO: "고객지원 및 분쟁해결 (Support & Resolution)", EN: "Help & Investor Support" },
    headerSub: { KO: "주문 오류, 결제 지연 및 투자자 권리 관련 전담 지원", EN: "Assistance for trade execution, settlement inquiries, and investor claims" },
    faqTitle: { KO: "자주 묻는 질문 (FAQ)", EN: "Frequently Asked Questions" },
    submitInquiry: { KO: "1:1 문의 접수 (Submit Ticket)", EN: "Submit Support Ticket" },
  },
} as const;

export function getTranslation(lang: Language, section: keyof typeof DICTIONARY, key: string): string {
  const sec = DICTIONARY[section] as any;
  if (!sec || !sec[key]) return key;
  return sec[key][lang] || sec[key]["KO"] || key;
}
