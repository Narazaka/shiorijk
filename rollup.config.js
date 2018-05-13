import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

export default {
  plugins: [
    nodeResolve({extensions: [".js", ".ts"]}),
    typescript({tsconfigOverride: {compilerOptions: {module: "es2015"}}}),
    commonjs({
      extensions:   [".js", ".ts"],
      namedExports: {"node_modules/chai/index.js": ["should"]},
    }),
  ],
  input:  "lib/shiorijk.ts",
  output: [
    {
      name:   "ShioriJK",
      format: "umd",
      file:   "dist/lib/shiorijk.js",
    },
    {
      format: "es",
      file:   "dist/lib/shiorijk.mjs",
    },
  ],
};
