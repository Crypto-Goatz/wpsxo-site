/**
 * /products/onpress-wp — OnPress umbrella plugin landing page.
 *
 * The Pro/Studio platform play. Distinct from FiggyPress (Figma → WP
 * design pipeline). OnPress is the full 0n suite living inside wp-admin:
 * JaxxAI sidebar, MCP tool palette, automation builder, the works.
 *
 * Status: pre-release. This page collects waitlist signups via the same
 * checkout flow with metadata.product_type='preorder'.
 */

import Link from 'next/link'
import { Sparkles, Zap, Brain, Workflow, ArrowRight, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'OnPress — The 0n Plugin for WordPress',
  description:
    'The full 0n AI suite, inside wp-admin. JaxxAI sidebar, MCP tool palette, automation builder, agent runtime. The platform play. Coming soon — founder list open.',
}

export default function OnPressUmbrellaPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
          Coming soon · founder list open
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">OnPress</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          The 0n plugin for WordPress. The full AI suite — every tool, every
          agent, every flow — native to wp-admin.
        </p>
      </div>

      <div className="card mb-8">
        <h2 className="text-lg font-bold mb-4">What it is</h2>
        <p className="text-[var(--text-secondary)] mb-3">
          0nWP gave WordPress AI content generation. WP-SXO added scoring.
          OnPress is the umbrella — the entire 0n platform living inside
          wp-admin, every tool tied to your existing site, every action gated
          by your 0n_ token.
        </p>
        <p className="text-[var(--text-secondary)]">
          Built for the operator who runs their entire business on WordPress
          and wants the AI engine that runs the rest of it to live in the same
          dashboard.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card">
          <Brain className="w-6 h-6 text-[var(--accent)] mb-3" />
          <h3 className="font-bold mb-2">JaxxAI sidebar</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Always-on AI co-pilot. Score content, generate articles, fact-check
            claims, qualify leads — without ever leaving wp-admin.
          </p>
        </div>
        <div className="card">
          <Zap className="w-6 h-6 text-[var(--accent)] mb-3" />
          <h3 className="font-bold mb-2">MCP tool palette</h3>
          <p className="text-sm text-[var(--text-muted)]">
            All 1,640+ tools from the 0nMCP catalog accessible from inside
            WordPress. Send Slack messages, create CRM contacts, post to social,
            run any AI orchestration — all from your editor.
          </p>
        </div>
        <div className="card">
          <Workflow className="w-6 h-6 text-[var(--accent)] mb-3" />
          <h3 className="font-bold mb-2">Automation builder</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Build .0n workflows visually. Trigger on WP events (post published,
            comment posted, form submitted) → fan out to any tool in the
            ecosystem.
          </p>
        </div>
        <div className="card">
          <ShieldCheck className="w-6 h-6 text-[var(--accent)] mb-3" />
          <h3 className="font-bold mb-2">Agent runtime</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Per-site AI agent with three knowledge layers (RocketOpp / location /
            site). Trained on your content, branded to your voice, shipped with
            your site.
          </p>
        </div>
      </div>

      <div className="card border-[var(--accent)]/40 mb-8">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          Founder list — early-bird pricing locked
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          The first 100 founders pay <strong className="text-[var(--text-primary)]">$497 lifetime</strong>{' '}
          (retail will be $1,497). Includes everything in the umbrella,
          unlimited sites, white-label rights for agencies, priority support, all
          future updates forever.
        </p>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Studio-tier subscribers on wpsxo.com get OnPress included free when
          it ships.
        </p>
        <Link
          href="/signup?next=/dashboard&product=onpress-wp"
          className="btn-primary inline-flex items-center gap-2"
        >
          Reserve a founder seat <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-xs text-[var(--text-muted)] mt-3">
          Sign up for a free wpsxo.com account → automatically reserved on the
          OnPress founder list. No charge until it ships and you confirm.
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold mb-3">Not the same as FiggyPress</h2>
        <p className="text-sm text-[var(--text-muted)] mb-3">
          <Link href="/products/figgypress" className="underline">
            FiggyPress
          </Link>{' '}
          is the Figma → WordPress design pipeline — extracts tokens, generates
          a real WordPress theme + Gutenberg blocks from your Figma file. One
          job, done well.
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          OnPress is the platform — JaxxAI, MCP, automations, agents, all
          inside wp-admin. Different product, different pricing.
        </p>
      </div>
    </div>
  )
}
