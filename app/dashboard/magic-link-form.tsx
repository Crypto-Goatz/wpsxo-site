'use client'

import { useState } from 'react'

export default function MagicLinkForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } finally {
      setLoading(false)
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div>
        <p className="text-sm">
          If we have a record of <strong>{email}</strong>, you&apos;ll get a
          sign-in link in a minute. Check your inbox (and spam folder).
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-sm text-[var(--text-muted)] underline mt-3"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm font-semibold">
        Purchase email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full mt-1 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />
      </label>
      <button
        type="submit"
        disabled={loading || !email}
        className="btn-primary w-full justify-center"
      >
        {loading ? 'Sending…' : 'Email me a sign-in link'}
      </button>
    </form>
  )
}
