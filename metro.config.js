const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ✅ Add buffer resolver
config.resolver.extraNodeModules = {
  buffer: require.resolve('buffer/'),
};

config.resolver.assetExts.push(
  'tflite',  // TensorFlow Lite models
  'txt'      // Label files
);

module.exports = withNativeWind(config, { input: "./src/global.css" });
