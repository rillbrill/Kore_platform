# RWA V3 to RWA-8th Mapping Table

작성일: 2026-09-02  
대상 UI: `rwa-v3` 투자자용 UI  
기준 시스템: `rwa-8th` 문서, API, 상태 모델, 원본 web 구현  
목적: 이미 만든 투자자 UI를 버리지 않고, `rwa-8th`의 기능/서버/API/상태 설계에 맞게 수습하기 위한 화면별 매핑표

## 1. 기준 판단

`rwa-v3`는 시각적으로 완성도 있는 투자자용 UI 프로토타입이다. 하지만 현재 데이터와 상태 변경은 대부분 `context/AppContext.tsx`와 `data/mock-*`에 묶여 있다.

`rwa-8th` 기준에서는 UI가 직접 상태를 성공 처리하면 안 된다. 상태 변경 명령은 API에 접수하고, `workflowId`를 받아, 이후 projection과 timeline을 다시 조회해야 한다.

```text
rwa-v3 현재 방식
  UI 로컬 state 변경
  -> 즉시 주문/보유/배당/환매 성공처럼 표시

rwa-8th 기준 방식
  API command 접수
  -> 202 Accepted + workflowId
  -> workflow / timeline / projection 재조회
  -> 완료, 대기, 차단, 격리를 화면에 반영
```

## 2. 전체 라우트 매핑

| 현재 `rwa-v3` | `rwa-8th` 기준 목표 | 판정 | 처리 방향 |
|---|---|---|---|
| `/` | `/investor` 또는 landing -> `/investor` | 부분 재사용 | 랜딩/홈의 시각 요소는 살리되, 실제 첫 행동은 `투자자 앱 -> 모의 계좌 개설` 또는 `시장`으로 정렬 |
| `/login` | PoC profile selector 또는 `/investor/onboarding` 전 단계 | 재해석 필요 | 실제 auth가 아니라 synthetic bearer token 선택 UI로 바꿈 |
| `/register` | `/investor/onboarding` | 병합 | 회원가입/KYC가 아니라 합성 계좌 개설/onboarding 흐름으로 흡수 |
| `/kyc` | `/investor/onboarding` | 대수정 | 실제 여권/LEI 입력 금지. 합성 여권, 고객확인, 투자자보호, 공시, 지갑 연결 단계로 재구성 |
| `/markets` | `/investor/markets` | 재사용 가능 | UI는 살리되 `GET /products` 기반으로 교체. KOSPI200 전체 활성처럼 보이면 안 됨 |
| `/markets/[id]` | `/investor/products/[securityId]` | 재사용 가능 | 상품 상세 UI를 `GET /products/{securityId}`와 기능별 availability 기반으로 교체 |
| `/trade` | `/investor/orders/new` + `/investor/secondary` | 분리 필요 | 1차 발행 주문과 24/7 거래는 다른 명령/상태이므로 화면 또는 mode를 명확히 분리 |
| `/portfolio` | `/investor/positions` | 재사용 가능 | `GET /positions`로 보유권리 수량축을 표시 |
| `/portfolio/[id]` | `/investor/positions` 또는 `/investor/products/[securityId]` | 재해석 필요 | 개별 보유 상세는 position detail 또는 product detail 하위 drawer로 정리 |
| `/rights` | `/investor/rights` | 부분 재사용 | 배당, 의결권, 지갑 복구, 기업행동 중지를 `localRightsScenario`와 rights API 기반으로 표시 |
| `/transactions` | `/investor/activities` | 대체 | ledger receipt가 아니라 `GET /activities`, `GET /workflows/{workflowId}/timeline` 중심 |
| `/support` | `/investor/support` | 재사용 가능 | `GET/POST /complaints` 기반 민원 접수/조회로 연결 |
| `/account` | `/investor/onboarding` + account summary | 축소 필요 | 입출금/기관투자자/실물인출 표현 제거. readiness, disclosure, wallet, funding status 표시 |
| `/settlement` | `/institution/*` | 투자자 앱에서 제거 | 기관 콘솔로 분리. 투자자 앱 기본 nav에는 두지 않음 |
| `/compliance` | `/institution/audit` | 투자자 앱에서 제거 | 기관 콘솔로 분리 |
| `/agent` | 없음 또는 internal prototype | 제거/격리 | PoC 문서 기준 핵심 투자자 IA 아님 |
| `/testbed` | 없음 또는 prototype lab | 제거/격리 | 일반 투자자 앱에서 숨김 |

