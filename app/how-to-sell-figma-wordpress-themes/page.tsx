import { Palette, ArrowRight, DollarSign, Layers, Quote } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Sell Figma WordPress Themes — A Complete Playbook',
  description:
    'The exact playbook for designers: design once in Figma, generate the theme with OnPress, sell it 10 times. Pricing tiers, marketplaces that actually pay, and the client handoff that doesn\'t bleed your margin.',
  openGraph: {
    title: 'How to Sell Figma WordPress Themes',
    description:
      'Design once. Generate. Sell 10 times. The playbook for designers turning Figma files into WordPress themes that pay rent.',
    type: 'article',
  },
}

export default function HowToSellPage() {
  return (
    <article className="max-w-[1200px] mx-auto px-6 pt-12 pb-20">
      {/* ── Hero ───────────────────────────────────────────── */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="grid-feature-icon purple w-14 h-14 mx-auto">
          <Palette className="w-7 h-7" />
        </div>
        <span className="badge badge-purple mb-4">Playbook</span>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
          Design once.{' '}
          <span className="text-[var(--secondary)]">Sell ten times.</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          The complete playbook for designers turning Figma files into
          WordPress themes that pay rent. Pricing tiers, marketplaces that
          actually pay, the client handoff that doesn't eat your margin, and
          the tool that compresses 30 hours of dev work into 30 seconds.
        </p>
      </header>

      <div className="prose-article">
        <h2>Why this is suddenly viable</h2>
        <p>
          For ten years, "Figma → WordPress theme" required a developer.
          You'd hand off the design, wait two weeks, get back a theme that
          half-matched the file, and then spend another week getting it
          shippable. Margin: gone.
        </p>
        <p>
          That changed in 2026. <strong>OnPress</strong> takes a Figma file
          URL and generates a real WordPress theme — style.css, functions.php,
          theme.json, full template hierarchy, custom blocks built from your
          components — in 30–90 seconds. You stay in design. The theme ships.
          The dev cost goes to zero.
        </p>
        <blockquote>
          The economics changed overnight. The designers who notice this
          first will own a category that didn't exist last year.
        </blockquote>

        <h2>The 5-step playbook</h2>

        <h3>Step 1: Pick a niche</h3>
        <p>
          Generic "agency theme" doesn't sell. Specific verticals do. Some of
          the best-performing 2026 niches:
        </p>
        <ul>
          <li>Med spas and aesthetics clinics</li>
          <li>Real estate teams (single-broker, not brokerages)</li>
          <li>SaaS landing pages (specifically: AI products needing trust signals)</li>
          <li>Local trade businesses (HVAC, plumbing, roofing)</li>
          <li>Coaches and course creators with existing audiences</li>
        </ul>
        <p>
          Pick one you know or have a designer friend in. The first sale is
          easier when you understand the customer's actual job.
        </p>

        <h3>Step 2: Design in Figma — once</h3>
        <p>
          Build a complete design system: color tokens, type styles, spacing
          scale, button variants, card patterns. Then design the templates:
          home, about, services, contact, blog index, blog post, single
          product (if WooCommerce). Use Figma component sets aggressively —
          OnPress turns each set into a Gutenberg block automatically, so
          variants in Figma become block style options in WordPress.
        </p>
        <p>
          <strong>Tip:</strong> Name your Figma styles like brand tokens —
          <code>color/primary</code>, <code>color/primary-dim</code>,
          <code>type/heading-xl</code>. OnPress reads them as design tokens
          and writes them into <code>theme.json</code>, which means the
          customizer in WordPress shows them with sensible names.
        </p>

        <h3>Step 3: Generate the theme</h3>
        <p>
          Paste the Figma file URL + a personal access token into OnPress,
          name the theme, hit generate. 60 seconds later you have:
        </p>
        <ul>
          <li><strong>The theme</strong> — full block theme with theme.json, style.css, every template</li>
          <li><strong>The plugin</strong> — Gutenberg blocks built from your Figma components</li>
          <li><strong>Block patterns</strong> — pre-built page layouts derived from your Figma frames</li>
          <li><strong>Customizer hooks</strong> — color + typography controls live-wired to your tokens</li>
          <li><strong>Auto Google Fonts import</strong> based on your Figma typography</li>
        </ul>
        <p>
          Drop the ZIP into a clean WordPress install. Tweak whatever needs
          tweaking. You're 90% done — the part where you would've waited for a
          dev for two weeks.
        </p>

        <h3>Step 4: Price it like a designer, not a dev</h3>
        <p>
          The market has trained itself to expect $59 themes from
          ThemeForest. Don't compete there — you'll race to the bottom and
          they'll race you to it.
        </p>
        <p>
          Tier the pricing based on who's buying:
        </p>
        <ul>
          <li>
            <strong>$197 — Solo License</strong>. Single site, includes 1 hour
            of customization help. Targets: solopreneurs who'd otherwise pay a
            dev $1,500. You're saving them money.
          </li>
          <li>
            <strong>$497 — Studio License</strong>. Up to 5 client sites.
            Targets: designers who want to flip the theme to their clients.
            You're letting them resell margin.
          </li>
          <li>
            <strong>$1,497 — Agency License</strong>. Unlimited client sites,
            white-label, 30-day onboarding support. Targets: agencies running
            10+ small business sites a year. You're giving them a profit
            multiplier.
          </li>
        </ul>
        <p>
          One theme. Three tiers. Average revenue per theme: $400–600 depending
          on traffic mix. Five themes a year = real income.
        </p>

        <h3>Step 5: Distribution that actually pays</h3>
        <p>
          Most marketplaces extract 30–50% commission and bury you in their
          algorithm. The ones worth your time:
        </p>
        <ul>
          <li>
            <strong>Direct on your own site.</strong> Stripe checkout, license
            key issuance, GitHub release for the ZIP. 0% commission. This
            should be your default.
          </li>
          <li>
            <strong>Lemon Squeezy / Gumroad.</strong> 5–10% all-in. Simple
            licensing built in. Good as a second channel for traffic you don't
            already own.
          </li>
          <li>
            <strong>Creative Market.</strong> 30–60% commission depending on
            tier, but their audience already buys themes. Worth listing one
            theme there as a top-of-funnel.
          </li>
          <li>
            <strong>ThemeForest.</strong> Avoid for a flagship product. Race to
            the bottom. List a stripped-down "starter" version max if you want
            the SEO juice.
          </li>
        </ul>
        <p>
          The leverage is on your own site. Build a small portfolio page,
          write the playbook (literally — write a "How I built this for
          [niche]" article per theme), and let it compound.
        </p>

        <h2>The client handoff that doesn't bleed margin</h2>
        <p>
          The worst part of selling themes used to be support. Customers ask
          things like "how do I change the hero image" five times per theme.
          Some thoughts:
        </p>
        <ul>
          <li>
            <strong>Loom every step.</strong> Record a 60-second walkthrough
            for the 10 most common changes. Link them in a "First-time setup"
            page that auto-loads when the theme activates.
          </li>
          <li>
            <strong>Use the customizer for what's customizable.</strong>
            OnPress wires your design tokens into Customizer fields. If
            customers can change colors and fonts there without touching CSS,
            your support load drops 70%.
          </li>
          <li>
            <strong>Ship a placeholder content kit.</strong> Demo data
            included so they don't see a blank theme on activation. This alone
            cuts "how do I make it look like the demo" tickets in half.
          </li>
          <li>
            <strong>Tier-gated support.</strong> Solo = 1 email response,
            Studio = 30 days, Agency = 90 days + Slack channel. Higher tier =
            higher willingness to pay = lower support sensitivity.
          </li>
        </ul>

        <h2>Why founder pricing on OnPress matters</h2>
        <p>
          OnPress Founder Solo is $147 lifetime — for unlimited theme
          generation. Founder Studio at $497 includes white-label rights,
          which is the unlock for actually selling client themes.
        </p>
        <p>
          Math: one Studio license sale at $497 covers OnPress forever.
          Two sales = pure margin from there on out.
        </p>
        <p>
          When founder seats fill, retail is $397 / $1,497. Same product,
          higher entry cost. <strong>Get in while the seats are open.</strong>
        </p>
      </div>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="card text-center py-10 mt-14 max-w-3xl mx-auto">
        <Layers className="w-12 h-12 mx-auto text-[var(--secondary)] mb-3" />
        <h2 className="text-2xl font-bold mb-3">
          The first theme is the hardest. Make it the easy one.
        </h2>
        <p className="text-[var(--text-secondary)] mb-5 max-w-md mx-auto">
          OnPress Founder Solo is $147 lifetime. Studio at $497 unlocks
          white-label client deliverables. Either way — pay once.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/products/onpress#pricing" className="btn-purple">
            Get OnPress
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="/pricing" className="btn-secondary">
            <DollarSign className="w-4 h-4" />
            Compare vs Pinegrow / Bricks
          </a>
        </div>
      </section>
    </article>
  )
}
