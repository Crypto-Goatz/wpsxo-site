/**
 * GET /auth/confirm
 *
 * Single landing for Supabase email links — magic link, signup confirmation,
 * password reset. Verifies the token_hash, writes the session cookie via the
 * SSR client, then bounces to ?next=/dashboard.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as
    | 'signup'
    | 'magiclink'
    | 'recovery'
    | 'invite'
    | 'email_change'
    | null
  const next = searchParams.get('next') || '/dashboard'

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
