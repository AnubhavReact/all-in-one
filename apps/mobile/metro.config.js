// Metro bundles the mobile app. By default it only looks inside this folder,
// which in a monorepo means it cannot find packages/core or the dependencies
// npm hoisted to the repo root. These two settings tell it where to look.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch the whole repo, so editing packages/core reloads the app.
config.watchFolders = [workspaceRoot];

// Resolve from the app first, then fall back to the hoisted root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Never load a second copy of a package from a nested node_modules.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
