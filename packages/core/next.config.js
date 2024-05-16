const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    const browserPath = path.resolve(
      __dirname,
      "../../node_modules/@allbridge/bridge-core-sdk/dist/browser/index.js"
    );
    config.resolve.alias["@allbridge/bridge-core-sdk"] = browserPath;
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
