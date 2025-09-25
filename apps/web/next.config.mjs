/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now stable in Next.js 14
  // experimental: { appDir: true } // Removed deprecated option

  // Configuration pour Docker avec standalone output
  output: "standalone",

  // Configuration pour les proxies API
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.API_URL || "http://localhost:10002"
        }/:path*`,
      },
    ];
  },
};

export default nextConfig;
