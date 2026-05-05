/**
 * POST /api/auth/magic-link
 *
 * Lets returning customers re-access their downloads without remembering a
 * password — they enter the email they used at checkout, we send a magic
 * link that signs them in and bounces them to /dashboard.
 *
 * We DO NOT verify the email belongs to a paying customer here — Supabase
 * will only deliver to a registered user, and signups are public. If the
 * email isn't registered, the link silently doesn't arrive — same UX as
 * any "we'll send you a link if it matches" flow. Don't leak existence.
 */

import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) {
    return Response.json({ error: 'Email required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // never create on magic-link request
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://wpsxo.com'}/dashboard`,
    },
  })

  if (error) {
    // Don't surface "user not found" — same response shape either way.
    console.error('[auth/magic-link]', error.message)
  }

  return Response.json({
    ok: true,
    message: "If we have a record of that email, you'll get a sign-in link in a minute.",
  })
}
