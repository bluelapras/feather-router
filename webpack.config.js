/* eslint-disable @typescript-eslint/no-var-requires */

// Production Webpack config
const path = require("path");

/**
 * Enable intellisense
 * @type {(env: string, arg: string) => import("webpack").Configuration}
 */

module.exports = () => {
  return {
    mode: "production",
    target: "web",
    // Don't continue if there are any errors
    bail: true,
    // Polyfills are injected on demand using babel-loader
    // Root entry
    entry: "./src/index.ts",
    output: {
      // Build folder
      path: path.resolve(__dirname, "dist"),
      // Only one bundle (no dependencies)
      filename: "feather-router.js",
      globalObject: "this",
      library: {
        name: "featherRouter",
        type: "umd",
      },
      // Clear the build directory before building
      clean: true,
      publicPath: "./",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        // Parse TSX, TS, JSX, JS files in src using Babel
        {
          test: /.[jt]sx?$/,
          include: /src/,
          use: ["babel-loader"],
        },
      ],
    },
    externals: {
      react: "react",
    },
  };
};
