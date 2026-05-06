import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WP-SXO — WordPress for the AI-Search Era',
  description:
    'Founder pricing on WP-SXO and OnPress. Search Experience Optimization for WordPress + the first Figma → WordPress converter that ships real themes. Lifetime licenses. Lifetime updates.',
  openGraph: {
    title: 'WP-SXO — WordPress for the AI-Search Era',
    description:
      'Founder pricing. Lifetime licenses. WP-SXO + OnPress — built for how search actually works in 2026.',
    url: 'https://wpsxo.com',
    siteName: 'WP-SXO',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur sticky top-0 z-40">
          <div className="max-w-[1200px] mx-auto px-6 py-3 flex justify-between items-center">
            <a href="/" className="flex items-center gap-2 group">
              <img
                src="/brand/wpsxo-logo.png"
                alt="WP-SXO"
                className="h-8 w-auto"
              />
            </a>
            <div className="flex gap-1 md:gap-5 items-center text-sm">
              <a
                href="/products/wpsxo"
                className="hidden md:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                WP-SXO
              </a>
              <a
                href="/products/figgypress"
                className="hidden md:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                FiggyPress
              </a>
              <a
                href="/products/onpress-wp"
                className="hidden md:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                OnPress
              </a>
              <a
                href="/products/detect-and-refine"
                className="hidden md:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                D&amp;R
              </a>
              <a
                href="/pricing"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Pricing
              </a>
              <a
                href="/seo-is-dead"
                className="hidden md:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                SEO is Dead
              </a>
              <a
                href="/login"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Login
              </a>
              <a href="#founder-pricing" className="btn-warn">
                Founder Deal
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] mt-20">
          <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-3">
                Plugins
              </h4>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>
                  <a
                    href="/products/wpsxo"
                    className="hover:text-[var(--text-primary)]"
                  >
                    WP-SXO
                  </a>
                </li>
                <li>
                  <a
                    href="/products/figgypress"
                    className="hover:text-[var(--text-primary)]"
                  >
                    FiggyPress (Figma → WP)
                  </a>
                </li>
                <li>
                  <a
                    href="/products/onpress-wp"
                    className="hover:text-[var(--text-primary)]"
                  >
                    OnPress (0n for WordPress)
                  </a>
                </li>
                <li>
                  <a
                    href="/products/detect-and-refine"
                    className="hover:text-[var(--text-primary)]"
                  >
                    Detect &amp; Refine
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-[var(--text-primary)]"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-3">
                Read
              </h4>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>
                  <a
                    href="/seo-is-dead"
                    className="hover:text-[var(--text-primary)]"
                  >
                    SEO is Dead
                  </a>
                </li>
                <li>
                  <a
                    href="/how-to-sell-figma-wordpress-themes"
                    className="hover:text-[var(--text-primary)]"
                  >
                    Sell Figma WP Themes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-3">
                Company
              </h4>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>
                  <a
                    href="https://rocketopp.com"
                    className="hover:text-[var(--text-primary)]"
                  >
                    RocketOpp
                  </a>
                </li>
                <li>
                  <a
                    href="https://0nmcp.com"
                    className="hover:text-[var(--text-primary)]"
                  >
                    0nMCP
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@0nmcp.com"
                    className="hover:text-[var(--text-primary)]"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-3">
                Legal
              </h4>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>
                  <a
                    href="/terms"
                    className="hover:text-[var(--text-primary)]"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-[var(--text-primary)]"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--border)] py-5 text-center text-xs text-[var(--text-muted)]">
            <p>
              © 2026 RocketOpp LLC. WP-SXO and OnPress are trademarks of
              RocketOpp LLC.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
