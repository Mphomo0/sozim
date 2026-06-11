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

  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/api/og',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source:
          '/:path(about|campus|career-pathway|privacy-policy|terms-of-service|contact-learning|welcome-message)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/:path(apply|call-me-back|contact|shop)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // homepage revalidate=3600, courses listing revalidate=3600
        source: '/:path(|courses)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // individual course pages revalidate=7200
        source: '/courses/:id',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=7200, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // news listing revalidate=7200, news[slug] revalidate=3600, category/tag pages revalidate=3600
        source: '/news/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // news index revalidate=7200 — longer TTL than individual articles
        source: '/news',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=7200, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
}

export default nextConfig
