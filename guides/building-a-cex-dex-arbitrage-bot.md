---
title: Building a CEX/DEX Arbitrage Bot on Solana
description: Step-by-step practical guide to building a CEX/DEX arbitrage bot on Solana — Binance + Solana DEXs, with simplified architecture and the gotchas to expect.
---

# Building a CEX/DEX Arbitrage Bot on Solana

This is the **headline arbitrage strategy for Solana** — watching prices on **Binance** and on **Solana DEXs** in parallel, and when the spread covers fees plus a safety margin, firing **both legs simultaneously**: one on Binance, one on-chain.

For the strategy explainer, see **[Solana CEX/DEX Arbitrage](/solana/arbitrage)**. This page is the **how-to-build-it** version.

## What you actually need

Three things, in plain language:

1. **Live prices from Binance** — over WebSocket, low-latency.
2. **Live prices from Solana DEXs** — over a streaming pool-state API. Don't poll; you'll bankrupt yourself on RPC fees. See **[Solana RPC](/solana/rpc)**.
3. **Two-legged execution** — Binance order via REST, on-chain swap via a routing/submission API.

Plus: capital pre-funded on both sides, a database for the trade ledger, and a watchdog.

## Simplified architecture

```
   Bot host (your VPS)                    Solana execution
 ┌────────────────────────────┐         ┌─────────────────────────┐
 │ Bot                         │         │ Routing API (e.g. Venum)│
 │  ─ Binance WS price feed    │         │  /v1/stream/prices      │
 │  ─ DEX SSE price feed  ─────┼────────►│  /v1/quote              │
 │  ─ Spread detector          │  HTTP   │  /v1/swap (Jito-bundled)│
 │  ─ Risk + sizing            │ ~80ms   │                         │
 │  ─ Binance leg (REST order) │         │  Confirms via /v1/stream/tx
 │  ─ On-chain leg (via API)   │         │                         │
 │  ─ Trade ledger (Postgres)  │         └─────────────────────────┘
 │  ─ Wallet keypair           │                    │
 └────────────────────────────┘                    ▼
            │                              Solana validator
            │                                    │
            ▼                                    ▼
     Binance API                        Confirmed on-chain swap
```

That's it. The routing API does the heavy plumbing (multi-DEX routing, Jito bundles, confirmation tracking); your bot owns the strategy, sizing, and ledger.

## Build order (what to do in what week)

