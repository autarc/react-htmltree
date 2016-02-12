'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utilities = require('../utilities');

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # Component: Container
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Update & delegation layer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var isBrowser = typeof HTMLElement !== 'undefined';

/**
 *
 */

var Container = function (_Component) {
  _inherits(Container, _Component);

  function Container(props) {
    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

    _this.state = {
      root: _this.getRoot(props),
      latest: null
    };
    return _this;
  }

  _createClass(Container, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.tree !== this.props.tree) {
        this.setState({
          root: this.getRoot(nextProps),
          latest: null
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var onHover = _props.onHover;
      var customRender = _props.customRender;
      var root = this.state.root;

      return _react2.default.createElement(
        'div',
        { className: 'Container' },
        _react2.default.createElement(
          'div',
          { className: 'Container__Nodes' },
          _react2.default.createElement(_Node2.default, { node: root, update: this.onUpdate.bind(this), onHover: onHover, customRender: customRender })
        ),
        _react2.default.createElement('input', { className: 'Container__Input', type: 'text', ref: 'input',
          onFocus: this.toggleFocus.bind(this),
          onBlur: this.toggleFocus.bind(this)
        })
      );
    }

    /**
     * Retrieve an immutable representation of the nodes (incl. extended/trimmed data)
     * @param  {Object}  props.tree                - [description]
     * @param  {Array}   props.defaultExpandedTags - [description]
     * @return {Object}                            - [description]
     */

  }, {
    key: 'getRoot',
    value: function getRoot(_ref) {
      var tree = _ref.tree;
      var defaultExpandedTags = _ref.defaultExpandedTags;

      transformNodes(tree, [], true);
      return _immutable2.default.fromJS(tree[0]);

      // recursive enumeration
      function transformNodes(tree, keyPath, initial) {
        tree.forEach(function (node, i) {
          node.depth = (0, _utilities.getDepth)(node);
          node.selector = (0, _utilities.getSelector)(node.name ? node : node.parent);
          node.keyPath = initial ? keyPath : [].concat(_toConsumableArray(keyPath), ['children', i]);
          node.state = defaultExpandedTags.indexOf(node.name) > -1 ? { expanded: true } : {};
          if (node.children) {
            if (node.children.length) {
              node.children = node.children.filter(function (child) {
                return child.type !== 'text' || child.data.trim().length;
              });
              transformNodes(node.children, node.keyPath);
            } else {
              delete node.children;
            }
          }
          if (node.attribs && !Object.keys(node.attribs).length) {
            delete node.attribs;
          }
          delete node.parent;
          delete node.next;
          delete node.prev;
        });
      }
    }

    /**
     * [toggleFocus description]
     * @param  {Event} e - [description]
     */

  }, {
    key: 'toggleFocus',
    value: function toggleFocus(e) {
      var _this2 = this;

      e.preventDefault();
      e.stopPropagation();

      var latest = this.state.latest;


      if (e.type === 'focus') {
        return this.onUpdate(null, latest, 'toggleFocus', { selected: true, unfocused: false });
      }
      // === blur || delay to check upcoming click
      this.timeout = setTimeout(function () {
        return _this2.onUpdate(null, latest, 'toggleFocus', { selected: false, unfocused: true });
      }, 100);
    }

    /**
     * Reducer for different actions based on the type
     * @param  {String} type      - [description]
     * @param  {Object} component - [description]
     * @param  {Object} nextState - [description]
     */

    /**
     * Reducer for different actions based on the type
     * @param  {Event}          e         - [description]
     * @param  {ReactComponent} component - [description]
     * @param  {String}         type      - [description]
     * @param  {Object}         data      - [description]
     */

  }, {
    key: 'onUpdate',
    value: function onUpdate(e, component, type, data) {
      var _this3 = this,
          _context2;

      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();

      clearTimeout(this.timeout);

      var _props2 = this.props;
      var origin = _props2.origin;
      var onHover = _props2.onHover;
      var onExpand = _props2.onExpand;
      var onSelect = _props2.onSelect;
      var onUnfocus = _props2.onUnfocus;
      var node = component.props.node;
      var _state = this.state;
      var root = _state.root;
      var latest = _state.latest;


      var name = node.get('name');
      var attribs = node.get('attribs');
      var selector = node.get('selector');

      var element = origin ? selector.match('>') ? origin.querySelectorAll(selector)[0] : origin : { // shallow representation
        tagName: name || node.get('type'),
        attributes: attribs && attribs.toJS(),
        selector: selector
      };

      var keyPath = [].concat(_toConsumableArray(node.get('keyPath').toJS()), ['state']);
      var updater = null; // toggle: (value) => !value

      switch (type) {

        case 'toggleHover':
          if (onHover && onHover.call(this, element, component) !== undefined) return;
          if (typeof data.tailed !== 'undefined') {
            keyPath = [].concat(_toConsumableArray(keyPath), ['tailed']);
            updater = function updater() {
              return data.tailed;
            };
            break;
          }
          return;

        case 'toggleExpand':
          if (onExpand && onExpand.call(this, element, component) !== undefined) return;
          // check: unfolding all children
          if (e.altKey && e.ctrlKey) {
            return this.setState({
              root: root.setIn([].concat(_toConsumableArray(node.get('keyPath').toJS())), (0, _utilities.setDeep)(node, 'children', ['state', 'expanded'], true))
            });
          }
          // TODO:
          // - fix [issue#1]('tailed')
          // console.log(node.toJSON(), data, e.target)
          keyPath = [].concat(_toConsumableArray(keyPath), ['expanded']);
          updater = function updater(expanded) {
            return !expanded;
          };
          break;

        case 'triggerSelect':
          if (latest) {
            var _ret = function () {
              var _context;

              _this3.refs.input.blur();
              var latestKeyPath = [].concat(_toConsumableArray(latest.props.node.get('keyPath').toJS()), ['state']);
              return {
                v: _this3.setState({
                  root: root.withMutations(function (map) {
                    return map.setIn([].concat(_toConsumableArray(latestKeyPath), ['tailed']), false).setIn([].concat(_toConsumableArray(latestKeyPath), ['selected']), false).setIn([].concat(_toConsumableArray(latestKeyPath), ['unfocused']), false).setIn([].concat(_toConsumableArray(keyPath), ['tailed']), data.tailed);
                  }),
                  latest: component
                }, (_context = _this3.refs.input).focus.bind(_context))
              };
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }
          return this.setState({
            root: root.setIn([].concat(_toConsumableArray(keyPath), ['tailed']), data.tailed),
            latest: component
          }, (_context2 = this.refs.input).focus.bind(_context2));

        case 'toggleFocus':
          if (data.selected) {
            if (onSelect && onSelect.call(this, element, component) !== undefined) return;
          } else {
            if (onUnfocus && onUnfocus.call(this, element, component) !== undefined) return;
          }
          return this.setState({
            root: root.withMutations(function (map) {
              return map.setIn([].concat(_toConsumableArray(keyPath), ['selected']), data.selected).setIn([].concat(_toConsumableArray(keyPath), ['unfocused']), data.unfocused);
            })
          });
      }

      this.setState({
        root: root.updateIn(keyPath, updater)
      });
    }
  }]);

  return Container;
}(_react.Component);

