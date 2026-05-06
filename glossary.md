---
title: Crypto Trading Bot Glossary
description: Every term you'll meet when running a crypto trading bot — Spot, perps, slippage, MEV, sandwich, RPC, Shreds, Jito, market-maker, AMM, and more.
---

# Crypto Trading Bot Glossary

Every term you'll meet when running a crypto trading bot — defined in one or two sentences, with cross-links to the deeper pages.

## Trading basics

**Spot** — Trading actual coins (you own them after the trade). Compare to **Futures**, where you trade a contract that tracks the price.

**Perpetual / Perp** — A futures contract with no expiry. Funded by a periodic payment between longs and shorts (the **funding rate**).

**Limit order** — A buy or sell at a specific price. Sits in the book until filled or canceled.

**Market order** — A buy or sell that fills immediately at whatever price is available. Risks slippage in thin books.

**Maker fee** — The (lower) fee you pay when your limit order adds liquidity to the book.

**Taker fee** — The (higher) fee you pay when your order removes liquidity by matching an existing one.

**OCO (One-Cancels-the-Other)** — A pair of orders where filling one cancels the other. Useful for "stop-loss + take-profit" setups.

**Slippage** — The difference between the price you expected and the price you actually got. Always positive in expectation; meaningfully so in thin books.

**Spread** — Difference between the best bid and best ask. Tight spreads = liquid market.

**Leverage** — Trading with borrowed capital. 5x leverage means a $100 position controls $500 of asset. Amplifies wins **and** losses.

**Liquidation** — Forced closure of a leveraged position when its margin falls below the maintenance threshold. Almost always at a loss.

**Funding rate** — Periodic payment between longs and shorts on a perpetual contract, used to peg perp price to spot price. See **[Funding-Rate Arbitrage](/guides/funding-rate-arbitrage)**.

**Basis** — The price gap between the spot market and the futures/perp market for the same asset.

**Basis trade / Cash-and-carry** — Long spot, short the equivalent perp; harvest the funding rate as profit. See **[Delta-Neutral Strategies](/guides/delta-neutral-strategies)**.

**Delta-neutral** — A position whose P&L doesn't depend on price direction. See **[Delta-Neutral Strategies](/guides/delta-neutral-strategies)**.

**Hedge** — A second position that offsets the directional risk of a first position.

## Strategy types

**Grid bot** — Places a ladder of buy and sell limit orders around a price, profits from oscillation.

**DCA (Dollar-Cost Averaging)** — Buying a fixed dollar amount on a schedule, ignoring price.

**Trend-following** — Buy when price is rising, sell when it turns. Indicators: moving averages, ATR, ADX.

**Mean-reversion** — Assume price reverts to its average; sell extremes, buy retracements.

**Market-making** — Post bids and asks simultaneously, capture the spread.

**Scalping** — Many small, fast trades, each capturing tiny moves.

**Arbitrage** — Buy on the cheap venue, sell on the dear one. Cross-exchange, intra-DEX, or CEX/DEX. See **[Building an Arbitrage Bot](/guides/building-an-arbitrage-bot)**.

**Triangular arbitrage** — Three-leg arb on a single venue, exploiting cross-rate mispricings.

**Sniping** — Buying a newly-listed or newly-launched token in the first block(s) of trading. Common on Solana via [Telegram trading bots](/guides/telegram-trading-bots).

**Copy-trading** — Mirroring another wallet's trades automatically.

## Bot infrastructure

**API key** — A credential that lets your bot act on your exchange account. Has scopes (read, trade, withdraw).

**WebSocket** — A persistent two-way connection to an exchange for real-time data. Far cheaper than polling.

**REST API** — Request/response API. Used for placing orders and one-off queries.

**Rate limit** — Maximum API calls per minute / per 10 seconds / per day. Exceeding it gets you throttled or banned.

**Sub-account** — A separate account under your master account, with its own balance and API keys. Used to isolate strategies.

**VPS** — Virtual Private Server. The cheap cloud machine you put your bot on so it runs 24/7.

**Backtest** — Simulating a strategy on historical data to estimate performance.

**Paper trading / Sandbox / Testnet** — Running the bot against real market data without real money. Always do this first.

**Watchdog** — A separate process or check that detects when your bot has failed and either alerts you or auto-closes positions.

## On-chain (Solana, mostly)

**RPC (Remote Procedure Call)** — How your bot reads from and writes to a blockchain. See **[Solana RPC](/solana/rpc)** for the Solana specifics.

