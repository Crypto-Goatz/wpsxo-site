/**
 * robots.txt for wpsxo.com.
 *
 * Marketing surface fully crawlable. /dashboard, /api, and Stripe
 * portal flow blocked. AI crawlers explicitly allowlisted because
 * the WP-SXO and OnPress plugin pages are commerce-tier content
 * we want cited in AI search results.
 */

import type { MetadataRoute } from 'next'

const BASE = 'https://wpsxo.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api/', '/_next/'],
      },
      { userAgent: 'GPTBot',          allow: '/' },
      { userAgent: 'ChatGPT-User',    allow: '/' },
      { userAgent: 'OAI-SearchBot',   allow: '/' },
      { userAgent: 'Claude-Web',      allow: '/' },
      { userAgent: 'ClaudeBot',       allow: '/' },
      { userAgent: 'Anthropic-AI',    allow: '/' },
      { userAgent: 'PerplexityBot',   allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot',           allow: '/' },
      { userAgent: 'cohere-ai',       allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
