import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || ''
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const keyHead = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').slice(0, 30)
  const keyTail = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').slice(-10)

  // Try the profiles select.
  const { data, error, status, statusText } = await supabaseAdmin
    .from('profiles')
    .select('id, email, access_token, credits_balance, plan')
    .eq('access_token', token)
    .maybeSingle()

  // Also try a simple select with no filter to see if the table is reachable at all.
  const counter = await supabaseAdmin
    .from('profiles')
    .select('id', { count: 'exact', head: true })

  return Response.json({
    env: { url_host: url.slice(8, 40), key_head: keyHead, key_tail: keyTail },
    target_query: {
      data,
      error: error
        ? { message: error.message, code: error.code, details: error.details, hint: error.hint }
        : null,
      status,
      statusText,
    },
    count_query: {
      count: counter.count,
      error: counter.error
        ? { message: counter.error.message, code: counter.error.code, details: counter.error.details, hint: counter.error.hint }
        : null,
      status: counter.status,
    },
  })
}
