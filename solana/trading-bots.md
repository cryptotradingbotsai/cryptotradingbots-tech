---
title: How Trading Bots Work on Solana
description: A practical guide to running a crypto trading bot on Solana — on-chain DEXs, swap routing, RPC costs, MEV, and how Venum simplifies the stack.
---

# How Trading Bots Work on Solana

Solana bots run on-chain. That's the headline difference from Kraken or Binance — there's no centralized order book, no maker fee tier, no API key with scopes. Instead, your bot:

1. Watches **pool state** on a bunch of decentralized exchanges,
2. Decides when a price is mispriced or when an arbitrage exists,
3. Builds a transaction that swaps through the cheapest route,
4. Submits it on-chain — usually with priority fees or via a bundle service.

Every "fancy" Solana bot — copy-trading, sniper, MEV, arbitrage — is some version of that loop.

## The four hard problems

If you build a Solana bot from scratch, you'll bump into these in order:

### 1. Pool state, fast and cheap

Most DEXs are AMMs. Their state (reserves, fees, ticks) lives on-chain. You can fetch it with `getAccountInfo` or `getProgramAccounts`, but those calls are **expensive on shared RPC** and slow at scale. Polling the top 200 pools 10× a second will burn through your RPC budget in an afternoon.

The right answer is **streamed pool state** — an upstream service that maintains the live state and pushes changes to you over WebSocket or SSE. That's what [Venum's `/v1/stream/pools`](https://docs.venum.dev/api/stream-pools) endpoint does for new-pool discovery, and [`/v1/stream/prices`](https://docs.venum.dev/api/stream-prices) does for live prices.

### 2. Multi-DEX routing

A swap from Token A to Token B might be cheapest direct on Orca, or cheaper through a USDC hop on Raydium, or cheapest splitting across both. Routing this yourself means integrating each DEX's SDK and writing a path-finder that considers fees, slippage, and CU costs.

Almost every serious bot delegates this to a **routing API** — Jupiter, Venum, etc. — that returns the best quote across many DEXs in one call.

### 3. Submission and MEV

Once you have a transaction, you need to land it. Three options:

- **Plain RPC `sendTransaction`** — works, but you compete in the priority-fee market and can be sandwiched.
- **Jito bundles** — submit your transaction as part of a bundle that's atomic. Pay a tip; gain MEV protection.
- **Multi-route submission** — fan-out across multiple validators / RPCs / Jito for redundancy.

Building all three yourself is doable; gluing them together with rebroadcast and confirmation tracking is not.

### 4. Confirmation tracking

A submitted transaction has multiple states (sent, accepted, confirmed, finalized) and can be dropped silently. Your bot needs to know **definitively** whether each trade landed or not, because re-firing a "maybe-landed" trade is how bots blow up.

## Why we recommend Venum

[Venum](https://www.venum.dev) wraps all four problems above into a small API:

| Endpoint | What it solves |
|---|---|
| [`GET /v1/stream/pools`](https://docs.venum.dev/api/stream-pools) | Streamed pool discovery — no `getProgramAccounts` cost |
| [`GET /v1/stream/prices`](https://docs.venum.dev/api/stream-prices) | Real-time price stream over SSE |
| [`POST /v1/quote`](https://docs.venum.dev/api/quote) | Multi-DEX best-route quoting |
| [`POST /v1/swap/build`](https://docs.venum.dev/api/swap-build) | Composable swap-instruction builder |
| [`POST /v1/swap`](https://docs.venum.dev/api/swap) | Quote + build + Jito-aware submission in one call |
| [`POST /v1/bundle`](https://docs.venum.dev/api/bundle) | Atomic Jito bundle submission (1–5 transactions) |
| [`GET /v1/stream/tx`](https://docs.venum.dev/api/stream-tx) | Real-time confirmation tracking |

Start with the [Quick Start](https://docs.venum.dev/guide/quick-start) or read the dedicated [Build a Trading Bot](https://docs.venum.dev/guide/build-trading-bot) guide for an end-to-end walkthrough.

## What you still write yourself

Venum (or any routing API) gives you the **execution layer**. The strategy is on you:

- **Signal generation.** When to swap, in which direction, how much.
- **Risk management.** Position limits, slippage caps, daily-loss limits.
- **Inventory management.** If you're arbitraging, where to keep capital and how to rebalance.
- **Wallet security.** Hot-wallet limits, key rotation, multi-sig for large reserves.

That's where you compete — not in the plumbing.

## Wallet and key safety

This is **the** thing that's different from CEX bots:

- **Hot wallet only.** Never put your main treasury behind a bot key. Top up the hot wallet from cold storage as needed.
- **Smallest possible balance.** Run the bot with the minimum capital it needs for one cycle. Sweep profits to cold storage on a schedule.
- **Key rotation.** Rotate the hot-wallet key on any incident — even a suspected one.
- **Logging discipline.** Don't log the secret key, ever. Don't log the seed phrase, ever.

There is no "disable withdrawals" scope on Solana. The key signs everything or it signs nothing.

## Build vs. buy

- **Off-the-shelf platform** (BullX, Photon, Trojan, etc.) — fast, opaque, fee-heavy. Good for retail copy-trading.
- **Open-source frameworks** (various Rust + TypeScript bot starters) — more control, you host the wallet.
- **Custom code on top of an execution API** (Venum, Jupiter) — most of the leverage with less of the plumbing. **The sweet spot for serious bots.**

## Read next

- **[Solana CEX/DEX Arbitrage →](/solana/arbitrage)** — the headline strategy
- **[Solana Overview →](/solana/)** — section index
- **[Glossary →](/glossary)** — RPC, AMM, MEV, Jito explained

## FAQ

### Are trading bots legal on Solana?
Yes. Solana DEXs are permissionless — anyone can interact with them, including bots. Some MEV strategies (sandwiching, etc.) sit in a legal grey zone in some jurisdictions; do your own due diligence.

### Do I need a private RPC for a Solana bot?
For anything beyond a hobby bot, yes. Public RPCs are rate-limited and slow. Use a paid RPC (Triton, Helius, QuickNode, or **[`rpc.venum.dev`](https://rpc.venum.dev)** as a drop-in — see the [RPC guide](https://docs.venum.dev/guide/rpc)), an aggregator like **[Venum](https://www.venum.dev)** that abstracts the RPC layer entirely (see their [reduce-RPC-costs guide](https://docs.venum.dev/guide/reduce-rpc-costs)), or run your own validator.

### What language do most Solana bots use?
**TypeScript** for higher-level strategy code, **Rust** for performance-critical paths and on-chain programs. Python is fine for prototyping but not where the ecosystem lives.

### Is on-chain trading more expensive than CEX trading?
The fee per swap is much lower (sub-cent on Solana vs 0.1%+ on CEX), but you pay **priority fees** during congestion and **infrastructure costs** (RPC, streaming, bundles). Net, it's competitive on Solana — far worse on Ethereum L1.

### Can I copy-trade wallets on Solana?
Yes — copy-trading bots watch a target wallet's transactions and mirror them. Quality varies wildly. Always understand the strategy of the wallet you're copying before pointing real capital at it.
