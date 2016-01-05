'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # Component: Node
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Representation of an HTML element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// http://www.w3.org/TR/html-markup/syntax.html#void-elements
var voidTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'];

/**
 *
 */

var Node = (function (_Component) {
  _inherits(Node, _Component);

  function Node() {
    _classCallCheck(this, Node);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Node).apply(this, arguments));
  }

  _createClass(Node, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.node !== this.props.node;
    }
  }, {
    key: 'render',
    value: function render() {
      var customRender = this.props.customRender;

      var Renderable = this.getRenderable();
      return !customRender ? Renderable : customRender(function (decorate) {
        return decorate(Renderable) || _react2.default.createElement(Renderable, Renderable.props);
      }, this.props.node.toJS());
    }
  }, {
    key: 'getRenderable',
    value: function getRenderable() {
      var _this2 = this;

      var _props = this.props;
      var node = _props.node;
      var update = _props.update;
      var onHover = _props.onHover;

      var type = node.get('type');
      var name = node.get('name');
      var data = node.get('data');
      var attribs = node.get('attribs');
      var depth = node.get('depth');
      var children = node.get('children');

      var expanded = node.getIn(['state', 'expanded']);
      var selected = node.getIn(['state', 'selected']);
      var tailed = node.getIn(['state', 'tailed']);
      var unfocused = node.getIn(['state', 'unfocused']);

      var tagEventHandlers = {
        onMouseDown: function onMouseDown(e) {
          return update(e, _this2, 'triggerSelect', { tailed: false });
        }
      };
      if (onHover) {
        Object.assign(tagEventHandlers, {
          onMouseOver: function onMouseOver(e) {
            return update(e, _this2, 'toggleHover');
          },
          onMouseOut: function onMouseOut(e) {
            return update(e, _this2, 'toggleHover');
          }
        });
      }
      if (children && children.size && name !== 'html') {
        Object.assign(tagEventHandlers, {
          onDoubleClick: function onDoubleClick(e) {
            return update(e, _this2, 'toggleExpand');
          }
        });
      }

      // indentation
      var base = {
        paddingLeft: (depth + 1) * 10
      };

      var modifier = {
        selected: selected,
        unfocused: unfocused,
        tailed: tailed
      };

      // render: text + comments
      if (type === 'text' || type === 'comment') {
        return _react2.default.createElement(
          'div',
          { className: 'Node' },
          _react2.default.createElement(
            'div',
            _extends({ className: (0, _classnames2.default)(["Node__Tag", "Node__Head", modifier]), style: base }, tagEventHandlers),
            type === 'text' ? _react2.default.createElement(
              'span',
              { className: 'Node__Wrap' },
              '"',
              _react2.default.createElement(
                'span',
                { className: 'Node__Text' },
                data
              ),
              '"'
            ) : _react2.default.createElement(
              'span',
              { className: 'Node__Comment' },
              '<!--' + data + '-->'
            )
          )
        );
      }

      // format: single-line tag, entries without children or just one + self-closing tags (e.g. images)
      if (!children || children.size === 1 && children.getIn([0, 'type']) === 'text') {
        var content = children && children.getIn([0, 'data']) || voidTags.indexOf(name) === -1;
        if (typeof content === 'boolean' || content.length < 500) {
          // only include less than 500
          return _react2.default.createElement(
            'div',
            { className: 'Node' },
            _react2.default.createElement(
              'div',
              _extends({ className: (0, _classnames2.default)(["Node__Tag", "Node__Head", modifier]), style: base }, tagEventHandlers),
              _react2.default.createElement(
                'span',
                { className: 'Node__Container' },
                this.getOpenTag(!content),
                content && _react2.default.createElement(
                  'span',
                  { className: 'Node__Content' },
                  content
                ),
                content && this.getCloseTag()
              )
            )
          );
        }
      }

      // indentation
      var baseExpander = {
        left: base.paddingLeft - 12
      };

      // render: collapsed + extended content
      var head = _react2.default.createElement(
        'div',
        _extends({ className: (0, _classnames2.default)(["Node__Tag", "Node__Head", modifier]), style: base }, tagEventHandlers),
        name !== 'html' && _react2.default.createElement(
          'span',
          { className: 'Node__Expander', style: baseExpander, onMouseDown: function onMouseDown(e) {
              return update(e, _this2, 'toggleExpand');
            } },
          !expanded ? _react2.default.createElement(
            'span',
            null,
            '▶'
          ) : _react2.default.createElement(
            'span',
            null,
            '▼'
          )
        ),
        _react2.default.createElement(
          'span',
          { className: 'Node__Container' },
          this.getOpenTag(),
          !expanded && _react2.default.createElement(
            'span',
            null,
            '…'
          ),
          !expanded && this.getCloseTag()
        )
      );

      // invoke head styling
      if (!selected && !unfocused) {
        Object.assign(tagEventHandlers, {
          onMouseOver: function onMouseOver(e) {
            return update(e, _this2, 'toggleHover', { tailed: true });
          },
          onMouseOut: function onMouseOut(e) {
            return update(e, _this2, 'toggleHover', { tailed: false });
          }
        });
      }

      return _react2.default.createElement(
        'div',
        { className: 'Node' },
        head,
        expanded && _react2.default.createElement(
          'div',
          { className: 'Node__Children' },
          children.map(function (child, i) {
            return _react2.default.createElement(Node, _extends({}, _this2.props, { node: child, key: i }));
          })
        ),
        expanded && _react2.default.createElement(
          'div',
          _extends({
            className: (0, _classnames2.default)(["Node__Tag", "Node__Tail", modifier]), style: base
          }, tagEventHandlers, {
            onMouseDown: function onMouseDown(e) {
              return update(e, _this2, 'triggerSelect', { tailed: true });
            }
          }),
          this.getCloseTag()
        )
      );
    }
  }, {
    key: 'getOpenTag',
    value: function getOpenTag(selfclosing) {
      var node = this.props.node;

      var name = node.get('name');
      var attribs = node.get('attribs');
      return _react2.default.createElement(
        'span',
        { className: 'Node__Wrap' },
        '<',
        _react2.default.createElement(
          'span',
          { className: 'Node__Name' },
          name
        ),
        attribs && attribs.entrySeq().map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var key = _ref2[0];
          var value = _ref2[1];

          var isLink = ['src', 'href'].indexOf(key) > -1;
          return _react2.default.createElement(
            'span',
            { className: 'Node__Wrap', key: key },
            ' ',
            _react2.default.createElement(
              'span',
              { className: 'Node__AttributeKey' },
              key
            ),
            '="',
            !isLink ? _react2.default.createElement(
              'span',
              { className: 'Node__AttributeValue' },
              value
            ) : _react2.default.createElement(
              'a',
              { className: (0, _classnames2.default)(['Node__AttributeValue'], {
                  link: true,
                  external: /^https?:/.test(value)
                }),
                href: value, target: '_blank'
              },
              value
            ),
            '"'
          );
        }),
        selfclosing && '/',
        '>'
      );
    }
  }, {
    key: 'getCloseTag',
    value: function getCloseTag() {
      var node = this.props.node;

      var name = node.get('name');
      return _react2.default.createElement(
        'span',
        { className: 'Node__Wrap' },
        '<',
        _react2.default.createElement(
          'span',
          { className: 'Node__Name' },
          '/' + name
        ),
        '>'
      );
    }
  }]);

  return Node;
})(_react.Component);

