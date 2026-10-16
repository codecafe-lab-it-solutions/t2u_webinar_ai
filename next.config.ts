import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev runs on a dedicated port (see package.json "dev"): another project
  // squats on [::1]:3000, so localhost:3000 silently resolved to ITS server,
  // which returned 500s and "Payment is not configured".
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
