/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  async redirects() {
    return [
      // OnPress → FiggyPress (renamed 2026-05-06).
      // Permanent redirect so Stripe receipts / old emails / search results
      // still land users on the live product page.
      { source: '/products/onpress', destination: '/products/figgypress', permanent: true },
      { source: '/products/onpress/:path*', destination: '/products/figgypress/:path*', permanent: true },
    ]
  },
};
export default nextConfig;
