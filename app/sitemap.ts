/**
 * Sitemap for wpsxo.com.
 *
 * Public surface = landing + 2 product detail pages + auth entry.
 * /dashboard is auth-gated and excluded by design.
 */

import type { MetadataRoute } from 'next'

const BASE = 'https://wpsxo.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE,                                              lastModified: now, changeFrequency: 'weekly',  priority: 1.00 },
    { url: `${BASE}/pricing`,                                 lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${BASE}/products/wpsxo`,                          lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${BASE}/products/onpress`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.90 },
    { url: `${BASE}/seo-is-dead`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/how-to-sell-figma-wordpress-themes`,      lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/login`,                                   lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE}/signup`,                                  lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
  ]
}
