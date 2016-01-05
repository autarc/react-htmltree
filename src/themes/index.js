/**
 * # Themes
 *
 * Select and combine styles (predefined or customized)
 */

const basicStyles = require('./index.styl')

const predefinedThemes = {
  'chrome-devtools': require('./chrome-devtools.styl'),
  'firefox-devtools.dark': require('./firefox-devtools.dark.styl'),
  'firefox-devtools.light': require('./firefox-devtools.light.styl')
}

/**
 * @param  {String|Object} theme - [description]
 * @return {String}              - [description]
 */
export default (theme) => {
  if (typeof theme === 'string') {
    if (!predefinedThemes[theme]) {
      throw new Error(`Invalid theme name: "${theme}" !`)
    }
    return `${basicStyles} ${predefinedThemes[theme]}`
  }
  // TODO:
  // - transform object declaration of styles regarding [freestyle](https://github.com/blakeembrey/free-style)
  // - prevent duplicate style definitions by only including them once
  return basicStyles
}
