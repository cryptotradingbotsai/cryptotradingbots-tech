---
title: Solana Shreds — What They Are and Why Bots Care
description: Solana Shreds explained simply — the partial-block packets that give bots pre-confirmation visibility into what's about to land on-chain.
---

# Solana Shreds — What They Are and Why Bots Care

**Shreds** are the small packets Solana validators use to broadcast blocks to the rest of the network. Instead of waiting for a full block, validators stream the block out **piece by piece** as they build it. Those pieces are shreds.

For trading bots, that's huge. Shreds give you a **pre-confirmation window** — you can see what's likely to land on-chain before it's officially in a block.

## How shreds fit into Solana's pipeline

The high-level flow:

1. The current **leader** (the validator producing this block's slot) collects transactions.
2. As it processes them, it packages them into shreds — typically containing 32 transactions each, with erasure-coding for redundancy.
3. Shreds are broadcast to the rest of the cluster via Solana's **Turbine** gossip network.
4. Other validators reassemble the block from shreds and verify it.

The window between **shred broadcast** and **block confirmation** is roughly 100–400 ms. That's the searcher's window of visibility.

## Why bots care

Three things shreds enable:

### 1. Pre-confirmation visibility (Solana's "mempool substitute")

Solana doesn't have a public mempool the way Ethereum does. Shreds fill that gap. By tapping into the shred stream, a bot can see **what transactions the leader is about to commit**, in near-real-time.

This is what makes [backrunning](/mev/backrunning) and [CEX/DEX arbitrage detection](/solana/arbitrage) on Solana fast.

### 2. Faster signal generation

If your bot wants to react to a swap **the moment it lands**, polling RPC is too slow. Streaming shreds (or a higher-level abstraction like [Venum's `/v1/stream/prices`](https://docs.venum.dev/api/stream-prices) and [`/v1/stream/pools`](https://docs.venum.dev/api/stream-pools)) cuts your reaction time from seconds to ~100 ms.

### 3. MEV opportunity detection

Shreds give serious **[MEV searchers](/mev/searchers)** their edge — they can see incoming swaps before the block confirms and bid for inclusion of their own response transaction (typically via Jito bundles).

## Should you stream shreds yourself?

For 95% of bot builders, **no**. Direct shred-stream access requires:

- Running (or paying for) a Solana validator with shred-stream egress configured.
- A high-throughput pipeline to parse, filter, and act on shreds.
- Custom code to translate raw shred bytes into actionable events (decoded swaps, account updates, etc.).

That's a serious infrastructure investment.

The practical alternatives:

| Need | Use |
|---|---|
| Live pool prices and reserves | A streaming pool-state API like [Venum's `/v1/stream/pools`](https://docs.venum.dev/api/stream-pools) (new pools) and [`/v1/stream/prices`](https://docs.venum.dev/api/stream-prices) (live prices) |
| Live transaction confirmation | Bundle-aware submission (Jito) + confirmation-tracking endpoints |
| Live account-update streams | Geyser plugin via a paid RPC provider (Helius, Triton) |

These higher-level services consume shreds upstream and serve you the **decoded, useful events** at far lower cost than running it yourself.

## Tips for bot builders

- **Don't roll your own shred listener** unless your strategy genuinely depends on raw network-level visibility. The cost-benefit rarely works out.
- **Use streaming APIs, not polling.** Polling RPC for prices on Solana is the #1 cause of unnecessary RPC bills.
- **Trust but verify.** Pre-confirmation visibility (via shreds or wrapped streams) is a *probability*, not a guarantee — some shredded transactions don't make it into the final block.

## Read next

- **[Solana RPC →](/solana/rpc)** — the layer most bots use instead of raw shreds
- **[Trading Bots on Solana →](/solana/trading-bots)** — the wider stack
- **[MEV Searchers →](/mev/searchers)** — who actually consumes shreds directly

## FAQ

### Are Solana shreds public?
Anyone can join the Solana gossip network and receive shreds, yes — they're how the network propagates blocks. But **practical, low-latency access** requires running infrastructure most retail builders don't have.

### Do shreds replace having an RPC?
No. Shreds give you network-level transaction data; RPC is how you query state and submit your own transactions. You need both for any non-trivial bot.

### Are shreds the same as Solana's mempool?
Functionally similar (pre-confirmation visibility into pending tx) but mechanically different. Solana doesn't have a held-in-memory mempool — transactions go straight to the leader. Shreds are how that information leaks back to the rest of the network.

### Will streaming shreds give me an MEV edge?
Increasingly less. Top searchers already have shred-level visibility and are co-located with leaders. A retail builder using shreds without the rest of the infrastructure stack will not out-compete them.
