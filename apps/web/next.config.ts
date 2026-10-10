import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These workspace packages ship TypeScript, so Next has to compile them
  // rather than assume they are already built for the browser.
  transpilePackages: ["@aio/core", "@aio/db"],

  // `next dev` otherwise writes an AGENTS.md into this folder whenever it
  // detects an agent, which shows up as a stray uncommitted change.
  agentRules: false,

  // The dev-only badge sits bottom-left, right on top of the sidebar's
  // account card. It never ships, but it makes the app hard to look at while
  // building it. Moved to the opposite corner, which is empty.
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
