/**
 * POST /api/license/activate
 *
 * Body: { key, fingerprint, site_url?, user_agent? }
 *
 * Records a new install/seat for the given license. Idempotent on
 * fingerprint — called from a plugin's "Activate License" button or
 * a Chrome extension's first-run code.
 */

import { NextRequest } from 'next/server'
import { activateLicense, findLicenseByKey } from '@/lib/license'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-License-Key',
} as const

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

function json(p: unknown, s = 200) {
  return Response.json(p, { status: s, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  let body: {
    key?: string
    fingerprint?: string
    site_url?: string
    user_agent?: string
  } = {}
  try {
    body = await req.json()
  } catch {
    return json({ ok: false, reason: 'invalid_json' }, 400)
  }

  const key = body.key || req.headers.get('x-license-key') || ''
  const fingerprint = body.fingerprint || ''
  if (!key || !fingerprint) {
    return json({ ok: false, reason: 'missing_key_or_fingerprint' }, 400)
  }

  const license = await findLicenseByKey(key)
  if (!license) return json({ ok: false, reason: 'not_found' }, 200)

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null

  const result = await activateLicense({
    license,
    fingerprint,
    siteUrl: body.site_url || null,
    userAgent: body.user_agent || req.headers.get('user-agent') || null,
    ip,
  })

  if (!result.ok) {
    return json({ ok: false, reason: result.reason })
  }

  return json({
    ok: true,
    activation_id: result.activation?.id,
    product: license.product_slug,
    max_seats: license.max_seats,
  })
}
