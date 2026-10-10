import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These workspace packages ship TypeScript, so Next has to compile them
  // rather than assume they are already built for the browser.
  transpilePackages: ["@aio/core", "@aio/db"],

  // `next dev` otherwise writes an AGENTS.md into this folder whenever it
  // detects an agent, which shows up as a stray uncommitted change.
  agentRules: false,

  // The dev-only badge never ships, but it covers whatever corner it sits in
  // while the app is being built. Bottom-right is now the "Ask AI" launcher,
  // and the sidebar's account card is above bottom-left, so it goes there.
  devIndicators: { position: "bottom-left" },
};

export default nextConfig;
