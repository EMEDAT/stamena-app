module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ⚠️ CRITICAL: react-native-reanimated/plugin must be listed LAST!
      'react-native-reanimated/plugin',
    ],
  };
};