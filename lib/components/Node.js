'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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

var Node = function (_Component) {
  _inherits(Node, _Component);

  function Node() {
    _classCallCheck(this, Node);

    return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).apply(this, arguments));
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

      var _props = this.props,
          node = _props.node,
          update = _props.update,
          onHover = _props.onHover;


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

        // render: text + comments
      };if (type === 'text' || type === 'comment') {
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

        // render: collapsed + extended content
      };var head = _react2.default.createElement(
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
            '\u25B6'
          ) : _react2.default.createElement(
            'span',
            null,
            '\u25BC'
          )
        ),
        _react2.default.createElement(
          'span',
          { className: 'Node__Container' },
          this.getOpenTag(),
          !expanded && _react2.default.createElement(
            'span',
            null,
            '\u2026'
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
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          var isLink = ['src', 'href'].indexOf(key) > -1;
          return _react2.default.createElement(
            'span',
            { className: 'Node__Wrap', key: key },
            '\xA0',
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
}(_react.Component);

Node.propTypes = {
  node: _propTypes2.default.object.isRequired,
  update: _propTypes2.default.func.isRequired,
  onHover: _propTypes2.default.func,
  customRenderer: _propTypes2.default.func
};
exports.default = Node;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvTm9kZS5qc3giXSwibmFtZXMiOlsidm9pZFRhZ3MiLCJOb2RlIiwibmV4dFByb3BzIiwibmV4dFN0YXRlIiwibm9kZSIsInByb3BzIiwiY3VzdG9tUmVuZGVyIiwiUmVuZGVyYWJsZSIsImdldFJlbmRlcmFibGUiLCJkZWNvcmF0ZSIsInRvSlMiLCJ1cGRhdGUiLCJvbkhvdmVyIiwidHlwZSIsImdldCIsIm5hbWUiLCJkYXRhIiwiYXR0cmlicyIsImRlcHRoIiwiY2hpbGRyZW4iLCJleHBhbmRlZCIsImdldEluIiwic2VsZWN0ZWQiLCJ0YWlsZWQiLCJ1bmZvY3VzZWQiLCJ0YWdFdmVudEhhbmRsZXJzIiwib25Nb3VzZURvd24iLCJlIiwiT2JqZWN0IiwiYXNzaWduIiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlT3V0Iiwic2l6ZSIsIm9uRG91YmxlQ2xpY2siLCJiYXNlIiwicGFkZGluZ0xlZnQiLCJtb2RpZmllciIsImNvbnRlbnQiLCJpbmRleE9mIiwibGVuZ3RoIiwiZ2V0T3BlblRhZyIsImdldENsb3NlVGFnIiwiYmFzZUV4cGFuZGVyIiwibGVmdCIsImhlYWQiLCJtYXAiLCJjaGlsZCIsImkiLCJzZWxmY2xvc2luZyIsImVudHJ5U2VxIiwia2V5IiwidmFsdWUiLCJpc0xpbmsiLCJsaW5rIiwiZXh0ZXJuYWwiLCJ0ZXN0IiwicHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJjdXN0b21SZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OytlQVJBOzs7Ozs7QUFVQTtBQUNBLElBQU1BLFdBQVcsQ0FDZixNQURlLEVBQ1AsTUFETyxFQUNDLElBREQsRUFDTyxLQURQLEVBQ2MsU0FEZCxFQUN5QixPQUR6QixFQUNrQyxJQURsQyxFQUN3QyxLQUR4QyxFQUVmLE9BRmUsRUFFTixRQUZNLEVBRUksTUFGSixFQUVZLFVBRlosRUFFd0IsTUFGeEIsRUFF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b2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIENvbXBvbmVudDogTm9kZVxuICpcbiAqIFJlcHJlc2VudGF0aW9uIG9mIGFuIEhUTUwgZWxlbWVudFxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5cbi8vIGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWwtbWFya3VwL3N5bnRheC5odG1sI3ZvaWQtZWxlbWVudHNcbmNvbnN0IHZvaWRUYWdzID0gW1xuICAnYXJlYScsICdiYXNlJywgJ2JyJywgJ2NvbCcsICdjb21tYW5kJywgJ2VtYmVkJywgJ2hyJywgJ2ltZycsXG4gICdpbnB1dCcsICdrZXlnZW4nLCAnbGluaycsICdtZW51aXRlbScsICdtZXRhJywgJ3BhcmFtJywgJ3NvdXJjZScsXG4gICd0cmFjaycsICd3YnInXG5dXG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9kZSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBub2RlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uSG92ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGN1c3RvbVJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSAobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICByZXR1cm4gbmV4dFByb3BzLm5vZGUgIT09IHRoaXMucHJvcHMubm9kZVxuICB9XG5cbiAgcmVuZGVyKCl7XG4gICAgY29uc3QgeyBjdXN0b21SZW5kZXIgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBSZW5kZXJhYmxlID0gdGhpcy5nZXRSZW5kZXJhYmxlKClcbiAgICByZXR1cm4gKCFjdXN0b21SZW5kZXIpID8gUmVuZGVyYWJsZSA6IGN1c3RvbVJlbmRlcigoZGVjb3JhdGUpID0+IHtcbiAgICAgIHJldHVybiBkZWNvcmF0ZShSZW5kZXJhYmxlKSB8fCA8UmVuZGVyYWJsZSB7Li4uUmVuZGVyYWJsZS5wcm9wc30vPlxuICAgIH0sIHRoaXMucHJvcHMubm9kZS50b0pTKCkpXG4gIH1cblxuICBnZXRSZW5kZXJhYmxlKCl7XG4gICAgY29uc3QgeyBub2RlLCB1cGRhdGUsIG9uSG92ZXIgfSA9IHRoaXMucHJvcHNcblxuICAgIGNvbnN0IHR5cGUgPSBub2RlLmdldCgndHlwZScpXG4gICAgY29uc3QgbmFtZSA9IG5vZGUuZ2V0KCduYW1lJylcbiAgICBjb25zdCBkYXRhID0gbm9kZS5nZXQoJ2RhdGEnKVxuICAgIGNvbnN0IGF0dHJpYnMgPSBub2RlLmdldCgnYXR0cmlicycpXG4gICAgY29uc3QgZGVwdGggPSBub2RlLmdldCgnZGVwdGgnKVxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5nZXQoJ2NoaWxkcmVuJylcblxuICAgIGNvbnN0IGV4cGFuZGVkID0gbm9kZS5nZXRJbihbJ3N0YXRlJywgJ2V4cGFuZGVkJ10pXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBub2RlLmdldEluKFsnc3RhdGUnLCAnc2VsZWN0ZWQnXSlcbiAgICBjb25zdCB0YWlsZWQgPSBub2RlLmdldEluKFsnc3RhdGUnLCAndGFpbGVkJ10pXG4gICAgY29uc3QgdW5mb2N1c2VkID0gbm9kZS5nZXRJbihbJ3N0YXRlJywgJ3VuZm9jdXNlZCddKVxuXG4gICAgY29uc3QgdGFnRXZlbnRIYW5kbGVycyA9IHtcbiAgICAgIG9uTW91c2VEb3duOiAoZSkgPT4gdXBkYXRlKGUsIHRoaXMsICd0cmlnZ2VyU2VsZWN0JywgeyB0YWlsZWQ6IGZhbHNlIH0pXG4gICAgfVxuICAgIGlmIChvbkhvdmVyKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRhZ0V2ZW50SGFuZGxlcnMsIHtcbiAgICAgICAgb25Nb3VzZU92ZXI6IChlKSA9PiB1cGRhdGUoZSwgdGhpcywgJ3RvZ2dsZUhvdmVyJyksXG4gICAgICAgIG9uTW91c2VPdXQ6IChlKSA9PiB1cGRhdGUoZSwgdGhpcywgJ3RvZ2dsZUhvdmVyJylcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5zaXplICYmIG5hbWUgIT09ICdodG1sJykge1xuICAgICAgT2JqZWN0LmFzc2lnbih0YWdFdmVudEhhbmRsZXJzLCB7XG4gICAgICAgIG9uRG91YmxlQ2xpY2s6IChlKSA9PiB1cGRhdGUoZSwgdGhpcywgJ3RvZ2dsZUV4cGFuZCcpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIGluZGVudGF0aW9uXG4gICAgdmFyIGJhc2UgPSB7XG4gICAgICBwYWRkaW5nTGVmdDogKGRlcHRoICsgMSkgKiAxMFxuICAgIH1cblxuICAgIHZhciBtb2RpZmllciA9IHtcbiAgICAgIHNlbGVjdGVkOiBzZWxlY3RlZCxcbiAgICAgIHVuZm9jdXNlZDogdW5mb2N1c2VkLFxuICAgICAgdGFpbGVkXG4gICAgfVxuXG4gICAgLy8gcmVuZGVyOiB0ZXh0ICsgY29tbWVudHNcbiAgICBpZiAodHlwZSA9PT0gJ3RleHQnIHx8IHR5cGUgPT09ICdjb21tZW50Jykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJOb2RlXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoW1wiTm9kZV9fVGFnXCIsIFwiTm9kZV9fSGVhZFwiLCBtb2RpZmllcl0pfSBzdHlsZT17YmFzZX0gey4uLnRhZ0V2ZW50SGFuZGxlcnN9PlxuICAgICAgICAgICAge3R5cGUgPT09ICd0ZXh0JyA/IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fV3JhcFwiPlxuICAgICAgICAgICAgICAgIFwiPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fVGV4dFwiPntkYXRhfTwvc3Bhbj5cIlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19Db21tZW50XCI+XG4gICAgICAgICAgICAgICAge2A8IS0tJHtkYXRhfS0tPmB9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIC8vIGZvcm1hdDogc2luZ2xlLWxpbmUgdGFnLCBlbnRyaWVzIHdpdGhvdXQgY2hpbGRyZW4gb3IganVzdCBvbmUgKyBzZWxmLWNsb3NpbmcgdGFncyAoZS5nLiBpbWFnZXMpXG4gICAgaWYgKCFjaGlsZHJlbiB8fCBjaGlsZHJlbi5zaXplID09PSAxICYmIGNoaWxkcmVuLmdldEluKFswLCAndHlwZSddKSA9PT0gJ3RleHQnKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gY2hpbGRyZW4gJiYgY2hpbGRyZW4uZ2V0SW4oWzAsICdkYXRhJ10pIHx8IHZvaWRUYWdzLmluZGV4T2YobmFtZSkgPT09IC0xXG4gICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdib29sZWFuJyB8fGNvbnRlbnQubGVuZ3RoIDwgNTAwKSB7IC8vIG9ubHkgaW5jbHVkZSBsZXNzIHRoYW4gNTAwXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJOb2RlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhbXCJOb2RlX19UYWdcIiwgXCJOb2RlX19IZWFkXCIsIG1vZGlmaWVyXSl9IHN0eWxlPXtiYXNlfSB7Li4udGFnRXZlbnRIYW5kbGVyc30+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX0NvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLmdldE9wZW5UYWcoIWNvbnRlbnQpfVxuICAgICAgICAgICAgICAgIHtjb250ZW50ICYmIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX0NvbnRlbnRcIj57Y29udGVudH08L3NwYW4+fVxuICAgICAgICAgICAgICAgIHtjb250ZW50ICYmIHRoaXMuZ2V0Q2xvc2VUYWcoKX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpbmRlbnRhdGlvblxuICAgIHZhciBiYXNlRXhwYW5kZXIgPSB7XG4gICAgICBsZWZ0OiBiYXNlLnBhZGRpbmdMZWZ0IC0gMTJcbiAgICB9XG5cbiAgICAvLyByZW5kZXI6IGNvbGxhcHNlZCArIGV4dGVuZGVkIGNvbnRlbnRcbiAgICBjb25zdCBoZWFkID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoW1wiTm9kZV9fVGFnXCIsIFwiTm9kZV9fSGVhZFwiLCBtb2RpZmllcl0pfSBzdHlsZT17YmFzZX0gey4uLnRhZ0V2ZW50SGFuZGxlcnN9PlxuICAgICAgICB7bmFtZSAhPT0gJ2h0bWwnICYmIChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19FeHBhbmRlclwiIHN0eWxlPXtiYXNlRXhwYW5kZXJ9IG9uTW91c2VEb3duPXsoZSkgPT4gdXBkYXRlKGUsIHRoaXMsICd0b2dnbGVFeHBhbmQnKX0+XG4gICAgICAgICAgICB7IWV4cGFuZGVkID8gPHNwYW4+JiM5NjU0Ozwvc3Bhbj4gOiA8c3Bhbj4mIzk2NjA7PC9zcGFuPn17LyoqICfilrYnIDogJ+KWvCcgKiovfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fQ29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMuZ2V0T3BlblRhZygpfVxuICAgICAgICAgIHshZXhwYW5kZWQgJiYgPHNwYW4+JmhlbGxpcDs8L3NwYW4+fVxuICAgICAgICAgIHshZXhwYW5kZWQgJiYgdGhpcy5nZXRDbG9zZVRhZygpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApXG5cbiAgICAvLyBpbnZva2UgaGVhZCBzdHlsaW5nXG4gICAgaWYgKCFzZWxlY3RlZCAmJiAhdW5mb2N1c2VkKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRhZ0V2ZW50SGFuZGxlcnMsIHtcbiAgICAgICAgb25Nb3VzZU92ZXI6IChlKSA9PiB1cGRhdGUoZSwgdGhpcywgJ3RvZ2dsZUhvdmVyJywgeyB0YWlsZWQ6IHRydWUgfSksXG4gICAgICAgIG9uTW91c2VPdXQ6IChlKSA9PiB1cGRhdGUoZSwgdGhpcywgJ3RvZ2dsZUhvdmVyJywgeyB0YWlsZWQ6IGZhbHNlIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIk5vZGVcIj5cbiAgICAgICAge2hlYWR9XG4gICAgICAgIHtleHBhbmRlZCAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJOb2RlX19DaGlsZHJlblwiPlxuICAgICAgICAgICAge2NoaWxkcmVuLm1hcCgoY2hpbGQsIGkpID0+IDxOb2RlIHsuLi50aGlzLnByb3BzfSBub2RlPXtjaGlsZH0ga2V5PXtpfS8+KX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAge2V4cGFuZGVkICYmIChcbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoW1wiTm9kZV9fVGFnXCIsIFwiTm9kZV9fVGFpbFwiLCBtb2RpZmllcl0pfSBzdHlsZT17YmFzZX1cbiAgICAgICAgICAgIHsuLi50YWdFdmVudEhhbmRsZXJzfVxuICAgICAgICAgICAgb25Nb3VzZURvd249eyhlKSA9PiB1cGRhdGUoZSwgdGhpcywgJ3RyaWdnZXJTZWxlY3QnLCB7IHRhaWxlZDogdHJ1ZSB9KX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGhpcy5nZXRDbG9zZVRhZygpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZ2V0T3BlblRhZyAoc2VsZmNsb3NpbmcpIHtcbiAgICBjb25zdCB7IG5vZGUgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBuYW1lID0gbm9kZS5nZXQoJ25hbWUnKVxuICAgIGNvbnN0IGF0dHJpYnMgPSBub2RlLmdldCgnYXR0cmlicycpXG4gICAgcmV0dXJuICAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19XcmFwXCI+XG4gICAgICAgICZsdDtcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fTmFtZVwiPntuYW1lfTwvc3Bhbj5cbiAgICAgICAge2F0dHJpYnMgJiYgYXR0cmlicy5lbnRyeVNlcSgpLm1hcCgoWyBrZXksIHZhbHVlIF0pID0+IHtcbiAgICAgICAgICBjb25zdCBpc0xpbmsgPSBbJ3NyYycsICdocmVmJ10uaW5kZXhPZihrZXkpID4gLTFcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fV3JhcFwiIGtleT17a2V5fT5cbiAgICAgICAgICAgICAgJm5ic3A7XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX0F0dHJpYnV0ZUtleVwiPntrZXl9PC9zcGFuPj1cIlxuICAgICAgICAgICAgICB7IWlzTGluayA/XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fQXR0cmlidXRlVmFsdWVcIj57dmFsdWV9PC9zcGFuPiA6XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFsnTm9kZV9fQXR0cmlidXRlVmFsdWUnXSwge1xuICAgICAgICAgICAgICAgICAgICBsaW5rOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBleHRlcm5hbDogL15odHRwcz86Ly50ZXN0KHZhbHVlKVxuICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICBocmVmPXt2YWx1ZX0gdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dmFsdWV9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICB9XCJcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH0pfVxuICAgICAgICB7c2VsZmNsb3NpbmcgJiYgJy8nfVxuICAgICAgICAmZ3Q7XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgZ2V0Q2xvc2VUYWcoKXtcbiAgICBjb25zdCB7IG5vZGUgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBuYW1lID0gbm9kZS5nZXQoJ25hbWUnKVxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19XcmFwXCI+XG4gICAgICAgICZsdDtcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fTmFtZVwiPntgLyR7bmFtZX1gfTwvc3Bhbj5cbiAgICAgICAgJmd0O1xuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG59XG4iXX0=