Node.propTypes = {
  node: _react.PropTypes.object.isRequired,
  update: _react.PropTypes.func.isRequired,
  onHover: _react.PropTypes.func,
  customRenderer: _react.PropTypes.func
};
exports.default = Node;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUUzQixLQUFLO2FBQ0o7O1dBRUQsQ0FDUjtTQUNGLENBQUM7UUFDRCxXQUFXLElBQUksR0FBRzs7T0FFZCxDQUNSO0tBQ0Y7OztrQ0FFWTtVQUNILElBQUksR0FBSyxJQUFJLENBQUMsS0FBSyxDQUFuQixJQUFJOztBQUNaLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDN0IsYUFDRTs7VUFBTSxTQUFTLEVBQUMsWUFBWTs7UUFFMUI7O1lBQU0sU0FBUyxFQUFDLFlBQVk7Z0JBQU0sSUFBSTtTQUFVOztPQUUzQyxDQUNSO0tBQ0Y7OztTQWpNa0IsSUFBSTtVQWJULFNBQVM7O0FBYUosSUFBSSxDQUVoQixTQUFTLEdBQUc7QUFDakIsTUFBSSxFQUFFLE9BaEJpQixTQUFTLENBZ0JoQixNQUFNLENBQUMsVUFBVTtBQUNqQyxRQUFNLEVBQUUsT0FqQmUsU0FBUyxDQWlCZCxJQUFJLENBQUMsVUFBVTtBQUNqQyxTQUFPLEVBQUUsT0FsQmMsU0FBUyxDQWtCYixJQUFJO0FBQ3ZCLGdCQUFjLEVBQUUsT0FuQk8sU0FBUyxDQW1CTixJQUFJO0NBQy9CO2tCQVBrQixJQUFJIiwiZmlsZSI6ImNvbXBvbmVudHMvTm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBDb21wb25lbnQ6IE5vZGVcbiAqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBhbiBIVE1MIGVsZW1lbnRcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXG5cbi8vIGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWwtbWFya3VwL3N5bnRheC5odG1sI3ZvaWQtZWxlbWVudHNcbmNvbnN0IHZvaWRUYWdzID0gW1xuICAnYXJlYScsICdiYXNlJywgJ2JyJywgJ2NvbCcsICdjb21tYW5kJywgJ2VtYmVkJywgJ2hyJywgJ2ltZycsXG4gICdpbnB1dCcsICdrZXlnZW4nLCAnbGluaycsICdtZW51aXRlbScsICdtZXRhJywgJ3BhcmFtJywgJ3NvdXJjZScsXG4gICd0cmFjaycsICd3YnInXG5dXG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9kZSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBub2RlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uSG92ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGN1c3RvbVJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIHJldHVybiBuZXh0UHJvcHMubm9kZSAhPT0gdGhpcy5wcm9wcy5ub2RlXG4gIH1cblxuICByZW5kZXIoKXtcbiAgICBjb25zdCB7IGN1c3RvbVJlbmRlciB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IFJlbmRlcmFibGUgPSB0aGlzLmdldFJlbmRlcmFibGUoKVxuICAgIHJldHVybiAoIWN1c3RvbVJlbmRlcikgPyBSZW5kZXJhYmxlIDogY3VzdG9tUmVuZGVyKChkZWNvcmF0ZSkgPT4ge1xuICAgICAgcmV0dXJuIGRlY29yYXRlKFJlbmRlcmFibGUpIHx8IDxSZW5kZXJhYmxlIHsuLi5SZW5kZXJhYmxlLnByb3BzfS8+XG4gICAgfSwgdGhpcy5wcm9wcy5ub2RlLnRvSlMoKSlcbiAgfVxuXG4gIGdldFJlbmRlcmFibGUoKXtcbiAgICBjb25zdCB7IG5vZGUsIHVwZGF0ZSwgb25Ib3ZlciB9ID0gdGhpcy5wcm9wc1xuXG4gICAgY29uc3QgdHlwZSA9IG5vZGUuZ2V0KCd0eXBlJylcbiAgICBjb25zdCBuYW1lID0gbm9kZS5nZXQoJ25hbWUnKVxuICAgIGNvbnN0IGRhdGEgPSBub2RlLmdldCgnZGF0YScpXG4gICAgY29uc3QgYXR0cmlicyA9IG5vZGUuZ2V0KCdhdHRyaWJzJylcbiAgICBjb25zdCBkZXB0aCA9IG5vZGUuZ2V0KCdkZXB0aCcpXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmdldCgnY2hpbGRyZW4nKVxuXG4gICAgY29uc3QgZXhwYW5kZWQgPSBub2RlLmdldEluKFsnc3RhdGUnLCAnZXhwYW5kZWQnXSlcbiAgICBjb25zdCBzZWxlY3RlZCA9IG5vZGUuZ2V0SW4oWydzdGF0ZScsICdzZWxlY3RlZCddKVxuICAgIGNvbnN0IHRhaWxlZCA9IG5vZGUuZ2V0SW4oWydzdGF0ZScsICd0YWlsZWQnXSlcbiAgICBjb25zdCB1bmZvY3VzZWQgPSBub2RlLmdldEluKFsnc3RhdGUnLCAndW5mb2N1c2VkJ10pXG5cbiAgICBjb25zdCB0YWdFdmVudEhhbmRsZXJzID0ge1xuICAgICAgb25Nb3VzZURvd246IChlKSA9PiB1cGRhdGUoZSwgdGhpcywgJ3RyaWdnZXJTZWxlY3QnLCB7IHRhaWxlZDogZmFsc2UgfSlcbiAgICB9XG4gICAgaWYgKG9uSG92ZXIpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGFnRXZlbnRIYW5kbGVycywge1xuICAgICAgICBvbk1vdXNlT3ZlcjogKGUpID0+IHVwZGF0ZShlLCB0aGlzLCAndG9nZ2xlSG92ZXInKSxcbiAgICAgICAgb25Nb3VzZU91dDogKGUpID0+IHVwZGF0ZShlLCB0aGlzLCAndG9nZ2xlSG92ZXInKVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLnNpemUgJiYgbmFtZSAhPT0gJ2h0bWwnKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRhZ0V2ZW50SGFuZGxlcnMsIHtcbiAgICAgICAgb25Eb3VibGVDbGljazogKGUpID0+IHVwZGF0ZShlLCB0aGlzLCAndG9nZ2xlRXhwYW5kJylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gaW5kZW50YXRpb25cbiAgICB2YXIgYmFzZSA9IHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAoZGVwdGggKyAxKSAqIDEwXG4gICAgfVxuXG4gICAgdmFyIG1vZGlmaWVyID0ge1xuICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkLFxuICAgICAgdW5mb2N1c2VkOiB1bmZvY3VzZWQsXG4gICAgICB0YWlsZWRcbiAgICB9XG5cbiAgICAvLyByZW5kZXI6IHRleHQgKyBjb21tZW50c1xuICAgIGlmICh0eXBlID09PSAndGV4dCcgfHwgdHlwZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk5vZGVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhbXCJOb2RlX19UYWdcIiwgXCJOb2RlX19IZWFkXCIsIG1vZGlmaWVyXSl9IHN0eWxlPXtiYXNlfSB7Li4udGFnRXZlbnRIYW5kbGVyc30+XG4gICAgICAgICAgICB7dHlwZSA9PT0gJ3RleHQnID8gKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19XcmFwXCI+XG4gICAgICAgICAgICAgICAgXCI8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19UZXh0XCI+e2RhdGF9PC9zcGFuPlwiXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX0NvbW1lbnRcIj5cbiAgICAgICAgICAgICAgICB7YDwhLS0ke2RhdGF9LS0+YH1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgLy8gZm9ybWF0OiBzaW5nbGUtbGluZSB0YWcsIGVudHJpZXMgd2l0aG91dCBjaGlsZHJlbiBvciBqdXN0IG9uZSArIHNlbGYtY2xvc2luZyB0YWdzIChlLmcuIGltYWdlcylcbiAgICBpZiAoIWNoaWxkcmVuIHx8IGNoaWxkcmVuLnNpemUgPT09IDEgJiYgY2hpbGRyZW4uZ2V0SW4oWzAsICd0eXBlJ10pID09PSAndGV4dCcpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBjaGlsZHJlbiAmJiBjaGlsZHJlbi5nZXRJbihbMCwgJ2RhdGEnXSkgfHwgdm9pZFRhZ3MuaW5kZXhPZihuYW1lKSA9PT0gLTFcbiAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ2Jvb2xlYW4nIHx8Y29udGVudC5sZW5ndGggPCA1MDApIHsgLy8gb25seSBpbmNsdWRlIGxlc3MgdGhhbiA1MDBcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk5vZGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFtcIk5vZGVfX1RhZ1wiLCBcIk5vZGVfX0hlYWRcIiwgbW9kaWZpZXJdKX0gc3R5bGU9e2Jhc2V9IHsuLi50YWdFdmVudEhhbmRsZXJzfT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fQ29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAge3RoaXMuZ2V0T3BlblRhZyghY29udGVudCl9XG4gICAgICAgICAgICAgICAge2NvbnRlbnQgJiYgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fQ29udGVudFwiPntjb250ZW50fTwvc3Bhbj59XG4gICAgICAgICAgICAgICAge2NvbnRlbnQgJiYgdGhpcy5nZXRDbG9zZVRhZygpfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGluZGVudGF0aW9uXG4gICAgdmFyIGJhc2VFeHBhbmRlciA9IHtcbiAgICAgIGxlZnQ6IGJhc2UucGFkZGluZ0xlZnQgLSAxMlxuICAgIH1cblxuICAgIC8vIHJlbmRlcjogY29sbGFwc2VkICsgZXh0ZW5kZWQgY29udGVudFxuICAgIGNvbnN0IGhlYWQgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhbXCJOb2RlX19UYWdcIiwgXCJOb2RlX19IZWFkXCIsIG1vZGlmaWVyXSl9IHN0eWxlPXtiYXNlfSB7Li4udGFnRXZlbnRIYW5kbGVyc30+XG4gICAgICAgIHtuYW1lICE9PSAnaHRtbCcgJiYgKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX0V4cGFuZGVyXCIgc3R5bGU9e2Jhc2VFeHBhbmRlcn0gb25Nb3VzZURvd249eyhlKSA9PiB1cGRhdGUoZSwgdGhpcywgJ3RvZ2dsZUV4cGFuZCcpfT5cbiAgICAgICAgICAgIHshZXhwYW5kZWQgPyA8c3Bhbj4mIzk2NTQ7PC9zcGFuPiA6IDxzcGFuPiYjOTY2MDs8L3NwYW4+fXsvKiogJ+KWticgOiAn4pa8JyAqKi99XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19Db250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5nZXRPcGVuVGFnKCl9XG4gICAgICAgICAgeyFleHBhbmRlZCAmJiA8c3Bhbj4maGVsbGlwOzwvc3Bhbj59XG4gICAgICAgICAgeyFleHBhbmRlZCAmJiB0aGlzLmdldENsb3NlVGFnKCl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcblxuICAgIC8vIGludm9rZSBoZWFkIHN0eWxpbmdcbiAgICBpZiAoIXNlbGVjdGVkICYmICF1bmZvY3VzZWQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGFnRXZlbnRIYW5kbGVycywge1xuICAgICAgICBvbk1vdXNlT3ZlcjogKGUpID0+IHVwZGF0ZShlLCB0aGlzLCAndG9nZ2xlSG92ZXInLCB7IHRhaWxlZDogdHJ1ZSB9KSxcbiAgICAgICAgb25Nb3VzZU91dDogKGUpID0+IHVwZGF0ZShlLCB0aGlzLCAndG9nZ2xlSG92ZXInLCB7IHRhaWxlZDogZmFsc2UgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTm9kZVwiPlxuICAgICAgICB7aGVhZH1cbiAgICAgICAge2V4cGFuZGVkICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk5vZGVfX0NoaWxkcmVuXCI+XG4gICAgICAgICAgICB7Y2hpbGRyZW4ubWFwKChjaGlsZCwgaSkgPT4gPE5vZGUgey4uLnRoaXMucHJvcHN9IG5vZGU9e2NoaWxkfSBrZXk9e2l9Lz4pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgICB7ZXhwYW5kZWQgJiYgKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhbXCJOb2RlX19UYWdcIiwgXCJOb2RlX19UYWlsXCIsIG1vZGlmaWVyXSl9IHN0eWxlPXtiYXNlfVxuICAgICAgICAgICAgey4uLnRhZ0V2ZW50SGFuZGxlcnN9XG4gICAgICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IHVwZGF0ZShlLCB0aGlzLCAndHJpZ2dlclNlbGVjdCcsIHsgdGFpbGVkOiB0cnVlIH0pfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0aGlzLmdldENsb3NlVGFnKCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBnZXRPcGVuVGFnIChzZWxmY2xvc2luZykge1xuICAgIGNvbnN0IHsgbm9kZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IG5hbWUgPSBub2RlLmdldCgnbmFtZScpXG4gICAgY29uc3QgYXR0cmlicyA9IG5vZGUuZ2V0KCdhdHRyaWJzJylcbiAgICByZXR1cm4gIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX1dyYXBcIj5cbiAgICAgICAgJmx0O1xuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19OYW1lXCI+e25hbWV9PC9zcGFuPlxuICAgICAgICB7YXR0cmlicyAmJiBhdHRyaWJzLmVudHJ5U2VxKCkubWFwKChbIGtleSwgdmFsdWUgXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlzTGluayA9IFsnc3JjJywgJ2hyZWYnXS5pbmRleE9mKGtleSkgPiAtMVxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19XcmFwXCIga2V5PXtrZXl9PlxuICAgICAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fQXR0cmlidXRlS2V5XCI+e2tleX08L3NwYW4+PVwiXG4gICAgICAgICAgICAgIHshaXNMaW5rID9cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19BdHRyaWJ1dGVWYWx1ZVwiPnt2YWx1ZX08L3NwYW4+IDpcbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9e2NsYXNzbmFtZXMoWydOb2RlX19BdHRyaWJ1dGVWYWx1ZSddLCB7XG4gICAgICAgICAgICAgICAgICAgIGxpbms6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4dGVybmFsOiAvXmh0dHBzPzovLnRlc3QodmFsdWUpXG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgIGhyZWY9e3ZhbHVlfSB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHt2YWx1ZX1cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICAgIHtzZWxmY2xvc2luZyAmJiAnLyd9XG4gICAgICAgICZndDtcbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxuICBnZXRDbG9zZVRhZygpe1xuICAgIGNvbnN0IHsgbm9kZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IG5hbWUgPSBub2RlLmdldCgnbmFtZScpXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX1dyYXBcIj5cbiAgICAgICAgJmx0O1xuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19OYW1lXCI+e2AvJHtuYW1lfWB9PC9zcGFuPlxuICAgICAgICAmZ3Q7XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
