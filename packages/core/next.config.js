/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    turbo: {
      resolveAlias: {
        '@phoenix-protocol/types': '../types/src',
        '@phoenix-protocol/utils': '../utils/src',
        '@phoenix-protocol/contracts': '../contracts/src',
        '@phoenix-protocol/state': '../state/src',
        '@phoenix-protocol/strategies': '../strategies/src'
      }
    }
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/stellar.toml",
        destination: "/api/stellar",
      },
    ];
  },
};

module.exports = nextConfig;
