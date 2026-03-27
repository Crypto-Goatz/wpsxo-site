import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product');

  // Map product slugs to GitHub release download URLs
  const downloads: Record<string, string> = {
    wpsxo: 'https://github.com/Crypto-Goatz/onpress-wp/releases/latest/download/wp-sxo.zip',
    onpress: 'https://github.com/Crypto-Goatz/onpress/releases/latest/download/onpress.zip',
  };

  const url = downloads[product || ''];
  if (!url) {
    return Response.json({ error: 'Unknown product' }, { status: 404 });
  }

  // TODO: Track free download in Supabase for analytics
  // TODO: Collect email before free download (lead capture)

  return Response.redirect(url);
}
