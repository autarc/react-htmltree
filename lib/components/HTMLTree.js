'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _server = require('react-dom/server');

var _htmlparser = require('htmlparser2');

var _themes = require('../themes/');

var _themes2 = _interopRequireDefault(_themes);

var _Container = require('./Container');

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # Component: HTMLTree
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Public interface of the component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var isBrowser = typeof HTMLElement !== 'undefined';

/**
 *
 */

var HTMLTree = (function (_Component) {
  _inherits(HTMLTree, _Component);

  function HTMLTree() {
    _classCallCheck(this, HTMLTree);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HTMLTree).apply(this, arguments));
  }

  _createClass(HTMLTree, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var source = this.props.source;
      // keep state of provided source and representation view in sync

      if (isBrowser && source instanceof HTMLElement) {
        (function () {
          var element = (0, _reactDom.findDOMNode)(_this2);
          _this2.observer = new MutationObserver(function (mutations) {
            var inception = mutations.some(function (mutation) {
              return element.contains(mutation.target);
            });
            if (!inception) {
              _this2.forceUpdate();
            }
          }).observe(source, {
            childList: true,
            subtree: true,
            attributes: true
          });
        })();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var source = _props.source;
      var theme = _props.theme;

      var defaultsAndEventHandlers = _objectWithoutProperties(_props, ['source', 'theme']);

      var origin = isBrowser && source instanceof HTMLElement && source;
      var tree = (0, _htmlparser.parseDOM)( /** sourceText **/
      origin ? source.outerHTML : _react2.default.isValidElement(source) ? (0, _server.renderToString)(source) : source.replace(/<!DOCTYPE(.|\n|\r)*?>/i, ''));

      var componentStyles = (0, _themes2.default)(theme);

      return _react2.default.createElement(
        'div',
        { className: 'HTMLTree' },
        _react2.default.createElement('style', { dangerouslySetInnerHTML: { __html: componentStyles } }),
        _react2.default.createElement(_Container2.default, _extends({ tree: tree, origin: origin || null }, defaultsAndEventHandlers))
      );
    }
  }]);

  return HTMLTree;
})(_react.Component);

