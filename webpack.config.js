const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.jsx",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    })
  ]
};
