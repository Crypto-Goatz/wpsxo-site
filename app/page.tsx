import { PRODUCTS } from '@/lib/products';

export default function Home() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 0 60px' }}>
        <span className="badge badge-green" style={{ marginBottom: 16, display: 'inline-block' }}>WordPress Plugins by RocketOpp</span>
        <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
          AI-Powered WordPress Plugins<br />
          <span style={{ color: 'var(--accent)' }}>That Actually Work</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Premium plugins built on the 0nMCP orchestration engine. Design to code. Content that ranks. Tools that convert.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <a href="#products" className="btn-primary">Browse Plugins</a>
          <a href="https://0nmcp.com" className="btn-secondary">Learn About 0nMCP</a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '0 0 60px' }}>
        {[
          { label: 'Tools', value: '819+' },
          { label: 'Services', value: '54' },
          { label: 'First Ever', value: 'Figma→WP' },
          { label: 'SXO Score', value: '100pt' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Products */}
      <section id="products" style={{ padding: '0 0 80px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32, textAlign: 'center' }}>Plugins</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {PRODUCTS.map(product => (
            <a href={`/products/${product.slug}`} key={product.slug} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontSize: 40 }}>{product.icon}</span>
                <span className={`badge ${product.badgeClass}`}>{product.badge}</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{product.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600, marginBottom: 12 }}>{product.tagline}</p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                {product.description.slice(0, 150)}...
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.prices.map(p => (
                  <span key={p.id} className={`badge ${p.amount === 0 ? 'badge-free' : 'badge-green'}`}>
                    {p.amount === 0 ? 'Free' : `$${p.amount}/yr`}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card" style={{ textAlign: 'center', padding: '48px', marginBottom: 80, background: 'linear-gradient(135deg, rgba(126,217,87,0.05), rgba(0,212,255,0.05))' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Powered by 0nMCP</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
          Every plugin connects to the 0nMCP orchestration engine. 819+ tools. 54 services. One intelligent layer.
        </p>
        <a href="https://0nmcp.com" className="btn-primary">Explore 0nMCP</a>
      </section>
    </div>
  );
}