## 3. API 연결 매핑

| UI 기능 | 현재 `rwa-v3` 구현 | `rwa-8th` API | 교체 수준 |
|---|---|---|---|
| 세션/고객 상태 | `isLoggedIn`, `user` 로컬 state | `GET /session` | 필수 교체 |
| 상품 목록 | `MOCK_SECURITIES` | `GET /products` | 필수 교체 |
| 상품 상세 | `securities.find()` | `GET /products/{securityId}` | 필수 교체 |
| 현재 공시 | mock copy | `GET /disclosures/current` | 필수 추가 |
| 공시 동의 | `completeKycOnboarding()` 내부 처리 | `POST /disclosure-consents` | 필수 교체 |
| 공시 동의 상태 | user state | `GET /disclosure-consents/current` | 필수 추가 |
| 지갑 연결 | local profile update | `POST /wallet-link-requests` | 필수 교체 |
| 지갑 교체 | 없음/목업 | `POST /wallet-replacement-requests` | 필수 추가 |
| 보유권리 | `INITIAL_POSITIONS` + local mutation | `GET /positions` | 필수 교체 |
| 활동 내역 | `ledgerEntries` | `GET /activities` | 필수 교체 |
| 업무 상세 | settlement event/local order | `GET /workflows/{workflowId}` | 필수 추가 |
| 업무 타임라인 | `SettlementTimeline` 목업 | `GET /workflows/{workflowId}/timeline` | 필수 교체 |
| 1차 발행 주문 | `placeOrder({ type: PRIMARY_ISSUANCE })` | `POST /primary-orders` | 필수 교체 |
| 1차 발행 취소 | 없음/목업 | `POST /primary-orders/{orderId}/cancellations` | 필요 |
| 24/7 호가 조회 | local orderbook arrays | `GET /quotes` | 필수 교체 |
| 24/7 주문 | `placeOrder({ type: SECONDARY_OTC })` | `POST /secondary-orders` | 필수 교체 |
| 환매 요청 | `requestRedemption()` local state | `POST /redemptions` | 필수 교체 |
| 환매 취소 | 없음/목업 | `POST /redemptions/{redemptionId}/cancellations` | 필요 |
| 배당 전환 | `claimDividend()` 즉시 입금 | `POST /dividend-conversions` | 필수 교체 |
| 의결권 지시 | `submitProxyVote()` local state | `POST /voting-instructions` | 필수 교체 |
| 민원 목록 | local seed | `GET /complaints` | 필수 교체 |
| 민원 접수 | local array push | `POST /complaints` | 필수 교체 |
| 민원 상세 | 없음/목업 | `GET /complaints/{complaintId}` | 필요 |

## 4. 페이지별 수습 매핑

### 4.1 Home

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/page.tsx` |
| 목표 위치 | `/investor` |
| 기준 원본 | `rwa-8th/apps/web/app/investor/page.tsx`, `investor-workspace.tsx` |
| 연결 API | `GET /session`, `GET /products?scope=demo`, `GET /positions`, `GET /activities` |
| 살릴 것 | 큰 첫 화면, 주요 상품으로 이동하는 CTA, 브랜드 톤 |
| 수정할 것 | `KSD 1:1 보장`, `전체 KOSPI200 거래 가능`, `실제 규제/감사 보증`처럼 보이는 문구 제거 |
| 필수 상태 | customer readiness, mock environment, projectionAsOf, next action |
| 위험도 | 높음 |

Home은 투자자에게 가장 먼저 `계정 준비`, `모의 삼성전자 상품`, `최근 업무`, `차단 사유`를 보여줘야 한다. 마케팅 랜딩처럼 “전 세계가 KOSPI200을 즉시 소유”하는 톤은 PoC 기준과 맞지 않는다.

### 4.2 Login / Register / KYC

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/login/page.tsx`, `app/register/page.tsx`, `app/kyc/page.tsx` |
| 목표 위치 | `/investor/onboarding` |
| 기준 원본 | `rwa-8th/apps/web/app/investor/onboarding/*` |
| 연결 API | `GET /session`, `GET /disclosures/current`, `GET /disclosure-consents/current`, `POST /disclosure-consents`, `POST /wallet-link-requests` |
| 살릴 것 | 단계형 onboarding UI, 진행 stepper, 확인 모달 |
| 수정할 것 | 실제 여권번호/LEI 입력, 기관투자자 KYC, KSD registry 검증 문구 제거 |
| 필수 상태 | eligibility, investorProtection, wallet, canPlaceNewOrder, canReceiveRights, blockingReasons |
| 위험도 | 매우 높음 |

