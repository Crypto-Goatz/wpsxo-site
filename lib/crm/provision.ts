import { crmFetch } from './client';
import { supabaseAdmin } from '../supabase';

const AGENCY_PIT = process.env.CRM_AGENCY_API_KEY!;
const COMPANY_ID = process.env.CRM_COMPANY_ID!;
const TRIAL_DAYS = parseInt(process.env.TRIAL_DURATION_DAYS || '14');

interface ProvisionInput {
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone?: string;
  planTier: 'starter' | 'pro' | 'agency';
  priceId: string;
  source: 'wpsxo' | '0nmcp' | 'marketplace';
}

export async function provisionTrialAccount(input: ProvisionInput) {
  const trialExpiresAt = new Date(Date.now() + TRIAL_DAYS * 86400000).toISOString();

  console.log(`[provision] Starting for ${input.email} (${input.planTier})`);

  // Step 1: Create CRM sub-location
  const locationRes = await crmFetch('/locations/', AGENCY_PIT, {
    method: 'POST',
    body: JSON.stringify({
      name: input.companyName,
      email: input.email,
      phone: input.phone || '',
      companyId: COMPANY_ID,
      settings: {
        allowDuplicateContact: false,
        allowDuplicateOpportunity: false,
      },
    }),
  });

  const locationId = locationRes.location?.id || locationRes.id;
  console.log(`[provision] Location created: ${locationId}`);

  // Step 2: Create admin user
  const userRes = await crmFetch('/users/', AGENCY_PIT, {
    method: 'POST',
    body: JSON.stringify({
      companyId: COMPANY_ID,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || '',
      type: 'account',
      role: 'admin',
      locationIds: [locationId],
      permissions: {
        campaignsEnabled: true,
        contactsEnabled: true,
        workflowsEnabled: true,
        opportunitiesEnabled: true,
        dashboardStatsEnabled: true,
        appointmentsEnabled: true,
        settingsEnabled: true,
        tagsEnabled: true,
      },
    }),
  });

  const userId = userRes.user?.id || userRes.id;
  console.log(`[provision] User created: ${userId}`);

  // Step 3: Log to Supabase
  const { data: record, error } = await supabaseAdmin
    .from('trial_accounts')
    .insert({
      location_id: locationId,
      user_id: userId,
      stripe_customer_id: input.stripeCustomerId,
      stripe_subscription_id: input.stripeSubscriptionId,
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
      company_name: input.companyName,
      phone: input.phone || null,
      plan_tier: input.planTier,
      status: 'trialing',
      trial_starts_at: new Date().toISOString(),
      trial_expires_at: trialExpiresAt,
      source: input.source,
      price_id: input.priceId,
      provisioning_log: [
        { step: 'location_created', status: 'success', timestamp: new Date().toISOString(), data: { location_id: locationId } },
        { step: 'user_created', status: 'success', timestamp: new Date().toISOString(), data: { user_id: userId } },
      ],
    })
    .select()
    .single();

  if (error) {
    console.error(`[provision] Supabase error:`, error);
  }

  console.log(`[provision] Complete: ${input.email} → location=${locationId}, user=${userId}`);

  return { success: true, locationId, userId, trialExpiresAt };
}
