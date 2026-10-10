import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These workspace packages ship TypeScript, so Next has to compile them
  // rather than assume they are already built for the browser.
  transpilePackages: ["@aio/core", "@aio/db"],

  // `next dev` otherwise writes an AGENTS.md into this folder whenever it
  // detects an agent, which shows up as a stray uncommitted change.
  agentRules: false,
};

export default nextConfig;
