// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  // ── Image sources ──────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'files.growcad.in'           },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com'  },
    ],
  },

  // ── Native server-only packages ────────────────────────────────────────────
  // bcrypt uses native C++ bindings — must NOT be bundled by webpack.
  // Only applies to Node.js API routes (/app/api/**).
  // Edge Middleware uses jose (Web Crypto) — never bcrypt.
  serverExternalPackages: ['bcrypt'],

  // ── CORS headers for /api/* routes ────────────────────────────────────────
  // Allows the React app (app.growcad.in) to call the API routes.
  // R2 presigned uploads use OPTIONS preflight — these headers cover that.
  async headers() {
    return [
      {
        source:  '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key:   'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL ?? '*',
          },
          {
            key:   'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key:   'Access-Control-Allow-Headers',
            value: 'Content-Type,Authorization,x-tenant-id',
          },
        ],
      },
    ];
  },

  // ── Experimental ──────────────────────────────────────────────────────────
  experimental: {
    serverActions: {
      allowedOrigins: ['app.growcad.in', 'localhost:3000'],
    },
  },
};

export default config;
