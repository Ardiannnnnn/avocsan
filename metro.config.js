const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ✅ Add buffer resolver
config.resolver.extraNodeModules = {
  buffer: require.resolve('buffer/'),
};

// ✅ TAMBAHKAN INI: Agar Metro bisa membaca file .cjs (Solusi Error Anda)
config.resolver.sourceExts.push('cjs');

config.resolver.assetExts.push(
  'tflite',  // TensorFlow Lite models
  'txt'      // Label files
);

module.exports = withNativeWind(config, { input: "./src/global.css" });
