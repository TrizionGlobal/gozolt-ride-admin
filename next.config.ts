import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    cpus: 4,
    proxyClientMaxBodySize: '100mb',
  },
};

export default nextConfig;
