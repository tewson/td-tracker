const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ["react-hot-loader/patch", "./src/index.jsx"],
  output: {
    filename: process.env.WEBPACK_DEV_SERVER
      ? "[name].[hash].js"
      : "[name].[contenthash].js"
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
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
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development"
            }
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.WEBPACK_DEV_SERVER ? "disabled" : "static",
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
