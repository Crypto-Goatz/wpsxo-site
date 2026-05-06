/**
 * GET /api/downloads/secure?product=<slug>&session_id=<cs_…>
 * GET /api/downloads/secure?product=<slug>&token=<0n_…>
 *
 * Authenticated, license-gated download proxy. Streams the actual zip
 * from a GitHub release through our server using GITHUB_TOKEN — works
 * for both public AND private repos.
 *
 * Auth modes (any one wins):
 *   1. Stripe session_id from a successful checkout (just-purchased path)
 *   2. 0n_ token in query OR Authorization: Bearer header
 *   3. Supabase session cookie (logged-in dashboard user)
 *
 * The user must either:
 *   - Have a row in lifetime_purchases for this session_id, OR
 *   - Have an active row in profile_addons for this product slug
 *
 * If neither, redirect to /pricing.
 *
 * Why this matters: WP-SXO ships from a private 0nwp repo. Public download
 * URLs would be 404 to buyers. This proxies through GitHub's authenticated
 * API and streams to the buyer.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import { getProfileByEmail, getProfileByToken } from '@/lib/credits'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

interface Manifest {
  github: string
  asset: string
  fallbackPublic?: string // direct URL if not gated
}

const MANIFESTS: Record<string, Manifest> = {
  wpsxo: { github: 'Crypto-Goatz/0nwp', asset: 'wpsxo.zip' },
  '0nwp': { github: 'Crypto-Goatz/0nwp', asset: '0nwp.zip' },
  figgypress: { github: 'Crypto-Goatz/onpress', asset: 'onpress.zip' },
  onpress: { github: 'Crypto-Goatz/onpress', asset: 'onpress.zip' },
  'detect-and-refine': {
    github: 'Crypto-Goatz/detect-and-refine-wp',
    asset: 'detect-and-refine.zip',
  },
}

async function isOwner(args: {
  product: string
  email?: string | null
  sessionId?: string | null
}): Promise<boolean> {
  // Path A — fresh checkout link (session_id in URL right after purchase)
  if (args.sessionId) {
    const { data } = await supabaseAdmin
      .from('lifetime_purchases')
      .select('id, product_slug, status')
      .eq('stripe_session_id', args.sessionId)
      .maybeSingle()
    if (data && data.status === 'paid') {
      // Allow any product they bought — slug check is loose because of the
      // onpress→figgypress rename
      const owned = (data.product_slug || '').toLowerCase()
      const want = args.product.toLowerCase()
      if (owned === want || (owned === 'onpress' && want === 'figgypress') || (owned === 'figgypress' && want === 'onpress')) {
        return true
      }
    }
  }

  // Path B — known account, has the addon granted
  if (args.email) {
    const profile = await getProfileByEmail(args.email)
    if (profile) {
      // Master access for the owner email
      if (profile.email.toLowerCase() === 'mike@rocketopp.com') return true

      const wantSlugs = [args.product, args.product === 'figgypress' ? 'onpress' : '']
        .filter(Boolean)
      const { data: addon } = await supabaseAdmin
        .from('profile_addons')
        .select('id')
        .eq('user_id', profile.id)
        .eq('status', 'active')
        .in('addon_slug', wantSlugs)
        .maybeSingle()
      if (addon) return true

      // Pro / Studio: all addons free
      if (profile.plan === 'pro' || profile.plan === 'studio' || profile.plan === 'enterprise') {
        return true
      }
    }
  }

  return false
}

async function getReleaseAsset(
  manifest: Manifest,
): Promise<{ id: number; name: string } | null> {
  const res = await fetch(
    `https://api.github.com/repos/${manifest.github}/releases/latest`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 60 },
    },
  )
  if (!res.ok) return null
  const data = (await res.json()) as {
    assets: Array<{ id: number; name: string }>
  }
  const named = data.assets.find((a) => a.name === manifest.asset)
  return named || data.assets[0] || null
}

export async function GET(req: NextRequest) {
  const product = (req.nextUrl.searchParams.get('product') || '').toLowerCase()
  const sessionId = req.nextUrl.searchParams.get('session_id')
  const tokenParam = req.nextUrl.searchParams.get('token')
  const auth = req.headers.get('authorization') || ''
  const headerToken = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  const tokenAny = tokenParam || headerToken

  const manifest = MANIFESTS[product]
  if (!manifest) {
    return NextResponse.json({ error: `Unknown product: ${product}` }, { status: 404 })
  }

  // Resolve user email
  let email: string | null = null
  if (tokenAny?.startsWith('0n_')) {
    const profile = await getProfileByToken(tokenAny)
    if (profile?.email) email = profile.email
  }
  if (!email) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.email) email = user.email
  }

  const owns = await isOwner({ product, email, sessionId })
  if (!owns) {
    const url = new URL('/pricing', req.url)
    url.searchParams.set('checkout', 'required')
    url.searchParams.set('product', product)
    return NextResponse.redirect(url, { status: 303 })
  }

  const asset = await getReleaseAsset(manifest)
  if (!asset) {
    return NextResponse.json(
      { error: 'No release asset available' },
      { status: 503 },
    )
  }

  // Stream the asset via GitHub API. Setting Accept:application/octet-stream
  // returns the actual binary (otherwise GitHub returns JSON metadata).
  const downloadRes = await fetch(
    `https://api.github.com/repos/${manifest.github}/releases/assets/${asset.id}`,
    {
      headers: {
        Accept: 'application/octet-stream',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      redirect: 'follow',
    },
  )

  if (!downloadRes.ok || !downloadRes.body) {
    return NextResponse.json(
      { error: `GitHub asset fetch failed: ${downloadRes.status}` },
      { status: 502 },
    )
  }

  return new Response(downloadRes.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${manifest.asset}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
