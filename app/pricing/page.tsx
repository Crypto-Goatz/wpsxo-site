import {
  Check,
  X,
  Flame,
  ArrowRight,
  Wallet,
  Infinity as InfinityIcon,
  ShieldCheck,
} from 'lucide-react'

interface CompetitorRow {
  feature: string
  wpsxo: string | boolean
  yoast: string | boolean
  rankmath: string | boolean
  surfer: string | boolean
}

const SEO_COMPARISON: CompetitorRow[] = [
  { feature: 'Pricing model', wpsxo: 'Lifetime $97 once', yoast: '$99/yr forever', rankmath: '$79/yr forever', surfer: '$89/mo' },
  { feature: '10-year cost', wpsxo: '$97', yoast: '$990', rankmath: '$790', surfer: '$10,680' },
  { feature: 'AI search visibility scoring', wpsxo: true, yoast: false, rankmath: false, surfer: 'Limited' },
  { feature: 'BLUF detection', wpsxo: true, yoast: false, rankmath: false, surfer: false },
  { feature: 'Auto FAQ + HowTo + Article schema', wpsxo: true, yoast: 'Manual', rankmath: 'Partial', surfer: false },
  { feature: 'Auto-generate llms.txt', wpsxo: true, yoast: false, rankmath: false, surfer: false },
  { feature: 'AI-bot rules in robots.txt', wpsxo: true, yoast: false, rankmath: false, surfer: false },
  { feature: 'Information Gain scoring', wpsxo: true, yoast: false, rankmath: false, surfer: 'Workspace tier' },
  { feature: 'CRO9 conversion tracking embed', wpsxo: true, yoast: false, rankmath: false, surfer: false },
  { feature: 'REST API for AI agents', wpsxo: true, yoast: false, rankmath: 'Partial', surfer: 'Partial' },
  { feature: 'Future updates', wpsxo: 'Lifetime, free', yoast: 'Subscription', rankmath: 'Subscription', surfer: 'Subscription' },
]

interface FigmaRow {
  feature: string
  onpress: string | boolean
  pinegrow: string | boolean
  bricks: string | boolean
  webflow: string | boolean
}

interface DrRow {
  feature: string
  dr: string | boolean
  clickcease: string | boolean
  cheq: string | boolean
  lunio: string | boolean
}

const DR_COMPARISON: DrRow[] = [
  { feature: 'Pricing', dr: '$8/domain/mo', clickcease: '$79–189/mo', cheq: 'Enterprise only', lunio: '$49–299/mo' },
  { feature: '12-month cost (1 domain)', dr: '$96', clickcease: '$948–2,268', cheq: 'Custom', lunio: '$588–3,588' },
  { feature: 'Behavioral grading (30+ signals)', dr: true, clickcease: 'Click-only', cheq: 'Enterprise', lunio: 'Limited' },
  { feature: 'Letter grades (A+ → F)', dr: true, clickcease: false, cheq: 'Custom', lunio: false },
  { feature: 'Google Ads conversion API feedback', dr: true, clickcease: true, cheq: true, lunio: true },
  { feature: 'Meta Conversions API feedback', dr: true, clickcease: false, cheq: true, lunio: true },
  { feature: 'LinkedIn Offline Conversions API', dr: true, clickcease: false, cheq: 'Enterprise', lunio: false },
  { feature: 'TikTok Events API feedback', dr: true, clickcease: false, cheq: 'Enterprise', lunio: false },
  { feature: 'Works on GHL / LeadConnector sites', dr: true, clickcease: false, cheq: false, lunio: false },
  { feature: 'WordPress plugin', dr: true, clickcease: true, cheq: false, lunio: false },
  { feature: 'Unlimited traffic', dr: true, clickcease: 'Tiered', cheq: 'Tiered', lunio: 'Tiered' },
  { feature: 'Privacy-first (no cookies, no PII)', dr: true, clickcease: 'Cookies', cheq: 'Cookies', lunio: 'Cookies' },
]

