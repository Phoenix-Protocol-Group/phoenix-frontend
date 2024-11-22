/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
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
