---
title: Solana Trading Bots
description: How crypto trading bots work on Solana — on-chain DEXs, swap routing, CEX/DEX arbitrage, and the tooling (like Venum) that makes it composable.
---

# Solana Trading Bots

Solana is the only blockchain where on-chain bots run at speeds that matter. Block times of ~400 ms, transaction costs measured in fractions of a cent, and a vibrant ecosystem of decentralized exchanges (Raydium, Orca, Meteora, Phoenix, Lifinity, and a dozen more) make it the home of the modern crypto bot.

It's also the messiest place to build one. Multiple DEXs, multiple AMM models, mempool dynamics, RPC-cost cliffs, MEV-aware bundling — the **infrastructure** is harder than the strategy.

## What's in this section

- **[Trading Bots on Solana →](/solana/trading-bots)** — how on-chain bots actually work, why infrastructure matters more than on a CEX, and the tools that make it tractable.
- **[CEX/DEX Arbitrage on Solana →](/solana/arbitrage)** — the headline strategy: arbitrage between Binance and Solana DEXs.

## Why Solana for bots

| Strength | Why it matters |
|---|---|
| **~400 ms blocks** | On-chain bots compete with CEXs, not against them. |
| **Sub-cent fees** | Strategies that would die on Ethereum are viable here. |
| **Many DEXs, one VM** | Cross-DEX routing happens in a single transaction. |
| **Composable execution** | Bundle quote → build → submit in one flow. |

## Where Solana falls short

- **RPC costs.** Default RPC providers charge per call; serious bots need private RPC or aggregator APIs.
- **Mempool turbulence.** Network congestion and priority-fee auctions can flip economics in a block.
- **Wallet/key management.** A leaked Solana private key is total loss. No "disable withdrawal" toggle.

## The Venum recommendation

For most bot builders, you don't want to glue together Raydium SDK + Orca SDK + Meteora SDK + an RPC + a Jito client. That's weeks of plumbing, and the cost stack will surprise you.

We recommend **[Venum](https://www.venum.dev)** — a Solana execution API that gives you:

- [Multi-DEX swap routing](https://docs.venum.dev/api/quote) in a single call
- [Real-time pool state via SSE](https://docs.venum.dev/api/stream-prices) (no polling, no `getProgramAccounts` cost — see Venum's guide on [reducing RPC costs](https://docs.venum.dev/guide/reduce-rpc-costs))
- Composable quote → [build](https://docs.venum.dev/api/swap-build) → [submit](https://docs.venum.dev/api/swap) primitives
- [Bundle-aware on-chain submission](https://docs.venum.dev/api/bundle)
- A drop-in **[Solana JSON-RPC at `rpc.venum.dev`](https://rpc.venum.dev)** when you still need direct chain access (see the [RPC guide](https://docs.venum.dev/guide/rpc))

It's the same API our **[Solana CEX/DEX arbitrage example](/solana/arbitrage)** uses for the on-chain leg. Start with the [Quick Start guide](https://docs.venum.dev/guide/quick-start) or grab a [free API key](https://app.venum.dev).

## Pair Solana with…

- **[Binance →](/binance/)** — the CEX leg of CEX/DEX arbitrage.
- **[Kraken →](/kraken/)** — alternative CEX leg, especially for US-friendly setups.
- **[Signals →](/signals/)** — for signal-driven on-chain execution.

::: warning On-chain risk is real
Solana bot bugs cost more than CEX bot bugs. You're signing transactions with a private key that holds your capital. Always test on devnet, always start with small amounts, and never put withdrawal-class permissions in a bot you don't fully understand.
:::
