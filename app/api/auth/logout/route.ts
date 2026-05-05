import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(_req: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', _req.url), { status: 303 })
}

export async function GET(_req: NextRequest) {
  return POST(_req)
}
