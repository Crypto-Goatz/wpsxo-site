import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import { Download, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PurchaseRow {
  id: string
  email: string
  name: string | null
  product_slug: string
  amount_total_cents: number
  currency: string
  status: string
  created_at: string
}

const PRODUCTS: Record<
  string,
  { name: string; downloadUrl: string; postPurchaseHelpUrl?: string }
> = {
  wpsxo: {
    name: 'WP-SXO',
    downloadUrl:
      'https://github.com/Crypto-Goatz/wpsxo-plugin/releases/latest/download/wpsxo.zip',
    postPurchaseHelpUrl: '/products/wpsxo',
  },
  onpress: {
    name: 'OnPress — Figma → WordPress',
    downloadUrl:
      'https://github.com/Crypto-Goatz/onpress/releases/latest/download/onpress.zip',
    postPurchaseHelpUrl: '/products/onpress',
  },
  'detect-and-refine': {
    name: 'Detect & Refine',
    downloadUrl:
      'https://github.com/Crypto-Goatz/detect-and-refine-wp/releases/latest/download/detect-and-refine.zip',
    postPurchaseHelpUrl: '/products/detect-and-refine',
  },
  'founder-bundle': {
    name: 'Founder Bundle',
    downloadUrl: '',
    postPurchaseHelpUrl: '/pricing',
  },
}

async function getPurchase(sessionId: string): Promise<PurchaseRow | null> {
  const { data } = await supabaseAdmin
    .from('lifetime_purchases')
    .select(
      'id, email, name, product_slug, amount_total_cents, currency, status, created_at',
    )
    .eq('stripe_session_id', sessionId)
    .maybeSingle()
  return (data as PurchaseRow | null) || null
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; product?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id
  const productHint = params.product

  let purchase: PurchaseRow | null = null
  if (sessionId) {
    purchase = await getPurchase(sessionId)
  }

  const productKey = (purchase?.product_slug || productHint || '').toLowerCase()
  const productMeta = PRODUCTS[productKey]

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-2">
        {purchase ? "You're in." : 'Dashboard'}
      </h1>
      <p className="text-[var(--text-secondary)] mb-8">
        {purchase
          ? 'Your purchase is confirmed. Download the plugin below — and keep the email Stripe just sent you for your records.'
          : 'Your downloads and account.'}
      </p>

      {purchase && productMeta && (
        <section className="card mb-6">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold mb-1">{productMeta.name}</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Lifetime license for <strong>{purchase.email}</strong>. License
                never expires. Updates included.
              </p>
            </div>
          </div>

          {productMeta.downloadUrl ? (
            <a
              href={productMeta.downloadUrl}
              className="btn-primary inline-flex items-center gap-2"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4" />
              Download {productMeta.name} (.zip)
            </a>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Bundle purchase — both plugins are linked to your email. We just
              sent you the download links by email.
            </p>
          )}

          {productMeta.postPurchaseHelpUrl && (
            <p className="text-sm text-[var(--text-muted)] mt-4">
              Need help installing?{' '}
              <Link
                href={productMeta.postPurchaseHelpUrl}
                className="underline"
              >
                Setup guide on the product page →
              </Link>
            </p>
          )}
        </section>
      )}

      {sessionId && !purchase && (
        <section className="card mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-amber-300 shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold mb-1">Almost ready…</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Stripe just confirmed your checkout. Our system is finishing
                provisioning — usually under 10 seconds. Refresh this page in a
                moment, or check the email Stripe sent you for the download
                link.
              </p>
            </div>
          </div>
        </section>
      )}

      {!sessionId && (
        <section className="card mb-6">
          <h2 className="text-lg font-bold mb-2">Your downloads</h2>
          <p className="text-sm text-[var(--text-muted)] mb-3">
            Purchased plugins appear here. If you bought via Stripe, the
            confirmation email also has your download link — that one is
            permanent.
          </p>
          <Link href="/pricing" className="text-sm underline">
            Browse founder pricing →
          </Link>
        </section>
      )}

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-2">Subscription &amp; billing</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Manage payment method, view invoices, or cancel any time.
        </p>
        <Link
          href="/api/billing/portal"
          className="btn-secondary inline-flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Manage billing
        </Link>
      </section>

      <section className="card">
        <h2 className="text-lg font-bold mb-2">CRM account</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Paid plans on WP-SXO Agency / Studio and OnPress Studio include a CRM
          login. Your account is provisioned automatically — check your email
          for the activation link.
        </p>
      </section>
    </div>
  )
}
