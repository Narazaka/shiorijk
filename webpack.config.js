const path = require("path");
const tsconfig = require("./tsconfig.json");

module.exports = {
  mode:   "none",
  entry:  {shiorijk: "./lib/shiorijk.ts"},
  output: {
    library:       "ShioriJK",
    libraryTarget: "umd",
    path:          path.resolve("."),
    filename:      "dist/lib/[name].js",
  },
  module: {
    rules: [
      {
        test:    /\.ts$/,
        loader:  "ts-loader",
        exclude: /node_modules/,
        options: {compilerOptions: tsconfig.compilerOptions},
      },
    ],
  },
  resolve: {
    extensions: [
      ".ts",
      ".js",
    ],
  },
  devtool: "source-map",
};
