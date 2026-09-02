# RWA V3 Investor UI

> `rwa-v3`는 `rwa-8th`의 문서, API, 상태 모델과 PoC 구현을 따르는 투자자용 UI adaptation이다. 제품의 기준은 이 레포의 목업 데이터가 아니라 sibling repo `../rwa-8th`의 문서와 서버 계약이다.

## P0 시스템 정합성 기준

- 기준 문서: `../rwa-8th/docs/05-screens-states-recovery/SCREEN_FLOWS.md`
- API 계약: `../rwa-8th/docs/07-data-api-events/API_CONTRACTS.md`
- API base: `NEXT_PUBLIC_API_URL`, 기본값 `http://127.0.0.1:4000/api/v1`
- 투자자 IA: `/investor`, `/investor/onboarding`, `/investor/markets`, `/investor/orders/new`, `/investor/secondary`, `/investor/positions`, `/investor/rights`, `/investor/activities`, `/investor/support`
- 서버 연결층: `lib/platform-api.ts`
- 서버 projection provider: `context/PlatformContext.tsx`

`rwa-8th` API가 켜져 있으면 `rwa-v3`는 플랫폼 projection을 우선 사용한다. API가 꺼져 있으면 기존 목업 UI를 fallback으로 유지한다.

## 실행

```bash
pnpm install
pnpm dev:with-rwa8th-api
```

`rwa-8th` 전체 시스템까지 함께 올릴 때는 다음 명령을 사용한다. 이 명령은 sibling repo의 Docker demo stack을 준비한 뒤, `rwa-v3` 투자자 UI를 `http://localhost:3000/investor`에서 실행한다.

```bash
pnpm dev:full:rwa8th
```

종료할 때는 다음 명령으로 `rwa-8th` demo stack을 내린다.

```bash
pnpm demo:down:rwa8th
```

수동으로 나눠 실행하려면 `rwa-8th` sibling repo에서 먼저 demo stack을 올린다.

```bash
cd ../rwa-8th
docker compose up --build --wait
```

그 뒤 이 앱에서 `pnpm dev:with-rwa8th-api`를 실행한다.

## 검증

```bash
pnpm typecheck
pnpm build
```

현재 typecheck는 공유 작업환경에서 `tsconfig.tsbuildinfo` 쓰기 권한에 막히지 않도록 `--incremental false`를 사용한다.

---

## Legacy Design Notes

> **대한민국 실물자산(RWA) 및 KOSPI 200 토큰화 금융 인프라 OS**
>
> 본 프로젝트는 한국예탁결제원(KSD) 외국인통합계좌 및 신탁은행(신한은행) 보관 구조를 기반으로, 국내 결제가 완료된 수탁권리의 24/7 DVP 2차거래와 1차 발행(KRX 묶음 집행), 배당 정산, 주총 전자 의결권을 제공하는 기관급 금융 플랫폼 프론트엔드입니다.

---

## 1. 핵심 아키텍처 및 디자인 방향성 (Design North Star)

- **디자인 컨셉**: *Sovereign Clear Ledger & Autonomous Financial Operating System*
- **시각적 DNA**: 
  - Canvas: Deep Obsidian (`#070A0F`)
  - Surfaces: Instrument Charcoal & Raised Slate (`#0D121D`, `#131B2A`)
  - Brand Accents: Tactical Settlement Teal (`#14B8A6`) & Institutional Cobalt (`#3B82F6`)
  - Typography: Tabular Numerals, Pretendard / Geist / JetBrains Mono
- **핵심 가치**: 
  - *"내가 무엇을 소유하고 있는지 직관적으로 이해한다."*
  - *"누가 수탁 책임을 지고 있는지 명확히 보인다."*
  - *"어떤 단계에서 결제 및 전자서명이 승인되는지 투명하다."*

---

## 2. 구현된 10대 핵심 화면 및 플로우

| 화면 | 경로 | 주요 기능 및 특징 |
|---|---|---|
| **1. 대시보드 (Executive Home)** | `/` | 수탁 총액 KPI, 실시간 T+2 결제 와처, 3분기 배당 알림, 마켓 펄스 |
| **2. 자산 탐색 (Asset Discovery)** | `/markets` | KOSPI 200 보통주 & 신재생에너지 인프라 신탁, 실시간 호가, 카드/테이블 뷰 |
| **3. 자산 상세 (Asset Detail)** | `/markets/[id]` | 1:1 수탁 구조, 신한은행 신탁 금고 증명, 배당 일정, 실시간 주문 티켓 연동 |
| **4. 주문 집행 데스크 (Trade Desk)** | `/trade` | 1차 발행(KRX 묶음) vs 24/7 OTC(지정 MM 즉시 DVP) 듀얼 엔진, 증거금 계산 |
| **5. 사전 적격성 검증 (Pre-Flight)** | Modal | 비거주자 LEI, 외인 취득한도, 위험성향 점수, USD/USDC 잔액 자동 감사 |
| **6. 다자간 전자서명 (Signing Modal)** | Modal | 투자자 개인키 서명 → 브로커 리스크 승인 → 신탁 에스크로 락 3단계 승인 |
| **7. DVP 결제 센터 (Settlement Hub)** | `/settlement` | 5단계 DVP 결제 타임라인, KSD 원장 기입 및 온체인 토큰 민팅 실시간 추적 |
| **8. 포트폴리오 & 수탁 (Portfolio)** | `/portfolio` | 상태별 수탁 잔고(가용 / T+2 대기 / 환매 락), 배당금 1-Click 청구, 의결권 투표 |
| **9. 포지션 심층 관리 (Position Detail)**| `/portfolio/[id]` | 개별 자산 심층 수탁 증명, 1차 환매(KRX 매도 & USD 회수) 신청 티켓 |
| **10. 거래 및 세무 원장 (Ledger & Tax)** | `/transactions` | 이중원장 대사 완료 전표 조회, 공식 전자 거래 확인서(PDF/인쇄), 원천징수 내역 |
| **11. 에이전트 OS 콘솔 (Agent OS)** | `/agent` & `⌘K` | 자연어 의도 해석, 실시간 정책 감사, 다자간 실행 그래프 수립 및 원클릭 실행 |
| **12. 기관 검증 콘솔 (Compliance)** | `/compliance` | KSD 법적 고객계좌부 vs 온체인 dShare 1:1 실시간 대사, 외인 소진율 모니터링 |

---

## 3. 실행 및 검증 가이드

```bash
# 디렉토리 이동
cd rwa-gemi_ver_2_

# 의존성 설치
pnpm install

# 타입스크립트 타입 검증
pnpm run typecheck

# 프로덕션 빌드
pnpm run build

# 개발 서버 실행 (포트 3002)
pnpm run dev
```
