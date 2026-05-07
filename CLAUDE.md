# CLAUDE.md — Conventions for AI assistants editing this site

Read this before adding or editing pages. The site is **SEO-first** and the brand voice matters more than technical depth.

---

## Brand & audience

- **Brand**: Crypto Trading Bots .TECH
- **Live**: <https://www.cryptotradingbots.tech>
- **Audience**: SEO-curious readers and crypto-curious devs — *not* infrastructure engineers.
- **Voice**: plain-English, concise, scannable, slightly opinionated, never jargon-heavy.
- **Tradeoff principle**: prefer being clear over being exhaustive. If a deep dive is needed, link out instead of inlining 3 KB of explanation.

---

## Page structure conventions

Every page should have, in roughly this order:

1. **YAML frontmatter** with `title:` and `description:` (160-char meta description).
2. **One-sentence lede** under the H1 that restates the page's value.
3. **Two-to-five short H2 sections** with bullet lists, tables, or short paragraphs.
4. **Tips & tricks** where relevant — a short, opinionated list, drawn from the local reference repos when applicable (paraphrase, don't copy).
5. **A simplified architecture sketch** (ASCII diagram) for any "how to build X" page.
6. **A "Read next" block** with 3–5 internal cross-links.
7. **An FAQ block** with 3–5 H3 questions — these earn featured-snippet placements.

Aim for ~500–1500 words per page. Longer is fine if structurally clean.

---

## Cross-linking rules

- **Every page** should link to: the section hub, the glossary for any newly introduced term, and 1–2 sibling pages.
- **Solana pages**: deep-link Venum (see "Venum link map" below). Link to [Venum](https://www.venum.dev) on first mention; deep-link to specific endpoint/guide pages thereafter.
- **Signals pages**: cross-link to <https://smart-crypto-signals.com>.
- **Build/strategy guides**: cross-link to MEV pages and the building-bots guides.

---

## Venum link map (canonical)

When mentioning a Venum capability, link to the most specific docs URL:

| Context | URL |
|---|---|
| Brand / first mention | <https://www.venum.dev> |
| Sign up / API key CTA | <https://app.venum.dev> |
| Quick start | <https://docs.venum.dev/guide/quick-start> |
| Build a trading bot | <https://docs.venum.dev/guide/build-trading-bot> |
| Build a Telegram bot | <https://docs.venum.dev/guide/build-telegram-trading-bot> |
| Build a swap UI | <https://docs.venum.dev/guide/build-swap-app> |
| Reduce RPC costs (polling, getProgramAccounts) | <https://docs.venum.dev/guide/reduce-rpc-costs> |
| Tx submission, Jito context | <https://docs.venum.dev/guide/submission> |
| Quote endpoint | <https://docs.venum.dev/api/quote> |
| Swap build endpoint | <https://docs.venum.dev/api/swap-build> |
| Swap (Jito-bundled) endpoint | <https://docs.venum.dev/api/swap> |
| Atomic Jito bundle endpoint | <https://docs.venum.dev/api/bundle> |
| Stream prices (SSE) | <https://docs.venum.dev/api/stream-prices> |
| Stream new pools (SSE) | <https://docs.venum.dev/api/stream-pools> |
| Stream tx confirmations | <https://docs.venum.dev/api/stream-tx> |
| Managed Solana JSON-RPC | <https://rpc.venum.dev> + [guide](https://docs.venum.dev/guide/rpc) |

**Do not mention Venum pricing.** No tiers, no dollar amounts, no "flat-rate" descriptors. Describe capabilities only.

---

## Local repos for credibility-grade tips

Three sibling repos on the same machine inform our "Building a bot" guides — paraphrase generic patterns from them but **don't expose private architecture details**:

- `~/Repositories/crypto-trading-bot/` — multi-exchange (Binance + Kraken) ensemble bot in TypeScript: scoring/precision/ML signal sources, multi-interval backtester, ports & adapters layout. Source for Kraken/Binance "what real bots look like" tone.
- `~/Repositories/solana-cex-dex-arb/` — CEX/DEX arbitrage bot using Binance + Venum. Source for the [Solana CEX/DEX Arbitrage](./solana/arbitrage.md) and [Building a CEX/DEX Arbitrage Bot](./guides/building-a-cex-dex-arbitrage-bot.md) guides.
- `~/Repositories/smart-crypto-signals/` — signals platform with Telegram delivery + Stripe + admin dashboard. Source for [Crypto Trading Signals](./signals/index.md).

---

## Build / deploy facts (cheat sheet)

- Vitepress 1.6.x, Node 22+, ESM (`"type": "module"`).
- `npm run build` outputs to `.vitepress/dist`. Sitemap auto-generated.
- GitHub Actions ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)) deploys on every push to `main`.
- Custom domain: `www.cryptotradingbots.tech` (apex 301-redirected via Gandi web forward).
- `public/CNAME` controls the custom domain — don't change without coordinating DNS.

---

## Things to avoid

- **Pricing claims** (Venum or otherwise).
- **Performance promises** ("X% APR guaranteed", etc.) — always frame as ranges with caveats.
- **Verbatim copy** from Venum docs or any source — rewrite in our voice.
- **Code-heavy pages**. A short snippet is fine; a wall of TypeScript is not.
- **Marketing fluff**. Be direct, not breathless.
- **Outdated dates**. Don't write "in 2024" — prefer evergreen phrasing.

---

## Memory pointers

The Claude memory directory for this project carries durable context that complements this file:

- `project_overview.md` — what the site is, what it covers
- `project_content_direction.md` — Venum-inspired editorial direction
- `project_inspiration_sources.md` — full inspiration map and weights
- `reference_venum_urls.md` — the verified Venum URL crawl

Update these alongside content changes if the conventions evolve.
