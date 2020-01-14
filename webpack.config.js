const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    filename: "[name].[contenthash].js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "../build/bundle-analyzer-report.html"
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin([{ from: "data", to: "data" }]),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    })
  ]
};
