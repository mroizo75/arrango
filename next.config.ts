import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance optimizations */
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header

  images: {
    remotePatterns: [
      { hostname: "ceaseless-tapir-769.convex.cloud", protocol: "https" },
      { hostname: "hushed-eel-616.convex.cloud", protocol: "https" },
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 60,
    // Optimize image loading
    formats: ['image/webp', 'image/avif'],
  },

  // Performance optimizations
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // Optimize build output
  output: 'standalone',
};

export default nextConfig;
