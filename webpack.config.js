const webpack = require('webpack')
// const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: [
    './app/components/App.js'
  ],
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react',
    }),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    // }),
    // new HtmlWebPackPlugin({
    //   template: "./app/views/index.html",
    //   filename: "./index.html"
    // })
  ]
};