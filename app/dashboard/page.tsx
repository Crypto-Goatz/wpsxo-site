export default function Dashboard() {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Your downloads and account.</p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Downloads</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Purchased plugins will appear here. Download links are valid for the duration of your subscription.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>CRM Account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Paid plans include a CRM account with AI-powered workflows. Your account is automatically provisioned when you subscribe.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Subscription</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
          Manage your subscription, update payment method, or upgrade.
        </p>
        <a href="/api/billing/portal" className="btn-secondary">Manage Billing</a>
      </div>
    </div>
  );
}
