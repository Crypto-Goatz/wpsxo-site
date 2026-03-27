const CRM_BASE_URL = process.env.CRM_BASE_URL || 'https://services.leadconnectorhq.com';
const CRM_API_VERSION = process.env.CRM_API_VERSION || '2021-07-28';

export async function crmFetch(
  endpoint: string,
  pit: string,
  options: RequestInit = {}
): Promise<any> {
  const res = await fetch(`${CRM_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${pit}`,
      'Content-Type': 'application/json',
      'Version': CRM_API_VERSION,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`CRM ${res.status} on ${endpoint}: ${JSON.stringify(body)}`);
  }

  return res.json();
}
