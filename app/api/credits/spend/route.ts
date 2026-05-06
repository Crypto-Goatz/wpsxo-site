/**
 * POST /api/credits/spend
 *
 * Body: { token, amount, reason, ref_type?, ref_id? }
 *
 * The single chokepoint every metered action goes through. If the user
 * doesn't have enough credits → returns ok:false + reason='insufficient'.
 * Caller MUST check ok before delivering value.
 *
 * Same endpoint works for the Chrome extension, MCP server, plugins, and
 * dashboard internal actions. One token, one balance, one ledger.
 */

import { NextRequest } from 'next/server'
import { getProfileByToken, spendCredits } from '@/lib/credits'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function POST(req: NextRequest) {
  let body: {
    token?: string
    amount?: number
    reason?: string
    ref_type?: string
    ref_id?: string
  } = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400, headers: CORS })
  }

  const auth = req.headers.get('authorization') || ''
  const token =
    body.token || (auth.startsWith('Bearer ') ? auth.slice(7).trim() : '')

  if (!token?.startsWith('0n_')) {
    return Response.json({ ok: false, error: 'token_required' }, { status: 401, headers: CORS })
  }

  const amount = Math.max(1, Math.floor(Number(body.amount) || 1))
  const reason = (body.reason || 'execution').slice(0, 200)

  const profile = await getProfileByToken(token)
  if (!profile) {
    return Response.json({ ok: false, error: 'invalid_token' }, { status: 401, headers: CORS })
  }

  // Pro / Studio with active sub: still ledger but never block.
  // Free tier: block when balance hits 0.
  // Studio also gets unlimited (handled by giant credit grant on renewal).

  const result = await spendCredits({
    userId: profile.id,
    amount,
    reason,
    refType: body.ref_type,
    refId: body.ref_id,
  })

  if (!result.ok) {
    return Response.json(
      { ok: false, error: result.error || 'spend_failed', balance: result.balance_after },
      { status: 402, headers: CORS },
    )
  }

  return Response.json(
    { ok: true, balance: result.balance_after, spent: amount },
    { headers: CORS },
  )
}
