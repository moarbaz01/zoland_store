import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  typescript: {
    ignoreBuildErrors: false, // Fix TypeScript errors before build
  },
  eslint: {
    ignoreDuringBuilds: false, // Ensure linting for production builds
  },
  output: "standalone", // Optimized for serverless deployment
  reactStrictMode: true, // Catches potential errors during development
  swcMinify: true, // Faster builds and minified JavaScript
};

export default nextConfig;
