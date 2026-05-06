/**
 * Credit-system helpers — single source of truth for spend / grant logic.
 *
 * Token-aware (every public surface authenticates via the 0n_ token in
 * profiles.access_token). Every spend creates a credit_transactions row
 * for audit, and uses the spend_credits() RPC for atomic decrement.
 */

import { supabaseAdmin } from '@/lib/supabase'

export const CREDIT_PACKS = {
  100: 900,
  500: 3900,
  2500: 14900,
  10000: 49900,
} as const

export const PACK_PRICE_IDS: Record<number, string | undefined> = {
  100: process.env.STRIPE_PRICE_CREDITS_100,
  500: process.env.STRIPE_PRICE_CREDITS_500,
  2500: process.env.STRIPE_PRICE_CREDITS_2500,
  10000: process.env.STRIPE_PRICE_CREDITS_10000,
}

export const SUBSCRIPTION_PLANS = {
  pro: {
    price_id: process.env.STRIPE_PRICE_PRO_MONTHLY,
    monthly_credits: 500,
    monthly_price_cents: 2900,
  },
  studio: {
    price_id: process.env.STRIPE_PRICE_STUDIO_MONTHLY,
    monthly_credits: 2500,
    monthly_price_cents: 7900,
  },
} as const

export const FREE_TIER = {
  signup_grant: 200,
  monthly_refresh: 100,
} as const

export interface ProfileWithCredits {
  id: string
  email: string
  access_token: string
  credits_balance: number
  plan: 'free' | 'pro' | 'studio' | 'enterprise'
  plan_renews_at: string | null
  plan_status: string | null
  last_credit_refresh_at: string | null
}

export async function getProfileByToken(
  token: string,
): Promise<ProfileWithCredits | null> {
  if (!token?.startsWith('0n_')) return null

  // Diagnostic: confirm we have the right env wired up.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const keyHead = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').slice(0, 20)
  if (!url.includes('pwujhhmlrtxjmjzyttwn')) {
    console.error('[credits.getProfileByToken] WRONG SUPABASE URL:', url.slice(0, 50))
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select(
      'id, email, access_token, credits_balance, plan, plan_renews_at, plan_status, last_credit_refresh_at',
    )
    .eq('access_token', token)
    .maybeSingle()

  if (error) {
    console.error(
      '[credits.getProfileByToken] db error:',
      error.message,
      'code:',
      error.code,
      'details:',
      error.details,
      'hint:',
      error.hint,
      'url-host:',
      url.slice(8, 35),
      'key-head:',
      keyHead,
    )
    return null
  }
  if (!data) {
    console.warn(
      '[credits.getProfileByToken] NO MATCH for token-prefix:',
      token.slice(0, 8),
      '...',
      token.slice(-4),
      'url-host:',
      url.slice(8, 35),
      'key-head:',
      keyHead,
    )
  } else {
    console.log(
      '[credits.getProfileByToken] hit:',
      (data as ProfileWithCredits).email,
    )
  }
  return (data as ProfileWithCredits | null) || null
}

export async function getProfileByEmail(
  email: string,
): Promise<ProfileWithCredits | null> {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select(
      'id, email, access_token, credits_balance, plan, plan_renews_at, plan_status, last_credit_refresh_at',
    )
    .ilike('email', email)
    .maybeSingle()
  return (data as ProfileWithCredits | null) || null
}

export async function spendCredits(args: {
  userId: string
  amount: number
  reason: string
  refType?: string
  refId?: string
}): Promise<{ ok: boolean; balance_after: number; error?: string }> {
  const { data, error } = await supabaseAdmin.rpc('spend_credits', {
    p_user_id: args.userId,
    p_amount: args.amount,
    p_reason: args.reason,
    p_ref_type: args.refType ?? null,
    p_ref_id: args.refId ?? null,
  })
  if (error) return { ok: false, balance_after: 0, error: error.message }
  const row = Array.isArray(data) ? data[0] : data
  return {
    ok: !!row?.ok,
    balance_after: row?.balance_after ?? 0,
    error: row?.error_msg ?? undefined,
  }
}

export async function grantCredits(args: {
  userId: string
  amount: number
  reason: string
  refType?: string
  refId?: string
}): Promise<number | null> {
  const { data, error } = await supabaseAdmin.rpc('grant_credits', {
    p_user_id: args.userId,
    p_amount: args.amount,
    p_reason: args.reason,
    p_ref_type: args.refType ?? null,
    p_ref_id: args.refId ?? null,
  })
  if (error) {
    console.error('[credits.grant]', error.message)
    return null
  }
  return data as number | null
}

export async function listTransactions(userId: string, limit = 50) {
  const { data } = await supabaseAdmin
    .from('credit_transactions')
    .select('id, delta, reason, ref_type, ref_id, balance_after, created_at, metadata')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data || []
}

export async function listAddons(userId: string) {
  const { data } = await supabaseAdmin
    .from('profile_addons')
    .select('addon_slug, status, granted_at, expires_at, source, metadata')
    .eq('user_id', userId)
    .order('granted_at', { ascending: false })
  return data || []
}

export async function grantAddon(args: {
  userId: string
  addonSlug: string
  source: string
  refId?: string
  expiresAt?: string | null
  metadata?: Record<string, unknown>
}): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('profile_addons')
    .upsert(
      {
        user_id: args.userId,
        addon_slug: args.addonSlug,
        status: 'active',
        granted_at: new Date().toISOString(),
        expires_at: args.expiresAt ?? null,
        source: args.source,
        ref_id: args.refId ?? null,
        metadata: args.metadata ?? {},
      },
      { onConflict: 'user_id,addon_slug' },
    )
  return !error
}

export async function setPlan(args: {
  userId: string
  plan: 'free' | 'pro' | 'studio' | 'enterprise'
  renewsAt?: string | null
  status?: string
  monthlyCredits?: number
}): Promise<boolean> {
  const updates: Record<string, unknown> = {
    plan: args.plan,
    plan_status: args.status ?? 'active',
  }
  if (args.renewsAt !== undefined) updates.plan_renews_at = args.renewsAt
  const { error: upd } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', args.userId)
  if (upd) return false

  if (args.monthlyCredits && args.monthlyCredits > 0) {
    await grantCredits({
      userId: args.userId,
      amount: args.monthlyCredits,
      reason: `subscription_${args.plan}_renewal`,
      refType: 'subscription',
    })
  }
  return true
}
