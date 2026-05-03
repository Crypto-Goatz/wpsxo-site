import {
  Search,
  Palette,
  Check,
  Zap,
  Infinity as InfinityIcon,
  ArrowRight,
  Skull,
  Wallet,
  Code2,
  Shield,
  Sparkles,
  Flame,
} from 'lucide-react'
import { PRODUCTS, BUNDLE } from '@/lib/products'

const ICON_MAP: Record<string, typeof Search> = {
  Search,
  Palette,
}

function accentClass(accent: string, kind: 'text' | 'bg' | 'badge') {
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
  return ''
}

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto px-6">
      {/* ── Founder Hero ───────────────────────────────────── */}
      <section className="text-center pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--warn)]/40 bg-[var(--warn-glow)] text-[var(--warn)] text-xs font-bold tracking-widest uppercase mb-6">
          <Flame className="w-3.5 h-3.5" />
          Founder Pricing — Limited Seats
        </div>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 max-w-3xl mx-auto">
          WordPress for the era where{' '}
          <span className="bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
            search learned to talk
          </span>
          .
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
          Two plugins for the new playbook. <strong className="text-[var(--text-primary)]">WP-SXO</strong>{' '}
          scores your content for AI search visibility.{' '}
          <strong className="text-[var(--text-primary)]">OnPress</strong> turns your
          Figma file into a real WordPress theme. Lifetime licenses. Lifetime updates.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-3">
          <a href="#founder-pricing" className="btn-warn">
            Get the Founder Deal
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="/seo-is-dead" className="btn-secondary">
            Read: SEO is Dead
          </a>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          One-time payment · Direct download · 14-day refund · No subscriptions, ever.
        </p>
      </section>

      {/* ── Trust strip ───────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-14">
        {[
          { Icon: InfinityIcon, label: 'Lifetime updates', sub: 'Pay once, update forever' },
          { Icon: Shield, label: '14-day refund', sub: 'No questions asked' },
          { Icon: Code2, label: 'Real source code', sub: 'No black boxes' },
          { Icon: Sparkles, label: 'Built on 0nMCP', sub: '1,640+ tools live' },
        ].map((t, i) => (
          <div key={i} className="card flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-glow)] flex items-center justify-center shrink-0">
              <t.Icon className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {t.label}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {t.sub}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ── The two plugins ───────────────────────────────── */}
      <section id="products" className="pb-14">
        <h2 className="text-3xl font-bold mb-3 text-center">The two plugins</h2>
        <p className="text-[var(--text-secondary)] text-center mb-10 max-w-xl mx-auto">
          Each does one job, ships real code, and never expires.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {PRODUCTS.map((product) => {
            const Icon = ICON_MAP[product.icon] || Search
            const popular =
              product.prices.find((p) => p.highlight) || product.prices[0]
            return (
              <a
                href={`/products/${product.slug}`}
                key={product.slug}
                className="card flex flex-col text-inherit"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`grid-feature-icon ${product.accent === 'teal' ? 'teal' : product.accent === 'purple' ? 'purple' : 'green'}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`badge ${accentClass(product.accent, 'badge')}`}>
                    {product.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold mb-1">{product.name}</h3>
                <p
                  className={`text-sm font-semibold mb-3 ${accentClass(product.accent, 'text')}`}
                >
                  {product.tagline}
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 flex-1">
                  {product.description.split('.')[0] + '.'}
                </p>
                <ul className="space-y-1.5 mb-5">
                  {product.hero_bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[var(--text-primary)]"
                    >
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${accentClass(product.accent, 'text')}`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
                      Founder pricing from
                    </p>
                    <p className="text-2xl font-extrabold text-[var(--text-primary)]">
                      ${product.prices[0].amount}{' '}
                      {product.prices[0].compareAt && (
                        <span className="text-sm font-normal text-[var(--text-muted)] line-through">
                          ${product.prices[0].compareAt}
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 font-bold ${accentClass(product.accent, 'text')}`}
                  >
                    See plans
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
                {popular?.founderSeats && (
                  <p className="text-[11px] text-[var(--warn)] uppercase tracking-widest mt-3 font-bold">
                    <Flame className="w-3 h-3 inline mr-1" />
                    {popular.founderSeats} {popular.label} seats left
                  </p>
                )}
              </a>
            )
          })}
        </div>
      </section>

      {/* ── Founder pricing — full plans ──────────────────── */}
      <section id="founder-pricing" className="pb-14">
        <div className="text-center mb-10">
          <span className="badge badge-warn mb-3">Founder Deal</span>
          <h2 className="text-3xl font-bold mb-3">
            One-time pricing. Forever updates.
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Pick a plugin. Or grab the bundle. After the founder seats sell out, we
            move to retail and the door closes.
          </p>
        </div>

        {/* Bundle hero */}
        <div className="card mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[var(--warn)] blur-3xl opacity-20" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <span className="badge badge-warn mb-2">
                <Flame className="w-3 h-3" /> Best Value
              </span>
              <h3 className="text-2xl font-extrabold mb-1">{BUNDLE.name}</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-3">
                {BUNDLE.tagline}
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                {BUNDLE.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-[var(--text-primary)]"
                  >
                    <Check className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center md:text-right shrink-0">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
                Founder bundle
              </p>
              <p className="text-4xl font-black text-[var(--text-primary)]">
                ${BUNDLE.amount}
              </p>
              <p className="text-sm text-[var(--text-muted)] line-through mb-3">
                ${BUNDLE.compareAt} retail
              </p>
              <a href="/products/wpsxo#pricing" className="btn-warn">
                Grab the bundle
              </a>
              <p className="text-[11px] text-[var(--warn)] uppercase tracking-widest mt-3 font-bold">
                <Flame className="w-3 h-3 inline mr-1" />
                {BUNDLE.founderSeats} bundle seats left
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {PRODUCTS.map((product) => (
            <div key={product.slug} className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <span
                  className={`badge ${accentClass(product.accent, 'badge')}`}
                >
                  {product.badge}
                </span>
              </div>
              <p
                className={`text-xs font-semibold mb-4 ${accentClass(product.accent, 'text')}`}
              >
                {product.tagline}
              </p>
              <div className="space-y-3">
                {product.prices.map((p) => (
                  <div
                    key={p.id}
                    className={`rounded-xl border p-4 ${
                      p.highlight
                        ? `border-[var(--accent)] bg-[var(--accent-glow)]`
                        : 'border-[var(--border)]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="font-bold text-[var(--text-primary)]">
                        {p.label}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {p.interval ? `per ${p.interval}` : 'one-time'}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                        ${p.amount}
                      </span>
                      {p.compareAt && (
                        <span className="text-sm text-[var(--text-muted)] line-through">
                          ${p.compareAt}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1 mb-3">
                      {p.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]"
                        >
                          <Check className="w-3 h-3 shrink-0 mt-0.5 text-[var(--accent)]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {p.founderSeats && (
                      <p className="text-[10px] text-[var(--warn)] uppercase tracking-widest font-bold mb-2">
                        {p.founderSeats} seats left
                      </p>
                    )}
                    <a
                      href={`/products/${product.slug}#pricing`}
                      className={
                        p.highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'
                      }
                    >
                      Choose {p.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison teaser ─────────────────────────────── */}
      <section className="pb-14">
        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-glow)] to-[var(--secondary-glow)] opacity-50 pointer-events-none" />
          <div className="relative grid md:grid-cols-[2fr_1fr] gap-6 items-center">
            <div>
              <span className="badge badge-teal mb-3">
                <Wallet className="w-3 h-3" /> Compare Lifetime vs Subscription
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Yoast Premium will charge you{' '}
                <span className="text-[var(--warn)]">$990</span> over 10 years.
              </h2>
              <p className="text-[var(--text-secondary)] mb-5">
                We charge you $97 once. Side-by-side breakdown vs Yoast, Rank Math,
                SurferSEO, Pinegrow, Bricks, and Webflow → WP.
              </p>
              <a href="/pricing" className="btn-primary">
                See the full comparison
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="card-inner text-center">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
                10-year cost
              </p>
              <div className="grid grid-cols-2 gap-3 mt-3 text-left">
                <div>
                  <p className="text-[10px] uppercase text-[var(--text-muted)]">
                    Yoast Premium
                  </p>
                  <p className="text-2xl font-extrabold text-[var(--warn)]">
                    $990
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-[var(--text-muted)]">
                    WP-SXO
                  </p>
                  <p className="text-2xl font-extrabold text-[var(--accent)]">
                    $97
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles row ──────────────────────────────────── */}
      <section className="pb-20">
        <div className="grid md:grid-cols-2 gap-5">
          <a
            href="/seo-is-dead"
            className="card group flex flex-col text-inherit"
          >
            <div className="grid-feature-icon warn">
              <Skull className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--warn)] transition-colors">
              SEO is Dead. Here's What Replaced It.
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1">
              Why keyword-stuffing stopped working in 2024, why AI search rewrote
              the rules, and the 8 dimensions that decide whether ChatGPT cites
              you tomorrow.
            </p>
            <span className="text-sm font-bold text-[var(--warn)] flex items-center gap-1">
              Read the article
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
          <a
            href="/how-to-sell-figma-wordpress-themes"
            className="card group flex flex-col text-inherit"
          >
            <div className="grid-feature-icon purple">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--secondary)] transition-colors">
              How to Sell Figma WordPress Themes
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1">
              The exact playbook: design once in Figma, generate the theme, sell
              it 10 times. Pricing tiers, marketplaces that actually pay, the
              client handoff that doesn't bleed your margin.
            </p>
            <span className="text-sm font-bold text-[var(--secondary)] flex items-center gap-1">
              Read the article
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </section>
    </div>
  )
}
