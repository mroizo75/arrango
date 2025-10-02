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
};

export default nextConfig;
