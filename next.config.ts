import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "ceaseless-tapir-769.convex.cloud", protocol: "https" },
      { hostname: "hushed-eel-616.convex.cloud", protocol: "https" },
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 60,
  },


  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // Optimize JavaScript compilation for modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

};

export default nextConfig;
