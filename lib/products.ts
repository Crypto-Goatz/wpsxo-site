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
        id: 'price_wpsxo_founder_solo',
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
        id: 'price_wpsxo_founder_agency',
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
        id: 'price_wpsxo_founder_studio',
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
    stripeProductId: 'prod_UDK3OAMMlDeOra',
    githubRepo: 'Crypto-Goatz/wpsxo-plugin',
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
    slug: 'onpress',
    name: 'OnPress',
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
        id: 'price_onpress_founder_solo',
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
        id: 'price_onpress_founder_studio',
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
    stripeProductId: 'prod_UDougubvysD7gQ',
    githubRepo: 'Crypto-Goatz/onpress',
    downloadFileName: 'onpress-wp.zip',
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
        a: 'Yes. Founder Studio includes white-label rights — your client gets a theme branded as theirs, no OnPress credit required. Solo lets you build for yourself but not resell.',
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
  priceId: 'price_founder_bundle',
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
