import type { NextConfig } from "next";
import { config } from "dotenv";

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Allow setting PORT in .env
config({ override: true });

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV != "development") {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `http://api:${process.env.API_PORT}/api/:path*`,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.join(__dirname, "./src"),
    };
    return config;
  },
};

export default nextConfig;
