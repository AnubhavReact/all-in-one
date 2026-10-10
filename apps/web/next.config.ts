import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These workspace packages ship TypeScript, so Next has to compile them
  // rather than assume they are already built for the browser.
  transpilePackages: ["@aio/core", "@aio/db"],
};

export default nextConfig;
