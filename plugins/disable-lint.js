const { withAppBuildGradle } = require("expo/config-plugins");

module.exports = function disableLint(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes("lintOptions")) return config;
    config.modResults.contents = config.modResults.contents.replace(
      /android\s*{/,
      `android {
    lint {
        checkReleaseBuilds false
        abortOnError false
    }`
    );
    return config;
  });
};
