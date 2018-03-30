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
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [node.name];

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
    var overview = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [keyPath];

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy5qcyJdLCJuYW1lcyI6WyJnZXRTZWxlY3RvciIsImdldERlcHRoIiwic2V0RGVlcCIsIm5vZGUiLCJzZWxlY3RvciIsIm5hbWUiLCJwYXJlbnQiLCJjaGlsZHJlbiIsIm1hdGNoZXMiLCJmaWx0ZXIiLCJjaGlsZCIsImxlbmd0aCIsImkiLCJsIiwidW5zaGlmdCIsImpvaW4iLCJsZXZlbCIsIm1hcCIsImxpc3RLZXkiLCJrZXlQYXRoIiwidmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJjaGFuZ2UiLCJzdWJQYXRocyIsImdldFBhdGhzIiwid2l0aE11dGF0aW9ucyIsImZvckVhY2giLCJsaXN0S2V5cyIsIm92ZXJ2aWV3IiwibGlzdCIsImdldEluIiwic2l6ZSIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7O1FBWWdCQSxXLEdBQUFBLFc7UUF1QkFDLFEsR0FBQUEsUTtRQWdCQUMsTyxHQUFBQSxPOzs7O0FBbkRoQjs7Ozs7O0FBTUE7Ozs7OztBQU1PLFNBQVNGLFdBQVQsQ0FBc0JHLElBQXRCLEVBQW9EO0FBQUEsTUFBeEJDLFFBQXdCLHVFQUFiLENBQUNELEtBQUtFLElBQU4sQ0FBYTs7QUFDekQsTUFBTUMsU0FBU0gsS0FBS0csTUFBcEI7QUFDQSxNQUFJQSxNQUFKLEVBQVk7QUFDVixRQUFNQyxXQUFXRCxPQUFPQyxRQUF4QjtBQUNBLFFBQU1DLFVBQVVELFNBQVNFLE1BQVQsQ0FBZ0IsVUFBQ0MsS0FBRDtBQUFBLGFBQVdBLE1BQU1MLElBQU4sS0FBZUYsS0FBS0UsSUFBL0I7QUFBQSxLQUFoQixDQUFoQjtBQUNBLFFBQUlHLFFBQVFHLE1BQVIsR0FBaUIsQ0FBckIsRUFBd0I7QUFDdEIsV0FBSyxJQUFJQyxJQUFJLENBQVIsRUFBV0MsSUFBSUwsUUFBUUcsTUFBNUIsRUFBb0NDLElBQUlDLENBQXhDLEVBQTJDRCxHQUEzQyxFQUFnRDtBQUM5QyxZQUFJSixRQUFRSSxDQUFSLE1BQWVULElBQW5CLEVBQXlCO0FBQ3ZCQyxtQkFBUyxDQUFULElBQWtCQSxTQUFTLENBQVQsQ0FBbEIsc0JBQTZDUSxJQUFFLENBQS9DO0FBQ0E7QUFDRDtBQUNGO0FBQ0Y7QUFDRFIsYUFBU1UsT0FBVCxDQUFpQlIsT0FBT0QsSUFBeEI7QUFDRDtBQUNELFNBQU9DLFVBQVVBLE9BQU9BLE1BQWpCLEdBQTBCTixZQUFZTSxNQUFaLEVBQW9CRixRQUFwQixDQUExQixHQUEwREEsU0FBU1csSUFBVCxDQUFjLEtBQWQsQ0FBakU7QUFDRDs7QUFFRDs7Ozs7QUFLTyxTQUFTZCxRQUFULENBQW1CRSxJQUFuQixFQUF5QjtBQUM5QixNQUFJYSxRQUFRLENBQVosQ0FEOEIsQ0FDaEI7QUFDZCxTQUFPYixLQUFLRyxNQUFaLEVBQW9CO0FBQ2xCVSxhQUFTLENBQVQ7QUFDQWIsV0FBT0EsS0FBS0csTUFBWjtBQUNEO0FBQ0QsU0FBT1UsS0FBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT08sU0FBU2QsT0FBVCxDQUFrQmUsR0FBbEIsRUFBdUJDLE9BQXZCLEVBQWdDQyxPQUFoQyxFQUF5Q0MsS0FBekMsRUFBZ0Q7QUFDckQsTUFBSSxDQUFDQyxNQUFNQyxPQUFOLENBQWNKLE9BQWQsQ0FBTCxFQUE2QjtBQUMzQkEsY0FBVSxDQUFDQSxPQUFELENBQVY7QUFDRDtBQUNELE1BQU1LLFNBQVUsT0FBT0gsS0FBUCxLQUFpQixVQUFsQixHQUFnQyxVQUFoQyxHQUE2QyxPQUE1RDtBQUNBLE1BQU1JLFdBQVdDLFNBQVNSLEdBQVQsRUFBY0MsT0FBZCxFQUF1QkMsT0FBdkIsQ0FBakI7QUFDQSxTQUFPRixJQUFJUyxhQUFKLENBQWtCLFVBQUNULEdBQUQsRUFBUztBQUNoQ08sYUFBU0csT0FBVCxDQUFpQixVQUFDUixPQUFEO0FBQUEsYUFBYUYsSUFBSU0sTUFBSixFQUFZSixPQUFaLEVBQXFCQyxLQUFyQixDQUFiO0FBQUEsS0FBakI7QUFDRCxHQUZNLENBQVA7O0FBSUEsV0FBU0ssUUFBVCxDQUFtQlIsR0FBbkIsRUFBd0JXLFFBQXhCLEVBQWtDVCxPQUFsQyxFQUFpRTtBQUFBLFFBQXRCVSxRQUFzQix1RUFBWCxDQUFDVixPQUFELENBQVc7O0FBQy9ELFFBQU1XLE9BQU9iLElBQUljLEtBQUosQ0FBVUgsUUFBVixDQUFiO0FBQ0EsUUFBSUUsSUFBSixFQUFVO0FBQ1IsVUFBTUUsT0FBT0YsS0FBS0UsSUFBbEI7QUFDQSxXQUFLLElBQUlwQixJQUFJLENBQWIsRUFBZ0JBLElBQUlvQixJQUFwQixFQUEwQnBCLEdBQTFCLEVBQStCO0FBQzdCaUIsaUJBQVNJLElBQVQsOEJBQWtCTCxRQUFsQixJQUE0QmhCLENBQTVCLHNCQUFrQ08sT0FBbEM7QUFDQU0saUJBQVNSLEdBQVQsK0JBQWtCVyxRQUFsQixJQUE0QmhCLENBQTVCLEVBQStCZ0IsU0FBUyxDQUFULENBQS9CLElBQTZDVCxPQUE3QyxFQUFzRFUsUUFBdEQ7QUFDRDtBQUNGO0FBQ0QsV0FBT0EsUUFBUDtBQUNEO0FBQ0YiLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIFV0aWxpdGllc1xuICpcbiAqIEhlbHBlciBmdW5jdGlvbnNcbiAqL1xuXG4vKipcbiAqIFtnZXRTZWxlY3RvciBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gbm9kZSAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gIHNlbGVjdG9yIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdG9yIChub2RlLCBzZWxlY3RvciA9IFtub2RlLm5hbWVdKSB7XG4gIGNvbnN0IHBhcmVudCA9IG5vZGUucGFyZW50XG4gIGlmIChwYXJlbnQpIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZHJlblxuICAgIGNvbnN0IG1hdGNoZXMgPSBjaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZC5uYW1lID09PSBub2RlLm5hbWUpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBtYXRjaGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAobWF0Y2hlc1tpXSA9PT0gbm9kZSkge1xuICAgICAgICAgIHNlbGVjdG9yWzBdID0gKGAke3NlbGVjdG9yWzBdfTpudGgtb2YtdHlwZSgke2krMX0pYClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGVjdG9yLnVuc2hpZnQocGFyZW50Lm5hbWUpXG4gIH1cbiAgcmV0dXJuIHBhcmVudCAmJiBwYXJlbnQucGFyZW50ID8gZ2V0U2VsZWN0b3IocGFyZW50LCBzZWxlY3RvcikgOiBzZWxlY3Rvci5qb2luKCcgPiAnKVxufVxuXG4vKipcbiAqIFtnZXREZXB0aCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gbm9kZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge051bWJlcn0gICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlcHRoIChub2RlKSB7XG4gIHZhciBsZXZlbCA9IDEgLy8gbGV2ZWw6IDBcbiAgd2hpbGUgKG5vZGUucGFyZW50KSB7XG4gICAgbGV2ZWwgKz0gMVxuICAgIG5vZGUgPSBub2RlLnBhcmVudFxuICB9XG4gIHJldHVybiBsZXZlbFxufVxuXG4vKipcbiAqIENoYW5nZXMgdGhlIHRoZSB2YWx1ZXMgaW4gdGhlIG5lc3RlZCBjb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0ltbXV0YWJsZS5NYXB9IG1hcCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0ge0FycmF5fSAgICAgICAgIGxpc3RLZXkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0ge0FycmF5fSAgICAgICAgIGtleVBhdGggLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0geyp8RnVuY3Rpb259ICAgIHZhbHVlICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXREZWVwIChtYXAsIGxpc3RLZXksIGtleVBhdGgsIHZhbHVlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0S2V5KSkge1xuICAgIGxpc3RLZXkgPSBbbGlzdEtleV1cbiAgfVxuICBjb25zdCBjaGFuZ2UgPSAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/ICd1cGRhdGVJbicgOiAnc2V0SW4nXG4gIGNvbnN0IHN1YlBhdGhzID0gZ2V0UGF0aHMobWFwLCBsaXN0S2V5LCBrZXlQYXRoKVxuICByZXR1cm4gbWFwLndpdGhNdXRhdGlvbnMoKG1hcCkgPT4ge1xuICAgIHN1YlBhdGhzLmZvckVhY2goKGtleVBhdGgpID0+IG1hcFtjaGFuZ2VdKGtleVBhdGgsIHZhbHVlKSlcbiAgfSlcblxuICBmdW5jdGlvbiBnZXRQYXRocyAobWFwLCBsaXN0S2V5cywga2V5UGF0aCwgb3ZlcnZpZXcgPSBba2V5UGF0aF0pIHtcbiAgICBjb25zdCBsaXN0ID0gbWFwLmdldEluKGxpc3RLZXlzKVxuICAgIGlmIChsaXN0KSB7XG4gICAgICBjb25zdCBzaXplID0gbGlzdC5zaXplXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICBvdmVydmlldy5wdXNoKFsuLi5saXN0S2V5cywgaSwgLi4ua2V5UGF0aF0pXG4gICAgICAgIGdldFBhdGhzKG1hcCwgWy4uLmxpc3RLZXlzLCBpLCBsaXN0S2V5c1swXV0sIGtleVBhdGgsIG92ZXJ2aWV3KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3ZlcnZpZXdcbiAgfVxufVxuIl19
