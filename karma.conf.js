/* eslint no-process-env: 0, no-magic-numbers: 0, max-statements: 0 */
const webpack = require("./webpack.config");

module.exports = function(config) {
  config.set({
    mime:           {"text/x-typescript": ["ts", "tsx"]}, // fix typescript serving video/mp2t mime type
    frameworks:     ["mocha"].concat(process.env.NO_DETECT ? [] : ["detectBrowsers"]),
    files:          ["test/**/*.ts"],
    preprocessors:  {"test/**/*.ts": ["webpack", "sourcemap", "espower"]},
    reporters:      ["mocha"],
    webpack,
    detectBrowsers: {
      usePhantomJS: false,
      postDetection(availableBrowsers) {
        const result = availableBrowsers;
        if (process.env.NO_IE) {
          const ieIndex = result.indexOf("IE");
          if (ieIndex !== -1) result.splice(ieIndex, 1);
        }
        const chromeIndex = availableBrowsers.indexOf("Chrome");
        if (chromeIndex >= 0) {
          result.splice(chromeIndex, 1);
          result.push("ChromeHeadless");
        }
        return result;
      },
    },
  });
};
