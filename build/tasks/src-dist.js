/**
 * # Task: Source - Distribution
 *
 * Configuration to build browser packages.
 */

import { emptyDirSync } from 'fs-extra'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
const merge = require('deep-merge')((target, source) => {
  if (target instanceof Array) {
    return [].concat(target, source)
  }
  return source
})

/**
 * [default description]
 * @param  {[type]} env [description]
 * @return {[type]}     [description]
 */
export default (env) => {
  emptyDirSync(env.DIST)
  return new Promise((resolve, reject) => {

    var config = {
      entry: `${env.SRC}/index.js`,
      resolve: {
        extensions: ['', '.js', '.jsx', '.json']
      },
      output: {
        path: env.DIST,
        filename: 'react-htmltree.js',
        library: 'ReactHTMLTree',
        libraryTarget: 'umd'
      },
      externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
      },
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
          },
          { // htmlparser2
            test: /\.json$/,
            loader: 'json'
          },
          { // themes
            test: /\.styl$/,
            loader: 'raw!postcss!stylus'
          }
        ]
      },
      // plugin configurations
      postcss(){
        return [
          autoprefixer({
            browsers: ['last 2 versions']
          }),
          cssnano
        ]
      }
    }

    // = development
    if (__DEVELOPMENT__) {
      const DevConfig = merge(config, {
        debug: true,
        devtool: 'inline-source-map'
      })
      var ready = false
      return webpack(DevConfig).watch(100, (error, stats) => {
        if (ready) {
          if (error) {
            return console.error(error)
          }
          return console.log(new Date().toISOString(), ' - [ReactHTMLTree]', stats.toString())
        }
        ready = true
        return resolve()
      })
    }

    // = production:debug
    const ProductionDebugConfig = merge(config, {
      debug: true,
      devtool: 'sourcemap',
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('development')
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            warnings: false,
            screw_ie8: true
          }
        })
      ]

    })

    // = production:min
    const ProductionMinConfig = merge(config, {
      debug: false,
      output: {
        filename: config.output.filename.replace('.js', '.min.js')
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            screw_ie8: true
          }
        })
      ]
    })

    return webpack(ProductionDebugConfig).run((error, stats) => {
      if (error) {
        return rejec(error)
      }
      return webpack(ProductionMinConfig).run((error, stats) => {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })

  })
}
