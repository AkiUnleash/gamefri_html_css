const path = require('path')
const MODE = "development";
const enabledSourceMap = MODE === "development";
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: MODE,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    assetModuleFilename: "imgs/[name][ext]"
  },
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: enabledSourceMap,
              importLoaders: 2
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: enabledSourceMap
            },
          },
        ],
      },
      {
        test: /\.(git|png|jpg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxsize: 100 * 1024,
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    openPage: "index.html",
    port: 3000,
    open: true
  },
  target: ["web", "es5"],
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/html/top.html"
    })
  ]
};