"use strict";

const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",

  devServer: {
    historyApiFallback: true,
  },

  entry: {
    app: "./src/index.tsx",
  },

  output: {
    publicPath: "/",
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "src/template.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(js|ts)x?/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@natural-selection/core": path.resolve(__dirname, "packages/core/src/index.tsx")
    }
  },
};
