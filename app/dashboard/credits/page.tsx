/**
 * /dashboard/credits — credit balance, history, buy more.
 *
 * Pulls everything server-side via the user's Supabase session OR a
 * 0n_ token cookie. Shows balance prominently, then the four credit
 * pack options, then the recent transaction log.
 */

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'
import {
  getProfileByEmail,
  listTransactions,
  CREDIT_PACKS,
  FREE_TIER,
} from '@/lib/credits'
import {
  Coins,
  Plus,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const PACK_LABEL: Record<number, string> = {
  100: 'Starter',
  500: 'Pro Pack',
  2500: 'Studio Pack',
  10000: 'Mega Pack',
}

const PACK_HIGHLIGHT: Record<number, boolean> = {
  100: false,
  500: false,
  2500: true,
  10000: false,
}

interface TxRow {
  id: string
  delta: number
  reason: string
  ref_type: string | null
  ref_id: string | null
  balance_after: number | null
  created_at: string
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function fmtReason(reason: string): string {
  const map: Record<string, string> = {
    signup_grant: '🎁 Welcome bonus',
    credit_pack_purchase: '💳 Credit pack',
    monthly_refresh: '🔄 Monthly refresh',
    referral_signup: '👋 Referral signup',
    referral_paid: '🚀 Referral converted',
    subscription_pro_renewal: '⭐ Pro renewal',
    subscription_studio_renewal: '🌟 Studio renewal',
    execution: '⚡ Execution',
  }
  return map[reason] || reason
}

export default async function CreditsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-extrabold mb-3">Sign in required</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          The credits dashboard needs you to be signed in.
        </p>
        <Link href="/dashboard" className="btn-primary inline-flex">
          Go to dashboard
        </Link>
      </div>
    )
  }

  const profile = await getProfileByEmail(user.email)
  const transactions = profile ? ((await listTransactions(profile.id, 50)) as TxRow[]) : []

  // Make sure a profile row exists
  if (!profile) {
    await supabaseAdmin.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        credits_balance: FREE_TIER.signup_grant,
        plan: 'free',
      },
      { onConflict: 'id' },
    )
  }

  const balance = profile?.credits_balance ?? FREE_TIER.signup_grant
  const plan = profile?.plan ?? 'free'

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/dashboard"
        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <div className="card mb-8 border-[var(--accent)]/40">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-5 h-5 text-amber-300" />
              <h1 className="text-3xl font-extrabold">
                {balance.toLocaleString()}{' '}
                <span className="text-base font-medium text-[var(--text-muted)]">
                  credits
                </span>
              </h1>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Plan: <strong className="capitalize text-[var(--text-primary)]">{plan}</strong>
              {plan === 'free' && (
                <>
                  {' · '}+{FREE_TIER.monthly_refresh} free credits monthly
                </>
              )}
            </p>
          </div>
          <Link
            href="/pricing#plans"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            See subscription plans
          </Link>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-3">Buy a credit pack</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">
        Credits never expire. Use them on any addon, plugin run, or AI execution.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {Object.entries(CREDIT_PACKS).map(([credits, cents]) => {
          const c = parseInt(credits, 10)
          const dollars = (cents as number) / 100
          const perCredit = ((cents as number) / 100 / c).toFixed(2)
          const highlight = PACK_HIGHLIGHT[c]
          return (
            <Link
              key={c}
              href={`/api/credits/checkout?credits=${c}`}
              className={`card text-center p-4 hover:border-[var(--accent)]/60 transition-colors ${
                highlight ? 'border-[var(--accent)]/40' : ''
              }`}
            >
              {highlight && (
                <div className="text-[10px] uppercase tracking-wider text-[var(--accent)] mb-1">
                  Best value
                </div>
              )}
              <div className="text-2xl font-extrabold">
                {c.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--text-muted)] mb-3">
                credits
              </div>
              <div className="text-xl font-bold">${dollars}</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-1">
                ${perCredit}/credit
              </div>
              <div className="text-xs font-bold mt-3 text-[var(--accent)]">
                {PACK_LABEL[c]}
              </div>
            </Link>
          )
        })}
      </div>

      <h2 className="text-lg font-bold mb-3">Recent activity</h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          No activity yet. Try running anything — it&apos;s on us until you spend{' '}
          {balance} credits.
        </p>
      ) : (
        <div className="card p-0">
          <ul className="divide-y divide-[var(--border)]">
            {transactions.map((t) => {
              const positive = t.delta > 0
              return (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {positive ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-amber-300 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {fmtReason(t.reason)}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {fmtDate(t.created_at)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`shrink-0 font-mono text-sm ${
                      positive ? 'text-emerald-400' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {positive ? '+' : ''}
                    {t.delta.toLocaleString()}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