PoC는 실제 개인정보를 받지 않는다. 화면은 합성 고객과 합성 여권을 설명해야 하며, 사용자가 입력하는 실제 신원확인 양식처럼 보이면 안 된다.

### 4.3 Markets

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/markets/page.tsx`, `components/domain/MarketScreenerTable.tsx`, `MarketHeatmapTreemap.tsx` |
| 목표 위치 | `/investor/markets` |
| 기준 원본 | `rwa-8th/apps/web/app/investor/markets/page.tsx` |
| 연결 API | `GET /products?limit=...`, `GET /products?scope=demo` |
| 살릴 것 | 스크리너/히트맵 전환, 검색, 표 레이아웃 |
| 수정할 것 | 200/200 tokenized, 실시간 거래량, KSD 수탁 검증 100% 같은 확정 표현 |
| 필수 상태 | candidateStatus, representative, availability.primary, availability.secondary, availability.redemption, blockingReasons |
| 위험도 | 중~높음 |

문서상 일반 KOSPI200 후보는 대부분 거래 불가 후보일 수 있다. `990001` 같은 PoC 대표 종목과 공식 후보를 구분해야 한다.

### 4.4 Product Detail

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/markets/[id]/page.tsx` |
| 목표 위치 | `/investor/products/[securityId]` |
| 연결 API | `GET /products/{securityId}`, `GET /quotes?securityId=...` |
| 살릴 것 | 가격/권리/리스크/CTA 배치 |
| 수정할 것 | legal guarantee처럼 보이는 표현, 내부 수탁 증거의 기본 노출 |
| 필수 상태 | 기능별 가능 여부, 기준시각, 차단 사유, 책임기관 |
| 위험도 | 중간 |

상품 상세는 `1차 발행`, `24/7 거래`, `환매`가 각각 가능한지 독립적으로 보여줘야 한다.

### 4.5 Trade

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/trade/page.tsx`, `components/domain/OrderTicket.tsx`, `PreFlightSuitabilityModal.tsx`, `AuthorizationSigningModal.tsx` |
| 목표 위치 | `/investor/orders/new`, `/investor/secondary` |
| 기준 원본 | `investor-workspace.tsx`의 `submitPrimaryOrder`, `submitSecondaryOrder` |
| 연결 API | `GET /quotes`, `POST /primary-orders`, `POST /secondary-orders`, `GET /workflows/{workflowId}/timeline` |
| 살릴 것 | 주문 티켓, 매수/매도 탭, 주문 전 확인, 서명 모달 |
| 수정할 것 | 금액 기반 소수 수량, 시장가 기본값, 즉시 DVP 완료 표현, local `authorizeOrder()` |
| 필수 상태 | integer quantity, quote expiry, fundingMode, signedIntent, 202 accepted, workflowId |
| 위험도 | 매우 높음 |

`rwa-8th`는 정수 수량만 허용한다. 24/7은 지정 시장조성자 호가 기반이고, 1차 발행은 KRW 지정가와 targetTradingDate를 포함한 signed intent가 필요하다.

### 4.6 Portfolio

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/portfolio/page.tsx`, `app/portfolio/[id]/page.tsx`, `AssetAllocationChart.tsx` |
| 목표 위치 | `/investor/positions` |
| 연결 API | `GET /positions`, `GET /activities` |
| 살릴 것 | 총 보유, 평가, 보유표, 개별 액션 배치 |
| 수정할 것 | 즉시 배당 수령, 실물 주식 인도, 로컬 평가액 중심 구조 |
| 필수 상태 | settledRights, pendingSettlement, redemptionLocked, burnPending, paymentClaim |
| 위험도 | 높음 |

보유 화면은 단순 portfolio valuation보다 수량 상태가 중요하다. 총수량, 거래가능, 결제대기, 환매잠금, 소각대기, 지급청구를 분리해야 한다.

