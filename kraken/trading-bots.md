---
title: How Trading Bots Work on Kraken
description: A practical guide to running a crypto trading bot on Kraken — the API, WebSockets, order types, rate limits, and security essentials.
---

# How Trading Bots Work on Kraken

Running a bot on Kraken comes down to four moving parts: **market data, orders, account state, and security**. Get those right and the rest is strategy.

## The Kraken API in plain English

Kraken offers two ways for a bot to talk to the exchange:

- **REST API** — request/response. Good for placing orders, checking balances, and one-off queries. Rate-limited per endpoint and per account tier.
- **WebSocket API** — streaming. Good for real-time prices, order-book depth, and trade fills. Most bots subscribe to a few WebSocket channels and use REST only for actions.

A typical bot keeps one persistent WebSocket open for market data and another (private, authenticated) one for its own orders and fills. REST is reserved for placing/canceling orders and balance checks.

## Order types you'll actually use

| Order type | When a bot uses it |
|---|---|
| **Limit** | Default for most strategies. Posts a price you're willing to pay; gets maker fee on Pro. |
| **Market** | When you _need_ a fill right now and can stomach the slippage. Avoid in thin books. |
| **Stop-loss / take-profit** | Server-side risk management — Kraken closes the position even if your bot crashes. |
| **Iceberg** | Hides large orders. Useful for serious size; overkill for retail bots. |

**Rule of thumb:** put your stop-losses on the exchange, not in your bot. If your bot dies, your stop should still fire.

## Rate limits — the unromantic ceiling

Kraken's rate limits are tier-based and counter-based. Each REST call costs "API counter" points; the counter decays over time. If you hit the cap, you get throttled or banned for a few minutes.

What this means for your bot:

- **Don't poll.** Use WebSockets for prices.
- **Batch.** If you can send one order with multiple legs, do it.
- **Backoff.** When a 429 hits, wait — don't retry immediately.

## Authentication and key safety

Kraken API keys come with **scopes**. Always create the most restrictive key your bot can work with:

| Scope | Enable when… |
|---|---|
| Query funds / open orders | Always — the bot needs to know its state. |
| Create / cancel orders | Always — the bot needs to trade. |
| Withdraw funds | **Almost never.** Only if you're building automated cash management, and even then think twice. |

Other essentials:

- **IP-allowlist your key.** Bind it to your VPS IP so a leaked key can't be used elsewhere.
- **Store the secret in an env var or secret manager.** Never in code, never in Git.
- **Rotate keys** quarterly or after any incident.

## Latency and where to host

Kraken's API is fronted by Cloudflare. Where you host your bot mostly affects WebSocket round-trip times:

- **Home Wi-Fi** — fine for paper trading and slow strategies.
- **Cheap VPS in EU or US** — the right answer for retail bots. ~10–50 ms to Kraken's edge.
- **Bare metal near Kraken's data center** — only worth it for HFT-class strategies, and at that point you're not really retail anymore.

## Build vs. buy

Three honest options:

1. **Off-the-shelf platform** (3Commas, Cryptohopper, Pionex, etc.) — hooks into your Kraken API key, runs strategies you configure in their UI. Lowest effort, least flexibility.
2. **Open-source bot** (Hummingbot, Freqtrade, OctoBot) — you host it, you tweak it. Free, more control, more setup.
3. **Custom code** — Python or TypeScript, your own logic, your own infra. Highest leverage, highest effort.

Most people should start with option 1 to learn the mechanics, then graduate to option 2 or 3 if they outgrow it.

## Read next

- **[Kraken Strategies →](/kraken/strategies)** — what works on Kraken specifically
- **[Kraken FAQ →](/kraken/faq)** — fees, geo-blocks, withdrawal limits
- **[Choosing a Bot →](/guides/choosing-a-bot)** — decision tree across platforms

## FAQ

### Does Kraken allow trading bots?
Yes. Kraken explicitly supports algorithmic trading via its REST and WebSocket APIs. You'll need an account in good standing and an API key with appropriate scopes.

### What's the best programming language for a Kraken bot?
**Python** has the most reference code and library support; **TypeScript / Node.js** is faster and integrates well with modern tooling. Both are fine. Pick what you already know.

### Can I run multiple bots on one Kraken account?
Yes, but they'll share the same rate-limit budget and the same balance. Coordinate them carefully or use sub-accounts where Kraken supports them.

### Do bots get a fee discount on Kraken?
Bots themselves don't, but **bots make it easier to maintain Kraken Pro volume tiers**, which do carry lower fees and maker rebates.
