import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Compress responses — reduces Fast Data Transfer
  compress: true,

  images: {
    // Keep unoptimized: ImageKit handles all image transforms server-side.
    // DO NOT enable Next.js image optimization — it creates an /api/image edge
    // function invocation per image, which consumes Edge Requests and Fluid CPU.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '**',
      },
    ],
  },

  // Reduce bundle size — removes unused locales from next/dist
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'recharts',
      'motion',
      'date-fns',
    ],
  },

  // Cache the OG image route at the CDN layer.
  // _next/static and public assets get immutable headers automatically from Vercel.
  async headers() {
    return [
      {
        source: '/api/og',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
}

export default nextConfig
