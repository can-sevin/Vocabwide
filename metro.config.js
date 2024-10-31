const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Ensure "cjs" is prioritized if needed for certain libraries
defaultConfig.resolver.sourceExts = ["cjs", ...defaultConfig.resolver.sourceExts];

module.exports = defaultConfig;