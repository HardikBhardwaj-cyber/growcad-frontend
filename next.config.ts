import type { NextConfig } from 'next';

const config: NextConfig = {
  turbopack: {}, // ✅ keep this

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'files.growcad.in' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  async headers() {
    const origin = process.env.NEXT_PUBLIC_APP_URL;

    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },

          // ⚠️ NEVER use '*' with credentials
          {
            key: 'Access-Control-Allow-Origin',
            value: origin ?? 'https://app.growcad.in',
          },

          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },

          {
            key: 'Access-Control-Allow-Headers',
            value:
              'Content-Type,Authorization,x-tenant-id,x-user-id,x-user-role',
          },
        ],
      },
    ];
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        'app.growcad.in',
        'localhost:3000',
      ],
    },
  },
};

export default config;