HTMLTree.defaultProps = {
  theme: 'chrome-devtools',
  defaultExpandedTags: ['html', 'body']
};
HTMLTree.propTypes = {
  source: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.node, _react.PropTypes.instanceOf(isBrowser ? HTMLElement : Object)]).isRequired,
  theme: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]).isRequired,
  defaultExpandedTags: _react.PropTypes.array.isRequired,
  customRender: _react.PropTypes.func,
  onHover: _react.PropTypes.func,
  onExpand: _react.PropTypes.func,
  onSelect: _react.PropTypes.func,
  onUnfocus: _react.PropTypes.func
};
exports.default = HTMLTree;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvSFRNTFRyZWUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNBLElBQU0sU0FBUyxHQUFHLE9BQU8sV0FBVyxLQUFLLFdBQVc7Ozs7O0FBQUE7SUFLL0IsUUFBUTtZQUFSLFFBQVE7O1dBQVIsUUFBUTswQkFBUixRQUFROztrRUFBUixRQUFROzs7ZUFBUixRQUFROzt3Q0F5QlI7OztVQUNULE1BQU0sR0FBSyxJQUFJLENBQUMsS0FBSyxDQUFyQixNQUFNOzs7QUFFZCxVQUFJLFNBQVMsSUFBSSxNQUFNLFlBQVksV0FBVyxFQUFFOztBQUM5QyxjQUFNLE9BQU8sR0FBRyxjQXpDYixXQUFXLFNBeUNtQixDQUFBO0FBQ2pDLGlCQUFLLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixDQUFDLFVBQUMsU0FBUyxFQUFLO0FBQ2xELGdCQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUTtxQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7YUFBQSxDQUFDLENBQUE7QUFDakYsZ0JBQUksQ0FBQyxTQUFTLEVBQUU7QUFDZCxxQkFBSyxXQUFXLEVBQUUsQ0FBQTthQUNuQjtXQUNGLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ2pCLHFCQUFTLEVBQUUsSUFBSTtBQUNmLG1CQUFPLEVBQUUsSUFBSTtBQUNiLHNCQUFVLEVBQUUsSUFBSTtXQUNqQixDQUFDLENBQUE7O09BQ0g7S0FDRjs7OzJDQUVxQjtBQUNwQixVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtPQUMzQjtLQUNGOzs7NkJBRU87bUJBQ2lELElBQUksQ0FBQyxLQUFLO1VBQXpELE1BQU0sVUFBTixNQUFNO1VBQUUsS0FBSyxVQUFMLEtBQUs7O1VBQUssd0JBQXdCOztBQUVsRCxVQUFNLE1BQU0sR0FBRyxTQUFTLElBQUksTUFBTSxZQUFZLFdBQVcsSUFBSSxNQUFNLENBQUE7QUFDbkUsVUFBTSxJQUFJLEdBQUcsZ0JBL0RSLFFBQVE7QUFnRVgsWUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEdBQ3hCLGdCQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRyxZQWxFN0IsY0FBYyxFQWtFOEIsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUMsQUFBQyxDQUN2RyxDQUFBOztBQUVELFVBQU0sZUFBZSxHQUFHLHNCQUFVLEtBQUssQ0FBQyxDQUFBOztBQUV4QyxhQUNFOztVQUFLLFNBQVMsRUFBQyxVQUFVO1FBQ3ZCLHlDQUFPLHVCQUF1QixFQUFFLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxBQUFDLEdBQUU7UUFDOUQsOERBQVcsSUFBSSxFQUFFLElBQUksQUFBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLElBQUUsSUFBSSxBQUFDLElBQUssd0JBQXdCLEVBQUc7T0FDeEUsQ0FDUDtLQUNGOzs7U0FsRWtCLFFBQVE7VUFiYixTQUFTOztBQWFKLFFBQVEsQ0FFcEIsWUFBWSxHQUFHO0FBQ3BCLE9BQUssRUFBRSxpQkFBaUI7QUFDeEIscUJBQW1CLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0NBQ3RDO0FBTGtCLFFBQVEsQ0FPcEIsU0FBUyxHQUFHO0FBQ2pCLFFBQU0sRUFBRSxPQXJCZSxTQUFTLENBcUJkLFNBQVMsQ0FBQyxDQUMxQixPQXRCcUIsU0FBUyxDQXNCcEIsTUFBTSxFQUNoQixPQXZCcUIsU0FBUyxDQXVCcEIsSUFBSSxFQUNkLE9BeEJxQixTQUFTLENBd0JwQixVQUFVLENBQUMsU0FBUyxHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUMsQ0FDdkQsQ0FBQyxDQUFDLFVBQVU7QUFDYixPQUFLLEVBQUUsT0ExQmdCLFNBQVMsQ0EwQmYsU0FBUyxDQUFDLENBQ3pCLE9BM0JxQixTQUFTLENBMkJwQixNQUFNLEVBQ2hCLE9BNUJxQixTQUFTLENBNEJwQixNQUFNLENBQ2pCLENBQUMsQ0FBQyxVQUFVO0FBQ2IscUJBQW1CLEVBQUUsT0E5QkUsU0FBUyxDQThCRCxLQUFLLENBQUMsVUFBVTtBQUMvQyxjQUFZLEVBQUUsT0EvQlMsU0FBUyxDQStCUixJQUFJO0FBQzVCLFNBQU8sRUFBRSxPQWhDYyxTQUFTLENBZ0NiLElBQUk7QUFDdkIsVUFBUSxFQUFFLE9BakNhLFNBQVMsQ0FpQ1osSUFBSTtBQUN4QixVQUFRLEVBQUUsT0FsQ2EsU0FBUyxDQWtDWixJQUFJO0FBQ3hCLFdBQVMsRUFBRSxPQW5DWSxTQUFTLENBbUNYLElBQUk7Q0FDMUI7a0JBdkJrQixRQUFRIiwiZmlsZSI6ImNvbXBvbmVudHMvSFRNTFRyZWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgQ29tcG9uZW50OiBIVE1MVHJlZVxuICpcbiAqIFB1YmxpYyBpbnRlcmZhY2Ugb2YgdGhlIGNvbXBvbmVudFxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZmluZERPTU5vZGUgfSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgeyByZW5kZXJUb1N0cmluZyB9IGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInXG5pbXBvcnQgeyBwYXJzZURPTSB9IGZyb20gJ2h0bWxwYXJzZXIyJ1xuXG5pbXBvcnQgZ2V0U3R5bGVzIGZyb20gJy4uL3RoZW1lcy8nXG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vQ29udGFpbmVyJ1xuXG5jb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnXG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFRNTFRyZWUgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgdGhlbWU6ICdjaHJvbWUtZGV2dG9vbHMnLFxuICAgIGRlZmF1bHRFeHBhbmRlZFRhZ3M6IFsnaHRtbCcsICdib2R5J11cbiAgfVxuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc291cmNlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBQcm9wVHlwZXMubm9kZSxcbiAgICAgIFByb3BUeXBlcy5pbnN0YW5jZU9mKGlzQnJvd3NlciA/IEhUTUxFbGVtZW50IDogT2JqZWN0KSxcbiAgICBdKS5pc1JlcXVpcmVkLFxuICAgIHRoZW1lOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBQcm9wVHlwZXMub2JqZWN0XG4gICAgXSkuaXNSZXF1aXJlZCxcbiAgICBkZWZhdWx0RXhwYW5kZWRUYWdzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBjdXN0b21SZW5kZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSG92ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRXhwYW5kOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25VbmZvY3VzOiBQcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICBjb25zdCB7IHNvdXJjZSB9ID0gdGhpcy5wcm9wc1xuICAgIC8vIGtlZXAgc3RhdGUgb2YgcHJvdmlkZWQgc291cmNlIGFuZCByZXByZXNlbnRhdGlvbiB2aWV3IGluIHN5bmNcbiAgICBpZiAoaXNCcm93c2VyICYmIHNvdXJjZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZmluZERPTU5vZGUodGhpcylcbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgIGNvbnN0IGluY2VwdGlvbiA9IG11dGF0aW9ucy5zb21lKChtdXRhdGlvbikgPT4gZWxlbWVudC5jb250YWlucyhtdXRhdGlvbi50YXJnZXQpKVxuICAgICAgICBpZiAoIWluY2VwdGlvbikge1xuICAgICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKVxuICAgICAgICB9XG4gICAgICB9KS5vYnNlcnZlKHNvdXJjZSwge1xuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKXtcbiAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KClcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKXtcbiAgICBjb25zdCB7IHNvdXJjZSwgdGhlbWUsIC4uLmRlZmF1bHRzQW5kRXZlbnRIYW5kbGVycyB9ID0gdGhpcy5wcm9wc1xuXG4gICAgY29uc3Qgb3JpZ2luID0gaXNCcm93c2VyICYmIHNvdXJjZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHNvdXJjZVxuICAgIGNvbnN0IHRyZWUgPSBwYXJzZURPTSgvKiogc291cmNlVGV4dCAqKi9cbiAgICAgIG9yaWdpbiA/IHNvdXJjZS5vdXRlckhUTUwgOlxuICAgICAgKFJlYWN0LmlzVmFsaWRFbGVtZW50KHNvdXJjZSkgPyByZW5kZXJUb1N0cmluZyhzb3VyY2UpIDogc291cmNlLnJlcGxhY2UoLzwhRE9DVFlQRSgufFxcbnxcXHIpKj8+L2ksICcnKSlcbiAgICApXG5cbiAgICBjb25zdCBjb21wb25lbnRTdHlsZXMgPSBnZXRTdHlsZXModGhlbWUpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJIVE1MVHJlZVwiPlxuICAgICAgICA8c3R5bGUgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBjb21wb25lbnRTdHlsZXMgfX0vPlxuICAgICAgICA8Q29udGFpbmVyIHRyZWU9e3RyZWV9IG9yaWdpbj17b3JpZ2lufHxudWxsfSB7Li4uZGVmYXVsdHNBbmRFdmVudEhhbmRsZXJzfS8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
