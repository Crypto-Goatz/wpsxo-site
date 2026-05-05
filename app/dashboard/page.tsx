/**
 * /dashboard — Customer account page.
 *
 * Three flows funnel into here:
 *   1. Just-finished checkout → arrives with ?session_id=cs_… in the URL.
 *      We look up that purchase + show it as the hero. We also pull every
 *      OTHER purchase that shares the same email so the page is the canonical
 *      "all your downloads" view from minute one.
 *   2. Logged-in returning customer → no session_id, but supabase session
 *      cookie is set. Pulls everything by user.email.
 *   3. Logged-out user with no session_id → magic-link form: enter your
 *      purchase email, we email you a sign-in link.
 *
 * Stripe's hosted billing portal is intentionally demoted to a small
 * secondary link inside the Subscriptions card — the primary surface is
 * downloads, not payment management.
 */

import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle2, Download, ExternalLink, Sparkles, LogOut } from 'lucide-react'
import MagicLinkForm from './magic-link-form'

export const dynamic = 'force-dynamic'

interface PurchaseRow {
  id: string
  stripe_session_id: string
  email: string
  name: string | null
  product_slug: string
  amount_total_cents: number
  currency: string
  status: string
  created_at: string
}

interface TrialRow {
  id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  email: string
  status: string
  plan_tier: string | null
  created_at: string
}

const PRODUCTS: Record<
  string,
  {
    name: string
    downloadUrl: string
    helpUrl: string
    figmaInstallNote?: string
  }
> = {
  wpsxo: {
    name: 'WP-SXO',
    downloadUrl:
      'https://github.com/Crypto-Goatz/wpsxo-plugin/releases/latest/download/wpsxo.zip',
    helpUrl: '/products/wpsxo',
  },
  onpress: {
    name: 'OnPress — Figma → WordPress',
    downloadUrl:
      'https://github.com/Crypto-Goatz/onpress/releases/latest/download/onpress.zip',
    helpUrl: '/products/onpress',
    figmaInstallNote:
      'In Figma: Plugins → Development → Import plugin from manifest → select manifest.json from the unzipped folder.',
  },
  'detect-and-refine': {
    name: 'Detect & Refine',
    downloadUrl:
      'https://github.com/Crypto-Goatz/detect-and-refine-wp/releases/latest/download/detect-and-refine.zip',
    helpUrl: '/products/detect-and-refine',
  },
  'founder-bundle': {
    name: 'Founder Bundle',
    downloadUrl: '',
    helpUrl: '/pricing',
  },
}

async function getPurchaseBySession(
  sessionId: string,
): Promise<PurchaseRow | null> {
  const { data } = await supabaseAdmin
    .from('lifetime_purchases')
    .select(
      'id, stripe_session_id, email, name, product_slug, amount_total_cents, currency, status, created_at',
    )
    .eq('stripe_session_id', sessionId)
    .maybeSingle()
  return (data as PurchaseRow | null) || null
}

async function getPurchasesByEmail(email: string): Promise<PurchaseRow[]> {
  const { data } = await supabaseAdmin
    .from('lifetime_purchases')
    .select(
      'id, stripe_session_id, email, name, product_slug, amount_total_cents, currency, status, created_at',
    )
    .ilike('email', email)
    .order('created_at', { ascending: false })
  return (data as PurchaseRow[]) || []
}

async function getTrialsByEmail(email: string): Promise<TrialRow[]> {
  const { data } = await supabaseAdmin
    .from('trial_accounts')
    .select(
      'id, stripe_customer_id, stripe_subscription_id, email, status, plan_tier, created_at',
    )
    .ilike('email', email)
    .order('created_at', { ascending: false })
  return (data as TrialRow[]) || []
}

