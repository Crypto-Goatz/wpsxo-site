/**
 * /dashboard/store — addon marketplace, internal-only.
 *
 * Mike's rule: addons are sold only inside the dashboard. No external
 * Stripe Payment Links, no DM-me-for-access. This page is the only door.
 *
 * Renders the PRODUCTS catalog from lib/products.ts as cards. Each card
 * checks the user's profile_addons to show "Owned" if already granted,
 * else routes to the existing /api/checkout?price=…&product=… flow.
 */

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getProfileByEmail, listAddons } from '@/lib/credits'
import { PRODUCTS, BUNDLE } from '@/lib/products'
import { Check, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function StorePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-extrabold mb-3">Sign in to shop</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          The store is for signed-in members only. All purchases land in your
          account automatically.
        </p>
        <Link href="/login" className="btn-primary inline-flex">
          Sign in
        </Link>
      </div>
    )
  }

  const profile = await getProfileByEmail(user.email)
  const addons = profile ? await listAddons(profile.id) : []
  const ownedSlugs = new Set(
    addons.filter((a) => a.status === 'active').map((a) => a.addon_slug),
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        href="/dashboard"
        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <ShoppingBag className="w-6 h-6 text-[var(--accent)]" />
        <h1 className="text-3xl font-extrabold">Store</h1>
      </div>
      <p className="text-[var(--text-secondary)] mb-8">
        Every addon you can use with your account. Pro and Studio members get
        all of these free — sign in there first if you want everything bundled.
      </p>

      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {PRODUCTS.map((p) => {
          const owned = ownedSlugs.has(p.slug)
          const cheapest = [...p.prices].sort((a, b) => a.amount - b.amount)[0]
          const monthly = p.prices.find((pr) => pr.interval === 'month')
          return (
            <div key={p.slug} className="card flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold text-lg">{p.name}</h2>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    {p.tagline}
                  </p>
                </div>
                {owned ? (
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-emerald-400 font-bold">
                    <Check className="w-4 h-4" /> Owned
                  </span>
                ) : (
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[var(--accent)] font-bold">
                    {cheapest ? `from $${cheapest.amount}` : ''}
                    {monthly ? '/mo' : cheapest ? ' lifetime' : ''}
                  </span>
                )}
              </div>

              <ul className="text-sm text-[var(--text-muted)] space-y-1">
                {p.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-1 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-2 mt-auto">
                {owned ? (
                  <Link
                    href={`/dashboard?product=${p.slug}`}
                    className="btn-secondary inline-flex items-center gap-1.5"
                  >
                    Open in dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  p.prices.map((pr) => (
                    <Link
                      key={pr.id}
                      href={`/api/checkout?price=${pr.id}&product=${p.slug}`}
                      className="btn-secondary inline-flex items-center gap-1.5"
                    >
                      ${pr.amount}
                      {pr.interval ? `/${pr.interval}` : ' lifetime'}
                    </Link>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card border-[var(--accent)]/40">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <h2 className="text-xl font-bold">{BUNDLE.name}</h2>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {BUNDLE.tagline}
            </p>
          </div>
          <span className="text-xs uppercase tracking-wider text-[var(--accent)] font-bold">
            ${BUNDLE.amount} lifetime
            <span className="line-through ml-2 text-[var(--text-muted)]">
              ${BUNDLE.compareAt}
            </span>
          </span>
        </div>
        <ul className="text-sm text-[var(--text-muted)] space-y-1 mb-4">
          {BUNDLE.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-1 text-emerald-400 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link
          href={`/api/checkout?price=${BUNDLE.priceId}&product=${BUNDLE.slug}`}
          className="btn-primary inline-flex items-center gap-2"
        >
          Buy bundle <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
