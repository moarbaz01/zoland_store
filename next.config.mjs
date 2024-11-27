const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  reactStrictMode: true, // Catches potential errors during development
  swcMinify: true, // Faster builds and minified JavaScript
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production", // Removes console logs in production
  // },
};

export default nextConfig;
