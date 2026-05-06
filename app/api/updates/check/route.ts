/**
 * GET /api/updates/check?slug=<product>&version=<current>&key=<license>
 *
 * Plugin Update Checker (yahnis-elsts/plugin-update-checker) compatible
 * endpoint. WordPress plugins poll this daily to discover new versions.
 *
 * For free / unlicensed plugins (no key, or key invalid), we still answer
 * with the latest version metadata — the version number is public, the
 * download URL is public (it's a GitHub release). The license check
 * happens INSIDE the plugin once installed, gating Pro features.
 *
 * For Chrome extensions or anything not on the Plugin Update Checker
 * convention, the same response shape works as a generic version probe.
 */

import { NextRequest } from 'next/server'
import { findLicenseByKey, touchLicenseChecked } from '@/lib/license'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 min — releases don't change minute-to-minute

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

interface Manifest {
  slug: string
  /** GitHub repo for releases */
  github: string
  /** Asset filename to deliver (also used to detect zip in latest release) */
  asset: string
  /** Plugin URI (used by WP for "Visit plugin site") */
  homepage: string
  /** Tested up to WP version */
  tested?: string
  requires?: string
  requires_php?: string
  /** Sections shown in WP admin "View details" dialog */
  sections?: Record<string, string>
  /** Author */
  author?: string
}

const PRODUCTS: Record<string, Manifest> = {
  '0nwp': {
    slug: '0nwp',
    github: 'Crypto-Goatz/0nwp',
    asset: '0nwp.zip',
    homepage: 'https://wpsxo.com/products/wpsxo',
    tested: '6.7',
    requires: '6.0',
    requires_php: '8.0',
    author: 'RocketOpp LLC',
    sections: {
      description:
        'AI Content Engine for WordPress. Groq-powered article generation, Yoast auto-population, SXO transformations (BLUF, Living DOM, schema, llms.txt), Jaxx chat widget, REST API.',
    },
  },
  wpsxo: {
    slug: 'wpsxo',
    // WP-SXO is the licensed Pro tier of 0nWP — same release line.
    github: 'Crypto-Goatz/0nwp',
    asset: 'wpsxo.zip',
    homepage: 'https://wpsxo.com/products/wpsxo',
    tested: '6.7',
    requires: '6.0',
    requires_php: '8.0',
    author: 'RocketOpp LLC',
    sections: {
      description:
        'WP-SXO — Search Experience Optimization for WordPress. The Pro license tier of 0nWP. Score every page on the 8 SXO dimensions, BLUF detection, schema injection, llms.txt generation.',
    },
  },
  'detect-and-refine': {
    slug: 'detect-and-refine',
    github: 'Crypto-Goatz/detect-and-refine-wp',
    asset: 'detect-and-refine.zip',
    homepage: 'https://wpsxo.com/products/detect-and-refine',
    tested: '6.7',
    requires: '6.0',
    requires_php: '8.0',
    author: 'RocketOpp LLC',
    sections: {
      description:
        '4KB tracking script that grades every visitor on 30+ behavioral signals and feeds quality back to Google/Meta/LinkedIn/TikTok ad platforms.',
    },
  },
  onpress: {
    slug: 'onpress',
    github: 'Crypto-Goatz/onpress-wp',
    asset: 'onpress.zip',
    homepage: 'https://wpsxo.com/products/onpress',
    tested: '6.7',
    requires: '6.0',
    requires_php: '8.0',
    author: 'RocketOpp LLC',
    sections: {
      description:
        'OnPress — the 0n umbrella plugin for WordPress. JaxxAI sidebar, MCP tool palette, automation builder, agent runtime. The 0n suite, native to wp-admin.',
    },
  },
  figgypress: {
    slug: 'figgypress',
    github: 'Crypto-Goatz/onpress',
    asset: 'figgypress.zip',
    homepage: 'https://wpsxo.com/products/figgypress',
    tested: '6.7',
    requires: '6.0',
    author: 'RocketOpp LLC',
    sections: {
      description:
        'FiggyPress — Figma → WordPress theme + plugin generator. Extracts design tokens, generates a real WordPress theme + plugin from your Figma file.',
    },
  },
}

interface GitHubRelease {
  tag_name: string
  name: string
  body: string
  published_at: string
  assets: Array<{ name: string; browser_download_url: string; size: number }>
}

async function getLatestRelease(repo: string): Promise<GitHubRelease | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    return (await res.json()) as GitHubRelease
  } catch {
    return null
  }
}

function tagToVersion(tag: string): string {
  return tag.replace(/^v/, '')
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const slug = (sp.get('slug') || '').toLowerCase()
  const currentVersion = sp.get('version') || '0.0.0'
  const licenseKey = sp.get('key') || req.headers.get('x-license-key') || ''

  const manifest = PRODUCTS[slug]
  if (!manifest) {
    return Response.json(
      { error: `Unknown product: ${slug}` },
      { status: 404, headers: CORS_HEADERS },
    )
  }

  // Touch the license (best-effort) so the dashboard can show last-checked.
  if (licenseKey) {
    findLicenseByKey(licenseKey)
      .then((lic) => lic && touchLicenseChecked(lic.id))
      .catch(() => {})
  }

  const release = await getLatestRelease(manifest.github)
  if (!release) {
    return Response.json(
      { error: 'No release available yet', slug },
      { status: 200, headers: CORS_HEADERS },
    )
  }

  const latestVersion = tagToVersion(release.tag_name)
  const namedAsset = release.assets.find((a) => a.name === manifest.asset)
  const downloadAsset = namedAsset || release.assets[0]
  if (!downloadAsset) {
    return Response.json(
      { error: 'Release has no downloadable asset', slug },
      { status: 200, headers: CORS_HEADERS },
    )
  }

  // Plugin Update Checker schema: https://github.com/YahnisElsts/plugin-update-checker
  return Response.json(
    {
      name: manifest.slug,
      slug: manifest.slug,
      version: latestVersion,
      author: manifest.author || 'RocketOpp LLC',
      author_homepage: 'https://rocketopp.com',
      homepage: manifest.homepage,
      requires: manifest.requires,
      tested: manifest.tested,
      requires_php: manifest.requires_php,
      download_url: downloadAsset.browser_download_url,
      package: downloadAsset.browser_download_url,
      sections: {
        ...(manifest.sections || {}),
        changelog: release.body || release.name,
      },
      // Convenience fields for non-WP consumers (Chrome ext, etc.)
      released_at: release.published_at,
      current_version: currentVersion,
      update_available:
        compareVersions(latestVersion, currentVersion) > 0,
    },
    { headers: CORS_HEADERS },
  )
}

function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0)
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0
    const y = pb[i] || 0
    if (x !== y) return x > y ? 1 : -1
  }
  return 0
}