const FIGMA_COMPARISON: FigmaRow[] = [
  { feature: 'Pricing model', onpress: 'Lifetime $147 once', pinegrow: '$199/yr forever', bricks: '$99/yr (or $299 lifetime, no Figma input)', webflow: '$23/mo + dev cost' },
  { feature: '10-year cost', onpress: '$147', pinegrow: '$1,990', bricks: '$990 / $299', webflow: '$2,760' },
  { feature: 'Figma file as input', onpress: true, pinegrow: 'Manual import', bricks: false, webflow: false },
  { feature: 'Outputs real WordPress theme', onpress: true, pinegrow: true, bricks: 'Builder lock-in', webflow: 'Static export' },
  { feature: 'Block patterns from Figma components', onpress: true, pinegrow: false, bricks: false, webflow: false },
  { feature: 'theme.json for block themes', onpress: true, pinegrow: 'Limited', bricks: false, webflow: false },
  { feature: 'WooCommerce-aware templates', onpress: 'Studio tier', pinegrow: 'Manual', bricks: 'Manual', webflow: 'Plugin needed' },
  { feature: 'Auto Google Fonts import', onpress: true, pinegrow: 'Manual', bricks: 'Manual', webflow: 'Auto' },
  { feature: 'White-label client deliverable', onpress: 'Studio tier', pinegrow: false, bricks: false, webflow: false },
  { feature: 'Future updates', onpress: 'Lifetime, free', pinegrow: 'Subscription', bricks: 'Subscription / Lifetime', webflow: 'Subscription' },
]

function CellValue({ v }: { v: string | boolean }) {
  if (v === true) {
    return <Check className="w-5 h-5 text-[var(--accent)] mx-auto" />
  }
  if (v === false) {
    return <X className="w-4 h-4 text-[var(--text-muted)] mx-auto" />
  }
  return <span className="text-sm">{v}</span>
}

