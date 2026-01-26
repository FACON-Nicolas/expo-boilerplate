const { withUniwindConfig } = require("uniwind/metro");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

module.exports = withUniwindConfig(config, {
  inlineRem: 16,
  cssEntryFile: "./global.css",
});