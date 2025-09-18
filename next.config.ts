import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hilop-s3-bucket.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      {
        source: "/:path*",           
        has: [
          {
            type: "host",
            value: "www.hilop.com",      
          },
        ],
        destination: "https://hilop.com/:path*", 
        permanent: true, 
      },
      {
        source: "/product/68246cfc5b9ab999150472e5",
        destination: "/product/hardveda-natural-performance-booster-capsule",
        permanent: true,
      },
      {
        source: "/product/68246b005b9ab999150472e2",
        destination: "/product/boldrise-last-long-delay-powder",
        permanent: true,
      },
      {
        source: "/product/682314a91b521615a7e89618", 
        destination: "/product/slimvibe-herbal-weight-loss-capsule", 
        permanent: true,
      },  
      {
        source: "/learn/better-sex",
        destination: "/product/hardveda-natural-performance-booster-capsule",
        permanent: true,
      },
      {
        source: "/learn/sexual-health",
        destination: "/product/hardveda-natural-performance-booster-capsule",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/$",
        destination: "/",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/contact-us",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      
    ];
  },
};

export default nextConfig;
