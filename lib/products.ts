export interface ProductPrice {
  id: string;
  label: string;
  amount: number;
  interval?: string;
  features: string[];
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  badgeClass: string;
  icon: string;
  features: string[];
  prices: ProductPrice[];
  stripeProductId: string;
  githubRepo: string;
  downloadFileName: string;
  category: 'figma' | 'wordpress' | 'seo';
}

export const PRODUCTS: Product[] = [
  {
    slug: 'onpress',
    name: 'OnPress',
    tagline: 'Figma to WordPress — First Ever',
    description: 'Convert Figma designs into complete WordPress themes and plugins. Extract design tokens, generate production-ready code, and download a ready-to-install ZIP. The first-ever Figma to WordPress plugin converter.',
    badge: 'NEW',
    badgeClass: 'badge-green',
    icon: '🎨',
    features: [
      'Figma design token extraction (colors, typography, spacing, effects)',
      'Complete WordPress theme generation (style.css, functions.php, all templates)',
      'WordPress plugin generation with Gutenberg blocks + shortcodes',
      'WooCommerce support',
      'Customizer integration with live color controls',
      'Auto Google Fonts import',
      'Block pattern generation from Figma components',
      'ZIP download or direct install',
      'REST API for programmatic access',
      'Settings page with token management',
    ],
    prices: [
      {
        id: 'price_1TFNH4HThmAuKVQMrvCWJ9R4',
        label: 'Pro',
        amount: 49,
        interval: 'year',
        features: ['Unlimited conversions', 'Theme + Plugin generation', 'WooCommerce support', 'Priority support', 'CRM account included'],
      },
    ],
    stripeProductId: 'prod_UDougubvysD7gQ',
    githubRepo: 'Crypto-Goatz/onpress',
    downloadFileName: 'onpress-wp.zip',
    category: 'figma',
  },
  {
    slug: 'wpsxo',
    name: 'WP-SXO',
    tagline: 'Search Experience Optimization for WordPress',
    description: 'AI-powered content scoring, recommendations, and generation for WordPress. Score every page against 8 SXO dimensions. Get actionable recommendations. Generate optimized content that ranks AND converts.',
    badge: 'POPULAR',
    badgeClass: 'badge-purple',
    icon: '🔍',
    features: [
      'SXO content scoring (8 dimensions, 0-100)',
      'AI-powered content recommendations',
      'BLUF (Bottom Line Up Front) optimization',
      'Table Trap detection and formatting',
      'Information Gain scoring',
      'Schema.org auto-injection',
      'Beaver Builder + Elementor + Gutenberg support',
      'REST API for Claude/AI control',
      'CRO9 conversion tracking built-in',
      'Real-time content grading in editor',
    ],
    prices: [
      {
        id: 'price_1TEtP7HThmAuKVQM4jQpPKaG',
        label: 'Free',
        amount: 0,
        features: ['Basic SXO scoring', '1 site', 'Community support'],
      },
      {
        id: 'price_1TEtP7HThmAuKVQM9yrUXxxl',
        label: 'Pro',
        amount: 49,
        interval: 'year',
        features: ['Full SXO scoring', 'AI recommendations', '3 sites', 'Priority support', 'CRM account included'],
      },
      {
        id: 'price_1TEtP7HThmAuKVQMfSj9vz4K',
        label: 'Agency',
        amount: 99,
        interval: 'year',
        features: ['Everything in Pro', 'Unlimited sites', 'White-label reports', 'API access', 'CRM account + AI agent'],
      },
    ],
    stripeProductId: 'prod_UDK3OAMMlDeOra',
    githubRepo: 'Crypto-Goatz/onpress-wp',
    downloadFileName: 'wp-sxo.zip',
    category: 'seo',
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}
