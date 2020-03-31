/* eslint no-process-env: 0, no-magic-numbers: 0, max-statements: 0 */
const path = require("path");
const webpack = require("./webpack.config.nwjs.test");

module.exports = function (config) {
    config.set({
        browsers: ["NWJS"],
        frameworks: ["nodewebkit-mocha"],
        files: ["test/**/*.ts"],
        preprocessors: { "test/**/*.ts": ["webpack", "sourcemap", "espower"] },
        reporters: ["mocha"],
        webpack,
        coverageReporter: {
            reporters: [{ type: "html" }, { type: "lcov" }, { type: "text" }, { type: "text-summary" }],
        },
        NWJSConfig: {
            copy: {
                // karma-nwjs-launcherの挙動上ないと動かない
                base: path.resolve("."),
                items: ["package.json"], // 1つ以上の実在ファイル
            },
        },
    });
};
