import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return Response.json({ error: 'Email and password required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://wpsxo.com'}/dashboard`,
    },
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json({ ok: true })
}
