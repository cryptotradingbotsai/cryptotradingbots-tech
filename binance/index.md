---
title: Binance Trading Bots
description: How crypto trading bots work on Binance — Spot, Futures, fees, strategies, security, and the questions everyone asks before going live.
---

# Binance Trading Bots

Binance is the **deepest, fastest, most liquid** crypto exchange in the world. For bots, that translates into one thing: **opportunity that doesn't exist anywhere else**. The flip side is competition — millions of bots run on Binance, including pro firms with co-located servers and budgets you don't have.

This section covers how to actually build, run, and survive a trading bot on Binance — Spot and Futures.

## What's in this section

- **[Trading Bots on Binance →](/binance/trading-bots)** — the API, WebSockets, Spot vs Futures, rate limits, and security.
- **[Binance Strategies →](/binance/strategies)** — grid, scalping, futures arb, funding-rate plays, and what actually works on the world's deepest book.
- **[Binance FAQ →](/binance/faq)** — fees, BNB discounts, withdrawal limits, sub-accounts, and the most-Googled questions.

## Why Binance for bots

| Strength | Why it matters |
|---|---|
| **Deepest liquidity** | Tight spreads on hundreds of pairs; less slippage on size. |
| **Highest velocity** | More fills per minute = more compounding for short-cycle strategies. |
| **Spot + Futures + Margin** | Run cash, leveraged, and funding-rate strategies on one venue. |
| **Sub-accounts** | Isolate strategies and bots cleanly under one master account. |

## Where Binance falls short

- **Competition.** Pro market-makers will eat your lunch on top pairs. Find your edge in second-tier pairs or non-obvious strategies.
- **Geographic complexity.** Binance.com, Binance.US, and Binance Futures have different products, different rules, and different availability.
- **Rate limits.** Aggressive on the WebSocket and order side; bad bot architecture gets banned fast.

## Pair Binance with…

- **[Kraken →](/kraken/)** for cross-exchange arbitrage on the same pairs.
- **[Solana →](/solana/)** for CEX/DEX arbitrage where Binance is the CEX leg — see the [Solana arbitrage guide](/solana/arbitrage).
- **[Signals →](/signals/)** for hands-off execution if you'd rather follow a strategy than build one.

::: tip Choose the right Binance
Binance.com (international), Binance.US, and Binance Futures are different products with different APIs and different availability. **Pick one and stick to it for your bot's lifetime** — switching means rewriting the integration.
:::
