---
title: Backrunning in Crypto — What It Is and How It Works
description: Backrunning explained simply — the polite cousin of frontrunning, how it makes markets more efficient, and where the line to harmful MEV gets drawn.
---

# Backrunning in Crypto — What It Is and How It Works

**Backrunning** is when a bot trades **immediately after** someone else's transaction lands, capturing a price gap or imbalance the original transaction created.

Unlike a [sandwich attack](/mev/sandwich-attack), backrunning doesn't make the victim's trade worse. It happens after the fact, and it's often **the mechanism that keeps DEX prices in sync with the rest of the market**.

## How backrunning works

Step by step:

1. A user submits a large swap on a DEX. Their swap pushes the pool price away from the broader market price (this is just normal AMM behavior — large swaps move prices).
2. Right after that swap lands, a backrunner bot **swaps in the opposite direction** — restoring the pool's price toward the market average.
3. The backrunner profits from the temporary mispricing the user left behind.

The user **does not pay extra slippage** — they got the price they expected, with their slippage tolerance respected. The backrunner is just trading the **post-swap pool state**.

## Backrunning vs frontrunning vs sandwich

| | Frontrun | Sandwich | Backrun |
|---|---|---|---|
| **Tx position** | Before victim | Before + after | After only |
| **Victim worse off?** | Sometimes (race lost) | Yes (more slippage) | **No** |
| **Captures** | Same alpha | Slippage created | Mispricing left behind |
| **Sentiment** | Adversarial | Adversarial | Often considered neutral / beneficial |

Backrunning is often described as the **"good MEV"** — searchers competing to backrun keep DEX prices accurate without harming the original swapper.

## The most common backrunning play: arbitrage

Backrunning is essentially **arbitrage with a millisecond delay**. The most common pattern:

- Big swap on Raydium pushes SOL/USDC price up by 0.5%.
- A backrunner sees that Orca and Meteora still have the old (lower) price.
- They buy SOL on Orca/Meteora and sell on Raydium — capturing the 0.5% gap.
- Result: all three pools converge on the new market price.

This is **the same mechanism** that drives [CEX/DEX arbitrage](/solana/arbitrage) — it's just on-chain-only.

## On Solana specifically

Solana's combination of fast blocks (~400 ms) and many high-liquidity DEXs makes backrunning especially active:

- A swap on one DEX can be backrun on another DEX **in the next block** (~400 ms later).
- Searchers stream live pool state via APIs like [Venum's `/v1/stream/prices`](https://docs.venum.dev/api/stream-prices) and [`/v1/stream/pools`](https://docs.venum.dev/api/stream-pools) to detect imbalances.
- Bundles via Jito give backrunners atomic execution and priority.

Backrunning is one of the most accessible forms of MEV for solo builders on Solana — though competition has grown sharply.

## When does backrunning become harmful?

The line is fuzzy. Two cases where backrunning feels closer to abuse:

- **Backrunning oracle updates** to attack a lending protocol — extracting from liquidation mispricings before they're patched.
- **Backrunning in coordination with a frontrun** — that's just a sandwich.

Pure post-tx arbitrage is broadly considered legitimate market activity.

## Read next

- **[MEV Overview →](/mev/)** — section index
- **[Sandwich Attack →](/mev/sandwich-attack)** — when frontrun + backrun is malicious
- **[Frontrunning →](/mev/frontrunning)** — the racing-ahead version
- **[Solana CEX/DEX Arbitrage →](/solana/arbitrage)** — backrunning's cousin: cross-venue

## FAQ

### Is backrunning illegal?
Generally no. It operates on public, permissionless infrastructure and doesn't degrade the victim's outcome. It's broadly considered legitimate trading activity.

### Can I become a backrunner?
Yes — it's the most accessible MEV strategy for solo builders. You'll need streaming pool state, fast routing, and bundle submission. **[Venum](https://www.venum.dev)** wraps all three (`/v1/stream/prices`, `/v1/quote`, `/v1/bundle`); see their [Build a Trading Bot](https://docs.venum.dev/guide/build-trading-bot) guide.

### Do I get paid extra if my swap is backrun?
No — the backrunner profits from market state, not from you. You get the same outcome with or without a backrunner present. (Some MEV-share schemes on Ethereum return a portion of backrun profits to the original swapper, but this is opt-in and rare.)

### What's the smallest backrun-worthy opportunity?
Depends on fees and the venue, but on Solana a backrun usually needs a **post-fee edge of $1–$5 minimum** to clear the priority-fee + Jito-tip cost.
