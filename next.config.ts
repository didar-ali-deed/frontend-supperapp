import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Images ──────────────────────────────────────────────────
  images: {
    // Serve AVIF first (best compression), fall back to WebP
    formats: ["image/avif", "image/webp"],
    // Breakpoints matching Tailwind: sm md lg xl 2xl + mobile
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimised images for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "**.clerk.com" },
      { protocol: "https", hostname: "**.clerkinc.com" },
      { protocol: "https", hostname: "**.cloudflare.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // ── Compiler ─────────────────────────────────────────────────
  compiler: {
    // Strip console.log/debug/info in production; keep warn/error
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // ── Experimental ─────────────────────────────────────────────
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
    optimizePackageImports: [
      "@tanstack/react-query",
    ],
  },

  // ── Headers ──────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Allow browser to reuse connections
          { key: "Connection", value: "keep-alive" },
          // Prevent embedding in iframes (security)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Remove MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        // Long-lived cache for Next.js static assets
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache optimised images
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
