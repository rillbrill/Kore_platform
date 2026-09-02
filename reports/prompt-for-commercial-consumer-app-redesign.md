# Prompt For Another AI

You are redesigning a commercial consumer app, not a PoC demo.

Use the attached audit report as the source of truth. The product is a consumer-facing platform for foreign individual investors to access Korean stock-backed custodial rights/RWA trading. Read the `rwa-8th` docs only by separating three layers:

1. Research/benchmark material, such as Dinari, Alpaca, Circle, Avalanche, and `dShare`. Do not copy those names or structures into our consumer UI.
2. PoC/demo material, such as synthetic customers, mock accounts, mock KRX/KSD responses, demo institutions, and test numbers. Do not use these as commercial UI copy.
3. Product principles to carry into the commercial app: account onboarding, KYC, investor protection, risk disclosure, dedicated wallet, instant 24/7 consumer buy/sell UX, designated liquidity-provider quotes behind the scenes, holdings state separation, dividends, voting, redemption, complaints/support, traceability, blocked-state recovery, and responsibility separation. Primary issuance, T+2 settlement, market-maker inventory, and institutional reconciliation are backend/operations concepts, not primary consumer journeys.

Your task:

- Redesign the current `localhost:3002` consumer UI as a polished commercial app for retail foreign investors.
- Remove `dShare` everywhere from consumer-facing copy. Use `stock custodial rights`, `custodial rights`, `rights`, or Korean equivalents such as `주식 수탁권리`, `수탁권리`, `권리`.
- Remove or isolate all PoC/demo language from the commercial app: `모의`, `합성`, `테스트베드`, `모의 거래소`, `합성 여권`, mock institution responses, and demo-only test numbers.
- Do not expose institution/operator/testbed screens in the consumer app.
- Do not imply confirmed real partnerships or legal guarantees unless explicitly provided. Avoid copy such as `KSD official`, `legally effective`, `100% protected`, `safe`, `instant`, or `real-time` unless carefully qualified.
- Build the consumer E2E flow: account setup, market discovery, asset detail, instant 24/7 buy/sell, holdings, dividend claim/USDC conversion option, voting instruction, redemption, activity history, support/complaints.
- Do not make consumers choose between primary issuance, KRX regular-session orders, MM trades, or T+2 settlement flows. Those are institutional/operational details. Show them only in optional advanced details or support/debug contexts when they materially affect the user's funds, availability, or redemption timeline.
- Make the UI feel like a real financial consumer product: trustworthy, clear, restrained, mobile-friendly, and understandable to non-Korean retail investors.

Deliverables:

- Updated UI/UX recommendations or implementation changes.
- A concise mapping from the audit findings to the changes made.
- Any remaining gaps or assumptions.
