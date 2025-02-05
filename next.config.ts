import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   // ✅ Static Export Mode ke liye zaroori
  images: {
    domains: ["cdn.sanity.io"], // Sanity ke CDN ko allow karein
  },
};

export default nextConfig;
