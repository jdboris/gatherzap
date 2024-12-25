import type { NextConfig } from "next";
import { config } from "dotenv";

// Allow setting PORT in .env
config({ override: true });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
