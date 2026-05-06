---
title: Solana CEX/DEX Arbitrage Bots
description: How CEX/DEX arbitrage works on Solana — the strategy, the math, the risks, and the tooling (Binance + Venum) that makes it tractable.
---

# Solana CEX/DEX Arbitrage Bots

CEX/DEX arbitrage is the **headline trading-bot strategy on Solana**, and for good reason: it's the cleanest way to extract value from the gap between two markets that quote the same asset slightly differently.

In plain English: when **Binance's price for SOL** drifts away from **Raydium's (or Orca's, or Meteora's) price for SOL**, by enough to cover fees plus a safety margin, a bot can simultaneously buy on the cheap side and sell on the dear side. Net: a small, mostly-delta-neutral profit per round-trip.

## The strategy in one table

| Binance vs DEX | On-chain leg | Binance leg | Profit source |
|---|---|---|---|
| Binance > DEX | **Buy** token on DEX | **Sell** token on Binance | spread − fees |
| Binance < DEX | **Sell** token on DEX | **Buy** token on Binance | spread − fees |

The trade fires only when the spread clears a per-token threshold:

```
threshold = binance_taker_bps + pool_fee_bps + jito_tip_bps + safety_padding
```

Below threshold: don't trade. Above threshold and growing: fire both legs as close to simultaneously as you can.

## Why it works on Solana specifically

Solana is the only chain where on-chain execution is fast and cheap enough to compete with a CEX:

- **~400 ms blocks** mean your DEX leg lands before Binance's price moves too far.
- **Sub-cent per-swap fees** keep the threshold low.
- **Multiple high-liquidity DEXs** (Raydium, Orca, Meteora, Phoenix) give the price-discovery you need.
- **Jito bundles** let you submit the on-chain leg with priority and atomicity.

It would not work on Ethereum L1 — the gas cost alone destroys the spread.

## What the bot actually does

A CEX/DEX arb bot is a tight loop:

1. **Stream prices** from both venues. Binance over WebSocket, Solana DEXs via a streaming pool-state API like **[Venum's `/v1/stream/prices`](https://docs.venum.dev/api/stream-prices)**.
2. **Compute the gap** for each watched token, every tick.
3. **Filter**: is the spread above the per-token threshold? Is your inventory positioned to take the trade? Is there a cap-ex limit you're under?
4. **Fire both legs**. Send the on-chain swap (typically through a routing API) and the Binance order at the same instant.
5. **Reconcile**. Confirm both legs landed. If only one did, hedge or unwind.
6. **Log**. Record P&L, slippage, latency, partial-fill rate.

## The hardest parts

Three problems take 80% of the engineering time:

### 1. Inventory and rebalancing

You can't move funds across the chain↔CEX boundary fast enough for one-shot arbitrage — withdrawals take minutes. So you **pre-fund both sides**: enough USDC + tokens on Binance, enough USDC + tokens in the on-chain wallet. The bot trades against this inventory and **rebalances periodically** (manually or via scheduled withdrawals).

That ties up capital. A serious CEX/DEX arb bot needs **at least $5,000–$10,000 split between the two venues** to be economically interesting.

### 2. Threshold tuning per token

Every token's pool has different fees, different depth, different volatility. A single global threshold leaves money on the table for some tokens and burns others. Real bots track per-token configs and update them as conditions change.

### 3. Reliability under congestion

When Solana is congested, your on-chain leg might not land. If your CEX leg already filled, you're now exposed and net long or short. The mitigations:

- **Priority fees** that scale with detected congestion.
- **Jito bundles** for atomic submission.
- **Confirmation tracking** so you know within ~1 second whether the chain leg landed.
- **Auto-hedge logic** that closes the CEX leg if the chain leg fails.

A real implementation we built for this strategy uses **[Venum's `/v1/swap` endpoint](https://docs.venum.dev/api/swap)** for the on-chain leg — it handles Jito submission, RPC fan-out, and confirmation in one call (see Venum's [submission guide](https://docs.venum.dev/guide/submission) and the [`/v1/bundle`](https://docs.venum.dev/api/bundle) endpoint for atomic Jito bundles). That alone removes weeks of plumbing.

## What it's not

- **It's not free money.** The post-fee edge per trade is small. You make returns through frequency, not size.
- **It's not market-neutral if you don't size carefully.** Mismatched leg sizes silently accumulate directional exposure.
- **It's not unlimited capacity.** Pool depth, Binance order-book depth, and your inventory cap how big each fill can be.

## Realistic expectations

A well-run CEX/DEX arb bot on Solana might target:

- **5–50 round-trips per day** depending on volatility
- **2–10 bps net per round-trip** (after all fees, tips, and slippage)
- **Annualized returns** in the **20–80% range** on the deployed capital, in good conditions

In quiet markets, returns drop sharply. In violent ones, the spreads widen but so does your slippage and failure rate. **It's a steady-grind strategy, not a moonshot.**

## Read next

- **[Trading Bots on Solana →](/solana/trading-bots)** — the underlying execution stack
- **[Binance Strategies →](/binance/strategies)** — the CEX leg's playbook
- **[Choosing a Bot →](/guides/choosing-a-bot)** — pick a strategy that matches your capital and time

## FAQ

### How much capital do I need for a Solana CEX/DEX arb bot?
**$5,000–$10,000 minimum**, split between Binance and a Solana hot wallet. Below that, fees dominate and the per-trade math doesn't work.

### Can I do this without a routing API like Venum?
Mechanically yes — you can integrate each DEX's SDK and submit transactions yourself. Practically no — the engineering effort is enormous, the cost stack is brutal, and you're competing against bots that already use these APIs. See Venum's [Build a Trading Bot guide](https://docs.venum.dev/guide/build-trading-bot) for a reference architecture.

### Is CEX/DEX arbitrage delta-neutral?
Approximately, if both legs fill at the prices you expect. In practice, **slippage, partial fills, and failed on-chain transactions** introduce small directional exposures that you need to manage actively.

### Why Binance and not Coinbase or Kraken?
Liquidity. Binance is where the most volume in Solana-listed tokens trades, so the on-chain↔Binance gap is the most actionable. **Kraken can work** for a smaller subset of tokens — see the [Kraken strategies page](/kraken/strategies) for details.

### Is this strategy MEV?
Strictly no — MEV typically refers to value extracted from ordering on-chain transactions (sandwiching, back-running). CEX/DEX arb extracts value from the **price gap between two venues** and uses MEV-protection tools (like Jito bundles) defensively to make sure your on-chain leg lands.
