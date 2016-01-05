'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utilities = require('../utilities');

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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

var Container = (function (_Component) {
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
            updater = function () {
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
          updater = function (expanded) {
            return !expanded;
          };
          break;

        case 'triggerSelect':
          if (latest) {
            var _ret = (function () {
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
            })();

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
})(_react.Component);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29udGFpbmVyLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlBLElBQU0sU0FBUyxHQUFHLE9BQU8sV0FBVyxLQUFLLFdBQVc7Ozs7O0FBQUE7SUFLL0IsU0FBUztZQUFULFNBQVM7O0FBYTVCLFdBYm1CLFNBQVMsQ0FhZixLQUFLLEVBQUU7MEJBYkQsU0FBUzs7dUVBQVQsU0FBUyxhQWNwQixLQUFLOztBQUNYLFVBQUssS0FBSyxHQUFHO0FBQ1gsVUFBSSxFQUFFLE1BQUssT0FBTyxDQUFDLEtBQUssQ0FBQztBQUN6QixZQUFNLEVBQUUsSUFBSTtLQUNiLENBQUE7O0dBQ0Y7O2VBbkJrQixTQUFTOzs4Q0FxQkQsU0FBUyxFQUFFO0FBQ3BDLFVBQUksU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUN0QyxZQUFJLENBQUMsUUFBUSxDQUFDO0FBQ1osY0FBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQzdCLGdCQUFNLEVBQUUsSUFBSTtTQUNiLENBQUMsQ0FBQTtPQUNIO0tBQ0Y7Ozs2QkFFTzttQkFDNEIsSUFBSSxDQUFDLEtBQUs7VUFBcEMsT0FBTyxVQUFQLE9BQU87VUFBRSxZQUFZLFVBQVosWUFBWTtVQUNyQixJQUFJLEdBQUssSUFBSSxDQUFDLEtBQUssQ0FBbkIsSUFBSTs7QUFDWixhQUNFOztVQUFLLFNBQVMsRUFBQyxXQUFXO1FBQ3hCOztZQUFLLFNBQVMsRUFBQyxrQkFBa0I7VUFDL0IsZ0RBQU0sSUFBSSxFQUFFLElBQUksQUFBQyxFQUFDLE1BQU0sRUFBSSxJQUFJLENBQUMsUUFBUSxNQUFiLElBQUksQ0FBVSxFQUFDLE9BQU8sRUFBRSxPQUFPLEFBQUMsRUFBQyxZQUFZLEVBQUUsWUFBWSxBQUFDLEdBQUU7U0FDdEY7UUFDTix5Q0FBTyxTQUFTLEVBQUMsa0JBQWtCLEVB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LEVBQUUsT0FwQmEsU0FBUyxDQW9CWixJQUFJO0FBQ3hCLFdBQVMsRUFBRSxPQXJCWSxTQUFTLENBcUJYLElBQUk7Q0FDMUI7a0JBWGtCLFNBQVMiLCJmaWxlIjoiY29tcG9uZW50cy9Db250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgQ29tcG9uZW50OiBDb250YWluZXJcbiAqXG4gKiBVcGRhdGUgJiBkZWxlZ2F0aW9uIGxheWVyXG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSdcblxuaW1wb3J0IHsgZ2V0U2VsZWN0b3IsIGdldERlcHRoLCBzZXREZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJ1xuaW1wb3J0IE5vZGUgZnJvbSAnLi9Ob2RlJ1xuXG5jb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnXG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRyZWU6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgIG9yaWdpbjogUHJvcFR5cGVzLmluc3RhbmNlT2YoaXNCcm93c2VyICYmIEhUTUxFbGVtZW50KSxcbiAgICBkZWZhdWx0RXhwYW5kZWRUYWdzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBjdXN0b21SZW5kZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSG92ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRXhwYW5kOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25VbmZvY3VzOiBQcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHJvb3Q6IHRoaXMuZ2V0Um9vdChwcm9wcyksXG4gICAgICBsYXRlc3Q6IG51bGxcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLnRyZWUgIT09IHRoaXMucHJvcHMudHJlZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHJvb3Q6IHRoaXMuZ2V0Um9vdChuZXh0UHJvcHMpLFxuICAgICAgICBsYXRlc3Q6IG51bGxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCl7XG4gICAgY29uc3QgeyBvbkhvdmVyLCBjdXN0b21SZW5kZXIgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXMuc3RhdGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWluZXJfX05vZGVzXCI+XG4gICAgICAgICAgPE5vZGUgbm9kZT17cm9vdH0gdXBkYXRlPXs6OnRoaXMub25VcGRhdGV9IG9uSG92ZXI9e29uSG92ZXJ9IGN1c3RvbVJlbmRlcj17Y3VzdG9tUmVuZGVyfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiQ29udGFpbmVyX19JbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgcmVmPVwiaW5wdXRcIlxuICAgICAgICAgIG9uRm9jdXM9ezo6dGhpcy50b2dnbGVGb2N1c31cbiAgICAgICAgICBvbkJsdXI9ezo6dGhpcy50b2dnbGVGb2N1c31cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbiBpbW11dGFibGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5vZGVzIChpbmNsLiBleHRlbmRlZC90cmltbWVkIGRhdGEpXG4gICAqIEBwYXJhbSAge09iamVjdH0gIHByb3BzLnRyZWUgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge0FycmF5fSAgIHByb3BzLmRlZmF1bHRFeHBhbmRlZFRhZ3MgLSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZXRSb290ICh7IHRyZWUsIGRlZmF1bHRFeHBhbmRlZFRhZ3MgfSkge1xuICAgIHRyYW5zZm9ybU5vZGVzKHRyZWUsIFtdLCB0cnVlKVxuICAgIHJldHVybiBJbW11dGFibGUuZnJvbUpTKHRyZWVbMF0pXG5cbiAgICAvLyByZWN1cnNpdmUgZW51bWVyYXRpb25cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1Ob2RlcyAodHJlZSwga2V5UGF0aCwgaW5pdGlhbCkge1xuICAgICAgdHJlZS5mb3JFYWNoKChub2RlLCBpKSA9PiB7XG4gICAgICAgIG5vZGUuZGVwdGggPSBnZXREZXB0aChub2RlKVxuICAgICAgICBub2RlLnNlbGVjdG9yID0gZ2V0U2VsZWN0b3Iobm9kZS5uYW1lID8gbm9kZSA6IG5vZGUucGFyZW50KVxuICAgICAgICBub2RlLmtleVBhdGggPSBpbml0aWFsID8ga2V5UGF0aCA6IFsuLi5rZXlQYXRoLCAnY2hpbGRyZW4nLCBpXVxuICAgICAgICBub2RlLnN0YXRlID0gZGVmYXVsdEV4cGFuZGVkVGFncy5pbmRleE9mKG5vZGUubmFtZSkgPiAtMSA/IHsgZXhwYW5kZWQ6IHRydWUgfSA6IHt9XG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZC50eXBlICE9PSAndGV4dCcgfHwgY2hpbGQuZGF0YS50cmltKCkubGVuZ3RoKVxuICAgICAgICAgICAgdHJhbnNmb3JtTm9kZXMobm9kZS5jaGlsZHJlbiwgbm9kZS5rZXlQYXRoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5hdHRyaWJzICYmICFPYmplY3Qua2V5cyhub2RlLmF0dHJpYnMpLmxlbmd0aCkge1xuICAgICAgICAgIGRlbGV0ZSBub2RlLmF0dHJpYnNcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnRcbiAgICAgICAgZGVsZXRlIG5vZGUubmV4dFxuICAgICAgICBkZWxldGUgbm9kZS5wcmV2XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBbdG9nZ2xlRm9jdXMgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge0V2ZW50fSBlIC0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgdG9nZ2xlRm9jdXMgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBjb25zdCB7IGxhdGVzdCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgaWYgKGUudHlwZSA9PT0gJ2ZvY3VzJykge1xuICAgICAgcmV0dXJuIHRoaXMub25VcGRhdGUobnVsbCwgbGF0ZXN0LCAndG9nZ2xlRm9jdXMnLCB7IHNlbGVjdGVkOiB0cnVlLCB1bmZvY3VzZWQ6IGZhbHNlIH0pXG4gICAgfVxuICAgIC8vID09PSBibHVyIHx8IGRlbGF5IHRvIGNoZWNrIHVwY29taW5nIGNsaWNrXG4gICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5vblVwZGF0ZShudWxsLCBsYXRlc3QsICd0b2dnbGVGb2N1cycsIHsgc2VsZWN0ZWQ6IGZhbHNlLCB1bmZvY3VzZWQ6IHRydWUgfSlcbiAgICB9LCAxMDApXG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciBmb3IgZGlmZmVyZW50IGFjdGlvbnMgYmFzZWQgb24gdGhlIHR5cGVcbiAgICogQHBhcmFtICB7U3RyaW5nfSB0eXBlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge09iamVjdH0gY29tcG9uZW50IC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG5leHRTdGF0ZSAtIFtkZXNjcmlwdGlvbl1cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgZm9yIGRpZmZlcmVudCBhY3Rpb25zIGJhc2VkIG9uIHRoZSB0eXBlXG4gICAqIEBwYXJhbSAge0V2ZW50fSAgICAgICAgICBlICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1JlYWN0Q29tcG9uZW50fSBjb21wb25lbnQgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICB0eXBlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBkYXRhICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBvblVwZGF0ZSAoZSwgY29tcG9uZW50LCB0eXBlLCBkYXRhKSB7XG4gICAgaWYgKGUgJiYgZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgKGUgJiYgZS5zdG9wUHJvcGFnYXRpb24pIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG5cbiAgICBjb25zdCB7IG9yaWdpbiwgb25Ib3Zlciwgb25FeHBhbmQsIG9uU2VsZWN0LCBvblVuZm9jdXMgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IG5vZGUgfSA9IGNvbXBvbmVudC5wcm9wc1xuICAgIGNvbnN0IHsgcm9vdCwgbGF0ZXN0IH0gPSB0aGlzLnN0YXRlXG5cbiAgICBjb25zdCBuYW1lID0gbm9kZS5nZXQoJ25hbWUnKVxuICAgIGNvbnN0IGF0dHJpYnMgPSBub2RlLmdldCgnYXR0cmlicycpXG4gICAgY29uc3Qgc2VsZWN0b3IgPSBub2RlLmdldCgnc2VsZWN0b3InKVxuXG4gICAgY29uc3QgZWxlbWVudCA9IG9yaWdpbiA/IChzZWxlY3Rvci5tYXRjaCgnPicpID8gb3JpZ2luLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpWzBdIDogb3JpZ2luKSA6XG4gICAgICAgICAgICAgICAgICAgIHsgLy8gc2hhbGxvdyByZXByZXNlbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICAgIHRhZ05hbWU6IG5hbWUgfHwgbm9kZS5nZXQoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJzICYmIGF0dHJpYnMudG9KUygpLFxuICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvclxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICB2YXIga2V5UGF0aCA9IFsuLi5ub2RlLmdldCgna2V5UGF0aCcpLnRvSlMoKSwgJ3N0YXRlJ11cbiAgICB2YXIgdXBkYXRlciA9IG51bGwgLy8gdG9nZ2xlOiAodmFsdWUpID0+ICF2YWx1ZVxuXG4gICAgc3dpdGNoICh0eXBlKSB7XG5cbiAgICAgIGNhc2UgJ3RvZ2dsZUhvdmVyJzpcbiAgICAgICAgaWYgKG9uSG92ZXIgJiYgb25Ib3Zlci5jYWxsKHRoaXMsIGVsZW1lbnQsIGNvbXBvbmVudCkgIT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YS50YWlsZWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAga2V5UGF0aCA9IFsuLi5rZXlQYXRoLCAndGFpbGVkJ11cbiAgICAgICAgICB1cGRhdGVyID0gKCkgPT4gZGF0YS50YWlsZWRcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuXG4gICAgICBjYXNlICd0b2dnbGVFeHBhbmQnOlxuICAgICAgICBpZiAob25FeHBhbmQgJiYgb25FeHBhbmQuY2FsbCh0aGlzLCBlbGVtZW50LCBjb21wb25lbnQpICE9PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgICAvLyBjaGVjazogdW5mb2xkaW5nIGFsbCBjaGlsZHJlblxuICAgICAgICBpZiAoZS5hbHRLZXkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcm9vdDogcm9vdC5zZXRJbihbLi4ubm9kZS5nZXQoJ2tleVBhdGgnKS50b0pTKCldLCBzZXREZWVwKG5vZGUsICdjaGlsZHJlbicsIFsnc3RhdGUnLCAnZXhwYW5kZWQnXSwgdHJ1ZSkpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOlxuICAgICAgICAvLyAtIGZpeCBbaXNzdWUjMV0oJ3RhaWxlZCcpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG5vZGUudG9KU09OKCksIGRhdGEsIGUudGFyZ2V0KVxuICAgICAgICBrZXlQYXRoID0gWy4uLmtleVBhdGgsICdleHBhbmRlZCddXG4gICAgICAgIHVwZGF0ZXIgPSAoZXhwYW5kZWQpID0+ICFleHBhbmRlZFxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlICd0cmlnZ2VyU2VsZWN0JzpcbiAgICAgICAgaWYgKGxhdGVzdCkge1xuICAgICAgICAgIHRoaXMucmVmcy5pbnB1dC5ibHVyKClcbiAgICAgICAgICBjb25zdCBsYXRlc3RLZXlQYXRoID0gWy4uLmxhdGVzdC5wcm9wcy5ub2RlLmdldCgna2V5UGF0aCcpLnRvSlMoKSwgJ3N0YXRlJ11cbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByb290OiByb290LndpdGhNdXRhdGlvbnMoKG1hcCkgPT4gbWFwXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0SW4oWy4uLmxhdGVzdEtleVBhdGgsICd0YWlsZWQnXSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0SW4oWy4uLmxhdGVzdEtleVBhdGgsICdzZWxlY3RlZCddLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ubGF0ZXN0S2V5UGF0aCwgJ3VuZm9jdXNlZCddLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ua2V5UGF0aCwgJ3RhaWxlZCddLCBkYXRhLnRhaWxlZClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICBsYXRlc3Q6IGNvbXBvbmVudFxuICAgICAgICAgIH0sIDo6dGhpcy5yZWZzLmlucHV0LmZvY3VzKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICByb290OiByb290LnNldEluKFsuLi5rZXlQYXRoLCAndGFpbGVkJ10sIGRhdGEudGFpbGVkKSxcbiAgICAgICAgICBsYXRlc3Q6IGNvbXBvbmVudFxuICAgICAgICB9LCA6OnRoaXMucmVmcy5pbnB1dC5mb2N1cylcblxuICAgICAgY2FzZSAndG9nZ2xlRm9jdXMnOlxuICAgICAgICBpZiAoZGF0YS5zZWxlY3RlZCkge1xuICAgICAgICAgIGlmIChvblNlbGVjdCAmJiBvblNlbGVjdC5jYWxsKHRoaXMsIGVsZW1lbnQsIGNvbXBvbmVudCkgIT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9uVW5mb2N1cyAmJiBvblVuZm9jdXMuY2FsbCh0aGlzLCBlbGVtZW50LCBjb21wb25lbnQpICE9PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICByb290OiByb290LndpdGhNdXRhdGlvbnMoKG1hcCkgPT4gbWFwXG4gICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5rZXlQYXRoLCAnc2VsZWN0ZWQnXSwgZGF0YS5zZWxlY3RlZClcbiAgICAgICAgICAgICAgICAgICAgICAuc2V0SW4oWy4uLmtleVBhdGgsICd1bmZvY3VzZWQnXSwgZGF0YS51bmZvY3VzZWQpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcm9vdDogcm9vdC51cGRhdGVJbihrZXlQYXRoLCB1cGRhdGVyKVxuICAgIH0pXG4gIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
