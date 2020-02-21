"use strict";

const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: __dirname,
  entry: {
    app: "./src/index.tsx",
  },

  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "src/template.html",
    })
  ],

  module: {
    rules: [
      {
        parser: {
          // Prevent lodash colliding with underscore on legacy pages
          // https://github.com/lodash/lodash/issues/1798#issuecomment-233804586
          // insanity
          amd: false,
        },
      },
      {
        test: /\.(js|ts)x?/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin(),

    ],
    extensions: [".ts", ".tsx", ".js"],
  },
  optimization: {
    splitChunks: {
      chunks: "async",
    },
  },
};
