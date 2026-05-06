---
title: Sandwich Attacks Explained
description: What a sandwich attack is, how it works step-by-step, what it costs victims, and the practical defenses that actually protect your swaps.
---

# Sandwich Attacks Explained

A **sandwich attack** is the most common form of harmful MEV. A bot watches you submit a swap, **buys the same asset in front of your transaction** to push the price up, lets your swap fill at the now-worse price, then **sells right after** — pocketing the difference.

It's called a "sandwich" because the victim's swap is the meat between two attacker slices.

## The five-step anatomy

1. **You submit a swap.** "Buy 100 SOL with USDC, max 1% slippage."
2. **A searcher's bot sees your tx** in the mempool (Ethereum) or via [Shreds](/solana/shreds) (Solana).
3. **The bot front-runs you.** It buys SOL right before your tx, pushing the pool price up.
4. **Your swap fills at the worse price.** You receive fewer SOL than you would have without interference.
5. **The bot back-runs you.** It immediately sells the SOL it just bought, capturing the price gap your swap left.

Net effect: the attacker profits, you pay extra slippage, the validator collects a tip from the searcher.

## What it costs you

A clean number is hard — it depends on swap size, pool depth, and your slippage tolerance — but as a rough scale:

| Swap size on a deep pool | Typical sandwich cost |
|---|---|
| < $500 | Usually nothing — too small to be worth attacking |
| $500 – $10,000 | 0.05% – 0.5% extra slippage |
| $10,000 – $100,000 | 0.5% – 2% extra slippage |
| > $100,000 | 1% – 5%+, depending on pool depth and slippage setting |

**Slippage tolerance is the lever.** A 5% slippage tolerance lets the attacker take up to ~5% from you. A 0.5% tolerance caps their take dramatically.

## How to defend yourself

| Defense | What it does | Effective on… |
|---|---|---|
| **Tight slippage** (0.3–0.5%) | Caps the attacker's max take | All chains |
| **Private bundles** (Jito on Solana, Flashbots Protect on ETH) | Hides your tx from public view until included | Both |
| **Routing APIs that bundle** | Same as above, but built-in | Solana via [Venum's Jito-bundled `/v1/swap`](https://docs.venum.dev/api/swap) |
| **Split big swaps** | Each smaller swap is less attractive | Both |
| **Avoid thin pools** | Sandwiches need price impact, which is bigger in shallow liquidity | Both |
| **Use TWAP-style order types** | Spreads the swap over time | Both, where supported |

For most retail Solana users, **using a routing API that defaults to Jito-bundled submission solves 90% of sandwich risk.**

## Sandwich on Solana vs Ethereum

| | Ethereum | Solana |
|---|---|---|
| **Mempool visibility** | Public — easy for searchers | No public mempool; requires Shred-stream access |
| **Block time** | ~12s — long window to execute | ~400ms — narrow window |
| **Defense default** | Flashbots Protect | Jito-bundled submission |
| **Sandwich frequency** | Very common pre-2023, declining as private flow grows | Less common, but rising as Shreds tooling matures |

## What sandwiches don't cover

A sandwich attack is **swap-specific**. It does not affect:

- Limit orders on a CEX (no public mempool to exploit; orders match against the order book directly).
- Off-chain trades.
- DCA bots that use small, low-impact swaps.
- Swaps via private channels (Flashbots Protect, Jito bundles, etc).

If your bot trades on **Kraken or Binance**, sandwiches are not part of your threat model. They're an on-chain phenomenon.

## Read next

- **[MEV Overview →](/mev/)** — the section index
- **[Frontrunning →](/mev/frontrunning)** — the broader category sandwich is part of
- **[Backrunning →](/mev/backrunning)** — the "polite" version of post-tx execution
- **[Solana RPC →](/solana/rpc)** — the infrastructure searchers depend on

## FAQ

### How do I know if I got sandwiched?
Look at your transaction on a block explorer. If the transactions immediately before and after yours are from the same account, swapping the same pair, that's almost always a sandwich.

### Does setting 0% slippage prevent sandwiches?
It would, but the swap will revert (fail) on any price movement at all. Real-world tradeoff: **0.3–0.5% slippage** balances sandwich resistance with swap reliability.

### Are sandwich bots illegal?
In most jurisdictions, no — they operate on public, permissionless blockchains. Some lawsuits have explored adversarial MEV under fraud or market-manipulation frameworks, but legal status remains unsettled.

### Why don't all DEXs have built-in sandwich protection?
Some are starting to. CowSwap pioneered batch auctions that prevent sandwiches; some Solana routing APIs default to Jito bundles. But the AMM model itself is sandwich-vulnerable by design.
