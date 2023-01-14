require('dotenv').config()

const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { DefinePlugin } = require('webpack')

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin()

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor')

module.exports = (_, argv) => {
  const devMode = argv.mode === 'development'

  const options = {
    entry: path.resolve('src', 'index.tsx'),
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: devMode ? '/' : './'
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './tsconfig.json'),
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'fast-sass-loader']
        },
        {
          test: /\.(ttf|woff|woff2)$/,
          use: 'file-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        ignoreOrder: true
      }),
      new MonacoWebpackPlugin({
        languages: ['json']
      }),
      new HtmlWebpackPlugin({
        template: './views/index.html',
        filename: 'index.html'
      }),
      new DefinePlugin({
        'process.env.API_SERVER': JSON.stringify(process.env.API_SERVER)
      })
      // new CopyWebpackPlugin({
      //   patterns: [
      //     {
      //       from: 'public'
      //     }
      //   ]
      // })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }

  options.mode = argv.mode

  if (devMode) {
    options.devtool = 'source-map'
    options.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 8090,
      hot: true,
      historyApiFallback: true
    }

    // return smp.wrap(options)
    // 현재는 버그로 인해 사용 불가능.
    // https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
  }

  return options
}
