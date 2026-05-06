---
title: MEV Searchers — How They Work
description: Who MEV searchers are, what their bots actually do, the strategies they run, and why solo searching has gotten dramatically harder.
---

# MEV Searchers — How They Work

An **MEV searcher** is a person (or team) running bots that scan the blockchain for **profitable transaction opportunities** — sandwich, frontrun, backrun, arbitrage, liquidations — and bid for the right to extract them.

If MEV is the profit, the searcher is who captures it.

## What a searcher actually does

A searcher's bot runs a tight loop, all the time:

1. **Watch.** Listen to the mempool (Ethereum) or to pre-block leader streams via [Shreds](/solana/shreds) (Solana).
2. **Detect.** Find a transaction that creates an opportunity — a big swap that'll move price, a liquidation that's underwater, an arbitrage that's about to open.
3. **Build.** Construct one or more transactions that capture the opportunity around the target.
4. **Bid.** Submit as a bundle to a relay (Jito, Flashbots, Eden, etc.) with a tip to the validator.
5. **Confirm.** If included, profit. If not, the bid was free — you just lost the opportunity.

This loop runs thousands of times per minute on a serious searcher's infrastructure.

## The strategies in one table

| Strategy | What it does | Win source |
|---|---|---|
| **[Sandwich](/mev/sandwich-attack)** | Buy in front of victim's swap, sell after | Price impact victim caused |
| **[Frontrun](/mev/frontrunning)** | Copy victim's profitable trade, beat them to it | Same alpha, faster execution |
| **[Backrun](/mev/backrunning)** | Trade immediately after victim's swap | Mispricing victim left in the pool |
| **DEX↔DEX arb** | Swap on cheap DEX, sell on dear DEX | Inter-pool price gap |
| **CEX↔DEX arb** | Same as above, but one venue is centralized | See [Solana CEX/DEX Arb](/solana/arbitrage) |
| **Liquidation** | Trigger an underwater loan position | Liquidation bonus paid by the protocol |

A serious searcher runs several of these in parallel.

## Why searcher edge has collapsed

In 2021–2022, a solo developer with a Helius RPC subscription could find profitable opportunities. By 2026, that's mostly gone. Why:

- **Private order flow** has eaten the public mempool. Most large swaps now go through Flashbots Protect, Jito, MEV-Share, or similar — invisible to the open mempool.
- **Latency competition.** Top searchers run co-located with validators, with custom-built block-builders. A retail bot is 50–500 ms slow.
- **Tooling consolidation.** A handful of teams (one of them often public) run >50% of all searcher volume.
- **Validator integration.** Some validators run their own searchers — extracting before relaying.

**Translation:** if you're not building a serious infrastructure stack, you're not competing for sandwich-class MEV. CEX/DEX arb (capital + good APIs win) is more accessible.

## What's still accessible to a small builder

Honest list:

- **CEX/DEX arbitrage** — see **[Solana CEX/DEX Arbitrage](/solana/arbitrage)**. Capital and an execution API ([Venum's Build a Trading Bot guide](https://docs.venum.dev/guide/build-trading-bot)) get you most of the way.
- **Cross-DEX arb on Solana** — easier than sandwich; competition is real but tractable.
- **Liquidation bots** on lending protocols — niche and competitive but still a real path.

What's not accessible:

- Generic sandwich-bot retail competition with established searchers.
- Anything requiring sub-millisecond latency from a Hetzner box.

## Tools and infrastructure searchers use

| Layer | Examples |
|---|---|
| **Pre-block visibility** | Solana Shreds via dedicated streaming nodes; Ethereum mempool via geth/nethermind nodes |
| **Routing / quoting** | Custom path-finders, or APIs like [Venum's `/v1/quote`](https://docs.venum.dev/api/quote) and [`/v1/swap/build`](https://docs.venum.dev/api/swap-build) for Solana swap routing |
| **Bundle submission** | Jito (Solana), Flashbots (Ethereum), MEV-Share, Eden |
| **Simulation** | foundry / forge, anvil, custom forks for instant on-chain simulation |
| **Infrastructure** | Bare metal in AWS Tokyo (Binance), Frankfurt or Ashburn (Solana), private RPC endpoints |

## Read next

- **[MEV Overview →](/mev/)** — the section index
- **[Solana CEX/DEX Arbitrage →](/solana/arbitrage)** — the most accessible MEV-adjacent strategy
- **[Solana RPC →](/solana/rpc)** — the layer searchers depend on

## FAQ

### How much money do MEV searchers make?
Top searchers reportedly make **tens of millions of dollars per year**. The long tail of small searchers makes a few hundred to a few thousand per month, often unsustainably as competition tightens.

### Is MEV searching legal?
Mostly yes, in most jurisdictions, since it operates on permissionless public infrastructure. Some forms (large-scale adversarial sandwiching) sit in legal grey zones depending on jurisdiction. Liquidation bots are uncontroversial.

### Do I need to write Rust to be a searcher?
For latency-critical paths, yes. For CEX/DEX arb and liquidations, **TypeScript or Python is fine** — your edge is capital + opportunity-finding, not microseconds.

### What's the difference between a searcher and an arbitrageur?
Overlapping circles. **Arbitrageur** = anyone who profits from price gaps. **Searcher** = specifically a bot operator who hunts blockchain-specific MEV opportunities (which include arb, liquidations, sandwich, etc).
