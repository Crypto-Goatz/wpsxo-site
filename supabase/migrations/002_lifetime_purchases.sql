-- One-time purchases of lifetime-licensed products (WP-SXO, OnPress, Bundle).
-- Subscription products (Detect & Refine) live in trial_accounts via the
-- existing customer.subscription.created handler.

create table if not exists lifetime_purchases (
  id                       uuid primary key default gen_random_uuid(),
  stripe_session_id        text unique not null,
  stripe_customer_id       text,
  stripe_payment_intent_id text,
  email                    text,
  name                     text,
  product_slug             text not null,
  price_id                 text not null,
  amount_total_cents       integer not null default 0,
  currency                 text not null default 'usd',
  status                   text not null default 'paid', -- paid | refunded | disputed
  /** Stripe checkout session metadata blob — useful for tracking source/UTMs */
  metadata                 jsonb,
  /** License key issued to the buyer (set by post-purchase fulfillment job). */
  license_key              text,
  /** GitHub release ZIP URL last delivered to the customer. */
  download_url             text,
  refunded_at              timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists lifetime_purchases_email_idx
  on lifetime_purchases (email);
create index if not exists lifetime_purchases_product_idx
  on lifetime_purchases (product_slug);
create index if not exists lifetime_purchases_status_idx
  on lifetime_purchases (status);

-- Service role only — no public access. Customers see purchases via the
-- /dashboard authenticated route which scopes by email.
alter table lifetime_purchases enable row level security;
create policy "service_role_full_access" on lifetime_purchases
  for all using (auth.role() = 'service_role');