### 4.7 Rights

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/rights/page.tsx`, `CorporateActionModal.tsx`, `DigitalCustodyCertificate.tsx` |
| 목표 위치 | `/investor/rights` |
| 연결 API | `GET /session`, `POST /dividend-conversions`, `POST /voting-instructions`, `GET /activities` |
| 살릴 것 | 권리 업무 허브, 배당/의결권 카드, 수탁 설명 UI |
| 수정할 것 | KSD 공식 증명서/법적 효력/직접 의결권 행사 표현 |
| 필수 상태 | dividend.status, paymentStatus, conversionStatus, voting.status, instructionDeadline |
| 위험도 | 높음 |

의결권은 직접 행사가 아니라 지시 제출이다. 배당은 즉시 지급 보장이 아니라 USD 지급/USDC 전환 요청과 실패/만료 처리를 보여줘야 한다.

### 4.8 Activities / Transactions

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/transactions/page.tsx`, `AuditReceiptModal.tsx`, `SettlementTimeline.tsx` |
| 목표 위치 | `/investor/activities`, `/investor/orders/[workflowId]` |
| 연결 API | `GET /activities`, `GET /workflows/{workflowId}`, `GET /workflows/{workflowId}/timeline` |
| 살릴 것 | 타임라인 UI, 영수증/상세 drawer 패턴 |
| 수정할 것 | KSD-DVP receipt, 법적 효력 있는 거래 확인서 표현 |
| 필수 상태 | workflowType, status axes, evidence timeline, projectionStatus |
| 위험도 | 높음 |

거래내역은 ledger가 아니라 workflow와 evidence timeline 중심이어야 한다.

