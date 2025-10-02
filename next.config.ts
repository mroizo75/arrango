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

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize chunks for better caching and loading
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 200000, // 200kb max chunk size
          cacheGroups: {
            framework: {
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              name: 'framework',
              chunks: 'all',
              priority: 40,
            },
            lib: {
              test: /[\\/]node_modules[\\/](?!react|react-dom|scheduler|prop-types|use-subscription)/,
              name: 'lib',
              chunks: 'all',
              priority: 30,
            },
          },
        },
      };
    }

    return config;
  },

  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
};

export default nextConfig;
