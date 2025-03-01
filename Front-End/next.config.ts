import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
    domains: ['health-care-5wrp.onrender.com', 'res.cloudinary.com'],
  },
};

export default nextConfig;
