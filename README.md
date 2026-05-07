# Crypto Trading Bots .TECH

SEO/content site for crypto trading bots — guides, strategies, FAQs, and references covering **Kraken**, **Binance**, and **Solana**, with a section on MEV and a hands-on building-bots track.

Live: <https://www.cryptotradingbots.tech>

Built with [VitePress](https://vitepress.dev/), deployed to GitHub Pages, served from a custom domain via Gandi.

---

## Quickstart

```bash
npm install
npm run dev       # local dev server on http://localhost:5173
npm run build     # static build to .vitepress/dist
npm run preview   # preview the built site
```

Node 22+ is recommended (matches the GitHub Actions runner).

---

## Content structure

```
.
├── index.md                          # home (Vitepress home layout)
├── what-is-a-crypto-trading-bot.md   # pillar / definition page
├── glossary.md                       # full term reference
│
├── kraken/                           # Kraken section
│   ├── index.md                      #   hub
│   ├── trading-bots.md
│   ├── strategies.md
│   └── faq.md
│
├── binance/                          # Binance section (same shape)
├── solana/                           # Solana section (incl. RPC, Shreds, arb)
├── mev/                              # MEV section (sandwich, frontrun, backrun, searchers)
├── signals/                          # crypto trading signals
├── guides/                           # building-bots + getting-started + choosing
│
├── public/                           # static assets copied verbatim to dist root
│   ├── CNAME                         #   custom domain (www.cryptotradingbots.tech)
│   └── robots.txt
│
└── .vitepress/
    └── config.ts                     # nav, sidebar, sitemap, SEO meta defaults
```

### Adding a page

1. Create a `.md` file in the appropriate section directory.
2. Add SEO frontmatter:
   ```yaml
   ---
   title: Page Title (used in <title> with the site suffix)
   description: 150–160 char meta description; pulls into OG/Twitter tags.
   ---
   ```
3. Wire it into the sidebar in [`.vitepress/config.ts`](./.vitepress/config.ts) under the matching path's `sidebar` block.
4. Cross-link it from at least 2 existing pages so it's reachable without nav.

### SEO conventions used

- Each page exports `og:title`, `og:description`, `og:url`, Twitter Card meta, and a `canonical` link via `transformHead` in [`.vitepress/config.ts`](./.vitepress/config.ts).
- `sitemap.xml` is auto-generated on build (Vitepress's built-in sitemap, hostname is `https://www.cryptotradingbots.tech`).
- `robots.txt` lives in `public/robots.txt`.
- Every section hub and major page has an in-page **FAQ** block (Q&A, H3 headings) — friendly for Google's "People Also Ask" / featured snippets.

### Editorial conventions

- Tone: **plain English, concise, not too technical**. Audience is SEO-curious readers + crypto-curious devs, not infra engineers.
- No pricing mentions for third-party products (Venum included).
- Cross-link generously: every page should link to the section hub, the glossary for new terms, and 1–2 related pages.
- See [`CLAUDE.md`](./CLAUDE.md) for the long form of these rules (used by AI assistants editing the site).

---

## Deploy

GitHub Pages, built and deployed by [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) on every push to `main`.

The workflow:

1. Checks out the repo (Node 22, npm cache).
2. Runs `npm ci` then `npm run build`.
3. Uploads `.vitepress/dist` as a Pages artifact.
4. Deploys via `actions/deploy-pages@v4` to the `github-pages` environment.

Manual run: **Actions → Deploy site to GitHub Pages → Run workflow**.

### One-time GitHub Pages setup

In **Settings → Pages**:

- **Source**: GitHub Actions
- **Custom domain**: `www.cryptotradingbots.tech`
- **Enforce HTTPS**: enabled (after Let's Encrypt cert is issued, ~10 min after DNS check passes)

The `public/CNAME` file keeps the custom domain locked in across deploys.

---

## DNS (Gandi)

The apex is **redirected to www** via Gandi's Web Forwarding feature; only `www` points at GitHub Pages directly.

### LiveDNS records

| Type  | Name | Value                            | TTL  |
|-------|------|----------------------------------|------|
| CNAME | `www`| `cryptotradingbotsai.github.io.` | 1800 |

### Web Forwarding (Gandi UI → Web Forwarding tab, not Records)

| Field         | Value                                  |
|---------------|----------------------------------------|
| Source host   | (empty, i.e. apex)                     |
| Target URL    | `https://www.cryptotradingbots.tech`   |
| Type          | Permanent (301)                        |
| Protocol      | HTTPS (Gandi auto-issues a Let's Encrypt cert for the apex) |
| Override path | disabled                               |

### Verifying

```bash
dig +short www.cryptotradingbots.tech         # → 185.199.{108..111}.153
dig +short cryptotradingbots.tech             # → Gandi forwarding server
curl -sI https://cryptotradingbots.tech/      # → 301 to https://www....
curl -sI https://www.cryptotradingbots.tech/  # → 200 (the homepage)
```

---

## Repo identity & SSH

This repo is set up to commit + push as the GitHub user **`cryptotradingbotsai`**, using a dedicated SSH key (so it stays separate from any personal/other-org GitHub identity on the same machine).

Per-repo git config (no global changes):

```ini
[user]
    name  = cryptotradingbotsai
    email = 260529389+cryptotradingbotsai@users.noreply.github.com
[remote "origin"]
    url = git@github-cryptotradingbotsai:cryptotradingbotsai/cryptotradingbots-tech.git
```

`~/.ssh/config` includes a host alias so the right key is used automatically:

```ssh
Host github-cryptotradingbotsai
  HostName github.com
  User git
  IdentityFile ~/.ssh/github-cryptotradingbotsai
  IdentitiesOnly yes
```

Verify:

```bash
ssh -T git@github-cryptotradingbotsai
# → Hi cryptotradingbotsai! You've successfully authenticated, ...
```

---

## Reference links

- **Venum** (Solana execution API we recommend): <https://www.venum.dev> · [docs](https://docs.venum.dev) · [RPC](https://rpc.venum.dev) ([guide](https://docs.venum.dev/guide/rpc)) · [Build a Trading Bot guide](https://docs.venum.dev/guide/build-trading-bot)
- **Smart Crypto Signals** (signals platform we link to): <https://smart-crypto-signals.com>

---

## License & disclaimer

Educational content only. Nothing on this site is financial advice. Trading bots can lose money — past performance is not a guarantee of future results.
