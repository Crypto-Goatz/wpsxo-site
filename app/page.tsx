import { PRODUCTS } from '@/lib/products';

export default function Home() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 0 60px' }}>
        <span className="badge badge-teal" style={{ marginBottom: 16, display: 'inline-block' }}>WordPress Plugins by RocketOpp</span>
        <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
          WordPress Plugins<br />
          <span style={{ background: 'linear-gradient(135deg, #2dd4bf, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Powered by AI</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Design to code. Content that ranks. Tools that convert. Built on the 0nMCP orchestration engine.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <a href="#products" className="btn-primary">Browse Plugins</a>
          <a href="https://0nmcp.com" className="btn-secondary">Learn About 0nMCP</a>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '0 0 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { num: '1', label: 'Download', desc: 'Get the free or pro version of any plugin. Install on your WordPress site in seconds.', color: 'teal', icon: '↓' },
            { num: '2', label: 'Connect', desc: 'Link to the 0nMCP engine. 819+ tools and 54 services power your WordPress from behind the scenes.', color: 'purple', icon: '⚡' },
            { num: '3', label: 'Automate', desc: 'AI handles the heavy lifting. Content scoring, design conversion, workflow automation — all running.', color: 'green', icon: '◎' },
          ].map(step => (
            <div key={step.num} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div className={`step-number step-${step.color}`}>{step.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>{step.label}</h3>
              </div>
              <div className="card-inner" style={{ textAlign: 'center', padding: '28px 20px', marginBottom: 16 }}>
                <span style={{ fontSize: 36 }} className={`icon-glow-${step.color}`}>{step.icon}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '0 0 60px' }}>
        {[
          { label: 'MCP Tools', value: '819+', color: 'var(--accent)' },
          { label: 'Services', value: '54', color: 'var(--secondary)' },
          { label: 'First Ever', value: 'Figma→WP', color: 'var(--tertiary)' },
          { label: 'SXO Scoring', value: '100pt', color: 'var(--accent)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Products */}
      <section id="products" style={{ padding: '0 0 80px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32, textAlign: 'center' }}>Plugins</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {PRODUCTS.map((product, i) => (
            <a href={`/products/${product.slug}`} key={product.slug} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontSize: 40 }}>{product.icon}</span>
                <span className={`badge ${i === 0 ? 'badge-teal' : 'badge-purple'}`}>{product.badge}</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{product.name}</h3>
              <p style={{ fontSize: 14, color: i === 0 ? 'var(--accent)' : 'var(--secondary)', fontWeight: 600, marginBottom: 12 }}>{product.tagline}</p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                {product.description.slice(0, 150)}...
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.prices.map(p => (
                  <span key={p.id} className={`badge ${p.amount === 0 ? 'badge-free' : i === 0 ? 'badge-teal' : 'badge-purple'}`}>
                    {p.amount === 0 ? 'Free' : `$${p.amount}/yr`}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card" style={{
        textAlign: 'center',
        padding: '48px',
        marginBottom: 80,
        background: 'linear-gradient(135deg, rgba(45,212,191,0.04), rgba(139,92,246,0.04))',
        border: '1px solid var(--border-glow)',
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Powered by <span style={{ color: 'var(--accent)' }}>0nMCP</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
          Every plugin connects to the 0nMCP orchestration engine. 819+ tools. 54 services. One intelligent layer.
        </p>
        <a href="https://0nmcp.com" className="btn-primary">Explore 0nMCP</a>
      </section>
    </div>
  );
}
