/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for deployment to static hosting (Vercel, Netlify, S3, etc.)
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  images: {
    // Required for static export - Next.js Image Optimization requires a server.
    // All images should be pre-optimized before adding to /public.
    unoptimized: true,
  },
};

module.exports = nextConfig;