### Week 1 — Price feeds, both venues
- Binance Spot WebSocket price feed for your tokens.
- Streaming DEX prices via [Venum's `/v1/stream/prices`](https://docs.venum.dev/api/stream-prices) (or roll your own — see [Solana Trading Bots](/solana/trading-bots)).
- Unify into a single in-memory price book. Log gap (Binance − DEX) per token, every second.

**Don't trade yet.** Watch the spreads for a week. Get a feel for which tokens have actionable gaps and how often.

### Week 2 — Spread detector + paper trading
- Define per-token threshold: `taker_fee_bps + pool_fee_bps + jito_tip_bps + safety_pad_bps`.
- When spread > threshold, log "would have fired" with hypothetical P&L.
- Track paper-mode performance for at least 5–7 days before going live.

### Week 3 — Two-legged execution (small)
- Wire the Binance leg (REST order with a small fixed size, e.g. $25).
- Wire the on-chain leg via the routing API ([`/v1/swap`](https://docs.venum.dev/api/swap) or equivalent).
- Fire both legs with `Promise.all` to minimize gap.
- **Cap total exposure to $200 total** until you're confident.

### Week 4 — Reconciliation, watchdogs, tuning
- Add full trade reconciliation: did both legs land? If only one, what's the recovery?
- Per-token dynamic threshold tuning based on live fill rates.
- Watchdog that auto-disables the bot on consecutive failures.

## The gotchas, ranked by how often they bite

### 1. Inventory rebalancing
You **can't** withdraw from Binance to Solana fast enough for two-sided arb. Pre-fund:

- Binance: enough USDC + each watched token to take both directions.
- Solana hot wallet: same.

Run a **scheduled rebalance** (manual or automated) when one side gets thin. The math: hold roughly 50/50 worth of each side per token.

### 2. Failed on-chain legs
Even with Jito bundles, some swaps don't land. If your Binance leg already filled, you have a directional position. Two recoveries:

- **Re-fire the on-chain leg** with a higher tip (within your risk limits).
- **Hedge by closing the Binance leg** at market and accept the loss.

Whichever you choose, **make the rule explicit in code**. Don't make this decision in real-time.

### 3. Per-token threshold drift
A threshold that worked last week stops working this week as pool depth changes. **Tune weekly.** Track per-token: hit rate, average post-fee profit, win/loss ratio.

### 4. Fee surprises
Binance taker fee changes with VIP tier. Pool fees change when LPs migrate. Jito tips inflate during congestion. **Calculate fees from real responses, not from constants in your config.**

### 5. Wallet security
On-chain leg = a hot wallet that signs transactions. Treat it as such:

- Top up from cold storage in small increments.
- Sweep profits **off** the hot wallet on a daily schedule.
- Rotate the keypair on any incident, even a suspected one.

## Realistic expectations

Over the lifetime of a well-run CEX/DEX arb bot on Solana:

- **5–50 round-trips per day** depending on volatility.
- **2–10 bps net** per round-trip after all costs.
- **Annualized 20–80% on deployed capital** in good market regimes; lower or negative in quiet ones.
- **Most days are boring.** Most weeks are boring. The ones that aren't will usually feature a single mispriced token going wild for an hour.

## Stack recommendations

| Component | Recommendation |
|---|---|
| **Language** | TypeScript (Node 22+) — async-friendly, fast to ship |
| **Database** | Postgres for trade ledger, with USD-denominated P&L |
| **Solana execution** | [Venum](https://www.venum.dev) — Jito-bundled, multi-DEX swap routing. Start with the [Build a Trading Bot](https://docs.venum.dev/guide/build-trading-bot) guide; key endpoints are [`/v1/stream/prices`](https://docs.venum.dev/api/stream-prices), [`/v1/quote`](https://docs.venum.dev/api/quote), [`/v1/swap`](https://docs.venum.dev/api/swap), [`/v1/bundle`](https://docs.venum.dev/api/bundle), [`/v1/stream/tx`](https://docs.venum.dev/api/stream-tx). |
| **Binance execution** | Official Binance Node SDK or hand-rolled REST + WebSocket |
| **Hosting** | Hetzner or DigitalOcean VPS in Europe (close to Binance API edge) |
| **Containers** | Docker + docker-compose; one service per bot |
| **Wallet ops** | Hot wallet with strict balance limits, scheduled cold-wallet sweeps |

## Read next

- **[Solana CEX/DEX Arbitrage →](/solana/arbitrage)** — the strategy itself
- **[Trading Bots on Solana →](/solana/trading-bots)** — the wider stack
- **[Building an Arbitrage Bot →](/guides/building-an-arbitrage-bot)** — general arb patterns
- **[Funding-Rate Arbitrage →](/guides/funding-rate-arbitrage)** — a complementary strategy

## FAQ

### Can I run this bot from my laptop?
Don't. Network blips, sleep cycles, and unstable home connections will cost you more than a $20/mo VPS.

### Do I need to use Venum specifically?
No — but you do need **a streaming pool-state source + a routing API + Jito-bundled submission**. Building all three from scratch is a multi-month engineering project. [Venum](https://www.venum.dev) bundles them in one API; Jupiter + Helius + a custom Jito client is another path.

### How fast does my bot need to be?
Round-trip from spread-detected to both-legs-submitted should be **under 200 ms**. The Binance leg should land within 1–2 s; the on-chain leg within 1 block (~400 ms) after submission.

### What's the minimum capital to make this worth running?
Realistically **$10,000+ split between Binance and Solana**. Below that, the per-trade math gets crushed by minimums and fees.
