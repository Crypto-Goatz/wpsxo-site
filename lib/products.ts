export interface ProductPrice {
  /** Stripe price ID. Placeholders until Stripe products are created. */
  id: string
  label: string
  /** USD, integer dollars */
  amount: number
  /** Founder pricing — what they'd pay if they waited. */
  compareAt?: number
  /** undefined = one-time / lifetime */
  interval?: 'year' | 'month'
  features: string[]
  /** Show a "Most Popular" pill */
  highlight?: boolean
  /** Limited founder seats left (decremented manually as we sell). */
  founderSeats?: number
}

export interface ProductFAQ {
  q: string
  a: string
}

export interface Product {
  slug: string
  name: string
  tagline: string
  description: string
  badge: string
  /** 'teal' | 'purple' | 'green' | 'warn' — drives all coloring on the page */
  accent: 'teal' | 'purple' | 'green' | 'warn'
  /** Lucide React icon name (resolved by the consumer component). */
  icon: string
  features: string[]
  prices: ProductPrice[]
  stripeProductId: string
  githubRepo: string
  downloadFileName: string
  category: 'figma' | 'wordpress' | 'seo'
  /** Bullets for the hero section of the detail page. */
  hero_bullets: string[]
  /** Mapped against alternative tools on /pricing. */
  comparison_alt: string
  /** Plain-English FAQ. */
  faqs: ProductFAQ[]
}

