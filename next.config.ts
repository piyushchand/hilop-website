import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://3.110.216.61/api/v1/:path*', // Proxy to backend
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hilop-s3-bucket.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
