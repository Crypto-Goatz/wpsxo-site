/**
 * Universal license helpers — used by every wpsxo product, every WP plugin,
 * every Chrome extension that ships under the 0n umbrella.
 *
 * The license is just a row in `public.licenses`. Activations track each
 * site/install/seat that's currently using the key. Seat enforcement is
 * a soft signal — the policy decision lives in the API endpoint, not here.
 */

import { supabaseAdmin } from '@/lib/supabase'

export interface License {
  id: string
  key: string
  email: string
  product_slug: string
  purchase_id: string | null
  source: string
  status: 'active' | 'revoked' | 'expired' | 'pending'
  max_seats: number
  expires_at: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  last_checked_at: string | null
}

export interface LicenseActivation {
  id: string
  license_id: string
  site_url: string | null
  fingerprint: string | null
  user_agent: string | null
  status: 'active' | 'deactivated'
  activated_at: string
  last_seen_at: string
  deactivated_at: string | null
}

const PRODUCT_PREFIX: Record<string, string> = {
  wpsxo: 'WPSXO',
  '0nwp': 'WPSXO',
  onpress: 'ONPRS',
  figgypress: 'FIGGY',
  'detect-and-refine': 'DRREF',
  'founder-bundle': 'BNDLE',
}

const PRODUCT_SEATS: Record<string, number> = {
  // Pull this from the actual Stripe price tier when we wire it. Default = 1
  // (Solo). Agency tiers override via metadata at the line-item level — see
  // `seatsForPrice()` in the webhook.
  wpsxo: 1,
  '0nwp': 1,
  onpress: 1,
  figgypress: 1,
  'detect-and-refine': 1,
  'founder-bundle': 25,
}

export function seatsForPrice(priceId: string): number {
  // Founder Agency / Studio override Solo defaults.
  // Solo = 1, Agency = 25, Studio = unlimited (we represent as 9999).
  if (priceId === 'price_1TT5C0LENnHWT4tVDGYzxMDg') return 25 // WP-SXO Agency
  if (priceId === 'price_1TT5C1LENnHWT4tVUmIbpvHF') return 9999 // WP-SXO Studio
  if (priceId === 'price_1TT5C2LENnHWT4tVZnia9dkj') return 5 // FiggyPress Studio (5 designers)
  if (priceId === 'price_1TT5C3LENnHWT4tVmQdo40sC') return 25 // Founder Bundle
  return 1
}

export async function generateLicenseKey(productSlug: string): Promise<string> {
  const prefix = PRODUCT_PREFIX[productSlug] || 'KEY'
  const { data, error } = await supabaseAdmin.rpc('generate_license_key', { prefix })
  if (error) throw new Error(`generate_license_key: ${error.message}`)
  return data as string
}

export async function createLicenseForPurchase(args: {
  email: string
  productSlug: string
  purchaseId: string
  priceId: string
  metadata?: Record<string, unknown>
}): Promise<License> {
  const key = await generateLicenseKey(args.productSlug)
  const max_seats = seatsForPrice(args.priceId)

  const { data, error } = await supabaseAdmin
    .from('licenses')
    .insert({
      key,
      email: args.email,
      product_slug: args.productSlug,
      purchase_id: args.purchaseId,
      source: 'stripe',
      status: 'active',
      max_seats,
      metadata: args.metadata ?? {},
    })
    .select('*')
    .single()

  if (error) throw new Error(`create license: ${error.message}`)
  return data as License
}

export async function findLicenseByKey(key: string): Promise<License | null> {
  const { data } = await supabaseAdmin
    .from('licenses')
    .select('*')
    .eq('key', key.trim())
    .maybeSingle()
  return (data as License | null) || null
}

export async function findLicensesByEmail(email: string): Promise<License[]> {
  const { data } = await supabaseAdmin
    .from('licenses')
    .select('*')
    .ilike('email', email)
    .order('created_at', { ascending: false })
  return (data as License[]) || []
}

export async function countActiveActivations(licenseId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('license_activations')
    .select('*', { count: 'exact', head: true })
    .eq('license_id', licenseId)
    .eq('status', 'active')
  return count ?? 0
}

export async function listActivations(licenseId: string): Promise<LicenseActivation[]> {
  const { data } = await supabaseAdmin
    .from('license_activations')
    .select('*')
    .eq('license_id', licenseId)
    .order('activated_at', { ascending: false })
  return (data as LicenseActivation[]) || []
}

export async function activateLicense(args: {
  license: License
  siteUrl?: string | null
  fingerprint: string
  userAgent?: string | null
  ip?: string | null
}): Promise<{ ok: boolean; reason?: string; activation?: LicenseActivation }> {
  if (args.license.status !== 'active') {
    return { ok: false, reason: `license_${args.license.status}` }
  }

  // Idempotent: if a row for this fingerprint exists, refresh and return it.
  const { data: existing } = await supabaseAdmin
    .from('license_activations')
    .select('*')
    .eq('license_id', args.license.id)
    .eq('fingerprint', args.fingerprint)
    .maybeSingle()

  if (existing) {
    const { data: updated } = await supabaseAdmin
      .from('license_activations')
      .update({
        status: 'active',
        site_url: args.siteUrl ?? (existing as LicenseActivation).site_url,
        user_agent: args.userAgent ?? (existing as LicenseActivation).user_agent,
        last_seen_at: new Date().toISOString(),
        deactivated_at: null,
      })
      .eq('id', (existing as LicenseActivation).id)
      .select('*')
      .single()
    return { ok: true, activation: updated as LicenseActivation }
  }

  // Net-new activation — enforce seat cap.
  const used = await countActiveActivations(args.license.id)
  if (used >= args.license.max_seats) {
    return { ok: false, reason: 'seat_cap_reached' }
  }

  const { data: created, error } = await supabaseAdmin
    .from('license_activations')
    .insert({
      license_id: args.license.id,
      site_url: args.siteUrl ?? null,
      fingerprint: args.fingerprint,
      user_agent: args.userAgent ?? null,
      ip: args.ip ?? null,
      status: 'active',
    })
    .select('*')
    .single()

  if (error) {
    return { ok: false, reason: error.message }
  }
  return { ok: true, activation: created as LicenseActivation }
}

export async function deactivateLicense(
  licenseId: string,
  fingerprint: string,
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('license_activations')
    .update({
      status: 'deactivated',
      deactivated_at: new Date().toISOString(),
    })
    .eq('license_id', licenseId)
    .eq('fingerprint', fingerprint)
  return !error
}

export async function touchLicenseChecked(licenseId: string) {
  await supabaseAdmin
    .from('licenses')
    .update({ last_checked_at: new Date().toISOString() })
    .eq('id', licenseId)
}

export function obfuscateKey(key: string): string {
  // Show first prefix + last 4 — used in admin UI when key shouldn't be
  // copy-pasteable from logs.
  const parts = key.split('-')
  if (parts.length < 2) return key
  return `${parts[0]}-…-${parts[parts.length - 1]}`
}
