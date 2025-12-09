module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Plugin Worklets (Wajib untuk Vision Camera / Skia)
      ["react-native-worklets-core/plugin", { processNestedWorklets: true }],
      
      // Plugin Reanimated (WAJIB TERAKHIR di list utama ini)
      "react-native-reanimated/plugin",
    ],
    // ✅ Tambahkan blok ini untuk Production
    env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    },
  };
};