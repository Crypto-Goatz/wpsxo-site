-- Trial accounts for CRM auto-provisioning
-- Used by wpsxo.com, 0nmcp.com, and marketplace
CREATE TABLE IF NOT EXISTS trial_accounts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id           TEXT UNIQUE NOT NULL,
  user_id               TEXT NOT NULL,
  stripe_customer_id    TEXT NOT NULL,
  stripe_subscription_id TEXT,
  email                 TEXT NOT NULL,
  first_name            TEXT,
  last_name             TEXT,
  company_name          TEXT,
  phone                 TEXT,
  plan_tier             TEXT NOT NULL DEFAULT 'starter',
  status                TEXT NOT NULL DEFAULT 'trialing',
  trial_starts_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  trial_expires_at      TIMESTAMPTZ NOT NULL,
  converted_at          TIMESTAMPTZ,
  suspended_at          TIMESTAMPTZ,
  reinstated_at         TIMESTAMPTZ,
  snapshot_applied      BOOLEAN DEFAULT false,
  snapshot_id           TEXT,
  source                TEXT DEFAULT 'wpsxo',
  price_id              TEXT,
  provisioning_log      JSONB DEFAULT '[]'::jsonb,
  error_log             JSONB DEFAULT '[]'::jsonb,
  metadata              JSONB DEFAULT '{}'::jsonb,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trial_email ON trial_accounts(email);
CREATE INDEX IF NOT EXISTS idx_trial_stripe ON trial_accounts(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_trial_status ON trial_accounts(status);
CREATE INDEX IF NOT EXISTS idx_trial_expires ON trial_accounts(trial_expires_at);
CREATE INDEX IF NOT EXISTS idx_trial_location ON trial_accounts(location_id);
CREATE INDEX IF NOT EXISTS idx_trial_source ON trial_accounts(source);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trial_accounts_updated_at ON trial_accounts;
CREATE TRIGGER trial_accounts_updated_at
  BEFORE UPDATE ON trial_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE trial_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON trial_accounts
  FOR ALL TO service_role USING (true) WITH CHECK (true);
