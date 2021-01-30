const path = require('path');
const nowMode = 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const imageRoot = '/'
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const globule = require('globule');
const CopyPlugin = require("copy-webpack-plugin");

const app = {
  mode: nowMode,
  entry: {
    main: './src/js/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "js/[name]-[hash].js"
  },
  module: {
    rules: [
      // StyleSheet File
      {
        test: /.(css|scss|sass)$/,
        use: [
          {
            // minifiy
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          // ベンダープレフィックスの自動付与
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["autoprefixer", { grid: true }],
                ],
              },
            },
          },
          {
            loader: 'sass-loader'
          }
        ],
      },
      // Photo File
      {
        test: /\.(png|jpg|jpeg|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: 'images/[name]-[hash].[ext]',
              publicPath: imageRoot
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              }
            }
          }
        ]
      },
      {
        // Pug File
        test: /\.pug/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true,
            }
          }
        ]
      },
    ],
  },
  // Local Server Setting
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    openPage: "index.html",
    port: 3000,
    open: true
  },
  plugins: [
    // CssMinify Plugin
    new MiniCssExtractPlugin({
      filename: 'styles/[name]-[hash].css'
    }),
    // distの自動削除
    new CleanWebpackPlugin(),
    // Faviconをdistへコピー
    new CopyPlugin({
      patterns: [{
        from: "*",
        to: "",
        context: "src/img/icon/"
      }],
    }
    )
  ],
};

// pubファイルの配列挿入
const templates = globule.find(
  './src/templates/**/*.pug', {
  ignore: [
    // private ignore
    './src/templates/**/_*.pug'
  ]
}
)

// 配列分のHtmlWebpackPluginを挿入
templates.forEach((template) => {
  const fileName = template.replace('./src/templates/', '').replace('.pug', '.html')
  app.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${fileName}`,
      template: template,
    })
  )
})

module.exports = app;