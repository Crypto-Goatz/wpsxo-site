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
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Sparkles,
  LogOut,
  Key,
  Monitor,
} from 'lucide-react'
import MagicLinkForm from './magic-link-form'
import LicenseKeyCopy from './license-key-copy'
import {
  findLicensesByEmail,
  listActivations,
  type License,
  type LicenseActivation,
} from '@/lib/license'

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
    // Routes through the secure proxy — license-gated, supports private repo.
    downloadUrl: '/api/downloads/secure?product=wpsxo',
    helpUrl: '/products/wpsxo',
  },
  figgypress: {
    name: 'FiggyPress — Figma → WordPress',
    downloadUrl: '/api/downloads/secure?product=figgypress',
    helpUrl: '/products/figgypress',
    figmaInstallNote:
      'In Figma: Plugins → Development → Import plugin from manifest → select manifest.json from the unzipped folder.',
  },
  // Backwards-compat: anyone with an old purchase under slug=onpress still resolves.
  onpress: {
    name: 'FiggyPress — Figma → WordPress',
    downloadUrl: '/api/downloads/secure?product=onpress',
    helpUrl: '/products/figgypress',
    figmaInstallNote:
      'In Figma: Plugins → Development → Import plugin from manifest → select manifest.json from the unzipped folder.',
  },
  'detect-and-refine': {
    name: 'Detect & Refine',
    downloadUrl: '/api/downloads/secure?product=detect-and-refine',
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
  let licenses: License[] = []
  let activationsByLicense: Record<string, LicenseActivation[]> = {}

  if (identifyingEmail) {
    ;[allPurchases, trials, licenses] = await Promise.all([
      getPurchasesByEmail(identifyingEmail),
      getTrialsByEmail(identifyingEmail),
      findLicensesByEmail(identifyingEmail),
    ])

    if (licenses.length > 0) {
      const acts = await Promise.all(licenses.map((l) => listActivations(l.id)))
      activationsByLicense = Object.fromEntries(
        licenses.map((l, i) => [l.id, acts[i]]),
      )
    }
  }

  const licensesByProduct: Record<string, License | undefined> = Object.fromEntries(
    licenses.map((l) => [l.product_slug, l]),
  )

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

          {licensesByProduct[heroPurchase.product_slug] && (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                <Key className="w-3 h-3" /> Your license key
              </div>
              <LicenseKeyCopy
                licenseKey={licensesByProduct[heroPurchase.product_slug]!.key}
              />
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Save this — you&apos;ll paste it into the plugin&apos;s settings
                screen to activate. Also emailed to you.
              </p>
            </div>
          )}

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

      {/* License keys + active sites */}
      {licenses.length > 0 && (
        <section className="card mb-6">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <Key className="w-4 h-4" /> License keys
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Paste these into the plugin or extension settings to activate.
            Lifetime keys never expire. Each key shows the active sites/installs
            using it.
          </p>
          <ul className="space-y-5">
            {licenses.map((license) => {
              const meta = PRODUCTS[license.product_slug]
              const acts = activationsByLicense[license.id] || []
              const activeActs = acts.filter((a) => a.status === 'active')
              const seatsLabel =
                license.max_seats >= 9999 ? 'Unlimited sites' : `${activeActs.length} of ${license.max_seats} sites`
              return (
                <li
                  key={license.id}
                  className="border-t border-[var(--border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div>
                      <div className="font-semibold text-sm">
                        {meta?.name || license.product_slug}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        Issued {fmtDate(license.created_at)} · {seatsLabel}
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-emerald-400">
                      {license.status}
                    </span>
                  </div>
                  <LicenseKeyCopy licenseKey={license.key} />
                  {activeActs.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {activeActs.map((a) => (
                        <li
                          key={a.id}
                          className="flex items-center gap-2 text-xs text-[var(--text-muted)]"
                        >
                          <Monitor className="w-3 h-3 shrink-0" />
                          <span className="truncate flex-1">
                            {a.site_url || a.fingerprint || 'Activated install'}
                          </span>
                          <span className="shrink-0">
                            since {fmtDate(a.activated_at)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

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
