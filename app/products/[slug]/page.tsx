import { getProduct, PRODUCTS } from '@/lib/products'
import { notFound } from 'next/navigation'
import {
  Search,
  Palette,
  ShieldCheck,
  Check,
  Flame,
  ArrowRight,
  Infinity as InfinityIcon,
  Shield,
  Code2,
  HelpCircle,
} from 'lucide-react'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

const ICON_MAP: Record<string, typeof Search> = { Search, Palette, ShieldCheck }

function accentClass(accent: string, kind: 'text' | 'badge' | 'gridIcon') {
  if (kind === 'text') {
    if (accent === 'teal') return 'text-[var(--accent)]'
    if (accent === 'purple') return 'text-[var(--secondary)]'
    if (accent === 'green') return 'text-[var(--tertiary)]'
    return 'text-[var(--warn)]'
  }
  if (kind === 'badge') {
    if (accent === 'teal') return 'badge-teal'
    if (accent === 'purple') return 'badge-purple'
    if (accent === 'green') return 'badge-green'
    return 'badge-warn'
  }
  if (accent === 'teal') return 'teal'
  if (accent === 'purple') return 'purple'
  if (accent === 'green') return 'green'
  return 'warn'
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const Icon = ICON_MAP[product.icon] || Search

  return (
    <div className="max-w-[1100px] mx-auto px-6 pt-12 pb-20">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="grid md:grid-cols-[auto_1fr] gap-6 items-start mb-12">
        <div
          className={`grid-feature-icon ${accentClass(product.accent, 'gridIcon')} w-16 h-16`}
        >
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <span className={`badge ${accentClass(product.accent, 'badge')} mb-3`}>
            <Flame className="w-3 h-3" /> {product.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3">{product.name}</h1>
          <p
            className={`text-lg font-semibold mb-4 ${accentClass(product.accent, 'text')}`}
          >
            {product.tagline}
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-6">
            {product.description}
          </p>
          <ul className="space-y-2 mb-6">
            {product.hero_bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-[var(--text-primary)]">
                <Check
                  className={`w-5 h-5 shrink-0 mt-0.5 ${accentClass(product.accent, 'text')}`}
                />
                {b}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <a href="#pricing" className="btn-warn">
              Founder pricing
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/pricing" className="btn-secondary">
              Compare vs {product.comparison_alt.split(' / ')[0]}
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust strip ────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-14">
        {[
          { Icon: InfinityIcon, label: 'Lifetime updates' },
          { Icon: Shield, label: '14-day refund' },
          { Icon: Code2, label: 'Real source code' },
        ].map((t, i) => (
          <div
            key={i}
            className="card flex items-center gap-3 py-3 px-4"
          >
            <t.Icon className={`w-5 h-5 ${accentClass(product.accent, 'text')}`} />
            <span className="text-sm font-bold">{t.label}</span>
          </div>
        ))}
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">
          Founder pricing — pay once.
        </h2>
        <p className="text-[var(--text-secondary)] text-center mb-10 max-w-xl mx-auto">
          Limited founder seats. Once they're gone, retail pricing kicks in and
          the founder tier doesn't return.
        </p>
        <div
          className={`grid gap-5 ${
            product.prices.length === 3
              ? 'md:grid-cols-3'
              : product.prices.length === 2
                ? 'md:grid-cols-2 max-w-3xl mx-auto'
                : 'max-w-md mx-auto'
          }`}
        >
          {product.prices.map((p) => (
            <div
              key={p.id}
              className={`card relative flex flex-col ${
                p.highlight
                  ? 'border-[var(--accent)] shadow-[0_0_40px_var(--accent-glow)]'
                  : ''
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--accent)] text-[#0c1220] text-xs font-extrabold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold mb-2">
                {p.label}
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-[var(--text-primary)]">
                  ${p.amount}
                </span>
                {p.compareAt && (
                  <span className="text-base text-[var(--text-muted)] line-through">
                    ${p.compareAt}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-4">
                {p.interval ? `per ${p.interval}` : 'one-time · lifetime'}
              </p>
              <ul className="space-y-1.5 mb-6 flex-1">
                {p.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${accentClass(product.accent, 'text')}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              {p.founderSeats !== undefined && (
                <p className="text-[11px] text-[var(--warn)] uppercase tracking-widest font-bold mb-3">
                  <Flame className="w-3 h-3 inline mr-1" />
                  {p.founderSeats} seats left
                </p>
              )}
              <a
                href={`/api/checkout?price=${p.id}&product=${product.slug}`}
                className={
                  p.highlight
                    ? 'btn-primary justify-center'
                    : 'btn-secondary justify-center'
                }
              >
                Get {p.label}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ──────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          What's in {product.name}
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {product.features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)]"
            >
              <Check
                className={`w-5 h-5 shrink-0 mt-0.5 ${accentClass(product.accent, 'text')}`}
              />
              <span className="text-sm text-[var(--text-primary)]">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
          <HelpCircle className="w-7 h-7 text-[var(--accent)]" />
          Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {product.faqs.map((f, i) => (
            <details
              key={i}
              className="card group cursor-pointer"
            >
              <summary className="flex items-center justify-between font-bold text-[var(--text-primary)]">
                {f.q}
                <span className="text-[var(--accent)] group-open:rotate-45 transition-transform text-2xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="card text-center py-10 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card-inner)]">
        <h2 className="text-2xl font-bold mb-3">
          Ready to ship?
        </h2>
        <p className="text-[var(--text-secondary)] mb-5 max-w-md mx-auto">
          Founder pricing closes when the seats fill. Lifetime license.
          Lifetime updates. No subscription.
        </p>
        <a href="#pricing" className="btn-warn">
          Lock in founder pricing
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  )
}
