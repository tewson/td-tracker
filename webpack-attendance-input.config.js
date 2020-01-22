const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/attendance-input/index.jsx",
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
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new MiniCssExtractPlugin()
  ]
};
