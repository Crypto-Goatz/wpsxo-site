import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WP-SXO — WordPress Plugins by RocketOpp",
  description: "Premium WordPress plugins powered by AI. OnPress: Figma to WordPress converter. WP-SXO: Search Experience Optimization. Download free or upgrade for full access.",
  openGraph: {
    title: "WP-SXO — WordPress Plugins by RocketOpp",
    description: "Premium WordPress plugins powered by AI.",
    url: "https://wpsxo.com",
    siteName: "WP-SXO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)', fontWeight: 800, fontSize: 18 }}>
            <span style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, #7ed957, #5cb83a)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 13, color: '#0A0E17',
            }}>0n</span>
            WP-SXO
          </a>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 14 }}>
            <a href="/products/onpress" style={{ color: 'var(--text-secondary)' }}>OnPress</a>
            <a href="/products/wpsxo" style={{ color: 'var(--text-secondary)' }}>WP-SXO</a>
            <a href="/login" style={{ color: 'var(--text-secondary)' }}>Login</a>
            <a href="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Get Started</a>
          </div>
        </nav>
        <main>{children}</main>
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '40px 24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 13,
          marginTop: 80,
        }}>
          <p>&copy; 2026 RocketOpp LLC. All rights reserved.</p>
          <p style={{ marginTop: 8 }}>
            <a href="https://0nmcp.com" style={{ color: 'var(--text-muted)' }}>0nMCP</a>
            {' · '}
            <a href="https://rocketopp.com" style={{ color: 'var(--text-muted)' }}>RocketOpp</a>
            {' · '}
            <a href="mailto:support@0nmcp.com" style={{ color: 'var(--text-muted)' }}>Support</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
