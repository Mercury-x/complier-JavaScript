const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin') // uglifyjs的一个分支
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// HappyPack 多线程打包

module.exports = {
  // optimization: {
  //   minimizer: [new TerserPlugin({
  //     cache: true, // 加快构建速度
  //     // parallel: true, // 多线程，加快打包速度
  //     terserOptions: {
  //       compress: {
  //         unused: true,
  //         drop_debugger: true,
  //         drop_console: true,
  //         dead_code: true
  //       }
  //     }
  //   })]
  // },
  resolve: {
    // 不想写后缀
    extensions: ['.wasm', '.jsx', '.mjs', '.js', '.jsx', '.json']
  },
  entry: path.resolve(__dirname, 'src/index.js'),
  module: {
    noParse: /node_modules\/(jquery\.js)/,
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              require.resolve('@babel/preset-react'),
              [require.resolve('@babel/preset-env', { modules: false })],
            ],
            // cacheDirectory: true,
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin()
  ],
  devServer: {
    hot: true
  }
}