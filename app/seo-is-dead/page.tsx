import { Skull, ArrowRight, Quote, Search } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO is Dead. Here\'s What Replaced It. — WP-SXO',
  description:
    'Why keyword-stuffing SEO stopped working in 2024, why AI search rewrote the rules, and the 8 dimensions that decide whether ChatGPT cites you tomorrow.',
  openGraph: {
    title: 'SEO is Dead. Here\'s What Replaced It.',
    description:
      'Why keyword-stuffing SEO stopped working, and the 8 dimensions of Search Experience Optimization that replaced it.',
    type: 'article',
  },
}

export default function SeoIsDeadPage() {
  return (
    <article className="max-w-[1200px] mx-auto px-6 pt-12 pb-20">
      {/* ── Hero ───────────────────────────────────────────── */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="grid-feature-icon warn w-14 h-14 mx-auto">
          <Skull className="w-7 h-7" />
        </div>
        <span className="badge badge-warn mb-4">Manifesto</span>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
          SEO is dead.{' '}
          <span className="text-[var(--warn)]">Here's what replaced it.</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          Keyword-stuffing stopped working in 2024. AI search rewrote the rules.
          Below: the 8 dimensions that decide whether ChatGPT, Perplexity, and
          Google's AI Overviews cite you tomorrow — and the WordPress plugin
          that scores you on every one of them.
        </p>
      </header>

      <div className="prose-article">
        <h2>The rules changed when search learned to talk</h2>
        <p>
          Here's the trick nobody is announcing on LinkedIn: <strong>users
          stopped clicking on results.</strong> They started getting answers.
        </p>
        <p>
          ChatGPT, Perplexity, Claude, Gemini, Google's AI Overviews — they
          read the SERP, synthesize an answer, cite a few sources, and the
          user never visits your page. If they do visit, it's because the AI
          quoted you specifically. <strong>Citation is the new click.</strong>
        </p>
        <blockquote>
          The job of your content is no longer to <em>rank</em>. It's to be
          <em> cited</em>. Different objective, different optimization.
        </blockquote>

        <h2>What stopped working</h2>
        <ul>
          <li>
            <strong>Keyword density.</strong> AI search doesn't care if "best
            CRM for small business" appears 14 times. It cares if your answer
            is structurally extractable.
          </li>
          <li>
            <strong>Backlink farms.</strong> Generative engines weight authority
            differently — citation patterns inside training data, schema
            consistency, and content that survives summarization.
          </li>
          <li>
            <strong>Long intros.</strong> If your point doesn't appear in the
            first 200 characters, the model summarizes the page above you and
            never reaches your point.
          </li>
          <li>
            <strong>Generic blog posts.</strong> AI search is biased toward
            content with novel claims, original data, or clearly stated
            opinions. Bland summaries get folded into the consensus and lose
            citation share.
          </li>
        </ul>

        <h2>What replaced SEO: the 8 SXO dimensions</h2>
        <p>
          Search Experience Optimization (SXO) is what you do when the consumer
          is the model, not the human. WP-SXO scores every page against these
          eight:
        </p>

        <h3>1. BLUF — Bottom Line Up Front</h3>
        <p>
          Does the answer appear in the first 300 characters? If not, the
          model paraphrases the intro and discards the rest. We score this
          dimension by extracting your H1 + the first paragraph and measuring
          whether it directly answers the implied question of the page.
        </p>

        <h3>2. Information Gain</h3>
        <p>
          Compared to the top 10 SERP results, what does your page say that's
          new? AI search engines explicitly reward novelty. Re-treading
          consensus = filed under "general knowledge" = no citation.
        </p>

        <h3>3. Schema completeness</h3>
        <p>
          Article + FAQPage + HowTo + Person + Organization JSON-LD. Models use
          structured data as a structural map of the page. Pages with proper
          schema get cited at <strong>3–5x the rate</strong> of pages without.
        </p>

        <h3>4. AI-bot accessibility</h3>
        <p>
          Are GPTBot, ChatGPT-User, Claude-Web, Perplexity-Bot, Anthropic-AI,
          and the rest allowed in your robots.txt? Most WordPress sites
          accidentally block them. WP-SXO patches this on activation.
        </p>

        <h3>5. <code>llms.txt</code></h3>
        <p>
          The new convention for "here's how AI should read my site." Like
          robots.txt for the LLM era. WP-SXO generates and maintains it for
          you, with permalinks to your most-cite-worthy pages.
        </p>

        <h3>6. Answer-shape headings</h3>
        <p>
          Question-format H2s ("How does WP-SXO score pages?") get extracted as
          QA pairs at far higher rates than statement headings ("WP-SXO scoring
          methodology"). Both communicate the same thing — but only one is
          model-friendly.
        </p>

        <h3>7. Citation density</h3>
        <p>
          Internal links to authoritative sources, named experts, and dated
          stats. Models extract these as supporting facts. Pages without them
          read as opinion; pages with them read as research.
        </p>

        <h3>8. Conversion structure</h3>
        <p>
          Once the human <em>does</em> click through, your page has to convert.
          We tie SXO scoring to the CRO9 conversion engine — 147 behavioral
          metrics on every visitor — so you can see whether your AI-citation
          traffic actually turns into customers.
        </p>

        <h2>"But Yoast already does this"</h2>
        <p>
          Yoast is a brilliant tool for the rules of 2018. It counts focus
          keywords. It checks meta length. It nags you about Flesch score.
          Useful, still! But none of those signals correlate with AI citation
          rate.
        </p>
        <p>
          Rank Math has the same DNA. SurferSEO is closer — its content
          editor at least talks about NLP terms and content structure — but
          it's a $89/month subscription that lives outside WordPress.
        </p>
        <p>
          WP-SXO is purpose-built for the model-as-consumer world,
          installs as a real WP plugin, runs on a one-time license, and
          updates as the rules keep shifting.
        </p>

        <h2>What WP-SXO does, specifically</h2>
        <ul>
          <li>
            <strong>Scans every page</strong> against the 8 dimensions on
            demand or on save.
          </li>
          <li>
            <strong>Surfaces the lowest-scoring fixes first</strong> with
            inline copy suggestions.
          </li>
          <li>
            <strong>Auto-injects schema</strong> on chosen post types — FAQ,
            HowTo, Article, with sane defaults you can override.
          </li>
          <li>
            <strong>Generates <code>llms.txt</code></strong> and updates it as
            your top pages change.
          </li>
          <li>
            <strong>Adds AI-bot allow rules</strong> to your robots.txt.
          </li>
          <li>
            <strong>Flags BLUF gaps</strong> with "your first 300 chars don't
            answer the title's question — here's a suggested rewrite."
          </li>
          <li>
            <strong>Compares your page to the SERP</strong> and tells you what
            unique angle you could add.
          </li>
        </ul>

        <h2>The honest pitch</h2>
        <p>
          The next 18 months are going to filter sites into two buckets.
          Sites that get cited by AI search engines, and sites that don't.
          The plugins built for keyword-density optimization aren't going to
          help with that filter — they're optimizing for an exam that already
          ended.
        </p>
        <p>
          WP-SXO is the new exam. Lifetime license, $97 for the first 100
          founders, $297 retail after that. Updates are free, forever.
        </p>
      </div>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="card text-center py-10 mt-14 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-3">
          Stop optimizing for 2018. Score for 2026.
        </h2>
        <p className="text-[var(--text-secondary)] mb-5 max-w-md mx-auto">
          WP-SXO Solo is $97 lifetime. 14-day refund. No subscriptions.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/products/wpsxo#pricing" className="btn-primary">
            Get WP-SXO
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="/pricing" className="btn-secondary">
            <Search className="w-4 h-4" />
            Compare vs Yoast / Rank Math
          </a>
        </div>
      </section>
    </article>
  )
}
