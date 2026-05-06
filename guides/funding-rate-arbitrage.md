---
title: Funding-Rate Arbitrage Explained
description: How funding-rate arbitrage works — the basis trade, the cross-venue version, and how to run it with real numbers and realistic expectations.
---

# Funding-Rate Arbitrage Explained

**Funding rates** are the periodic payments between longs and shorts on a perpetual futures contract. They exist to keep the perp price tethered to the spot price.

When the funding rate is **positive**, longs pay shorts. When it's **negative**, shorts pay longs. Funding-rate arbitrage means **positioning yourself on whichever side gets paid**, hedging out the price exposure on another venue, and collecting the funding payments as profit.

It's one of the **steadiest, most boring** crypto strategies. That's a feature, not a bug.

## Two flavors

### 1. The basis trade (single venue)

The classic. Buy Spot, short the Perpetual. You're delta-neutral (no price exposure). You collect the funding rate the longs pay.

```
Long $10,000 SOL Spot      ◄── price goes up: spot wins, perp loses
Short $10,000 SOL Perp     ◄── price goes down: spot loses, perp wins
                              Net: ~0 directional P&L
                              Funding rate: paid to short → profit
```

If the funding rate annualized is, say, +15%, you collect ~15% per year on the deployed capital, regardless of where SOL goes.

**Caveat:** funding rates can flip negative. When they do, you start paying. Quality basis-trade bots monitor this and unwind when funding turns sustainably negative.

### 2. Cross-venue funding arbitrage

When two venues quote different funding rates for the same asset, you can:

- **Long** on the venue paying you (negative funding)
- **Short** on the venue charging less (or paying you on the other side)

Net: collect the funding-rate **difference** on both legs.

This works because funding rates are venue-specific — Binance, Bybit, OKX, dYdX, Hyperliquid, and others all set their own. Divergences are common during news events or weekend regimes.

## Where it fits

| Strategy | Risk profile | Capital efficiency |
|---|---|---|
| **Basis trade (Spot long + Perp short)** | Very low directional risk; some liquidation risk on the short | Medium (margin both sides) |
| **Cross-venue funding arb** | Low directional risk if hedged correctly | Lower (margin on both venues) |
| **Funding rate "carry"** (single-side bet on funding direction) | High — directional bet | High |

The basis trade is the classic. The cross-venue version is more capital-intensive but also more situationally rich.

## Tips & tricks

### Watch the **annualized** rate, not the per-hour
Most exchanges show funding as a per-8-hour rate. Multiply by 1095 to get annualized. A 0.01% per-8-hour rate annualizes to ~10.95% — useful as a baseline.

### Liquidation risk on the short leg is real
You're short the perp. If price rips, your collateral on the perp side gets eaten. **Run with conservative leverage** — 2–3x max on the short side. Top up margin before it gets close.

### Spot-Perp wallet transfers cost time
On Binance, moving USDT from Spot to Futures wallet is instant via internal transfer. Across venues (Spot on Coinbase, Perp on Binance), it's a withdrawal — slow and fee-bearing. **Pre-fund both wallets.**

### Funding direction predicts itself
Funding rates have momentum. If a rate has been +0.05% per 8h for a week, it's likely to stay positive next week. Use this to time entries — but be ready to unwind on a flip.

### Stablecoin-margined vs coin-margined perps behave differently
USDT-margined perps are simpler — your P&L is in USDT and matches your spot leg. Coin-margined (COIN-M) perps create a non-linear hedge. **Stick to USDT-margined for basis trades** unless you specifically want the coin-M behavior.

## Simplified architecture (basis trade)

```
       ┌────────────────────────────────────┐
       │ Bot                                 │
       │                                     │
       │  ─ Funding rate watcher (per pair)  │
       │  ─ Threshold filter                 │
       │  ─ Position sizing                  │
       │  ─ Leg 1: Spot long  (Binance Spot) │
       │  ─ Leg 2: Perp short (Binance USDT-M)│
       │  ─ Funding-event tracker            │
       │  ─ Auto-unwind on flip              │
       └────────────────────────────────────┘
                    │
                    ▼
              Binance APIs
              (Spot + Futures, separate keys, sub-account isolated)
```

Same shape as any two-legged strategy: detect, size, fire two legs, manage state. The "trades" are infrequent — most of the bot's life is monitoring funding events and rebalancing collateral.

## Realistic expectations

- **Expected return:** 5–30% annualized on deployed capital, depending on market regime. Bull markets push funding higher; sideways markets push it lower.
- **Variance:** funding spikes during euphoria and crashes; you'll see months at 50%+ APR and months at 5%.
- **Operational load:** low. Set it up, monitor weekly. The biggest risks are liquidation on the short and missing a funding-direction flip.

## Read next

- **[Delta-Neutral Strategies →](/guides/delta-neutral-strategies)** — the broader category basis trade belongs to
- **[Binance Strategies →](/binance/strategies)** — basis trade in the Binance context
- **[Building an Arbitrage Bot →](/guides/building-an-arbitrage-bot)** — general arb patterns

## FAQ

### Is funding-rate arbitrage really risk-free?
No. The directional risk is hedged away if both legs are sized correctly. **Liquidation risk on the short leg, basis risk between Spot and Perp, and operational risk (exchange downtime, key compromise) remain.**

### Which exchange has the best funding rates?
Varies. Binance has the deepest liquidity but funding is often closer to neutral. **Bybit, OKX, and Hyperliquid** sometimes have larger divergences. Watching cross-venue rates is most of the alpha.

### Can I run this on Solana?
On Solana **DEXs**, perps are available (Drift, Mango). Basis trade would mean Spot SOL + perp short on Drift. Volumes are smaller; opportunities exist but with thinner liquidity.

### How much capital to start?
**$5,000+ minimum** for the basis trade to clear minimums and leave room for collateral buffer. Cross-venue funding arb realistically needs $10,000+ split across venues.
