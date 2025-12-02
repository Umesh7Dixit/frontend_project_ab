import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["cdn.prod.website-files.com", "images.unsplash.com"],
  },
};

export default nextConfig;
