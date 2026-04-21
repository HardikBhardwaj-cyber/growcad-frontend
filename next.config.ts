// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  // Allow images from R2 public URL and common CDNs
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'files.growcad.in'                    },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com'          },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com'           }, // Google avatars
    ],
  },

  // CORS headers for R2 presigned URL uploads (OPTIONS preflight)
  async headers() {
    return [
      {
        source:  '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true'                         },
          { key: 'Access-Control-Allow-Origin',      value: process.env.NEXT_PUBLIC_APP_URL ?? '*' },
          { key: 'Access-Control-Allow-Methods',     value: 'GET,POST,PUT,DELETE,OPTIONS'  },
          { key: 'Access-Control-Allow-Headers',     value: 'Content-Type,Authorization,x-tenant-id' },
        ],
      },
    ];
  },

  // Experimental: server actions + Turbopack in dev
  experimental: {
    serverActions: { allowedOrigins: ['app.growcad.in', 'localhost:3000'] },
  },

  // Webpack: allow jsonwebtoken + bcryptjs in server components
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals = [...(config.externals ?? []), 'bcryptjs'];
    }
    return config;
  },
};

export default config;
