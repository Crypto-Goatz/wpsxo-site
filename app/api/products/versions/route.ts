/**
 * GET /api/products/versions
 *
 * Returns the LATEST released version + metadata for every product
 * managed under the 0n umbrella. Used by /dashboard so the listed
 * downloads always reflect what's actually shipping.
 *
 * Source of truth: GitHub releases (one repo per product). When a new
 * release ships → next dashboard load shows it. No hardcoded versions
 * to drift out of date.
 *
 * Cache: 60s revalidate so dashboard hits don't hammer GitHub.
 */

import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 60

const PRODUCT_REPOS: Record<string, string> = {
  wpsxo: 'Crypto-Goatz/0nwp',
  '0nwp': 'Crypto-Goatz/0nwp',
  figgypress: 'Crypto-Goatz/onpress',
  onpress: 'Crypto-Goatz/onpress',
  'detect-and-refine': 'Crypto-Goatz/detect-and-refine-wp',
  '0n-extension': '0nork/0n-extension',
}

interface VersionInfo {
  product: string
  repo: string
  version: string | null
  released_at: string | null
  changelog: string | null
  asset_count: number
  available: boolean
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

async function getRelease(repo: string): Promise<{
  version: string | null
  released_at: string | null
  changelog: string | null
  asset_count: number
}> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) {
      return { version: null, released_at: null, changelog: null, asset_count: 0 }
    }
    const data = (await res.json()) as {
      tag_name: string
      published_at: string
      body: string
      assets: Array<unknown>
    }
    return {
      version: (data.tag_name || '').replace(/^v/, ''),
      released_at: data.published_at,
      changelog: data.body || null,
      asset_count: (data.assets || []).length,
    }
  } catch {
    return { version: null, released_at: null, changelog: null, asset_count: 0 }
  }
}

export async function GET(req: NextRequest) {
  const slugFilter = req.nextUrl.searchParams.get('product')
  const slugs = slugFilter && PRODUCT_REPOS[slugFilter]
    ? [slugFilter]
    : Object.keys(PRODUCT_REPOS)

  const results: VersionInfo[] = await Promise.all(
    slugs.map(async (slug): Promise<VersionInfo> => {
      const repo = PRODUCT_REPOS[slug]
      const release = await getRelease(repo)
      return {
        product: slug,
        repo,
        version: release.version,
        released_at: release.released_at,
        changelog: release.changelog,
        asset_count: release.asset_count,
        available: !!release.version && release.asset_count > 0,
      }
    }),
  )

  return Response.json(
    {
      generated_at: new Date().toISOString(),
      products: results,
    },
    { headers: CORS },
  )
}
