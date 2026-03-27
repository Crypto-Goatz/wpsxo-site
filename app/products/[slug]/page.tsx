import { getProduct, PRODUCTS } from '@/lib/products';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 48 }}>{product.icon}</span>
        <div>
          <span className={`badge ${product.badgeClass}`} style={{ marginBottom: 4, display: 'inline-block' }}>{product.badge}</span>
          <h1 style={{ fontSize: 36, fontWeight: 900 }}>{product.name}</h1>
        </div>
      </div>
      <p style={{ fontSize: 16, color: 'var(--accent)', fontWeight: 600, marginBottom: 16 }}>{product.tagline}</p>
      <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 700 }}>
        {product.description}
      </p>

      {/* Pricing Cards */}
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Choose Your Plan</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${product.prices.length}, 1fr)`, gap: 20, marginBottom: 48 }}>
        {product.prices.map((price, i) => (
          <div key={price.id} className="card" style={{
            border: i === product.prices.length - 1 ? '2px solid var(--accent)' : undefined,
            position: 'relative',
          }}>
            {i === product.prices.length - 1 && (
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--accent)', color: '#0A0E17', padding: '4px 16px',
                borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
              }}>Best Value</div>
            )}
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {price.label}
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 4 }}>
              {price.amount === 0 ? 'Free' : `$${price.amount}`}
            </div>
            {price.interval && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>per {price.interval}</div>}
            {!price.interval && price.amount === 0 && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>forever</div>}
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
              {price.features.map(f => (
                <li key={f} style={{ fontSize: 14, color: 'var(--text-secondary)', padding: '6px 0', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>+</span> {f}
                </li>
              ))}
            </ul>
            {price.amount === 0 ? (
              <a href={`/api/downloads/free?product=${product.slug}`} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Download Free
              </a>
            ) : (
              <a href={`/api/checkout?price=${price.id}&product=${product.slug}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Get {price.label}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Features */}
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Features</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 48 }}>
        {product.features.map(f => (
          <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 0' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>+</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
