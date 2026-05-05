/**
 * GET|POST /api/license/check
 *
 * Universal license validation endpoint. Used by every WP plugin, Chrome
 * extension, and Figma plugin shipped under the 0n umbrella.
 *
 * Query params (GET) or JSON body (POST):
 *   key            — license key (required)
 *   product        — product slug we're checking against (optional, recommended)
 *   fingerprint    — caller's site/install fingerprint (optional, used for usage stats)
 *
 * Returns:
 *   { valid, status, product, max_seats, seats_used, expires_at, plan }
 *
 * Idempotent. Safe to call on every page load / every plugin tick.
 * Wide CORS so any origin can call it.
 */

import { NextRequest } from 'next/server'
import {
  findLicenseByKey,
  countActiveActivations,
  touchLicenseChecked,
} from '@/lib/license'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-License-Key',
} as const

function json(payload: unknown, status = 200) {
  return Response.json(payload, { status, headers: CORS_HEADERS })
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

async function readArgs(req: NextRequest) {
  if (req.method === 'GET') {
    const sp = req.nextUrl.searchParams
    return {
      key: sp.get('key') || req.headers.get('x-license-key') || '',
      product: sp.get('product') || undefined,
      fingerprint: sp.get('fingerprint') || undefined,
    }
  }
  try {
    const body = (await req.json()) as Record<string, string | undefined>
    return {
      key: body.key || req.headers.get('x-license-key') || '',
      product: body.product,
      fingerprint: body.fingerprint,
    }
  } catch {
    return { key: '', product: undefined, fingerprint: undefined }
  }
}

async function handle(req: NextRequest) {
  const { key, product } = await readArgs(req)
  if (!key) return json({ valid: false, status: 'missing_key' }, 400)

  const license = await findLicenseByKey(key)
  if (!license) return json({ valid: false, status: 'not_found' }, 200)

  if (product && license.product_slug !== product) {
    return json({ valid: false, status: 'product_mismatch' }, 200)
  }

  if (license.status !== 'active') {
    return json({
      valid: false,
      status: license.status,
      product: license.product_slug,
    })
  }

  if (license.expires_at && new Date(license.expires_at) < new Date()) {
    return json({
      valid: false,
      status: 'expired',
      product: license.product_slug,
      expires_at: license.expires_at,
    })
  }

  const seats_used = await countActiveActivations(license.id)
  // Fire and forget — never let stats writes slow the response.
  touchLicenseChecked(license.id).catch(() => {})

  return json({
    valid: true,
    status: 'active',
    product: license.product_slug,
    email: license.email,
    max_seats: license.max_seats,
    seats_used,
    expires_at: license.expires_at,
  })
}

export async function GET(req: NextRequest) {
  return handle(req)
}

export async function POST(req: NextRequest) {
  return handle(req)
}
