---
title: Building an Arbitrage Bot — A Practical Guide
description: How to build a crypto arbitrage bot — the architecture, the strategy, the gotchas, and the tooling that makes it tractable in 2026.
---

# Building an Arbitrage Bot — A Practical Guide

An **arbitrage bot** spots the same asset trading at different prices in two places, buys cheap, sells dear, and pockets the spread. Sounds simple. The reality is a list of small, brutal details that turn the strategy from "free money" into a business.

This page is the **shortest honest version** — what you need, in what order. For the Solana-specific case, see **[Building a CEX/DEX Arbitrage Bot](/guides/building-a-cex-dex-arbitrage-bot)**.

## The four flavors of arbitrage

| Flavor | Cheap side | Dear side | Capital cost |
|---|---|---|---|
| **CEX ↔ CEX** | E.g. Binance | E.g. Kraken | High — must pre-fund both |
| **CEX ↔ DEX** | Binance | Solana DEX | High — chain + CEX inventory |
| **DEX ↔ DEX** (intra-chain) | Raydium | Orca | Lower — single wallet |
| **Triangular** (single venue) | A → B | B → C → A | Lowest — but tight margins |

Pick one. Mixing flavors in version one of your bot is a fast way to ship nothing.

## Simplified architecture

The shape is the same regardless of flavor:

```
┌──────────────────────────────────────────┐
│ Bot                                       │
│                                           │
│  ┌─────────────┐    ┌─────────────────┐  │
│  │ Price feed  │───►│ Spread detector │  │
│  │ (venue A+B) │    └────────┬────────┘  │
│  └─────────────┘             │            │
│                              ▼            │
│                    ┌──────────────────┐   │
│                    │ Risk + sizing    │   │
│                    └────────┬─────────┘   │
│                             │              │
│                ┌────────────┴───────────┐  │
│                ▼                        ▼  │
│       ┌────────────────┐      ┌────────────────┐
│       │ Order on A     │      │ Order on B     │
│       │ (buy cheap)    │      │ (sell dear)    │
│       └────────────────┘      └────────────────┘
│                ▲                        ▲      │
│                └──── trade ledger ──────┘      │
└──────────────────────────────────────────┘
```

Five components: **price feed**, **spread detector**, **risk/sizing**, **two order legs**, **trade ledger**. That's it.

## Build order

Build in this order — each step depends on the previous:

### 1. Price feeds, both venues, streaming
Don't poll. Subscribe to WebSocket / SSE feeds on each venue. For CEX, native exchange WebSocket. For DEX, a streaming pool-state API ([Venum's `/v1/stream/prices`](https://docs.venum.dev/api/stream-prices) on Solana is the cleanest option).

**Tip:** use a unified internal price object across feeds — `{ venue, pair, bid, ask, timestamp }` — so the spread detector doesn't care where the price came from.

### 2. Spread detector with per-pair thresholds
Spread > threshold means "fire." Threshold per pair = (taker fee A) + (taker fee B) + (network/priority cost) + safety padding. **Static thresholds = leaving money or losing it.** Real bots tune per pair.

### 3. Risk and sizing
Before firing, every trade clears these gates: **max trade size**, **max exposure per asset**, **daily loss cap**, **max concurrent open arbs**. Capital efficiency comes later — survival comes first.

### 4. Two-legged execution, as parallel as possible
Fire both legs simultaneously. Network latency is your enemy. **Tip from production code:** if leg A confirms but leg B fails, you have an unhedged position. Have an explicit recovery path — close A, retry B, or accept and log.

### 5. Trade ledger in Postgres
Every fire, every fill, every failure → log it with cost basis. **You will need this** for tax, for debugging, for tuning thresholds. Don't try to reconstruct from exchange CSVs later. Use USD-denominated P&L; asset-denominated ledgers lie when the asset moves.

### 6. Watchdogs
A bot that disconnects silently is more dangerous than one that crashes loudly. Heartbeat every 30 s; alert if the bot has gone quiet; auto-close all open positions if your watchdog can't reach the bot.

## The gotchas that kill new arb bots

- **Fees not modeled correctly.** CEX taker fee + maker rebate + withdrawal cost + on-chain priority fee. Miss any one and your "profitable" backtest is fiction.
- **Latency between legs.** If your venues are 200 ms apart, the price has moved by the time leg B lands.
- **Inventory drift.** You can't move USDC across venues fast enough for one-shot arb. Pre-fund and rebalance on schedule.
- **Failed transactions.** On-chain legs fail more than you think. Build for the partial-fill case from day one.
- **Backtesting on fills, not on order book.** Real fills depend on book depth, which historical tick data rarely captures faithfully. Treat backtests as upper bounds, not predictions.

## Stack recommendations

For the **execution layer**:

- **CEX legs:** native exchange APIs (REST + WebSocket). Use the official SDK if it's good (Binance), otherwise write a thin client.
- **DEX legs (Solana):** [Venum](https://www.venum.dev) for routing ([`/v1/quote`](https://docs.venum.dev/api/quote)) + bundle submission ([`/v1/swap`](https://docs.venum.dev/api/swap), [`/v1/bundle`](https://docs.venum.dev/api/bundle)). Saves weeks of plumbing — see the [Build a Trading Bot](https://docs.venum.dev/guide/build-trading-bot) guide.
- **DEX legs (Ethereum/L2):** 0x API, 1inch, or Cowswap, depending on your latency tolerance.

For the **strategy layer**:

- **TypeScript** is the sweet spot — async-friendly, easy to deploy, easy to integrate.
- **Python** for prototyping; **Rust** if you genuinely need sub-millisecond latency (you probably don't).
- **Postgres** for the ledger; **Redis** if you need fast cross-process state.

## What "live" looks like

A working arbitrage bot in production:

- Watches **20–80 pairs** simultaneously.
- Fires **5–100 round-trips per day** depending on volatility.
- Targets **2–10 bps net per round-trip** after all fees.
- Spends **most of its time idle** waiting for a tradable spread.
- Has **per-pair threshold configs** that get tuned weekly.

If your bot fires every 30 seconds, you're either lucky, broken, or about to lose money fast.

## Read next

- **[Building a CEX/DEX Arbitrage Bot →](/guides/building-a-cex-dex-arbitrage-bot)** — Solana-specific deep-dive
- **[Solana CEX/DEX Arbitrage →](/solana/arbitrage)** — the strategy explainer
- **[Funding-Rate Arbitrage →](/guides/funding-rate-arbitrage)** — a different arb flavor
- **[Choosing a Bot →](/guides/choosing-a-bot)** — should you build at all?

## FAQ

### How much capital do I need to build an arbitrage bot?
**$5,000–$10,000** is a realistic floor. Below that, fees and minimum order sizes dominate. Above that, you can run multiple pairs with proper sizing.

### Can I do CEX↔CEX arbitrage between Kraken and Binance?
Yes — see **[Kraken Strategies](/kraken/strategies)** and **[Binance Strategies](/binance/strategies)**. The hardest part is inventory: pre-fund both sides, rebalance manually.

### Should I write my own DEX integration?
Almost never. Use a routing API ([Venum](https://www.venum.dev) on Solana, Jupiter, 0x, 1inch). The engineering time saved easily pays for the API.

### What's the smallest viable arbitrage bot?
A **DEX↔DEX intra-chain bot on Solana**, watching ~10 pairs, with $1,000 capital. Cheapest to start, most accessible to a solo dev. Returns are modest but the learning curve is steep enough that even small profits are educational.
