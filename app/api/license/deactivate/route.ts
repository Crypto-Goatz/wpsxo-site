/**
 * POST /api/license/deactivate
 *
 * Body: { key, fingerprint }
 *
 * Frees a seat. Used by:
 *   - WP plugin uninstall hook
 *   - "Remove this site" button on /dashboard
 *   - Chrome extension on uninstall
 */

import { NextRequest } from 'next/server'
import { deactivateLicense, findLicenseByKey } from '@/lib/license'

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
  let body: { key?: string; fingerprint?: string } = {}
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

  const ok = await deactivateLicense(license.id, fingerprint)
  return json({ ok })
}