export default function PricingPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-20">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="text-center mb-14">
        <span className="badge badge-warn mb-4">
          <Flame className="w-3 h-3" /> Founder Pricing
        </span>
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Pay once. Update forever.
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
          Side-by-side comparison vs the subscriptions you'd otherwise rent every
          year. Pick the lifetime path while founder seats are still open.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { label: 'WP-SXO Solo', value: '$97', sub: 'lifetime' },
            { label: 'OnPress Solo', value: '$147', sub: 'lifetime' },
            { label: 'D&R', value: '$8/mo', sub: 'per domain · 30-day trial' },
            { label: 'Bundle', value: '$397', sub: 'both lifetime plugins', highlight: true },
          ].map((p, i) => (
            <div
              key={i}
              className={`card ${p.highlight ? 'border-[var(--warn)] bg-[var(--warn-glow)]' : ''}`}
            >
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                {p.label}
              </p>
              <p
                className={`text-2xl font-black mt-1 ${p.highlight ? 'text-[var(--warn)]' : 'text-[var(--text-primary)]'}`}
              >
                {p.value}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {p.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEO comparison ────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-[var(--accent)]" />
              WP-SXO vs the SEO incumbents
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Optimizes for how search actually works in 2026 — not 2018.
            </p>
          </div>
          <a href="/products/wpsxo#pricing" className="btn-primary">
            Get WP-SXO
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-3 text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs">
                  Feature
                </th>
                <th className="py-3 px-3 text-center text-[var(--accent)] font-extrabold">
                  WP-SXO
                </th>
                <th className="py-3 px-3 text-center text-[var(--text-muted)] font-bold">
                  Yoast Premium
                </th>
                <th className="py-3 px-3 text-center text-[var(--text-muted)] font-bold">
                  Rank Math Pro
                </th>
                <th className="py-3 px-3 text-center text-[var(--text-muted)] font-bold">
                  SurferSEO
                </th>
              </tr>
            </thead>
            <tbody>
              {SEO_COMPARISON.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="py-3 px-3 text-[var(--text-primary)] font-semibold">
                    {row.feature}
                  </td>
                  <td className="py-3 px-3 text-center bg-[var(--accent-glow)] text-[var(--text-primary)] font-semibold">
                    <CellValue v={row.wpsxo} />
                  </td>
                  <td className="py-3 px-3 text-center text-[var(--text-secondary)]">
                    <CellValue v={row.yoast} />
                  </td>
                  <td className="py-3 px-3 text-center text-[var(--text-secondary)]">
                    <CellValue v={row.rankmath} />
                  </td>
                  <td className="py-3 px-3 text-center text-[var(--text-secondary)]">
                    <CellValue v={row.surfer} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Figma comparison ──────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-[var(--secondary)]" />
              OnPress vs Figma → WP alternatives
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              The first one that actually takes a Figma file and outputs a real WP theme.
            </p>
          </div>
          <a href="/products/onpress#pricing" className="btn-purple">
            Get OnPress
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-3 text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs">
                  Feature
                </th>
                <th className="py-3 px-3 text-center text-[var(--secondary)] font-extrabold">
                  OnPress
                </th>
                <th className="py-3 px-3 text-center text-[var(--text-muted)] font-bold">
                  Pinegrow
                </th>
                <th className="py-3 px-3 text-center text-[var(--text-muted)] font-bold">
                  Bricks Builder
                </th>
                <th className="py-3 px-3 text-center text-[var(--text-muted)] font-bold">
                  Webflow → WP
                </th>
              </tr>
            </thead>
            <tbody>
              {FIGMA_COMPARISON.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="py-3 px-3 text-[var(--text-primary)] font-semibold">
                    {row.feature}
                  </td>
                  <td className="py-3 px-3 text-center bg-[var(--secondary-glow)] text-[var(--text-primary)] font-semibold">
                    <CellValue v={row.onpress} />
                  </td>
                  <td className="py-3 px-3 text-center text-[var(--text-secondary)]">
                    <CellValue v={row.pinegrow} />
                  </td>
                  <td className="py-3 px-3 text-center text-[var(--text-secondary)]">
                    <CellValue v={row.bricks} />
                  </td>
                  <td className="py-3 px-3 text-center text-[var(--text-secondary)]">
                    <CellValue v={row.webflow} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── D&R comparison ────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[var(--tertiary)]" />
              Detect & Refine vs the click-fraud incumbents
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              10–25× cheaper. Grades every click on a quality spectrum, not just fraud.
            </p>
          </div>
          <a
            href="/products/detect-and-refine#pricing"
            className="btn-primary"
          >
            Try D&R free for 30 days
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-3 text-[var(--text-muted)] font-bold uppercase tracking-wider text-xs">
                  Feature
                </th>
                <th className="py-3 px-3 text-center text-[var(--tertiary)] font-extrabold">
                  Detect & Refine
                </th>
                <th className="py-3 px-3 text-center text-[var(--text-muted)] font-bold">
                  ClickCease
                </th>
                <th className="py-3 px-3 text-center text-[var(--text-muted)] font-bold">
                  CHEQ
                </th>
                <th className="py-3 px-3 text-center text-[var(--text-muted)] font-bold">
                  Lunio
                </th>
              </tr>
            </thead>
            <tbody>
              {DR_COMPARISON.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="py-3 px-3 text-[var(--text-primary)] font-semibold">
                    {row.feature}
                  </td>
                  <td className="py-3 px-3 text-center bg-[var(--tertiary-glow)] text-[var(--text-primary)] font-semibold">
                    <CellValue v={row.dr} />
                  </td>
                  <td className="py-3 px-3 text-center text-[var(--text-secondary)]">
                    <CellValue v={row.clickcease} />
                  </td>
                  <td className="py-3 px-3 text-center text-[var(--text-secondary)]">
                    <CellValue v={row.cheq} />
                  </td>
                  <td className="py-3 px-3 text-center text-[var(--text-secondary)]">
                    <CellValue v={row.lunio} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Why lifetime ──────────────────────────────────── */}
      <section className="card text-center py-10 mb-12">
        <InfinityIcon className="w-12 h-12 mx-auto text-[var(--accent)] mb-4" />
        <h2 className="text-2xl font-bold mb-3">
          Why lifetime — and why now
        </h2>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-2">
          Subscriptions exist because they make spreadsheets predictable. They
          don't make products better. We charge once because we trust our roadmap.
        </p>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
          Founder pricing exists for one reason — we want feedback from real
          builders. Once the seats fill, retail kicks in and the founder tier
          doesn't return. No fake countdown. Just real seats.
        </p>
        <a href="/#founder-pricing" className="btn-warn">
          Lock in founder pricing
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  )
}
