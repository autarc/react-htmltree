'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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

    var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

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
      var _this2 = this;

      var _props = this.props,
          onHover = _props.onHover,
          customRender = _props.customRender;
      var root = this.state.root;

      return _react2.default.createElement(
        'div',
        { className: 'Container' },
        _react2.default.createElement(
          'div',
          { className: 'Container__Nodes' },
          _react2.default.createElement(_Node2.default, { node: root, update: this.onUpdate.bind(this), onHover: onHover, customRender: customRender })
        ),
        _react2.default.createElement('input', { className: 'Container__Input', type: 'text', ref: function ref(input) {
            _this2.input = input;
          } }),
        'onFocus=',
        this.toggleFocus.bind(this),
        'onBlur=',
        this.toggleFocus.bind(this),
        '/>'
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
      var tree = _ref.tree,
          defaultExpandedTags = _ref.defaultExpandedTags;

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
      var _this3 = this;

      e.preventDefault();
      e.stopPropagation();

      var latest = this.state.latest;


      if (e.type === 'focus') {
        return this.onUpdate(null, latest, 'toggleFocus', { selected: true, unfocused: false });
      }
      // === blur || delay to check upcoming click
      this.timeout = setTimeout(function () {
        return _this3.onUpdate(null, latest, 'toggleFocus', { selected: false, unfocused: true });
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
      var _context2;

      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();

      clearTimeout(this.timeout);

      var _props2 = this.props,
          origin = _props2.origin,
          onHover = _props2.onHover,
          onExpand = _props2.onExpand,
          onSelect = _props2.onSelect,
          onUnfocus = _props2.onUnfocus;
      var node = component.props.node;
      var _state = this.state,
          root = _state.root,
          latest = _state.latest;


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
            var _context;

            this.input.blur();
            var latestKeyPath = [].concat(_toConsumableArray(latest.props.node.get('keyPath').toJS()), ['state']);
            return this.setState({
              root: root.withMutations(function (map) {
                return map.setIn([].concat(_toConsumableArray(latestKeyPath), ['tailed']), false).setIn([].concat(_toConsumableArray(latestKeyPath), ['selected']), false).setIn([].concat(_toConsumableArray(latestKeyPath), ['unfocused']), false).setIn([].concat(_toConsumableArray(keyPath), ['tailed']), data.tailed);
              }),
              latest: component
            }, (_context = this.input).focus.bind(_context));
          }
          return this.setState({
            root: root.setIn([].concat(_toConsumableArray(keyPath), ['tailed']), data.tailed),
            latest: component
          }, (_context2 = this.input).focus.bind(_context2));

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
  tree: _propTypes2.default.array.isRequired,
  origin: _propTypes2.default.instanceOf(isBrowser && HTMLElement),
  defaultExpandedTags: _propTypes2.default.array.isRequired,
  customRender: _propTypes2.default.func,
  onHover: _propTypes2.default.func,
  onExpand: _propTypes2.default.func,
  onSelect: _propTypes2.default.func,
  onUnfocus: _propTypes2.default.func
};
exports.default = Container;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29udGFpbmVyLmpzeCJdLCJuYW1lcyI6WyJpc0Jyb3dzZXIiLCJIVE1MRWxlbWVudCIsIkNvbnRhaW5lciIsInByb3BzIiwic3RhdGUiLCJyb290IiwiZ2V0Um9vdCIsImxhdGVzdCIsIm5leHRQcm9wcyIsInRyZWUiLCJzZXRTdGF0ZSIsIm9uSG92ZXIiLCJjdXN0b21SZW5kZXIiLCJvblVwZGF0ZSIsImlucHV0IiwidG9nZ2xlRm9jdXMiLCJkZWZhdWx0RXhwYW5kZWRUYWdzIiwidHJhbnNmb3JtTm9kZXMiLCJmcm9tSlMiLCJrZXlQYXRoIiwiaW5pdGlhbCIsImZvckVhY2giLCJub2RlIiwiaSIsImRlcHRoIiwic2VsZWN0b3IiLCJuYW1lIiwicGFyZW50IiwiaW5kZXhPZiIsImV4cGFuZGVkIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJmaWx0ZXIiLCJjaGlsZCIsInR5cGUiLCJkYXRhIiwidHJpbSIsImF0dHJpYnMiLCJPYmplY3QiLCJrZXlzIiwibmV4dCIsInByZXYiLCJlIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJzZWxlY3RlZCIsInVuZm9jdXNlZCIsInRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiY29tcG9uZW50IiwiY2xlYXJUaW1lb3V0Iiwib3JpZ2luIiwib25FeHBhbmQiLCJvblNlbGVjdCIsIm9uVW5mb2N1cyIsImdldCIsImVsZW1lbnQiLCJtYXRjaCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ0YWdOYW1lIiwiYXR0cmlidXRlcyIsInRvSlMiLCJ1cGRhdGVyIiwiY2FsbCIsInVuZGVmaW5lZCIsInRhaWxlZCIsImFsdEtleSIsImN0cmxLZXkiLCJzZXRJbiIsImJsdXIiLCJsYXRlc3RLZXlQYXRoIiwid2l0aE11dGF0aW9ucyIsIm1hcCIsImZvY3VzIiwidXBkYXRlSW4iLCJwcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJpbnN0YW5jZU9mIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7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QTJEQSxXQUFLcEMsUUFBTCxDQUFjO0FBQ1pMLGNBQU1BLEtBQUtxRSxRQUFMLENBQWN2RCxPQUFkLEVBQXVCMkMsT0FBdkI7QUFETSxPQUFkO0FBR0Q7Ozs7OztBQXhNa0I1RCxTLENBRVp5RSxTLEdBQVk7QUFDakJsRSxRQUFNLG9CQUFVbUUsS0FBVixDQUFnQkMsVUFETDtBQUVqQjFCLFVBQVEsb0JBQVUyQixVQUFWLENBQXFCOUUsYUFBYUMsV0FBbEMsQ0FGUztBQUdqQmUsdUJBQXFCLG9CQUFVNEQsS0FBVixDQUFnQkMsVUFIcEI7QUFJakJqRSxnQkFBYyxvQkFBVW1FLElBSlA7QUFLakJwRSxXQUFTLG9CQUFVb0UsSUFMRjtBQU1qQjNCLFlBQVUsb0JBQVUyQixJQU5IO0FBT2pCMUIsWUFBVSxvQkFBVTBCLElBUEg7QUFRakJ6QixhQUFXLG9CQUFVeUI7QUFSSixDO2tCQUZBN0UsUyIsImZpbGUiOiJjb21wb25lbnRzL0NvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBDb21wb25lbnQ6IENvbnRhaW5lclxuICpcbiAqIFVwZGF0ZSAmIGRlbGVnYXRpb24gbGF5ZXJcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSdcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcydcblxuaW1wb3J0IHsgZ2V0U2VsZWN0b3IsIGdldERlcHRoLCBzZXREZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJ1xuaW1wb3J0IE5vZGUgZnJvbSAnLi9Ob2RlJ1xuXG5jb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnXG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRyZWU6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgIG9yaWdpbjogUHJvcFR5cGVzLmluc3RhbmNlT2YoaXNCcm93c2VyICYmIEhUTUxFbGVtZW50KSxcbiAgICBkZWZhdWx0RXhwYW5kZWRUYWdzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBjdXN0b21SZW5kZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSG92ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRXhwYW5kOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25VbmZvY3VzOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByb290OiB0aGlzLmdldFJvb3QocHJvcHMpLFxuICAgICAgbGF0ZXN0OiBudWxsXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy50cmVlICE9PSB0aGlzLnByb3BzLnRyZWUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByb290OiB0aGlzLmdldFJvb3QobmV4dFByb3BzKSxcbiAgICAgICAgbGF0ZXN0OiBudWxsXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpe1xuICAgIGNvbnN0IHsgb25Ib3ZlciwgY3VzdG9tUmVuZGVyIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzLnN0YXRlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFpbmVyX19Ob2Rlc1wiPlxuICAgICAgICAgIDxOb2RlIG5vZGU9e3Jvb3R9IHVwZGF0ZT17Ojp0aGlzLm9uVXBkYXRlfSBvbkhvdmVyPXtvbkhvdmVyfSBjdXN0b21SZW5kZXI9e2N1c3RvbVJlbmRlcn0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cIkNvbnRhaW5lcl9fSW5wdXRcIiB0eXBlPVwidGV4dFwiIHJlZj17KGlucHV0KSA9PiB7IHRoaXMuaW5wdXQgPSBpbnB1dDsgfX0gLz5cbiAgICAgICAgICBvbkZvY3VzPXs6OnRoaXMudG9nZ2xlRm9jdXN9XG4gICAgICAgICAgb25CbHVyPXs6OnRoaXMudG9nZ2xlRm9jdXN9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYW4gaW1tdXRhYmxlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBub2RlcyAoaW5jbC4gZXh0ZW5kZWQvdHJpbW1lZCBkYXRhKVxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBwcm9wcy50cmVlICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtBcnJheX0gICBwcm9wcy5kZWZhdWx0RXhwYW5kZWRUYWdzIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZ2V0Um9vdCAoeyB0cmVlLCBkZWZhdWx0RXhwYW5kZWRUYWdzIH0pIHtcbiAgICB0cmFuc2Zvcm1Ob2Rlcyh0cmVlLCBbXSwgdHJ1ZSlcbiAgICByZXR1cm4gSW1tdXRhYmxlLmZyb21KUyh0cmVlWzBdKVxuXG4gICAgLy8gcmVjdXJzaXZlIGVudW1lcmF0aW9uXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtTm9kZXMgKHRyZWUsIGtleVBhdGgsIGluaXRpYWwpIHtcbiAgICAgIHRyZWUuZm9yRWFjaCgobm9kZSwgaSkgPT4ge1xuICAgICAgICBub2RlLmRlcHRoID0gZ2V0RGVwdGgobm9kZSlcbiAgICAgICAgbm9kZS5zZWxlY3RvciA9IGdldFNlbGVjdG9yKG5vZGUubmFtZSA/IG5vZGUgOiBub2RlLnBhcmVudClcbiAgICAgICAgbm9kZS5rZXlQYXRoID0gaW5pdGlhbCA/IGtleVBhdGggOiBbLi4ua2V5UGF0aCwgJ2NoaWxkcmVuJywgaV1cbiAgICAgICAgbm9kZS5zdGF0ZSA9IGRlZmF1bHRFeHBhbmRlZFRhZ3MuaW5kZXhPZihub2RlLm5hbWUpID4gLTEgPyB7IGV4cGFuZGVkOiB0cnVlIH0gOiB7fVxuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gY2hpbGQudHlwZSAhPT0gJ3RleHQnIHx8IGNoaWxkLmRhdGEudHJpbSgpLmxlbmd0aClcbiAgICAgICAgICAgIHRyYW5zZm9ybU5vZGVzKG5vZGUuY2hpbGRyZW4sIG5vZGUua2V5UGF0aClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuYXR0cmlicyAmJiAhT2JqZWN0LmtleXMobm9kZS5hdHRyaWJzKS5sZW5ndGgpIHtcbiAgICAgICAgICBkZWxldGUgbm9kZS5hdHRyaWJzXG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50XG4gICAgICAgIGRlbGV0ZSBub2RlLm5leHRcbiAgICAgICAgZGVsZXRlIG5vZGUucHJldlxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogW3RvZ2dsZUZvY3VzIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtFdmVudH0gZSAtIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHRvZ2dsZUZvY3VzIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgY29uc3QgeyBsYXRlc3QgfSA9IHRoaXMuc3RhdGVcblxuICAgIGlmIChlLnR5cGUgPT09ICdmb2N1cycpIHtcbiAgICAgIHJldHVybiB0aGlzLm9uVXBkYXRlKG51bGwsIGxhdGVzdCwgJ3RvZ2dsZUZvY3VzJywgeyBzZWxlY3RlZDogdHJ1ZSwgdW5mb2N1c2VkOiBmYWxzZSB9KVxuICAgIH1cbiAgICAvLyA9PT0gYmx1ciB8fCBkZWxheSB0byBjaGVjayB1cGNvbWluZyBjbGlja1xuICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMub25VcGRhdGUobnVsbCwgbGF0ZXN0LCAndG9nZ2xlRm9jdXMnLCB7IHNlbGVjdGVkOiBmYWxzZSwgdW5mb2N1c2VkOiB0cnVlIH0pXG4gICAgfSwgMTAwKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgZm9yIGRpZmZlcmVudCBhY3Rpb25zIGJhc2VkIG9uIHRoZSB0eXBlXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdHlwZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbXBvbmVudCAtIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7T2JqZWN0fSBuZXh0U3RhdGUgLSBbZGVzY3JpcHRpb25dXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIGZvciBkaWZmZXJlbnQgYWN0aW9ucyBiYXNlZCBvbiB0aGUgdHlwZVxuICAgKiBAcGFyYW0gIHtFdmVudH0gICAgICAgICAgZSAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtSZWFjdENvbXBvbmVudH0gY29tcG9uZW50IC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgdHlwZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgZGF0YSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgb25VcGRhdGUgKGUsIGNvbXBvbmVudCwgdHlwZSwgZGF0YSkge1xuICAgIGlmIChlICYmIGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKVxuICAgIGlmIChlICYmIGUuc3RvcFByb3BhZ2F0aW9uKSBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuXG4gICAgY29uc3QgeyBvcmlnaW4sIG9uSG92ZXIsIG9uRXhwYW5kLCBvblNlbGVjdCwgb25VbmZvY3VzIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBub2RlIH0gPSBjb21wb25lbnQucHJvcHNcbiAgICBjb25zdCB7IHJvb3QsIGxhdGVzdCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgY29uc3QgbmFtZSA9IG5vZGUuZ2V0KCduYW1lJylcbiAgICBjb25zdCBhdHRyaWJzID0gbm9kZS5nZXQoJ2F0dHJpYnMnKVxuICAgIGNvbnN0IHNlbGVjdG9yID0gbm9kZS5nZXQoJ3NlbGVjdG9yJylcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBvcmlnaW4gPyAoc2VsZWN0b3IubWF0Y2goJz4nKSA/IG9yaWdpbi5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVswXSA6IG9yaWdpbikgOlxuICAgICAgICAgICAgICAgICAgICB7IC8vIHNoYWxsb3cgcmVwcmVzZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICB0YWdOYW1lOiBuYW1lIHx8IG5vZGUuZ2V0KCd0eXBlJyksXG4gICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogYXR0cmlicyAmJiBhdHRyaWJzLnRvSlMoKSxcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgdmFyIGtleVBhdGggPSBbLi4ubm9kZS5nZXQoJ2tleVBhdGgnKS50b0pTKCksICdzdGF0ZSddXG4gICAgdmFyIHVwZGF0ZXIgPSBudWxsIC8vIHRvZ2dsZTogKHZhbHVlKSA9PiAhdmFsdWVcblxuICAgIHN3aXRjaCAodHlwZSkge1xuXG4gICAgICBjYXNlICd0b2dnbGVIb3Zlcic6XG4gICAgICAgIGlmIChvbkhvdmVyICYmIG9uSG92ZXIuY2FsbCh0aGlzLCBlbGVtZW50LCBjb21wb25lbnQpICE9PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgICBpZiAodHlwZW9mIGRhdGEudGFpbGVkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGtleVBhdGggPSBbLi4ua2V5UGF0aCwgJ3RhaWxlZCddXG4gICAgICAgICAgdXBkYXRlciA9ICgpID0+IGRhdGEudGFpbGVkXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cblxuICAgICAgY2FzZSAndG9nZ2xlRXhwYW5kJzpcbiAgICAgICAgaWYgKG9uRXhwYW5kICYmIG9uRXhwYW5kLmNhbGwodGhpcywgZWxlbWVudCwgY29tcG9uZW50KSAhPT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgICAgLy8gY2hlY2s6IHVuZm9sZGluZyBhbGwgY2hpbGRyZW5cbiAgICAgICAgaWYgKGUuYWx0S2V5ICYmIGUuY3RybEtleSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHJvb3Q6IHJvb3Quc2V0SW4oWy4uLm5vZGUuZ2V0KCdrZXlQYXRoJykudG9KUygpXSwgc2V0RGVlcChub2RlLCAnY2hpbGRyZW4nLCBbJ3N0YXRlJywgJ2V4cGFuZGVkJ10sIHRydWUpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgLy8gLSBmaXggW2lzc3VlIzFdKCd0YWlsZWQnKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhub2RlLnRvSlNPTigpLCBkYXRhLCBlLnRhcmdldClcbiAgICAgICAga2V5UGF0aCA9IFsuLi5rZXlQYXRoLCAnZXhwYW5kZWQnXVxuICAgICAgICB1cGRhdGVyID0gKGV4cGFuZGVkKSA9PiAhZXhwYW5kZWRcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAndHJpZ2dlclNlbGVjdCc6XG4gICAgICAgIGlmIChsYXRlc3QpIHtcbiAgICAgICAgICB0aGlzLmlucHV0LmJsdXIoKVxuICAgICAgICAgIGNvbnN0IGxhdGVzdEtleVBhdGggPSBbLi4ubGF0ZXN0LnByb3BzLm5vZGUuZ2V0KCdrZXlQYXRoJykudG9KUygpLCAnc3RhdGUnXVxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHJvb3Q6IHJvb3Qud2l0aE11dGF0aW9ucygobWFwKSA9PiBtYXBcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ubGF0ZXN0S2V5UGF0aCwgJ3RhaWxlZCddLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ubGF0ZXN0S2V5UGF0aCwgJ3NlbGVjdGVkJ10sIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5sYXRlc3RLZXlQYXRoLCAndW5mb2N1c2VkJ10sIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5rZXlQYXRoLCAndGFpbGVkJ10sIGRhdGEudGFpbGVkKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGxhdGVzdDogY29tcG9uZW50XG4gICAgICAgICAgfSwgOjp0aGlzLmlucHV0LmZvY3VzKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICByb290OiByb290LnNldEluKFsuLi5rZXlQYXRoLCAndGFpbGVkJ10sIGRhdGEudGFpbGVkKSxcbiAgICAgICAgICBsYXRlc3Q6IGNvbXBvbmVudFxuICAgICAgICB9LCA6OnRoaXMuaW5wdXQuZm9jdXMpXG5cbiAgICAgIGNhc2UgJ3RvZ2dsZUZvY3VzJzpcbiAgICAgICAgaWYgKGRhdGEuc2VsZWN0ZWQpIHtcbiAgICAgICAgICBpZiAob25TZWxlY3QgJiYgb25TZWxlY3QuY2FsbCh0aGlzLCBlbGVtZW50LCBjb21wb25lbnQpICE9PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvblVuZm9jdXMgJiYgb25VbmZvY3VzLmNhbGwodGhpcywgZWxlbWVudCwgY29tcG9uZW50KSAhPT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcm9vdDogcm9vdC53aXRoTXV0YXRpb25zKChtYXApID0+IG1hcFxuICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ua2V5UGF0aCwgJ3NlbGVjdGVkJ10sIGRhdGEuc2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5rZXlQYXRoLCAndW5mb2N1c2VkJ10sIGRhdGEudW5mb2N1c2VkKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJvb3Q6IHJvb3QudXBkYXRlSW4oa2V5UGF0aCwgdXBkYXRlcilcbiAgICB9KVxuICB9XG5cbn1cbiJdfQ==
