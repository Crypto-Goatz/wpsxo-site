/**
 * GET /api/credits/balance
 *
 * Returns balance + recent activity. Auth via 0n_ token (header or query).
 */

import { NextRequest } from 'next/server'
import { getProfileByToken, listTransactions, listAddons } from '@/lib/credits'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-License-Key',
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

function bearerToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization') || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim()
  return req.nextUrl.searchParams.get('token')
}

export async function GET(req: NextRequest) {
  const token = bearerToken(req)
  if (!token?.startsWith('0n_')) {
    return Response.json({ error: 'token_required' }, { status: 401, headers: CORS })
  }

  const profile = await getProfileByToken(token)
  if (!profile) {
    return Response.json({ error: 'invalid_token' }, { status: 401, headers: CORS })
  }

  const [transactions, addons] = await Promise.all([
    listTransactions(profile.id, 20),
    listAddons(profile.id),
  ])

  return Response.json(
    {
      ok: true,
      balance: profile.credits_balance,
      plan: profile.plan,
      plan_status: profile.plan_status,
      plan_renews_at: profile.plan_renews_at,
      addons: addons,
      recent: transactions,
    },
    { headers: CORS },
  )
}
