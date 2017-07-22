var path = require('path')
var pkg = require(path.resolve(__dirname, '../package.json'))
var webpack = require('webpack')

var ENV = process.env.NODE_ENV || 'production'

var generateConfig = () => {
  const fileName = 'app'
  const CONFIG = {
    ENV
  }
  const plugins = [
    new webpack.DefinePlugin({
      'CONFIG': JSON.stringify(CONFIG),
      'PKG_NAME': JSON.stringify(pkg.name),
      'PKG_VERSION': JSON.stringify(pkg.version),
      'process.env': process.env
    })
  ]
  return {
    entry: path.resolve(__dirname, '../src/index.js'),
    stats: { children: false },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: fileName + '.js',
      library: fileName,
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: require(path.resolve(__dirname, '../build/.babelrc.json'))
          },
          exclude: /(node_modules|dist)/
        },
        {
          test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|ico|html)/,
          loader: 'file-loader?name=./[name].[ext]'
        },
        {
          test: /\.pug$/,
          loader: ['vue-template-compiler-loader', 'pug-html-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                minimize: CONFIG.ENV === 'production'
              }
            },
            {
              loader: 'sass-loader',
              options: {
                data: '$env:' + CONFIG.ENV + ';'
              }
            }
          ]
        }
      ]
    },
    plugins: plugins
  }
}

module.exports = generateConfig()
