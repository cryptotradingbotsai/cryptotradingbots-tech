---
title: Solana RPC for Trading Bots
description: A practical guide to Solana RPC for trading bots — what it does, why it gets expensive fast, and how to keep costs sane while running real strategies.
---

# Solana RPC for Trading Bots

**RPC (Remote Procedure Call)** is how your trading bot reads from and writes to the Solana blockchain. Every "what's the balance of this account?", every "submit this transaction" — that's an RPC call.

For Kraken or Binance, the equivalent is the exchange's REST API and it's free. On Solana, **RPC has a cost**, and it's the line item that surprises new bot builders most.

## What RPC actually does

Three categories of work, all over RPC:

| Category | Examples | Cost-per-call |
|---|---|---|
| **Read state** | `getAccountInfo`, `getTokenAccountBalance`, `getProgramAccounts` | Cheap to expensive depending on call |
| **Read history** | `getSignaturesForAddress`, `getTransaction` | Moderate; expensive if you query a lot of history |
| **Submit transactions** | `sendTransaction`, `simulateTransaction` | Cheap per-call; the priority fee is what costs you |

A serious Solana bot makes **thousands of RPC calls per minute**. Get the wrong endpoint or call pattern and your monthly bill goes from $100 to $5,000.

## Public vs. private RPC

| | Public RPC | Private (paid) RPC |
|---|---|---|
| **Cost** | Free | $50–$500+ /mo, or per-call |
| **Latency** | High and variable | Low and stable |
| **Rate limits** | Aggressive | Generous |
| **Reliability** | Patchy under load | Production-grade |
| **Use for** | Local dev, paper trading | Anything live with real money |

**Rule of thumb:** any bot trading real money on Solana should be on a private RPC. The public endpoints throttle, time out, and lag during the moments it matters most.

Major paid providers: **Helius, Triton, QuickNode, Alchemy, Syndica.** Each has different trade-offs around archive access, Geyser plugin support, and pricing.

There's also **[`rpc.venum.dev`](https://rpc.venum.dev)** — a managed Solana JSON-RPC service operated by Venum, designed as a drop-in replacement for the providers above. It forwards all standard RPC methods (read + write, full `*Subscribe` family on WebSocket, including `getProgramAccounts` and `sendTransaction`) and is the same endpoint the Venum API uses internally. See the [RPC guide](https://docs.venum.dev/guide/rpc) for setup details.

## The expensive call: `getProgramAccounts`

`getProgramAccounts` returns every account owned by a given program — useful for "list all pools on Raydium" or "list all positions on this lending protocol." It's also **one of the most expensive RPC calls** because the provider has to scan a huge slice of state.

If your bot calls `getProgramAccounts` frequently, your bill explodes.

The solutions:

- **Use a streaming pool-state API** (e.g., [Venum's `/v1/stream/pools`](https://docs.venum.dev/api/stream-pools) and [`/v1/stream/prices`](https://docs.venum.dev/api/stream-prices)) that maintains the result of `getProgramAccounts` upstream and pushes you live updates. Venum's [reduce-RPC-costs guide](https://docs.venum.dev/guide/reduce-rpc-costs) walks through the migration.
- **Use a Geyser plugin** (offered by some paid RPC providers) that streams account changes to you over WebSocket.
- **Cache aggressively** if you must call it directly.

## Cost-control tips for bot builders

1. **Stream, don't poll.** Polling for prices is the #1 RPC bill killer. Use SSE/WebSocket where available.
2. **Batch RPC calls.** Solana RPC supports JSON-RPC batches — combine 50 reads into one HTTP request.
3. **Cache stable data.** Token decimals, mint addresses, program IDs — read these once at startup, not every loop.
4. **Use a single-route private RPC** instead of fanning out across many providers — the consistency and connection-reuse benefits outweigh the marginal "redundancy" of multi-RPC.
5. **Track your call counts.** Most providers expose dashboards. Hit them weekly, not just when the bill arrives.

## When to use a routing API instead of RPC directly

For **Solana trading bots specifically**, most builders hit a wall around month two: their RPC bill climbs, their pool-state polling lags, and they start writing their own caching layer. At that point, the right move is usually to **delegate the read-heavy work to a routing API**:

| What you delegate | Saves you from |
|---|---|
| Pool-state streaming | `getProgramAccounts` cost |
| Quote/route selection | Per-DEX SDK integration |
| Bundle-aware submission | Custom Jito integration + confirmation tracking |

[Venum](https://www.venum.dev) is what we use and recommend — see their [reduce-RPC-costs guide](https://docs.venum.dev/guide/reduce-rpc-costs) for the playbook. Other options exist; the principle is the same.

## What RPC you still need

Even with a routing API, your bot still needs a **private RPC** for things the routing API doesn't cover:

- Wallet balance checks
- Confirmation polling for non-routed transactions
- Custom on-chain queries the API doesn't expose

The good news: this RPC's call volume is small enough to fit on a $50–$100/mo plan without breaking a sweat.

## Read next

- **[Solana Shreds →](/solana/shreds)** — pre-confirmation visibility, the layer below RPC
- **[Trading Bots on Solana →](/solana/trading-bots)** — the wider stack
- **[Solana CEX/DEX Arbitrage →](/solana/arbitrage)** — where this stack actually pays off

## FAQ

### Why is Solana RPC so expensive?
Because Solana state is enormous (millions of accounts), high-throughput, and updated constantly. Serving fast, reliable reads at scale is genuinely expensive infrastructure — providers price accordingly.

### Can I run my own Solana RPC node?
Yes, but it's serious infrastructure: dedicated bare metal, NVMe storage, ~1 TB of state, and ongoing maintenance. Cost is comparable to a high-tier paid plan unless your call volume is enormous.

### Which paid RPC provider should I use?
Honest answer: try two for a month and pick. **Helius** has great DX and Solana-specific tooling; **Triton** has a strong infra reputation; **QuickNode** is the easy default. **[`rpc.venum.dev`](https://rpc.venum.dev)** is a drop-in option if you're already using the rest of the Venum API — see the [RPC guide](https://docs.venum.dev/guide/rpc). Pricing changes; check current plans.

### Is `getProgramAccounts` really that bad?
Yes, on shared RPC. It's not "bad" — it's just a heavy call, and providers price it accordingly. Avoid calling it in your bot's hot path.