export const PRODUCTS: Product[] = [
  {
    slug: 'wpsxo',
    name: 'WP-SXO',
    tagline: 'Search Experience Optimization for WordPress',
    description:
      "AI-powered content scoring and optimization for WordPress. Score every page against the 8 SXO dimensions that actually drive traffic in 2026. Inject schema. Generate llms.txt. Detect BLUF gaps. Built for the AI-search era — because keyword-stuffing SEO is dead.",
    badge: 'FOUNDER',
    accent: 'teal',
    icon: 'Search',
    features: [
      'SXO content scoring (8 dimensions, 0–100)',
      'BLUF (Bottom Line Up Front) detection + suggestions',
      'Auto-inject FAQ + HowTo + Article JSON-LD on chosen post types',
      'Auto-generate llms.txt + AI-bot rules in robots.txt',
      'Information Gain scoring vs top-10 SERP results',
      'Bulk schema fix wizard',
      'Real-time content grading inside Gutenberg + Classic Editor',
      'Beaver Builder + Elementor compatibility',
      'CRO9 conversion tracking embed (the 15KB script that grades clicks)',
      'REST API for Claude / AI control',
      'Lifetime updates included',
    ],
    prices: [
      {
        id: 'price_1TT5C0LENnHWT4tVOYpzOMwC',
        label: 'Founder Solo',
        amount: 97,
        compareAt: 297,
        features: [
          '1 site',
          'Lifetime license',
          'Lifetime updates',
          'Email support',
        ],
        founderSeats: 100,
      },
      {
        id: 'price_1TT5C0LENnHWT4tVDGYzxMDg',
        label: 'Founder Agency',
        amount: 297,
        compareAt: 997,
        features: [
          'Up to 25 sites',
          'White-label scan reports',
          'API access',
          'Priority support',
          'CRM account included',
          'Lifetime updates',
        ],
        highlight: true,
        founderSeats: 50,
      },
      {
        id: 'price_1TT5C1LENnHWT4tVUmIbpvHF',
        label: 'Founder Studio',
        amount: 497,
        compareAt: 1997,
        features: [
          'Unlimited sites',
          'Done-for-you onboarding (1 hr)',
          'Direct Slack with the team',
          'API + agent integration',
          'CRM + AI agent included',
          'Lifetime updates',
        ],
        founderSeats: 25,
      },
    ],
    stripeProductId: 'prod_URzAp6T3rDu0WN',
    // WP-SXO ships from the 0nwp repo (production code, Git Updater, SXO
    // transformations, Yoast). The wpsxo.zip alias is on that release.
    githubRepo: 'Crypto-Goatz/0nwp',
    downloadFileName: 'wpsxo.zip',
    category: 'seo',
    hero_bullets: [
      'Score every page against the dimensions AI search engines actually weigh',
      'Auto-inject the schema Google + ChatGPT need to cite you',
      'Find the BLUF gaps that quietly kill your rankings',
    ],
    comparison_alt: 'Yoast Premium / Rank Math Pro / SurferSEO',
    faqs: [
      {
        q: 'How is this different from Yoast or Rank Math?',
        a: "Yoast and Rank Math optimize for 2018 Google. They count keywords. WP-SXO scores for 2026 — AI search visibility, BLUF strength, schema completeness, llms.txt readiness, Information Gain. Different ranking model, different optimization.",
      },
      {
        q: 'What WordPress versions do you support?',
        a: 'WP 6.0+. Tested on Gutenberg, Classic Editor, Elementor 3.21+, Beaver Builder 2.8+. PHP 8.0 minimum.',
      },
      {
        q: 'Is this really lifetime or is "lifetime" a 1-year trick?',
        a: "Real lifetime. One charge, license never expires, updates never stop. Founder pricing exists because we want feedback from real users — once we hit our seat caps the price goes to retail (and stays there).",
      },
      {
        q: 'How many sites can I install on?',
        a: 'Solo = 1. Agency = up to 25. Studio = unlimited. Each tier validates against your license key on plugin activation.',
      },
      {
        q: 'What if I want a refund?',
        a: '14-day no-questions refund. After that, license is non-refundable but transferable to another site.',
      },
    ],
  },
  {
    slug: 'detect-and-refine',
    name: 'Detect & Refine',
    tagline: 'Stop paying for clicks that never convert',
    description:
      'A 4KB tracking script that grades every visitor on your website based on what they actually do. 30+ behavioral signals → letter grade A+ to F (X for bots). Grades stream back to Google, Meta, LinkedIn, and TikTok via conversion APIs so the algorithm learns what a real customer looks like and stops sending you garbage clicks. Click fraud detection, traffic quality scoring, and ad optimization in one script tag.',
    badge: 'NEW',
    accent: 'green',
    icon: 'ShieldCheck',
    features: [
      '4KB async script — one line in your <head>, nothing else to configure',
      '30+ behavioral signals: scroll depth, mouse movement, time on page, click patterns, form interaction, exit intent, copy/paste, keystrokes, page visibility',
      'Letter grades A+ → F + X (bot) per session',
      'Bot detection with headless-browser fingerprinting + impossible-click-speed checks',
      'Google Ads Enhanced Conversions feedback',
      'Meta Conversions API feedback',
      'LinkedIn Offline Conversions API feedback',
      'TikTok Events API feedback',
      'Real-time dashboard — quality score, grade distribution, platform breakdown, top referrers',
      'Privacy-first — no cookies, no PII, no fingerprinting (GDPR/CCPA compliant)',
      'WordPress plugin (one-click install) + works on GHL/Shopify/Wix/Squarespace/any HTML site',
      'WooCommerce integration — add-to-cart + checkout events feed into the grade',
      'Unlimited page views, unlimited sessions',
      '`[dr_quality_badge]` shortcode — show "94% real traffic" social proof',
    ],
    prices: [
      {
        id: 'price_1TT5C3LENnHWT4tV1ZYsRP25',
        label: 'Per Domain',
        amount: 8,
        compareAt: 79,
        interval: 'month',
        features: [
          '$8 per domain — every month, locked at this rate forever for founders',
          '30-day free trial on your first domain',
          'Unlimited page views + sessions',
          'All 4 ad platform integrations',
          'Real-time dashboard',
          'WordPress plugin + universal script tag',
        ],
        highlight: true,
        founderSeats: 250,
      },
    ],
    stripeProductId: 'prod_URzAxq1uTWNwAe',
    githubRepo: 'Crypto-Goatz/detect-and-refine-wp',
    downloadFileName: 'detect-and-refine.zip',
    category: 'seo',
    hero_bullets: [
      'Grades every ad click on a quality spectrum — not just fraud / not-fraud',
      'Streams those grades back to Google, Meta, LinkedIn, and TikTok automatically',
      "10–25x cheaper than ClickCease, CHEQ, or Lunio — and works on platforms they don't (GHL)",
    ],
    comparison_alt: 'ClickCease / CHEQ / Lunio',
    faqs: [
      {
        q: 'How is this different from click fraud detection?',
        a: "Click fraud tools detect bots and that's it. D&R grades every click on a quality spectrum (A+ through F), then streams those grades to your ad platforms via their conversion APIs so the algorithm learns to send more A+ clicks and fewer F clicks. Fraud detection is one feature; ad optimization is the product.",
      },
      {
        q: 'Does it slow down my site?',
        a: "No. 4KB async script. Sends data via sendBeacon (non-blocking). Zero impact on page speed scores.",
      },
      {
        q: 'What about privacy?',
        a: 'No cookies. No PII. No fingerprinting. We track behavior (scroll, click, time on page) — not identity. GDPR / CCPA compliant by design.',
      },
      {
        q: 'Does it work outside WordPress?',
        a: 'Yes. The WordPress plugin is the easiest path, but the raw script tag works on GHL/LeadConnector sites, Shopify, Wix, Squarespace, React/Next.js apps, or any plain HTML page. Same tag, same dashboard.',
      },
      {
        q: 'Why $8/month and not lifetime?',
        a: "D&R has ongoing real-time costs — the script phones home on every session, the platform sends data to Google/Meta/LinkedIn/TikTok continuously, and the dashboards run live. Lifetime would mean we eventually go bankrupt or shut you off. $8/mo with the founder rate locked forever is the honest version. Multi-domain businesses pay $8/domain — five locations = $40/mo total.",
      },
      {
        q: 'How fast do I see results?',
        a: "Day 1 you see grade distribution + bot count in the dashboard. Day 3-5 your ad platforms have enough conversion API data to start shifting bidding. Most accounts see a 10-20% improvement in ROAS within the first 30 days.",
      },
      {
        q: 'What does "founder rate locked forever" mean?',
        a: "First 250 customers stay at $8/domain/mo for the life of their account, even after we raise retail (likely to $12–19/mo as we add ad platforms). Add new domains later, they're $8 too. The lock travels with you.",
      },
    ],
  },
  {
    slug: 'figgypress',
    name: 'FiggyPress',
    tagline: 'Figma → WordPress. Theme + plugin. In one shot.',
    description:
      'The first-ever Figma to WordPress converter that ships a real, production-grade theme — not a pretty-looking cage. Extract design tokens. Generate a complete theme (style.css, functions.php, every template). Generate a plugin with custom Gutenberg blocks. Download ready-to-install ZIP.',
    badge: 'NEW',
    accent: 'purple',
    icon: 'Palette',
    features: [
      'Figma design token extraction — colors, typography, spacing, radii, shadows',
      'Complete WordPress theme generation (style.css, functions.php, all templates, theme.json)',
      'Plugin generation with Gutenberg blocks built from Figma components',
      'Block patterns auto-built from Figma component sets',
      'WooCommerce-ready output for stores',
      'Customizer integration — color + typography controls live-wired to tokens',
      'Auto Google Fonts import based on Figma typography styles',
      'theme.json generation matching modern WP block-theme spec',
      'ZIP download or one-click direct install',
      'REST API for programmatic generation',
      'Lifetime updates included',
    ],
    prices: [
      {
        id: 'price_1TTwoYLENnHWT4tVOfRpDx43',
        label: 'Monthly',
        amount: 19,
        interval: 'month',
        features: [
          'Unlimited Figma → WP conversions',
          'Theme + plugin generation',
          'Cancel any time',
          'Free for Pro/Studio members',
        ],
      },
      {
        id: 'price_1TT5C2LENnHWT4tV3o7ruThm',
        label: 'Founder Solo',
        amount: 147,
        compareAt: 397,
        features: [
          'Unlimited Figma → WP conversions',
          'Theme + plugin generation',
          'Single user',
          'Lifetime updates',
        ],
        founderSeats: 100,
      },
      {
        id: 'price_1TT5C2LENnHWT4tVZnia9dkj',
        label: 'Founder Studio',
        amount: 497,
        compareAt: 1497,
        features: [
          'Everything in Solo',
          'White-label client deliverables',
          'Multi-user (up to 5 designers)',
          'WooCommerce + custom post type generation',
          'Priority support',
          'Lifetime updates',
        ],
        highlight: true,
        founderSeats: 25,
      },
    ],
    stripeProductId: 'prod_URzA9GrvYQguxF',
    githubRepo: 'Crypto-Goatz/onpress',
    downloadFileName: 'figgypress.zip',
    category: 'figma',
    hero_bullets: [
      'A real WordPress theme — not an iframe of your Figma file',
      "Block patterns built from your component sets so editors can't break the design",
      'Generate one theme, sell it to ten clients',
    ],
    comparison_alt: 'Pinegrow / Bricks Builder / Webflow → WP',
    faqs: [
      {
        q: 'Does it actually output a real WordPress theme?',
        a: "Yes. Real PHP. Real template hierarchy. Real theme.json. functions.php with proper enqueues. style.css with the WP header block. Customizer hooks. You can read the code, edit it, ship it. It's not a wrapper — it's the theme.",
      },
      {
        q: 'How do you handle Figma components?',
        a: 'Each Figma component set becomes a Gutenberg block. Variants become block style variations. The plugin output registers all of them with proper attributes + the editor preview matches the Figma source.',
      },
      {
        q: 'Can I sell the themes I generate?',
        a: 'Yes. Founder Studio includes white-label rights — your client gets a theme branded as theirs, no FiggyPress credit required. Solo lets you build for yourself but not resell.',
      },
      {
        q: 'WooCommerce?',
        a: 'Studio tier generates WooCommerce-aware templates (single-product, archive-product, cart, checkout) styled from your Figma. Solo tier is theme-only.',
      },
      {
        q: 'How does the export actually work?',
        a: "You paste your Figma file URL + a Figma personal access token, name your theme, hit generate. We pull the file, walk every page + component, generate the full theme + plugin code, and hand you a ZIP. Average run: 30–90 seconds depending on file size.",
      },
    ],
  },
]

export const BUNDLE = {
  slug: 'founder-bundle',
  name: 'Founder Bundle — Both Plugins',
  tagline: 'WP-SXO + OnPress, lifetime, both updated forever.',
  amount: 397,
  compareAt: 1294,
  priceId: 'price_1TT5C3LENnHWT4tVmQdo40sC',
  stripeProductId: 'prod_URzAw2Vjs77KOE',
  features: [
    'WP-SXO Founder Agency (25 sites)',
    'OnPress Founder Studio (white-label, 5 designers)',
    'All future plugin releases — free, forever',
    'Founder-only Slack channel',
    'Lifetime updates on everything',
  ],
  founderSeats: 25,
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
