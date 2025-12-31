import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['swiper'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'toryskateshop.com',
        pathname: '/wp-content/uploads/**',
      },
      // Para las imágenes de Google
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'https://vendetiyo.vercel.app',
        pathname: '/**'
      },
      // Para las imágenes de Instagram/Facebook CDN
      {
        protocol: 'https',
        hostname: 'instagram.fmec2-1.fna.fbcdn.net',
        pathname: '/**'
      }
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  experimental: {
    scrollRestoration: true,
    // legacyBrowsers fue removido en Next.js 13+
    optimizeCss: false, // Habilita optimización CSS (válido desde Next.js 13.2)
    nextScriptWorkers: false, // Mejor rendimiento para scripts
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'x-robot-tag',
          value: 'all',
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=60',
        },
      ],
    },
  ],
};

export default nextConfig;