import type { NextConfig } from 'next';

const isDev  = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ─────────────────────────────────────────────────────────────
  // COMPILER
  // ─────────────────────────────────────────────────────────────
  compiler: {
    removeConsole: isProd
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // ─────────────────────────────────────────────────────────────
  // TRANSPILATION (WebGL + Motion stack)
  // ─────────────────────────────────────────────────────────────
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'lenis',
  ],

  // ─────────────────────────────────────────────────────────────
  // IMAGES (Performance + future-proof)
  // ─────────────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 86400,

    // Allow all HTTPS images (safe for SaaS + CDN + user uploads)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // SECURITY HEADERS (HARDENED + WebGL SAFE)
  // ─────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Basic security
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // Permissions
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },

          // HTTPS enforcement
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          // Content Security Policy (balanced for WebGL + safety)
          {
            key: 'Content-Security-Policy',
            value: isProd
              ? [
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "font-src 'self' https://fonts.gstatic.com",
                  "img-src 'self' data: blob: https:",
                  "connect-src 'self' https:",
                  "worker-src blob:",
                  "child-src blob:",
                ].join('; ')
              : '',
          },
        ].filter(Boolean),
      },

      // Static asset caching (fonts, etc.)
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ─────────────────────────────────────────────────────────────
  // PERFORMANCE + BUNDLE OPTIMIZATION
  // ─────────────────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'gsap',
    ],
    scrollRestoration: true,

    // Only enable turbo in dev (safe)
  //  turbo: isDev ? {} : undefined,
  },

  // ─────────────────────────────────────────────────────────────
  // WEBPACK (Three.js compatibility)
  // ─────────────────────────────────────────────────────────────
  webpack(config) {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        crypto: false,
      },
    };

    return config;
  },
};

export default nextConfig;