### 4.9 Support

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/support/page.tsx` |
| 목표 위치 | `/investor/support` |
| 연결 API | `GET /complaints`, `POST /complaints`, `GET /complaints/{complaintId}` |
| 살릴 것 | 문의 분류, 접수 폼, 최근 문의 목록 |
| 수정할 것 | 24시간 보장 답변, 책임기관 hardcode |
| 필수 상태 | complaint type, responsibleRole, related workflow, disclosureVersion, status |
| 위험도 | 중간 |

민원은 단순 support ticket이 아니라 책임기관 배정, 답변, 정정 workflow 연결, 종결 근거가 따라야 한다.

### 4.10 Account

| 항목 | 내용 |
|---|---|
| 현재 파일 | `app/account/page.tsx` |
| 목표 위치 | `/investor/onboarding` 일부 + account summary |
| 연결 API | `GET /session`, `GET /disclosure-consents/current`, `POST /wallet-replacement-requests` |
| 살릴 것 | 계정 상태 카드, 자금경로 카드, quick action layout |
| 수정할 것 | 실제 입금/출금 모달, 기관투자자 한도, KSD 직접 인출, 실물 주식 상환 |
| 필수 상태 | readiness, cash scenario, wallet, disclosure consent |
| 위험도 | 매우 높음 |

원본 PoC에서 실제 자금 입출금 화면은 핵심 투자자 UI가 아니다. USD/USDC는 주문 자금경로와 시연 scenario로 표현한다.

## 5. 기관/운영자 화면 분리 매핑

| 현재 `rwa-v3` | 처리 | `rwa-8th` 기준 위치 |
|---|---|---|
| `/settlement` | 투자자 앱에서 제거 | `/institution/domestic`, `/institution/workflows/[workflowId]` |
| `/compliance` | 투자자 앱에서 제거 | `/institution/audit` |
| `/agent` | 제거 또는 내부 prototype 보관 | 문서상 핵심 화면 아님 |
| `/testbed` | 제거 또는 prototype lab 보관 | 일반 앱 nav에서 숨김 |
| `components/layout/RoleBanner.tsx` | 투자자 앱에서 제거 | 기관 콘솔 내부의 demo role notice로만 사용 가능 |
| `components/ui/Navbar.tsx` role switcher | 투자자 앱에서 제거 | `/institution/*` shell에서만 시연 필터로 제한 |
| `components/layout/ConsoleShell.tsx` | 별도 기관 콘솔로 이동 가능 | `/institution/*` shell 후보 |

## 6. 타입과 데이터 모델 매핑

| 현재 `rwa-v3` 타입 | `rwa-8th` 기준 타입/개념 | 처리 |
|---|---|---|
| `Security` | `Product` | `Product.availability`, `blockingReasons`, `referenceVersion` 중심으로 교체 |
| `Order` | `PrimaryOrder`, `SecondaryOrder`, `Redemption`, `Workflow` | 하나의 Order 모델로 뭉치지 않기 |
| `Position` | rights position projection | 수량축을 API projection 그대로 표시 |
| `SettlementEvent` | `WorkflowTimeline` | 로컬 stage progress 폐기 |
| `CorporateAction` | `LocalRightsScenario`, rights activities | 배당/의결권/기업행동 상태 분리 |
| `LedgerEntry` | `Activity`, `WorkflowTimeline` | 거래 전표 중심에서 업무 증거 중심으로 전환 |
| `UserProfile` | `Session.customerReadiness` | 실제 개인 프로필 입력 대신 합성 사용자 상태 |
| `InstitutionalRole` | synthetic bearer token role | UI 전환이 권한을 바꾸지 않는다는 원칙 적용 |

## 7. 반드시 고쳐야 할 문구 패턴

| 현재 자주 보이는 표현 | 문제 | 대체 방향 |
|---|---|---|
| `KSD 공식 전자등록` | 실제 기관 연결/공식 효력처럼 보임 | `모의 KSD 확인 응답`, `모의 외부 응답` |
| `법적 효력 있는 거래 확인서` | PoC 금지 표현 | `모의 거래 확인 요약`, `증거 흐름 요약` |
| `100% 보장` | 보장/인허가 오인 위험 | `모의 조건에서 대사 통과`, `현재 기준시각 확인` |
| `실시간 DVP T+0` | 문서의 비동기 workflow와 충돌 | `24/7 제한 거래 접수`, `권리·토큰·자금 확정 대기/완료` |
| `KSD 직접 인출` | PoC 환매 구조와 다름 | `환매 요청`, `USD 지급청구`, `토큰 소각 대기` |
| `기관투자자 KYC` | 투자자 앱과 PoC 고객 흐름 혼선 | `합성 고객확인`, `투자자 보호 판정` |
| `전체 KOSPI200 tokenized` | 기준정보 문서와 충돌 | `PoC 대표 종목`, `거래 불가 후보` |

## 8. 우선순위

### P0: 시스템 정합성

1. `rwa-v3`에 `rwa-8th`의 `platform-api.ts`에 해당하는 API client를 도입한다.
2. `AppContext` 중심 로컬 성공 처리를 중단하고 server projection 기반 hook/store로 바꾼다.
3. synthetic profile token 선택 구조를 만든다.
4. `/investor/*` 라우트로 목표 IA를 정렬한다.

### P1: 투자자 핵심 플로우

1. `/investor/onboarding`: session, disclosure, consent, wallet link.
2. `/investor/markets`: products, availability, blocking reasons.
3. `/investor/orders/new`: primary order signed intent.
4. `/investor/secondary`: quote selection, secondary signed intent.
5. `/investor/orders/[workflowId]`: workflow timeline.
6. `/investor/positions`: position projection.
7. `/investor/rights`: dividend conversion, voting instruction.
8. `/investor/support`: complaints.

### P2: UX 수습

1. 기존 v3의 고급 시각 요소를 투자자 행동 중심으로 낮춘다.
2. 모든 성공 표현을 `접수`, `처리 중`, `완료`, `차단`, `격리`로 재정렬한다.
3. `처리 과정 보기` drawer를 workflow timeline 기반으로 만든다.
4. 모바일에서 drawer는 전체 높이, desktop에서는 오른쪽 panel로 표시한다.

### P3: 기관 분리

1. 투자자 nav에서 기관 화면 제거.
2. `/institution/*`는 별도 작업으로 분리.
3. 투자자 화면에서 기관 화면으로 직접 메뉴 이동은 금지하고, workflow detail 안의 추적 링크만 허용한다.

## 9. 최종 수습 전략

가장 현실적인 전략은 `rwa-v3`를 폐기하지 않고 다음 순서로 흡수하는 것이다.

```text
1. rwa-8th 원본 web의 API client와 command 로직을 기준으로 삼는다.
2. rwa-v3의 화면과 컴포넌트는 presentation layer로 남긴다.
3. route와 data contract를 /investor/* 기준으로 재배치한다.
4. 위험한 카피와 가짜 보장 표현을 PoC 문서 언어로 교정한다.
5. workflowId 중심으로 모든 주문/권리/민원 상세를 연결한다.
```

이렇게 하면 시각 작업을 버리지 않으면서도, 제품의 기준을 `rwa-8th`로 되돌릴 수 있다.
