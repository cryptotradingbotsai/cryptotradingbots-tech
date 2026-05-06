import { defineConfig } from 'vitepress'

const SITE_URL = 'https://www.cryptotradingbots.tech'
const SITE_NAME = 'Crypto Trading Bots .TECH'
const DEFAULT_DESCRIPTION =
  'Guides, strategies, and references for crypto trading bots on Kraken, Binance, and Solana. Plain-English explanations, FAQs, and curated links to trusted tools.'

export default defineConfig({
  lang: 'en-US',
  title: SITE_NAME,
  titleTemplate: ':title — Crypto Trading Bots .TECH',
  description: DEFAULT_DESCRIPTION,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: SITE_URL },

  head: [
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],
    ['meta', { name: 'author', content: 'Crypto Trading Bots .TECH' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/og-default.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${SITE_URL}/og-default.png` }],
    ['link', { rel: 'canonical', href: SITE_URL }],
  ],

  transformHead: ({ pageData }) => {
    const head: any[] = []
    const fm = pageData.frontmatter || {}
    const title = fm.title || pageData.title || SITE_NAME
    const description = fm.description || pageData.description || DEFAULT_DESCRIPTION
    const url = `${SITE_URL}/${pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '')}`

    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:url', content: url }])
    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])
    head.push(['link', { rel: 'canonical', href: url }])
    return head
  },

  themeConfig: {
    siteTitle: SITE_NAME,
    nav: [
      { text: 'Kraken', link: '/kraken/' },
      { text: 'Binance', link: '/binance/' },
      { text: 'Solana', link: '/solana/' },
      { text: 'MEV', link: '/mev/' },
      { text: 'Signals', link: '/signals/' },
      {
        text: 'Guides',
        items: [
          { text: 'Getting Started', link: '/guides/getting-started' },
          { text: 'Choosing a Bot', link: '/guides/choosing-a-bot' },
          { text: 'Telegram Trading Bots', link: '/guides/telegram-trading-bots' },
          { text: 'Building an Arbitrage Bot', link: '/guides/building-an-arbitrage-bot' },
          { text: 'Building a CEX/DEX Arb Bot', link: '/guides/building-a-cex-dex-arbitrage-bot' },
          { text: 'Funding-Rate Arbitrage', link: '/guides/funding-rate-arbitrage' },
          { text: 'Delta-Neutral Strategies', link: '/guides/delta-neutral-strategies' },
          { text: 'Glossary', link: '/glossary' },
          { text: 'What is a trading bot?', link: '/what-is-a-crypto-trading-bot' },
        ],
      },
    ],

    sidebar: {
      '/kraken/': [
        {
          text: 'Kraken',
          items: [
            { text: 'Overview', link: '/kraken/' },
            { text: 'Trading Bots on Kraken', link: '/kraken/trading-bots' },
            { text: 'Strategies', link: '/kraken/strategies' },
            { text: 'FAQ', link: '/kraken/faq' },
          ],
        },
      ],
      '/binance/': [
        {
          text: 'Binance',
          items: [
            { text: 'Overview', link: '/binance/' },
            { text: 'Trading Bots on Binance', link: '/binance/trading-bots' },
            { text: 'Strategies', link: '/binance/strategies' },
            { text: 'FAQ', link: '/binance/faq' },
          ],
        },
      ],
      '/solana/': [
        {
          text: 'Solana',
          items: [
            { text: 'Overview', link: '/solana/' },
            { text: 'Trading Bots on Solana', link: '/solana/trading-bots' },
            { text: 'CEX/DEX Arbitrage', link: '/solana/arbitrage' },
            { text: 'Solana RPC', link: '/solana/rpc' },
            { text: 'Solana Shreds', link: '/solana/shreds' },
          ],
        },
      ],
      '/mev/': [
        {
          text: 'MEV',
          items: [
            { text: 'Overview', link: '/mev/' },
            { text: 'MEV Searchers', link: '/mev/searchers' },
            { text: 'Sandwich Attacks', link: '/mev/sandwich-attack' },
            { text: 'Frontrunning', link: '/mev/frontrunning' },
            { text: 'Backrunning', link: '/mev/backrunning' },
          ],
        },
      ],
      '/signals/': [
        {
          text: 'Signals',
          items: [{ text: 'Overview', link: '/signals/' }],
        },
      ],
      '/guides/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Getting Started', link: '/guides/getting-started' },
            { text: 'Choosing a Bot', link: '/guides/choosing-a-bot' },
            { text: 'Telegram Trading Bots', link: '/guides/telegram-trading-bots' },
          ],
        },
        {
          text: 'Building Bots',
          items: [
            { text: 'Building an Arbitrage Bot', link: '/guides/building-an-arbitrage-bot' },
            { text: 'Building a CEX/DEX Arb Bot', link: '/guides/building-a-cex-dex-arbitrage-bot' },
            { text: 'Funding-Rate Arbitrage', link: '/guides/funding-rate-arbitrage' },
            { text: 'Delta-Neutral Strategies', link: '/guides/delta-neutral-strategies' },
          ],
        },
        {
          text: 'Reference',
          items: [
            { text: 'Glossary', link: '/glossary' },
            { text: 'What is a Crypto Trading Bot?', link: '/what-is-a-crypto-trading-bot' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],

    footer: {
      message:
        'Educational content only — not financial advice. Always do your own research.',
      copyright: `© ${new Date().getFullYear()} Crypto Trading Bots .TECH`,
    },

    search: { provider: 'local' },

    editLink: undefined,
    outline: { level: [2, 3], label: 'On this page' },
  },
})
