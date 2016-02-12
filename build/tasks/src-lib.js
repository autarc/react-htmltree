/**
 * # Task: Source - Library
 *
 *
 */

import path from 'path'
import { emptyDirSync, readFile } from 'fs-extra'
import gulp from 'gulp'
const $ = require('gulp-load-plugins')()
import stylus from 'stylus'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import replaceRelative from 'gulp-replace-relative'

/**
 * [description]
 * @param  {[type]} env [description]
 * @return {[type]}     [description]
 */
export default (env) => {
  emptyDirSync(env.LIB)
  return new Promise((resolve, reject) => {
    const MATCH_ALL = `${env.SRC}/**/*`
    const target = `${env.LIB}/`
    transform(gulp.src(MATCH_ALL), target).on('end', () => {
      if (__DEVELOPMENT__) {
        $.watch(MATCH_ALL, (file) => {
          transform(gulp.src(file.path, { base: `${env.SRC}` }), target)
          .on('end', () => console.log('[CHANGE]', $.util.colors.yellow(file.path)))
        })
      }
      return resolve()
    })
  })
}

/**
 * Lazypipe alternative re-usable code
 * @param  {[type]} stream [description]
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
function transform (stream, target) {
  const filter = {
    scripts: $.filter((file) => /\.jsx?$/.test(file.path), { restore: true }),
    styles: $.filter((file) => /\.styl$/.test(file.path), { restore: true })
  }

  return stream
  .pipe($.plumber(::console.error))

  // scripts
  .pipe(filter.scripts)
    .pipe($.sourcemaps.init())
      // include inline styles
      .pipe($.replaceRelative(/require\('\.\/(.*?\.styl')\)/g, (file, match, callback) => {
        const includePath = match.match(/\('(.*?\.styl)'\)/)[1]
        readFile(path.resolve(path.dirname(file.path), includePath), (error, data) => {
          const css = stylus(data.toString()).render()
          postcss([
            autoprefixer({
              browsers: ['last 2 versions']
            }),
            cssnano
          ])
          .process(css)
          .then(function (result) {
            return callback(`"${result.css}"`)
          })
        })
      }))
      .pipe($.babel({/** see .babelrc **/}))
    .pipe($.sourcemaps.write())
  .pipe(filter.scripts.restore)

  // styles
  .pipe(filter.styles)
    .pipe($.stylus())
    .pipe($.postcss([
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ]))
  .pipe(filter.styles.restore)

  .pipe($.plumber.stop())
  .pipe(gulp.dest(target))
}
