---
title: Kraken Bot FAQ
description: Direct answers to the most-asked questions about running crypto trading bots on Kraken — fees, geo-blocks, security, withdrawals, and more.
---

# Kraken Bot FAQ

The questions that come up over and over when running a trading bot on Kraken — answered without filler.

## Account & access

### Does Kraken allow trading bots?
Yes, explicitly. Kraken supports algorithmic trading via its public REST and WebSocket APIs. Create an API key with the right scopes and you're good to go.

### Do I need Kraken Pro to run a bot?
No, but you probably want it. Kraken Pro gives you better fee tiers, maker rebates, and access to advanced order types. The standard Kraken account works for basic bots.

### Is Kraken available in my country?
Most countries — but check the [Kraken availability list](https://support.kraken.com/) before you commit. Some products (futures, margin, staking) have additional geographic restrictions even within supported countries.

### Can I run a bot from a US account?
Yes. Kraken is one of the better-regulated US-friendly exchanges. Note that Kraken Futures availability for US users has changed multiple times — check current status.

## Fees

### What are Kraken's fees for bot trading?
On Kraken Pro, **maker fees start at 0.16%** and **taker fees at 0.26%** for low-volume accounts, scaling down to as low as **0.00% / 0.10%** at the highest tiers. Bots can earn maker rebates by posting limit orders that don't immediately fill.

### Does Kraken charge a fee for using the API?
No — API access is free. You only pay the standard trading fees on your filled orders.

### Are there withdrawal fees?
Yes, per-asset. ETH, USDC, and BTC withdrawals each have their own fixed fees. Plan your bot's cash management around batching withdrawals.

## API & technical

### What's Kraken's API rate limit?
Kraken uses a per-account API counter that **decays over time**. The exact ceiling depends on your verification tier. Use WebSockets for prices to keep your REST counter free for actual trading.

### Does Kraken have a sandbox / paper-trading mode?
Yes — Kraken Demo (for futures) and you can paper-trade by simulating fills against the real WebSocket feed without sending orders. Most bot frameworks (Hummingbot, Freqtrade) support paper mode out of the box.

### Can I use Kraken's WebSocket without authentication?
Yes, for public market data (prices, order books, trades). Authentication is required for private channels (your own orders, your own balances).

### What happens if my bot crashes mid-trade?
Stop-losses placed **server-side** at Kraken keep firing even if your bot dies. That's why the rule is: always attach a stop-loss when you open a position.

## Security

### How do I keep my Kraken API key safe?
Three rules:

1. **IP-allowlist** the key to your bot's server.
2. **Disable withdrawal scope** unless you absolutely need it.
3. **Store the secret in environment variables or a secret manager**, never in code or Git.

### What scopes should I enable?
Minimum: **Query Funds**, **Query Open Orders**, **Create & Modify Orders**, **Cancel & Close Orders**. Skip "Withdraw Funds" unless you're building cash-management automation.

### Has Kraken ever been hacked?
Kraken has never had a major exchange-level breach as of writing. That doesn't mean it can't happen — keep only what you need on the exchange and withdraw to cold storage regularly.

## Strategy & profitability

### Can I really make money with a Kraken bot?
Some people do. Most don't. Bots automate execution; they don't manufacture alpha. The biggest wins come from **avoiding losses** (sticking to the rule) rather than catching highs.

### What's the smallest amount I can start with?
Mechanically, ~$50. Practically, **~$1,000** is where fees stop dominating your P&L and you can run a reasonable position size.

### Should I use leverage on Kraken with a bot?
Probably not while you're learning. Leverage amplifies bot bugs as fast as it amplifies wins. Master spot first.

## Read next

- **[Trading Bots on Kraken →](/kraken/trading-bots)** — the API and order types
- **[Kraken Strategies →](/kraken/strategies)** — what works on Kraken
- **[Choosing a Bot →](/guides/choosing-a-bot)** — match a platform to your goals
