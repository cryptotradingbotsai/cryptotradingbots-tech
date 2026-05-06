---
title: Binance Bot FAQ
description: Direct answers to common questions about running crypto trading bots on Binance — fees, BNB discounts, sub-accounts, US restrictions, and security.
---

# Binance Bot FAQ

The most-asked questions about running a trading bot on Binance — answered without filler.

## Account & access

### Does Binance allow trading bots?
Yes, explicitly. Binance offers comprehensive REST and WebSocket APIs for algorithmic trading and even hosts native bots (grid, DCA) directly in its UI.

### What's the difference between Binance.com and Binance.US?
**Binance.com** is the international platform with the deepest liquidity, most pairs, and most products. **Binance.US** is a separate company serving US residents with a more limited product set, fewer pairs, and stricter compliance. **The APIs are different** — code written for one won't work on the other.

### Can I run a bot from the United States?
Yes — on Binance.US (limited products) or, in some states, on Binance Futures via approved channels. Plain Binance.com is geo-blocked from US IPs. **Don't try to bypass with a VPN** — it violates ToS and can result in funds being frozen.

### Do I need a verified account to run a bot?
Yes. Unverified accounts have very low withdrawal limits and can't access most products. Complete identity verification before you start.

## Fees

### What are Binance's trading fees?
Standard Spot fees start at **0.10% maker / 0.10% taker**, dropping to **0.012% / 0.024%** at VIP 9. Holding BNB gives a **25% discount on Spot fees**. Futures fees are lower — starting at **0.02% maker / 0.05% taker**.

### Does Binance charge for API access?
No. APIs are free. You only pay standard trading fees on filled orders.

### How does the BNB fee discount work?
Hold BNB in your spot wallet and toggle "Use BNB to pay for fees" in account settings. Binance deducts the trading fee in BNB at a 25% discount.

### Are there fees for withdrawing crypto?
Yes, per-asset network fees. Withdrawing USDC on Solana is much cheaper than withdrawing on Ethereum. Plan your bot's cash management around the cheap-network options.

## API & technical

### What are Binance's API rate limits?
Per-IP and per-account limits, measured per minute and per 10 seconds. **Order placement has its own quota** separate from general request quota. Burst over the limits and you get a temporary IP ban (2 min → 1 day → permanent).

### Does Binance have a testnet?
Yes — **Spot Testnet** and **Futures Testnet**, both with separate API endpoints. You get fake balances to test with. Use them. Always.

### What's a User Data Stream?
A private WebSocket channel that pushes account events (order fills, balance updates) the instant they happen. Subscribe to this rather than polling — it's faster and saves your rate-limit budget.

### Can I run a bot on Binance Futures?
Yes. The Futures API is similar to Spot but with extra concepts (leverage, position mode, margin type). Test on Futures Testnet first — liquidations will end your day faster than you think.

## Sub-accounts & isolation

### Should I use sub-accounts for my bot?
**Yes**, if you run more than one strategy. Sub-accounts give independent balances, independent rate-limit budgets, and clean per-strategy P&L. Each can have its own API key.

### Are sub-accounts available everywhere?
Most regions, but check before relying on them. Binance.US doesn't offer them.

### Does each sub-account need its own KYC?
No — they inherit verification from the master account.

## Security

### How do I keep my Binance API key safe?
Same as anywhere:

1. **IP-allowlist** the key to your bot's server.
2. **Never enable withdrawal scope** unless absolutely required.
3. **Store the secret in environment variables or a secret manager**.
4. **Use one key per strategy/sub-account** so a leak limits damage.

### What's the worst-case if my Binance API key leaks?
Without withdrawal permission: an attacker can place trades on your behalf — pump-and-dump style — and drain you via slippage. **With** withdrawal permission: instant total loss. Always disable withdrawals.

### Has Binance been hacked?
Binance had a high-profile $40M hot-wallet breach in 2019, fully reimbursed via the SAFU fund. Since then, security has improved. **Treat any exchange as a hot wallet** — don't keep more on Binance than your bot needs.

## Strategy & profitability

### Can I make money with a Binance bot?
Some people do. Most don't. The deepest liquidity in crypto also means the most competition. Edges exist but are smaller than they were five years ago.

### What's the smallest amount I can start with?
Mechanically: $50. Practically: **$1,000–$5,000**. Below that, fees and minimum order sizes dominate.

### Should I use Binance's built-in bots?
Yes, as a learning tool. They're easy to set up and you'll learn what grid/DCA actually feel like. But they take a meaningful cut of profits — eventually graduate to a custom or open-source bot.

### Is Binance Futures riskier for bots than Spot?
Yes. Leverage amplifies bot bugs as fast as it amplifies wins. Many bots that look profitable on Spot blow up on 5x leverage because of execution slippage during fast moves.

## Read next

- **[Trading Bots on Binance →](/binance/trading-bots)** — the API and infrastructure
- **[Binance Strategies →](/binance/strategies)** — what works on Binance
- **[Choosing a Bot →](/guides/choosing-a-bot)** — pick a platform
