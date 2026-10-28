import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    cpus: 4,
  },
};

export default nextConfig;
