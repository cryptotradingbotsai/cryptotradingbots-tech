---
title: How Trading Bots Work on Binance
description: A practical guide to running a crypto trading bot on Binance — Spot vs Futures APIs, WebSockets, rate limits, sub-accounts, and security essentials.
---

# How Trading Bots Work on Binance

Binance gives you more knobs than any other exchange. That's both the power and the problem. This page walks through what actually matters: which API to use, how the rate limits really work, why sub-accounts will save you, and how to keep your keys from getting drained.

## Spot vs Futures vs Margin — pick one

Binance has three trading venues, each with its own API:

| Venue | What you trade | Use it when… |
|---|---|---|
| **Spot** | Real assets (you own the coins) | You want simple buy/sell, DCA, grid, basic strategies. |
| **USD-M Futures** | Perpetual contracts settled in USDT/USDC | You want leverage, short-selling, or funding-rate plays. |
| **COIN-M Futures** | Inverse perps settled in the underlying asset | You're hedging coin exposure, or you actually want to be long the asset. |
| **Margin (Cross/Isolated)** | Borrowed Spot trading | You want leverage on Spot pairs without using Futures. |

**Pick one for your bot.** Mixing venues in a single bot is doable but messy — different APIs, different leverage, different liquidation rules.

## The Binance API in plain English

Two layers, same as Kraken:

- **REST** — request/response. Place orders, query state, manage account.
- **WebSocket** — streaming. Get live prices, depth, trades, and your own account events.

Binance also offers a **User Data Stream** — a private WebSocket channel that pushes you fill events the instant they happen. Subscribe to this and you don't need to poll for fills.

## Rate limits — Binance is strict

Binance enforces rate limits in three dimensions:

1. **Requests per minute** — basic API call quota.
2. **Order count per 10 seconds** and **per day** — separate quota for actually placing orders.
3. **Connection limits** — how many WebSockets you can have open from one IP.

Hit any of these too often and you get a temporary ban (2 minutes → 1 day → forever). The mitigations:

- **Use WebSockets for state.** Don't poll for prices, balances, or fills.
- **Batch where possible.** Cancel-replace > cancel + new where it's supported.
- **Respect 429 / 418 responses.** Back off exponentially. Never retry-spam.

## Sub-accounts — the unsung hero

If you run more than one strategy, **use sub-accounts**. They give you:

- Independent balances and risk per strategy.
- Independent rate-limit budgets.
- Clear P&L attribution (your tax-time future-self will thank you).
- Per-strategy API keys, so a leak in one doesn't drain the rest.

You'll need to enable sub-accounts on the master account; some Binance regions don't support them.

## Authentication and key safety

Same rules as everywhere, applied harder because Binance is a bigger target:

| Practice | Why |
|---|---|
| **IP-allowlist** every key | Stops a leaked key from being used elsewhere. |
| **Disable withdrawals** | The single biggest blast-radius scope. Almost never needed for bots. |
| **One key per strategy** | Limits damage from any single key compromise. |
| **Rotate quarterly** | Reduces the window of exposure. |
| **Store in a secret manager** | Vault, 1Password, AWS Secrets Manager — anywhere but code or Git. |

## Latency and where to host

If your strategy reacts to price changes faster than 100 ms, hosting matters:

- **AWS Tokyo (`ap-northeast-1`)** is closest to Binance's main API edge — ~5–20 ms round-trips.
- **AWS Singapore** is a solid second choice.
- **Anywhere in Europe or US** adds 100–250 ms — fine for swing/position bots, deadly for HFT.

For grid, DCA, and most signal-driven bots, latency doesn't matter much. For market-making or scalping, host in Tokyo.

## Build vs. buy

Three honest options, same as Kraken:

1. **Off-the-shelf platform** (3Commas, Cryptohopper, Pionex, Bitsgap, Binance's own bots). Lowest effort.
2. **Open-source bot** (Hummingbot, Freqtrade, OctoBot). Free, more control.
3. **Custom code.** Highest leverage, highest effort. Most pro bots are custom.

::: tip Binance has built-in bots
Binance offers native grid, DCA, and arbitrage bots in the UI. They're a good zero-setup way to learn the mechanics — but they take a meaningful cut of profits. Once you outgrow them, move to your own.
:::

## Read next

- **[Binance Strategies →](/binance/strategies)** — what works on the deepest book in crypto
- **[Binance FAQ →](/binance/faq)** — fees, BNB discounts, sub-accounts
- **[Choosing a Bot →](/guides/choosing-a-bot)** — decide what to build (or buy)

## FAQ

### Does Binance allow trading bots?
Yes. Binance encourages algorithmic trading and offers official APIs for it. Some regions have stricter rules around derivatives — check what's available where you live.

### What's the best language for a Binance bot?
**Python** for prototyping and ML. **TypeScript / Node.js** or **Rust** if you care about latency. Avoid Java for retail bots — it's overkill and the GC pauses will bite you.

### Are Binance fees lower for bots?
Bots don't get a special fee tier, but they make it easier to **maintain VIP volume tiers**, which do carry lower fees. Holding BNB also gives a 25% fee discount on Spot.

### Can I run multiple bots on one Binance account?
Yes, but **use sub-accounts** to isolate them. Same-account bots share the rate-limit budget and balance, which causes invisible interference.
