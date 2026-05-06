---
title: MEV — Maximal Extractable Value Explained
description: A plain-English guide to MEV — what it is, who extracts it, the main strategies (sandwich, frontrunning, backrunning), and how it works on Ethereum vs Solana.
---

# MEV — Maximal Extractable Value Explained

**MEV (Maximal Extractable Value)** is the profit a validator — or someone paying a validator — can make by **reordering, including, or excluding** transactions in a block. If your transaction is sitting in the queue and a sophisticated actor sees it before it confirms, they can act around it for profit.

That sounds abstract. The concrete forms are familiar:

- **[Sandwich attack](/mev/sandwich-attack)** — buy in front of your swap, sell after it.
- **[Frontrunning](/mev/frontrunning)** — copy your trade and execute it before yours.
- **[Backrunning](/mev/backrunning)** — let your trade land, then trade right after to capture the resulting price gap.
- **CEX/DEX arbitrage** — captures the price gap between an on-chain DEX and a centralized exchange. (See **[Solana CEX/DEX Arbitrage](/solana/arbitrage)**.)

The actors who hunt these opportunities are **[MEV searchers](/mev/searchers)** — bots scanning the mempool (or pre-block state) for trades they can act around.

## Where MEV happens

| Chain | Mempool visibility | Block time | MEV character |
|---|---|---|---|
| **Ethereum** | Public mempool — anyone can see pending tx | ~12 s | Sandwich-heavy, well-tooled, multi-billion $ market |
| **Solana** | Pre-block "leader visibility" via Shreds, no traditional mempool | ~400 ms | More backrunning + arbitrage, less classic sandwich |
| **Other L2s** | Varies — many are encrypted or sequencer-controlled | varies | Lower MEV than mainnet, growing as TVL grows |

Solana doesn't have a public mempool the way Ethereum does. Instead, transactions stream to the current leader as **[Shreds](/solana/shreds)**. That changes the MEV landscape — sandwiching is harder, but backrunning and arb still work.

## Who profits, who loses

| Role | Role |
|---|---|
| **Searcher** | Finds the opportunity, builds the transaction, pays a tip to the validator. |
| **Validator / Block producer** | Includes the searcher's bundle in exchange for a tip (and sometimes a kickback). |
| **Bundle relay** (Jito on Solana, Flashbots on Ethereum) | Routes searcher bundles to validators, takes a cut. |
| **Victim** (you, often) | Pays slightly more on a swap than they would have without MEV. |

For an average swap, victim cost is small — fractions of a percent. For a large, slow swap on a thin pool, MEV can eat several percent.

## Defending yourself

You can't make MEV go away, but you can make yourself a less attractive target:

- **Use private order flow** — bundle services like Jito (Solana) or Flashbots Protect (Ethereum) submit your transaction without exposing it to the public mempool.
- **Tight slippage** — if your slippage tolerance is 0.5% instead of 5%, sandwiches stop being profitable on you.
- **Split big swaps** — many small trades present less surface area than one big one.
- **Use routing APIs that bundle defensively** — [Venum's `/v1/swap`](https://docs.venum.dev/api/swap) submits via Jito by default for Solana swaps, removing most of the sandwich risk. The dedicated [`/v1/bundle`](https://docs.venum.dev/api/bundle) endpoint lets you submit atomic 1–5-tx Jito bundles when you need stricter ordering.

## What the deeper pages cover

- **[MEV Searchers →](/mev/searchers)** — the bots and the people behind them
- **[Sandwich Attacks →](/mev/sandwich-attack)** — the most-discussed form of MEV
- **[Frontrunning →](/mev/frontrunning)** — older sibling of sandwich
- **[Backrunning →](/mev/backrunning)** — the "polite" version, sometimes legitimate

## Read next

- **[Solana RPC →](/solana/rpc)** — the infrastructure layer searchers depend on
- **[Solana Shreds →](/solana/shreds)** — Solana's pre-mempool tx visibility model
- **[Glossary →](/glossary)** — every term defined

## FAQ

### Is all MEV bad?
No. CEX/DEX arbitrage and backrunning of large mispriced trades **make markets more efficient** — they shrink the price gap between venues. The harmful forms are sandwich attacks and adversarial frontrunning that extract value from retail.

### Can I become an MEV searcher?
Mechanically yes; practically very hard. The barrier to entry has risen sharply since 2022 — searchers compete on infrastructure (private RPC, co-location, custom relays) and on the depth of their opportunity-finding code. Solo operators are rare today.

### Does Solana have less MEV than Ethereum?
**Different**, not necessarily less. Solana lacks a public mempool, so traditional sandwiching is harder. But the fast block time + Shreds visibility creates new opportunities (especially backrunning and DEX↔DEX arb).

### How much MEV gets extracted in a year?
Order of magnitude: **billions of dollars** annually across Ethereum + Solana + L2s. The exact number depends on whose dashboards you trust.