**DEX (Decentralized Exchange)** — An on-chain exchange. On Solana: Raydium, Orca, Meteora, Phoenix, Lifinity, etc.

**AMM (Automated Market Maker)** — A DEX model where prices are determined by a formula on top of pool reserves, not by an order book.

**Pool** — The on-chain account holding the reserves of an AMM.

**Slippage tolerance** — Your max acceptable price deviation when swapping. Set per-transaction.

**Priority fee** — An extra fee on Solana that bumps your transaction's priority during congestion.

**Jito** — A Solana infrastructure provider offering bundle-aware transaction submission. Used for MEV protection and atomic execution.

**Bundle** — A group of transactions submitted atomically (all land or none do). Provided by Jito on Solana, MEV-Boost / relays on Ethereum.

**Shreds** — Partial block packets Solana validators broadcast as they build a block. Give pre-confirmation visibility to bots and searchers. See **[Solana Shreds](/solana/shreds)**.

**Geyser plugin** — A Solana validator extension that streams account-state changes to subscribers in real time. Often offered by paid RPC providers.

**Turbine** — Solana's network-layer protocol for propagating shreds across validators.

**Leader** — The validator currently producing the block for a given Solana slot. Receives transactions directly.

**`getProgramAccounts`** — A Solana RPC call that fetches all accounts owned by a program. Powerful but expensive — most bots avoid it via streaming pool-state APIs.

**SSE (Server-Sent Events)** — A streaming HTTP protocol used by some pool-state APIs as a lighter alternative to WebSockets.

## MEV

**MEV (Maximal Extractable Value)** — Profit a validator (or someone paying a validator) can make by reordering, including, or excluding transactions. See **[MEV Overview](/mev/)**.

**MEV searcher** — A bot operator who hunts MEV opportunities (sandwich, frontrun, backrun, arbitrage, liquidations). See **[MEV Searchers](/mev/searchers)**.

**Sandwich attack** — A bot buys before your swap and sells after, profiting from the price impact you caused. See **[Sandwich Attack](/mev/sandwich-attack)**.

**Frontrunning** — Copying or beating someone else's profitable trade before it lands. See **[Frontrunning](/mev/frontrunning)**.

**Backrunning** — Trading immediately after another transaction to capture price gaps it left. See **[Backrunning](/mev/backrunning)**.

**Liquidation bot** — A bot that monitors lending protocols and triggers underwater loans to claim the liquidation bonus.

**Private order flow** — Submitting transactions through a private channel (Flashbots Protect, Jito bundles, MEV-Share) instead of the public mempool.

**Mempool** — The pool of pending unconfirmed transactions on a blockchain. Public on Ethereum; not public in the same way on Solana — see **[Shreds](/solana/shreds)**.

## Exchanges & products

**CEX (Centralized Exchange)** — Binance, Kraken, Coinbase, OKX, Bybit. Run by a company; you trust them with custody.

**DEX (Decentralized Exchange)** — On-chain exchange (see above). You hold custody; you sign every swap.

**Hot wallet** — A wallet with a key that's online (used by your bot). Limited capital.

**Cold wallet** — A wallet with a key kept offline. Where most of your treasury should live.

**KYC (Know Your Customer)** — Identity verification required by regulated CEXs.

**USDT-M / COIN-M** — Margin currency for Binance Futures. USDT-M settles in stables; COIN-M settles in the underlying coin.

## Risk management

**Stop-loss** — An order that closes your position when price hits a defined level. Can be in your bot or on the exchange.

**Take-profit** — Mirror of stop-loss, at the upside target.

**Position sizing** — How much capital you put into a single trade. The single most important variable in long-term P&L.

**Drawdown** — Peak-to-trough decline. Reported as max drawdown (worst run) and current drawdown.

**R-multiple** — Profit or loss measured in units of risk. A trade with a $100 stop-loss that nets +$300 is a +3R trade.

**Sharpe ratio** — Risk-adjusted return. Higher is better; above 2 is good, above 3 is suspicious.

**Win rate** — Percentage of trades that close profitable. Means little without an R-multiple — a 30% win rate at +3R per win is excellent.

## Read next

- **[What is a Crypto Trading Bot? →](/what-is-a-crypto-trading-bot)** — start here if these terms are new
- **[Getting Started →](/guides/getting-started)** — your first bot, end-to-end
- **[Choosing a Bot →](/guides/choosing-a-bot)** — decision framework
