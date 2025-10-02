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

  // Optimize JavaScript compilation for modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimize CSS loading
  optimizeFonts: true,

  // Target modern browsers to reduce polyfills
  browserslist: [
    '>0.3%',
    'not ie 11',
    'not dead',
  ],
};

export default nextConfig;
