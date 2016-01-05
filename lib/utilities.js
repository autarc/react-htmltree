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
//# sourceMappingURL=data:application/json;base64,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QUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM3QixnQkFBUSxDQUFDLElBQUksOEJBQUssUUFBUSxJQUFFLENBQUMsc0JBQUssT0FBTyxHQUFFLENBQUE7QUFDM0MsZ0JBQVEsQ0FBQyxHQUFHLCtCQUFNLFFBQVEsSUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFHLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtPQUNoRTtLQUNGO0FBQ0QsV0FBTyxRQUFRLENBQUE7R0FDaEI7Q0FDRiIsImZpbGUiOiJ1dGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgVXRpbGl0aWVzXG4gKlxuICogSGVscGVyIGZ1bmN0aW9uc1xuICovXG5cbi8qKlxuICogW2dldFNlbGVjdG9yIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSBub2RlICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgc2VsZWN0b3IgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0b3IgKG5vZGUsIHNlbGVjdG9yID0gW25vZGUubmFtZV0pIHtcbiAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnRcbiAgaWYgKHBhcmVudCkge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkcmVuXG4gICAgY29uc3QgbWF0Y2hlcyA9IGNoaWxkcmVuLmZpbHRlcigoY2hpbGQpID0+IGNoaWxkLm5hbWUgPT09IG5vZGUubmFtZSlcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPiAxKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG1hdGNoZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChtYXRjaGVzW2ldID09PSBub2RlKSB7XG4gICAgICAgICAgc2VsZWN0b3JbMF0gPSAoYCR7c2VsZWN0b3JbMF19Om50aC1vZi10eXBlKCR7aSsxfSlgKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZWN0b3IudW5zaGlmdChwYXJlbnQubmFtZSlcbiAgfVxuICByZXR1cm4gcGFyZW50ICYmIHBhcmVudC5wYXJlbnQgPyBnZXRTZWxlY3RvcihwYXJlbnQsIHNlbGVjdG9yKSA6IHNlbGVjdG9yLmpvaW4oJyA+ICcpXG59XG5cbi8qKlxuICogW2dldERlcHRoIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSBub2RlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7TnVtYmVyfSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVwdGggKG5vZGUpIHtcbiAgdmFyIGxldmVsID0gMSAvLyBsZXZlbDogMFxuICB3aGlsZSAobm9kZS5wYXJlbnQpIHtcbiAgICBsZXZlbCArPSAxXG4gICAgbm9kZSA9IG5vZGUucGFyZW50XG4gIH1cbiAgcmV0dXJuIGxldmVsXG59XG5cbi8qKlxuICogQ2hhbmdlcyB0aGUgdGhlIHZhbHVlcyBpbiB0aGUgbmVzdGVkIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7SW1tdXRhYmxlLk1hcH0gbWFwICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7QXJyYXl9ICAgICAgICAgbGlzdEtleSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7QXJyYXl9ICAgICAgICAga2V5UGF0aCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7KnxGdW5jdGlvbn0gICAgdmFsdWUgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldERlZXAgKG1hcCwgbGlzdEtleSwga2V5UGF0aCwgdmFsdWUpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3RLZXkpKSB7XG4gICAgbGlzdEtleSA9IFtsaXN0S2V5XVxuICB9XG4gIGNvbnN0IGNoYW5nZSA9ICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpID8gJ3VwZGF0ZUluJyA6ICdzZXRJbidcbiAgY29uc3Qgc3ViUGF0aHMgPSBnZXRQYXRocyhtYXAsIGxpc3RLZXksIGtleVBhdGgpXG4gIHJldHVybiBtYXAud2l0aE11dGF0aW9ucygobWFwKSA9PiB7XG4gICAgc3ViUGF0aHMuZm9yRWFjaCgoa2V5UGF0aCkgPT4gbWFwW2NoYW5nZV0oa2V5UGF0aCwgdmFsdWUpKVxuICB9KVxuXG4gIGZ1bmN0aW9uIGdldFBhdGhzIChtYXAsIGxpc3RLZXlzLCBrZXlQYXRoLCBvdmVydmlldyA9IFtrZXlQYXRoXSkge1xuICAgIGNvbnN0IGxpc3QgPSBtYXAuZ2V0SW4obGlzdEtleXMpXG4gICAgaWYgKGxpc3QpIHtcbiAgICAgIGNvbnN0IHNpemUgPSBsaXN0LnNpemVcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgIG92ZXJ2aWV3LnB1c2goWy4uLmxpc3RLZXlzLCBpLCAuLi5rZXlQYXRoXSlcbiAgICAgICAgZ2V0UGF0aHMobWFwLCBbLi4ubGlzdEtleXMsIGksIGxpc3RLZXlzWzBdXSwga2V5UGF0aCwgb3ZlcnZpZXcpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdmVydmlld1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