function fmtAmount(cents: number, currency: string) {
  if (cents === 0) return 'Free (JAG)'
  const dollars = cents / 100
  return `$${dollars.toFixed(2)} ${currency.toUpperCase()}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; product?: string; from?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id
  const justCheckedOut = !!sessionId

  // ── Try to identify the customer ────────────────────────────────
  // Order: session_id (post-checkout) → supabase auth session → none
  let identifyingEmail: string | null = null
  let heroPurchase: PurchaseRow | null = null

  if (sessionId) {
    heroPurchase = await getPurchaseBySession(sessionId)
    if (heroPurchase) identifyingEmail = heroPurchase.email
  }

  if (!identifyingEmail) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.email) identifyingEmail = user.email
  }

  // ── If we have an email, load EVERYTHING for that customer ──────
  let allPurchases: PurchaseRow[] = []
  let trials: TrialRow[] = []
  if (identifyingEmail) {
    ;[allPurchases, trials] = await Promise.all([
      getPurchasesByEmail(identifyingEmail),
      getTrialsByEmail(identifyingEmail),
    ])
  }

  // ── Render: anonymous fallback ──────────────────────────────────
  if (!identifyingEmail) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold mb-2">Your account</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Enter the email you used at checkout. We&apos;ll email you a sign-in link
          — no password needed.
        </p>
        <div className="card">
          <MagicLinkForm />
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-6">
          Just bought something? Check the email Stripe sent — the link to your
          downloads is in there too.
        </p>
      </div>
    )
  }

  // ── Render: account view ────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold">
          {justCheckedOut ? "You're in." : 'Your account'}
        </h1>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
      <p className="text-[var(--text-secondary)] mb-8">
        Signed in as <strong>{identifyingEmail}</strong>
      </p>

      {/* Hero card for fresh checkout */}
      {justCheckedOut && heroPurchase && PRODUCTS[heroPurchase.product_slug] && (
        <section className="card mb-6 border-[var(--accent)]/40">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold mb-1">
                {PRODUCTS[heroPurchase.product_slug].name} unlocked
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Lifetime license. License never expires. Updates included.
              </p>
            </div>
          </div>
          {PRODUCTS[heroPurchase.product_slug].downloadUrl && (
            <a
              href={PRODUCTS[heroPurchase.product_slug].downloadUrl}
              className="btn-primary inline-flex items-center gap-2"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4" />
              Download {PRODUCTS[heroPurchase.product_slug].name} (.zip)
            </a>
          )}
          {PRODUCTS[heroPurchase.product_slug].figmaInstallNote && (
            <p className="text-xs text-[var(--text-muted)] mt-3">
              <strong>Install:</strong>{' '}
              {PRODUCTS[heroPurchase.product_slug].figmaInstallNote}
            </p>
          )}
        </section>
      )}

      {/* Provisioning state — checkout went through but webhook hasn't landed yet */}
      {justCheckedOut && !heroPurchase && (
        <section className="card mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-amber-300 shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold mb-1">Almost ready…</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Stripe just confirmed your checkout. Provisioning usually
                finishes in under 10 seconds. Refresh this page in a moment, or
                check your email — the link works permanently.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* All downloads */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-1">Your downloads</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Every plugin you&apos;ve purchased — link is permanent, lifetime updates
          included.
        </p>
        {allPurchases.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            No purchases on record yet for this email.{' '}
            <Link href="/pricing" className="underline">
              Browse founder pricing →
            </Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {allPurchases.map((p) => {
              const meta = PRODUCTS[p.product_slug]
              if (!meta) return null
              return (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 py-3 border-t border-[var(--border)] first:border-t-0 first:pt-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{meta.name}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      {fmtDate(p.created_at)} ·{' '}
                      {fmtAmount(p.amount_total_cents, p.currency)} ·{' '}
                      <Link href={meta.helpUrl} className="underline">
                        Setup guide
                      </Link>
                    </div>
                  </div>
                  {meta.downloadUrl && (
                    <a
                      href={meta.downloadUrl}
                      className="btn-secondary inline-flex items-center gap-1.5 shrink-0"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Subscriptions (trials / recurring) — only renders when relevant */}
      {trials.length > 0 && (
        <section className="card mb-6">
          <h2 className="text-lg font-bold mb-1">Subscriptions</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Active subscriptions and trials. Manage payment method or cancel
            from the Stripe portal.
          </p>
          <ul className="space-y-2 mb-4">
            {trials.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-4 py-2 text-sm border-t border-[var(--border)] first:border-t-0 first:pt-0"
              >
                <div>
                  <span className="font-semibold capitalize">
                    {t.plan_tier || 'Plan'}
                  </span>
                  <span className="text-[var(--text-muted)] ml-2">
                    · {t.status}
                  </span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  Since {fmtDate(t.created_at)}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/api/billing/portal"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Manage billing in Stripe
          </Link>
        </section>
      )}

      <section className="card">
        <h2 className="text-lg font-bold mb-1">Need help?</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Email{' '}
          <a href="mailto:mike@rocketopp.com" className="underline">
            mike@rocketopp.com
          </a>{' '}
          — replies in under 24 hours during the founder period.
        </p>
      </section>
    </div>
  )
}
