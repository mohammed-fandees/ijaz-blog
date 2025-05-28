import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.zoya.finance',
        pathname: '/content/images/**',
      },
    ],
  },
};

export default nextConfig;
