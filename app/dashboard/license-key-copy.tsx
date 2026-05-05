'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function LicenseKeyCopy({ licenseKey }: { licenseKey: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(licenseKey).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50 transition-colors text-left group"
      aria-label="Copy license key to clipboard"
    >
      <code className="font-mono text-sm tracking-wider text-[var(--text-primary)] truncate">
        {licenseKey}
      </code>
      <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 shrink-0">
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy
          </>
        )}
      </span>
    </button>
  )
}
