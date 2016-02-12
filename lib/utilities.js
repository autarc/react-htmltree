'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelector = getSelector;
exports.getDepth = getDepth;
exports.setDeep = setDeep;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * # Utilities
 *
 * Helper functions
 */

/**
 * [getSelector description]
 * @param  {Object} node     - [description]
 * @param  {Array}  selector - [description]
 * @return {String}          - [description]
 */
function getSelector(node) {
  var selector = arguments.length <= 1 || arguments[1] === undefined ? [node.name] : arguments[1];

  var parent = node.parent;
  if (parent) {
    var children = parent.children;
    var matches = children.filter(function (child) {
      return child.name === node.name;
    });
    if (matches.length > 1) {
      for (var i = 0, l = matches.length; i < l; i++) {
        if (matches[i] === node) {
          selector[0] = selector[0] + ':nth-of-type(' + (i + 1) + ')';
          break;
        }
      }
    }
    selector.unshift(parent.name);
  }
  return parent && parent.parent ? getSelector(parent, selector) : selector.join(' > ');
}

/**
 * [getDepth description]
 * @param  {Object} node - [description]
 * @return {Number}      - [description]
 */
function getDepth(node) {
  var level = 1; // level: 0
  while (node.parent) {
    level += 1;
    node = node.parent;
  }
  return level;
}

/**
 * Changes the the values in the nested collection
 * @param {Immutable.Map} map     - [description]
 * @param {Array}         listKey - [description]
 * @param {Array}         keyPath - [description]
 * @param {*|Function}    value   - [description]
 */
function setDeep(map, listKey, keyPath, value) {
  if (!Array.isArray(listKey)) {
    listKey = [listKey];
  }
  var change = typeof value === 'function' ? 'updateIn' : 'setIn';
  var subPaths = getPaths(map, listKey, keyPath);
  return map.withMutations(function (map) {
    subPaths.forEach(function (keyPath) {
      return map[change](keyPath, value);
    });
  });

  function getPaths(map, listKeys, keyPath) {
    var overview = arguments.length <= 3 || arguments[3] === undefined ? [keyPath] : arguments[3];

    var list = map.getIn(listKeys);
    if (list) {
      var size = list.size;
      for (var i = 0; i < size; i++) {
        overview.push([].concat(_toConsumableArray(listKeys), [i], _toConsumableArray(keyPath)));
        getPaths(map, [].concat(_toConsumableArray(listKeys), [i, listKeys[0]]), keyPath, overview);
      }
    }
    return overview;
  }
}
//# sourceMappingURL=data:application/json;base64,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ICMgVXRpbGl0aWVzXG4gKlxuICogSGVscGVyIGZ1bmN0aW9uc1xuICovXG5cbi8qKlxuICogW2dldFNlbGVjdG9yIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSBub2RlICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgc2VsZWN0b3IgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0b3IgKG5vZGUsIHNlbGVjdG9yID0gW25vZGUubmFtZV0pIHtcbiAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnRcbiAgaWYgKHBhcmVudCkge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkcmVuXG4gICAgY29uc3QgbWF0Y2hlcyA9IGNoaWxkcmVuLmZpbHRlcigoY2hpbGQpID0+IGNoaWxkLm5hbWUgPT09IG5vZGUubmFtZSlcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPiAxKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG1hdGNoZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChtYXRjaGVzW2ldID09PSBub2RlKSB7XG4gICAgICAgICAgc2VsZWN0b3JbMF0gPSAoYCR7c2VsZWN0b3JbMF19Om50aC1vZi10eXBlKCR7aSsxfSlgKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZWN0b3IudW5zaGlmdChwYXJlbnQubmFtZSlcbiAgfVxuICByZXR1cm4gcGFyZW50ICYmIHBhcmVudC5wYXJlbnQgPyBnZXRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yKSA6IHNlbGVjdG9yLmpvaW4oJyA+ICcpXG59XG5cbi8qKlxuICogW2dldERlcHRoIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSBub2RlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7TnVtYmVyfSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVwdGggKG5vZGUpIHtcbiAgdmFyIGxldmVsID0gMSAvLyBsZXZlbDogMFxuICB3aGlsZSAobm9kZS5wYXJlbnQpIHtcbiAgICBsZXZlbCArPSAxXG4gICAgbm9kZSA9IG5vZGUucGFyZW50XG4gIH1cbiAgcmV0dXJuIGxldmVsXG59XG5cbi8qKlxuICogQ2hhbmdlcyB0aGUgdGhlIHZhbHVlcyBpbiB0aGUgbmVzdGVkIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7SW1tdXRhYmxlLk1hcH0gbWFwICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7QXJyYXl9ICAgICAgICAgbGlzdEtleSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7QXJyYXl9ICAgICAgICAga2V5UGF0aCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7KnxGdW5jdGlvbn0gICAgdmFsdWUgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldERlZXAgKG1hcCwgbGlzdEtleSwga2V5UGF0aCwgdmFsdWUpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3RLZXkpKSB7XG4gICAgbGlzdEtleSA9IFtsaXN0S2V5XVxuICB9XG4gIGNvbnN0IGNoYW5nZSA9ICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpID8gJ3VwZGF0ZUluJyA6ICdzZXRJbidcbiAgY29uc3Qgc3ViUGF0aHMgPSBnZXRQYXRocyhtYXAsIGxpc3RLZXksIGtleVBhdGgpXG4gIHJldHVybiBtYXAud2l0aE11dGF0aW9ucygobWFwKSA9PiB7XG4gICAgc3ViUGF0aHMuZm9yRWFjaCgoa2V5UGF0aCkgPT4gbWFwW2NoYW5nZV0oa2V5UGF0aCwgdmFsdWUpKVxuICB9KVxuXG4gIGZ1bmN0aW9uIGdldFBhdGhzIChtYXAsIGxpc3RLZXlzLCBrZXlQYXRoLCBvdmVydmlldyA9IFtrZXlQYXRoXSkge1xuICAgIGNvbnN0IGxpc3QgPSBtYXAuZ2V0SW4obGlzdEtleXMpXG4gICAgaWYgKGxpc3QpIHtcbiAgICAgIGNvbnN0IHNpemUgPSBsaXN0LnNpemVcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgIG92ZXJ2aWV3LnB1c2goWy4uLmxpc3RLZXlzLCBpLCAuLi5rZXlQYXRoXSlcbiAgICAgICAgZ2V0UGF0aHMobWFwLCBbLi4ubGlzdEtleXMsIGksIGxpc3RLZXlzWzBdXSwga2V5UGF0aCwgb3ZlcnZpZXcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdmVydmlld1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