Container.propTypes = {
  tree: _react.PropTypes.array.isRequired,
  origin: _react.PropTypes.instanceOf(isBrowser && HTMLElement),
  defaultExpandedTags: _react.PropTypes.array.isRequired,
  customRender: _react.PropTypes.func,
  onHover: _react.PropTypes.func,
  onExpand: _react.PropTypes.func,
  onSelect: _react.PropTypes.func,
  onUnfocus: _react.PropTypes.func
};
exports.default = Container;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29udGFpbmVyLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlBLElBQU0sWUFBWSxPQUFPLFdBQVAsS0FBdUIsV0FBdkI7Ozs7OztJQUtHOzs7QUFhbkIsV0FibUIsU0FhbkIsQ0FBYSxLQUFiLEVBQW9COzBCQWJELFdBYUM7O3VFQWJELHNCQWNYLFFBRFk7O0FBRWxCLFVBQUssS0FBTCxHQUFhO0FBQ1gsWUFBTSxNQUFLLE9BQUwsQ0FBYSxLQUFiLENBQU47QUFDQSxjQUFRLElBQVI7S0FGRixDQUZrQjs7R0FBcEI7O2VBYm1COzs4Q0FxQlEsV0FBVztBQUNwQyxVQUFJLFVBQVUsSUFBVixLQUFtQixLQUFLLEtBQUwsQ0FBVyxJQUFYLEVBQWlCO0FBQ3RDLGFBQUssUUFBTCxDQUFjO0FBQ1osZ0JBQU0sS0FBSyxPQUFMLENBQWEsU0FBYixDQUFOO0FBQ0Esa0JBQVEsSUFBUjtTQUZGLEVBRHNDO09BQXhDOzs7OzZCQVFNO21CQUM0QixLQUFLLEtBQUwsQ0FENUI7VUFDRSx5QkFERjtVQUNXLG1DQURYO1VBRUUsT0FBUyxLQUFLLEtBQUwsQ0FBVCxLQUZGOztBQUdOLGFBQ0U7O1VBQUssV0FBVSxXQUFWLEVBQUw7UUFDRTs7WUFBSyxXQUFVLGtCQUFWLEVBQUw7VUFDRSxnREFBTSxNQUFNLElBQU4sRUFBWSxRQUFVLEtBQUssUUFBTCxXQUFWLEVBQXlCLFNBQVMsT0FBVCxFQUFrQixjQUFjLFlBQWQsRUFBN0QsQ0FERjtTQURGO1FBSUUseUNBQU8sV0FBVSxrQkFBVixFQUE2QixNQUFLLE1BQUwsRUFBWSxLQUFJLE9BQUo7QUFDOUMsbUJBQVcsS0FBSyxXQUFMLFdBQVg7QUFDQSxrQkFBVSxLQUFLLFdBQUwsV0FBVjtTQUZGLENBSkY7T0FERixDQUhNOzs7Ozs7Ozs7Ozs7a0NBc0JnQztVQUE3QixpQkFBNkI7VUFBdkIsK0NBQXVCOztBQUN0QyxxQkFBZSxJ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Z0JBQUksWUFBWSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLE9BQXBCLEVBQTZCLFNBQTdCLE1BQTRDLFNBQTVDLEVBQXVELE9BQXZFO1dBREYsTUFFTztBQUNMLGdCQUFJLGFBQWEsVUFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixPQUFyQixFQUE4QixTQUE5QixNQUE2QyxTQUE3QyxFQUF3RCxPQUF6RTtXQUhGO0FBS0EsaUJBQU8sS0FBSyxRQUFMLENBQWM7QUFDbkIsa0JBQU0sS0FBSyxhQUFMLENBQW1CLFVBQUMsR0FBRDtxQkFBUyxJQUNyQixLQURxQiw4QkFDWCxXQUFTLFlBREUsRUFDVyxLQUFLLFFBQUwsQ0FEWCxDQUVyQixLQUZxQiw4QkFFWCxXQUFTLGFBRkUsRUFFWSxLQUFLLFNBQUw7YUFGckIsQ0FBekI7V0FESyxDQUFQLENBTkY7QUE3Q0YsT0F4QmtDOztBQW1GbEMsV0FBSyxRQUFMLENBQWM7QUFDWixjQUFNLEtBQUssUUFBTCxDQUFjLE9BQWQsRUFBdUIsT0FBdkIsQ0FBTjtPQURGLEVBbkZrQzs7OztTQWxIakI7OztVQUVaLFlBQVk7QUFDakIsUUFBTSxpQkFBVSxLQUFWLENBQWdCLFVBQWhCO0FBQ04sVUFBUSxpQkFBVSxVQUFWLENBQXFCLGFBQWEsV0FBYixDQUE3QjtBQUNBLHVCQUFxQixpQkFBVSxLQUFWLENBQWdCLFVBQWhCO0FBQ3JCLGdCQUFjLGlCQUFVLElBQVY7QUFDZCxXQUFTLGlCQUFVLElBQVY7QUFDVCxZQUFVLGlCQUFVLElBQVY7QUFDVixZQUFVLGlCQUFVLElBQVY7QUFDVixhQUFXLGlCQUFVLElBQVY7O2tCQVZNIiwiZmlsZSI6ImNvbXBvbmVudHMvQ29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIENvbXBvbmVudDogQ29udGFpbmVyXG4gKlxuICogVXBkYXRlICYgZGVsZWdhdGlvbiBsYXllclxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnXG5cbmltcG9ydCB7IGdldFNlbGVjdG9yLCBnZXREZXB0aCwgc2V0RGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcydcbmltcG9ydCBOb2RlIGZyb20gJy4vTm9kZSdcblxuY29uc3QgaXNCcm93c2VyID0gdHlwZW9mIEhUTUxFbGVtZW50ICE9PSAndW5kZWZpbmVkJ1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0cmVlOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBvcmlnaW46IFByb3BUeXBlcy5pbnN0YW5jZU9mKGlzQnJvd3NlciAmJiBIVE1MRWxlbWVudCksXG4gICAgZGVmYXVsdEV4cGFuZGVkVGFnczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgY3VzdG9tUmVuZGVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkhvdmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkV4cGFuZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uVW5mb2N1czogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcm9vdDogdGhpcy5nZXRSb290KHByb3BzKSxcbiAgICAgIGxhdGVzdDogbnVsbFxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIGlmIChuZXh0UHJvcHMudHJlZSAhPT0gdGhpcy5wcm9wcy50cmVlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcm9vdDogdGhpcy5nZXRSb290KG5leHRQcm9wcyksXG4gICAgICAgIGxhdGVzdDogbnVsbFxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKXtcbiAgICBjb25zdCB7IG9uSG92ZXIsIGN1c3RvbVJlbmRlciB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcy5zdGF0ZVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIkNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkNvbnRhaW5lcl9fTm9kZXNcIj5cbiAgICAgICAgICA8Tm9kZSBub2RlPXtyb290fSB1cGRhdGU9ezo6dGhpcy5vblVwZGF0ZX0gb25Ib3Zlcj17b25Ib3Zlcn0gY3VzdG9tUmVuZGVyPXtjdXN0b21SZW5kZXJ9Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJDb250YWluZXJfX0lucHV0XCIgdHlwZT1cInRleHRcIiByZWY9XCJpbnB1dFwiXG4gICAgICAgICAgb25Gb2N1cz17Ojp0aGlzLnRvZ2dsZUZvY3VzfVxuICAgICAgICAgIG9uQmx1cj17Ojp0aGlzLnRvZ2dsZUZvY3VzfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuIGltbXV0YWJsZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgbm9kZXMgKGluY2wuIGV4dGVuZGVkL3RyaW1tZWQgZGF0YSlcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgcHJvcHMudHJlZSAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7QXJyYXl9ICAgcHJvcHMuZGVmYXVsdEV4cGFuZGVkVGFncyAtIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldFJvb3QgKHsgdHJlZSwgZGVmYXVsdEV4cGFuZGVkVGFncyB9KSB7XG4gICAgdHJhbnNmb3JtTm9kZXModHJlZSwgW10sIHRydWUpXG4gICAgcmV0dXJuIEltbXV0YWJsZS5mcm9tSlModHJlZVswXSlcblxuICAgIC8vIHJlY3Vyc2l2ZSBlbnVtZXJhdGlvblxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybU5vZGVzICh0cmVlLCBrZXlQYXRoLCBpbml0aWFsKSB7XG4gICAgICB0cmVlLmZvckVhY2goKG5vZGUsIGkpID0+IHtcbiAgICAgICAgbm9kZS5kZXB0aCA9IGdldERlcHRoKG5vZGUpXG4gICAgICAgIG5vZGUuc2VsZWN0b3IgPSBnZXRTZWxlY3Rvcihub2RlLm5hbWUgPyBub2RlIDogbm9kZS5wYXJlbnQpXG4gICAgICAgIG5vZGUua2V5UGF0aCA9IGluaXRpYWwgPyBrZXlQYXRoIDogWy4uLmtleVBhdGgsICdjaGlsZHJlbicsIGldXG4gICAgICAgIG5vZGUuc3RhdGUgPSBkZWZhdWx0RXhwYW5kZWRUYWdzLmluZGV4T2Yobm9kZS5uYW1lKSA+IC0xID8geyBleHBhbmRlZDogdHJ1ZSB9IDoge31cbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuLmZpbHRlcigoY2hpbGQpID0+IGNoaWxkLnR5cGUgIT09ICd0ZXh0JyB8fCBjaGlsZC5kYXRhLnRyaW0oKS5sZW5ndGgpXG4gICAgICAgICAgICB0cmFuc2Zvcm1Ob2Rlcyhub2RlLmNoaWxkcmVuLCBub2RlLmtleVBhdGgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLmF0dHJpYnMgJiYgIU9iamVjdC5rZXlzKG5vZGUuYXR0cmlicykubGVuZ3RoKSB7XG4gICAgICAgICAgZGVsZXRlIG5vZGUuYXR0cmlic1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBub2RlLnBhcmVudFxuICAgICAgICBkZWxldGUgbm9kZS5uZXh0XG4gICAgICAgIGRlbGV0ZSBub2RlLnByZXZcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFt0b2dnbGVGb2N1cyBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7RXZlbnR9IGUgLSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICB0b2dnbGVGb2N1cyAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIGNvbnN0IHsgbGF0ZXN0IH0gPSB0aGlzLnN0YXRlXG5cbiAgICBpZiAoZS50eXBlID09PSAnZm9jdXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5vblVwZGF0ZShudWxsLCBsYXRlc3QsICd0b2dnbGVGb2N1cycsIHsgc2VsZWN0ZWQ6IHRydWUsIHVuZm9jdXNlZDogZmFsc2UgfSlcbiAgICB9XG4gICAgLy8gPT09IGJsdXIgfHwgZGVsYXkgdG8gY2hlY2sgdXBjb21pbmcgY2xpY2tcbiAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLm9uVXBkYXRlKG51bGwsIGxhdGVzdCwgJ3RvZ2dsZUZvY3VzJywgeyBzZWxlY3RlZDogZmFsc2UsIHVuZm9jdXNlZDogdHJ1ZSB9KVxuICAgIH0sIDEwMClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIGZvciBkaWZmZXJlbnQgYWN0aW9ucyBiYXNlZCBvbiB0aGUgdHlwZVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHR5cGUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7T2JqZWN0fSBjb21wb25lbnQgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge09iamVjdH0gbmV4dFN0YXRlIC0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cblxuICAvKipcbiAgICogUmVkdWNlciBmb3IgZGlmZmVyZW50IGFjdGlvbnMgYmFzZWQgb24gdGhlIHR5cGVcbiAgICogQHBhcmFtICB7RXZlbnR9ICAgICAgICAgIGUgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7UmVhY3RDb21wb25lbnR9IGNvbXBvbmVudCAtIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgIHR5cGUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGRhdGEgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIG9uVXBkYXRlIChlLCBjb21wb25lbnQsIHR5cGUsIGRhdGEpIHtcbiAgICBpZiAoZSAmJiBlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KClcbiAgICBpZiAoZSAmJiBlLnN0b3BQcm9wYWdhdGlvbikgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcblxuICAgIGNvbnN0IHsgb3JpZ2luLCBvbkhvdmVyLCBvbkV4cGFuZCwgb25TZWxlY3QsIG9uVW5mb2N1cyB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IHsgbm9kZSB9ID0gY29tcG9uZW50LnByb3BzXG4gICAgY29uc3QgeyByb290LCBsYXRlc3QgfSA9IHRoaXMuc3RhdGVcblxuICAgIGNvbnN0IG5hbWUgPSBub2RlLmdldCgnbmFtZScpXG4gICAgY29uc3QgYXR0cmlicyA9IG5vZGUuZ2V0KCdhdHRyaWJzJylcbiAgICBjb25zdCBzZWxlY3RvciA9IG5vZGUuZ2V0KCdzZWxlY3RvcicpXG5cbiAgICBjb25zdCBlbGVtZW50ID0gb3JpZ2luID8gKHNlbGVjdG9yLm1hdGNoKCc+JykgPyBvcmlnaW4ucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilbMF0gOiBvcmlnaW4pIDpcbiAgICAgICAgICAgICAgICAgICAgeyAvLyBzaGFsbG93IHJlcHJlc2VudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgdGFnTmFtZTogbmFtZSB8fCBub2RlLmdldCgndHlwZScpLFxuICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnMgJiYgYXR0cmlicy50b0pTKCksXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgIHZhciBrZXlQYXRoID0gWy4uLm5vZGUuZ2V0KCdrZXlQYXRoJykudG9KUygpLCAnc3RhdGUnXVxuICAgIHZhciB1cGRhdGVyID0gbnVsbCAvLyB0b2dnbGU6ICh2YWx1ZSkgPT4gIXZhbHVlXG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcblxuICAgICAgY2FzZSAndG9nZ2xlSG92ZXInOlxuICAgICAgICBpZiAob25Ib3ZlciAmJiBvbkhvdmVyLmNhbGwodGhpcywgZWxlbWVudCwgY29tcG9uZW50KSAhPT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnRhaWxlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBrZXlQYXRoID0gWy4uLmtleVBhdGgsICd0YWlsZWQnXVxuICAgICAgICAgIHVwZGF0ZXIgPSAoKSA9PiBkYXRhLnRhaWxlZFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGNhc2UgJ3RvZ2dsZUV4cGFuZCc6XG4gICAgICAgIGlmIChvbkV4cGFuZCAmJiBvbkV4cGFuZC5jYWxsKHRoaXMsIGVsZW1lbnQsIGNvbXBvbmVudCkgIT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIC8vIGNoZWNrOiB1bmZvbGRpbmcgYWxsIGNoaWxkcmVuXG4gICAgICAgIGlmIChlLmFsdEtleSAmJiBlLmN0cmxLZXkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByb290OiByb290LnNldEluKFsuLi5ub2RlLmdldCgna2V5UGF0aCcpLnRvSlMoKV0sIHNldERlZXAobm9kZSwgJ2NoaWxkcmVuJywgWydzdGF0ZScsICdleHBhbmRlZCddLCB0cnVlKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86XG4gICAgICAgIC8vIC0gZml4IFtpc3N1ZSMxXSgndGFpbGVkJylcbiAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZS50b0pTT04oKSwgZGF0YSwgZS50YXJnZXQpXG4gICAgICAgIGtleVBhdGggPSBbLi4ua2V5UGF0aCwgJ2V4cGFuZGVkJ11cbiAgICAgICAgdXBkYXRlciA9IChleHBhbmRlZCkgPT4gIWV4cGFuZGVkXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgJ3RyaWdnZXJTZWxlY3QnOlxuICAgICAgICBpZiAobGF0ZXN0KSB7XG4gICAgICAgICAgdGhpcy5yZWZzLmlucHV0LmJsdXIoKVxuICAgICAgICAgIGNvbnN0IGxhdGVzdEtleVBhdGggPSBbLi4ubGF0ZXN0LnByb3BzLm5vZGUuZ2V0KCdrZXlQYXRoJykudG9KUygpLCAnc3RhdGUnXVxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHJvb3Q6IHJvb3Qud2l0aE11dGF0aW9ucygobWFwKSA9PiBtYXBcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ubGF0ZXN0S2V5UGF0aCwgJ3RhaWxlZCddLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ubGF0ZXN0S2V5UGF0aCwgJ3NlbGVjdGVkJ10sIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5sYXRlc3RLZXlQYXRoLCAndW5mb2N1c2VkJ10sIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5rZXlQYXRoLCAndGFpbGVkJ10sIGRhdGEudGFpbGVkKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGxhdGVzdDogY29tcG9uZW50XG4gICAgICAgICAgfSwgOjp0aGlzLnJlZnMuaW5wdXQuZm9jdXMpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHJvb3Q6IHJvb3Quc2V0SW4oWy4uLmtleVBhdGgsICd0YWlsZWQnXSwgZGF0YS50YWlsZWQpLFxuICAgICAgICAgIGxhdGVzdDogY29tcG9uZW50XG4gICAgICAgIH0sIDo6dGhpcy5yZWZzLmlucHV0LmZvY3VzKVxuXG4gICAgICBjYXNlICd0b2dnbGVGb2N1cyc6XG4gICAgICAgIGlmIChkYXRhLnNlbGVjdGVkKSB7XG4gICAgICAgICAgaWYgKG9uU2VsZWN0ICYmIG9uU2VsZWN0LmNhbGwodGhpcywgZWxlbWVudCwgY29tcG9uZW50KSAhPT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob25VbmZvY3VzICYmIG9uVW5mb2N1cy5jYWxsKHRoaXMsIGVsZW1lbnQsIGNvbXBvbmVudCkgIT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHJvb3Q6IHJvb3Qud2l0aE11dGF0aW9ucygobWFwKSA9PiBtYXBcbiAgICAgICAgICAgICAgICAgICAgICAuc2V0SW4oWy4uLmtleVBhdGgsICdzZWxlY3RlZCddLCBkYXRhLnNlbGVjdGVkKVxuICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ua2V5UGF0aCwgJ3VuZm9jdXNlZCddLCBkYXRhLnVuZm9jdXNlZClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByb290OiByb290LnVwZGF0ZUluKGtleVBhdGgsIHVwZGF0ZXIpXG4gICAgfSlcbiAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
