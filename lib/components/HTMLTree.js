'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var HTMLTree = function (_Component) {
  _inherits(HTMLTree, _Component);

  function HTMLTree() {
    _classCallCheck(this, HTMLTree);

    return _possibleConstructorReturn(this, (HTMLTree.__proto__ || Object.getPrototypeOf(HTMLTree)).apply(this, arguments));
  }

  _createClass(HTMLTree, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var source = this.props.source;
      // keep state of provided source and representation view in sync

      if (isBrowser && source instanceof HTMLElement) {
        var element = (0, _reactDom.findDOMNode)(this);
        this.observer = new MutationObserver(function (mutations) {
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
      var _props = this.props,
          source = _props.source,
          theme = _props.theme,
          defaultsAndEventHandlers = _objectWithoutProperties(_props, ['source', 'theme']);

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
}(_react.Component);

HTMLTree.defaultProps = {
  theme: 'chrome-devtools',
  defaultExpandedTags: ['html', 'body']
};
HTMLTree.propTypes = {
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.instanceOf(isBrowser ? HTMLElement : Object)]).isRequired,
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  defaultExpandedTags: PropTypes.array.isRequired,
  customRender: PropTypes.func,
  onHover: PropTypes.func,
  onExpand: PropTypes.func,
  onSelect: PropTypes.func,
  onUnfocus: PropTypes.func
};
exports.default = HTMLTree;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvSFRNTFRyZWUuanN4Il0sIm5hbWVzIjpbImlzQnJvd3NlciIsIkhUTUxFbGVtZW50IiwiSFRNTFRyZWUiLCJzb3VyY2UiLCJwcm9wcyIsImVsZW1lbnQiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJpbmNlcHRpb24iLCJzb21lIiwibXV0YXRpb24iLCJjb250YWlucyIsInRhcmdldCIsImZvcmNlVXBkYXRlIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJhdHRyaWJ1dGVzIiwiZGlzY29ubmVjdCIsInRoZW1lIiwiZGVmYXVsdHNBbmRFdmVudEhhbmRsZXJzIiwib3JpZ2luIiwidHJlZSIsIm91dGVySFRNTCIsImlzVmFsaWRFbGVtZW50IiwicmVwbGFjZSIsImNvbXBvbmVudFN0eWxlcyIsIl9faHRtbCIsImRlZmF1bHRQcm9wcyIsImRlZmF1bHRFeHBhbmRlZFRhZ3MiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJvbmVPZlR5cGUiLCJzdHJpbmciLCJub2RlIiwiaW5zdGFuY2VPZiIsIk9iamVjdCIsImlzUmVxdWlyZWQiLCJvYmplY3QiLCJhcnJheSIsImN1c3RvbVJlbmRlciIsImZ1bmMiLCJvbkhvdmVyIiwib25FeHBhbmQiLCJvblNlbGVjdCIsIm9uVW5mb2N1cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7OytlQVpBOzs7Ozs7QUFjQSxJQUFNQSxZQUFZLE9BQU9DLFdBQVAsS0FBdUIsV0FBekM7O0FBRUE7Ozs7SUFHcUJDLFE7Ozs7Ozs7Ozs7O3dDQXlCQTtBQUFBOztBQUFBLFVBQ1RDLE1BRFMsR0FDRSxLQUFLQyxLQURQLENBQ1RELE1BRFM7QUFFakI7O0FBQ0EsVUFBSUgsYUFBYUcsa0JBQWtCRixXQUFuQyxFQUFnRDtBQUM5QyxZQUFNSSxVQUFVLDJCQUFZLElBQVosQ0FBaEI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCLElBQUlDLGdCQUFKLENBQXFCLFVBQUNDLFNBQUQsRUFBZTtBQUNsRCxjQUFNQyxZQUFZRCxVQUFVRSxJQUFWLENBQWUsVUFBQ0MsUUFBRDtBQUFBLG1CQUFjTixRQUFRTyxRQUFSLENBQWlCRCxTQUFTRSxNQUExQixDQUFkO0FBQUEsV0FBZixDQUFsQjtBQUNBLGNBQUksQ0FBQ0osU0FBTCxFQUFnQjtBQUNkLG1CQUFLSyxXQUFMO0FBQ0Q7QUFDRixTQUxlLEVBS2JDLE9BTGEsQ0FLTFosTUFMSyxFQUtHO0FBQ2pCYSxxQkFBVyxJQURNO0FBRWpCQyxtQkFBUyxJQUZRO0FBR2pCQyxzQkFBWTtBQUhLLFNBTEgsQ0FBaEI7QUFVRDtBQUNGOzs7MkNBRXFCO0FBQ3BCLFVBQUksS0FBS1osUUFBVCxFQUFtQjtBQUNqQixhQUFLQSxRQUFMLENBQWNhLFVBQWQ7QUFDRDtBQUNGOzs7NkJBRU87QUFBQSxtQkFDaUQsS0FBS2YsS0FEdEQ7QUFBQSxVQUNFRCxNQURGLFVBQ0VBLE1BREY7QUFBQSxVQUNVaUIsS0FEVixVQUNVQSxLQURWO0FBQUEsVUFDb0JDLHdCQURwQjs7QUFHTixVQUFNQyxTQUFTdEIsYUFBYUcsa0JBQWtCRixXQUEvQixJQUE4Q0UsTUFBN0Q7QUFDQSxVQUFNb0IsT0FBTywyQkFBUztBQUNwQkQsZUFBU25CLE9BQU9xQixTQUFoQixHQUNDLGdCQUFNQyxjQUFOLENBQXFCdEIsTUFBckIsSUFBK0IsNEJBQWVBLE1BQWYsQ0FBL0IsR0FBd0RBLE9BQU91QixPQUFQLENBQWUsd0JBQWYsRUFBeUMsRUFBekMsQ0FGOUMsQ0FBYjs7QUFLQSxVQUFNQyxrQkFBa0Isc0JBQVVQLEtBQVYsQ0FBeEI7O0FBRUEsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFVBQWY7QUFDRSxpREFBTyx5QkFBeUIsRUFBRVEsUUFBUUQsZUFBVixFQUFoQyxHQURGO0FBRUUsc0VBQVcsTUFBTUosSUFBakIsRUFBdUIsUUFBUUQsVUFBUSxJQUF2QyxJQUFpREQsd0JBQWpEO0FBRkYsT0FERjtBQU1EOzs7Ozs7QUFsRWtCbkIsUSxDQUVaMkIsWSxHQUFlO0FBQ3BCVCxTQUFPLGlCQURhO0FBRXBCVSx1QkFBcUIsQ0FBQyxNQUFELEVBQVMsTUFBVDtBQUZELEM7QUFGSDVCLFEsQ0FPWjZCLFMsR0FBWTtBQUNqQjVCLFVBQVE2QixVQUFVQyxTQUFWLENBQW9CLENBQzFCRCxVQUFVRSxNQURnQixFQUUxQkYsVUFBVUcsSUFGZ0IsRUFHMUJILFVBQVVJLFVBQVYsQ0FBcUJwQyxZQUFZQyxXQUFaLEdBQTBCb0MsTUFBL0MsQ0FIMEIsQ0FBcEIsRUFJTEMsVUFMYztBQU1qQmxCLFNBQU9ZLFVBQVVDLFNBQVYsQ0FBb0IsQ0FDekJELFVBQVVFLE1BRGUsRUFFekJGLFVBQVVPLE1BRmUsQ0FBcEIsRUFHSkQsVUFUYztBQVVqQlIsdUJBQXFCRSxVQUFVUSxLQUFWLENBQWdCRixVQVZwQjtBQVdqQkcsZ0JBQWNULFVBQVVVLElBWFA7QUFZakJDLFdBQVNYLFVBQVVVLElBWkY7QUFhakJFLFlBQVVaLFVBQVVVLElBYkg7QUFjakJHLFlBQVViLFVBQVVVLElBZEg7QUFlakJJLGFBQVdkLFVBQVVVO0FBZkosQztrQkFQQXhDLFEiLCJmaWxlIjoiY29tcG9uZW50cy9IVE1MVHJlZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBDb21wb25lbnQ6IEhUTUxUcmVlXG4gKlxuICogUHVibGljIGludGVyZmFjZSBvZiB0aGUgY29tcG9uZW50XG4gKi9cblxuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZmluZERPTU5vZGUgfSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgeyByZW5kZXJUb1N0cmluZyB9IGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInXG5pbXBvcnQgeyBwYXJzZURPTSB9IGZyb20gJ2h0bWxwYXJzZXIyJ1xuXG5pbXBvcnQgZ2V0U3R5bGVzIGZyb20gJy4uL3RoZW1lcy8nXG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vQ29udGFpbmVyJ1xuXG5jb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnXG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFRNTFRyZWUgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgdGhlbWU6ICdjaHJvbWUtZGV2dG9vbHMnLFxuICAgIGRlZmF1bHRFeHBhbmRlZFRhZ3M6IFsnaHRtbCcsICdib2R5J11cbiAgfTtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHNvdXJjZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgUHJvcFR5cGVzLm5vZGUsXG4gICAgICBQcm9wVHlwZXMuaW5zdGFuY2VPZihpc0Jyb3dzZXIgPyBIVE1MRWxlbWVudCA6IE9iamVjdCksXG4gICAgXSkuaXNSZXF1aXJlZCxcbiAgICB0aGVtZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgUHJvcFR5cGVzLm9iamVjdFxuICAgIF0pLmlzUmVxdWlyZWQsXG4gICAgZGVmYXVsdEV4cGFuZGVkVGFnczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgY3VzdG9tUmVuZGVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkhvdmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkV4cGFuZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uVW5mb2N1czogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgIGNvbnN0IHsgc291cmNlIH0gPSB0aGlzLnByb3BzXG4gICAgLy8ga2VlcCBzdGF0ZSBvZiBwcm92aWRlZCBzb3VyY2UgYW5kIHJlcHJlc2VudGF0aW9uIHZpZXcgaW4gc3luY1xuICAgIGlmIChpc0Jyb3dzZXIgJiYgc291cmNlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBmaW5kRE9NTm9kZSh0aGlzKVxuICAgICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgY29uc3QgaW5jZXB0aW9uID0gbXV0YXRpb25zLnNvbWUoKG11dGF0aW9uKSA9PiBlbGVtZW50LmNvbnRhaW5zKG11dGF0aW9uLnRhcmdldCkpXG4gICAgICAgIGlmICghaW5jZXB0aW9uKSB7XG4gICAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pLm9ic2VydmUoc291cmNlLCB7XG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpe1xuICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XG4gICAgICB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpe1xuICAgIGNvbnN0IHsgc291cmNlLCB0aGVtZSwgLi4uZGVmYXVsdHNBbmRFdmVudEhhbmRsZXJzIH0gPSB0aGlzLnByb3BzXG5cbiAgICBjb25zdCBvcmlnaW4gPSBpc0Jyb3dzZXIgJiYgc291cmNlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgc291cmNlXG4gICAgY29uc3QgdHJlZSA9IHBhcnNlRE9NKC8qKiBzb3VyY2VUZXh0ICoqL1xuICAgICAgb3JpZ2luID8gc291cmNlLm91dGVySFRNTCA6XG4gICAgICAoUmVhY3QuaXNWYWxpZEVsZW1lbnQoc291cmNlKSA/IHJlbmRlclRvU3RyaW5nKHNvdXJjZSkgOiBzb3VyY2UucmVwbGFjZSgvPCFET0NUWVBFKC58XFxufFxccikqPz4vaSwgJycpKVxuICAgIClcblxuICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlcyA9IGdldFN0eWxlcyh0aGVtZSlcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIkhUTUxUcmVlXCI+XG4gICAgICAgIDxzdHlsZSBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IGNvbXBvbmVudFN0eWxlcyB9fS8+XG4gICAgICAgIDxDb250YWluZXIgdHJlZT17dHJlZX0gb3JpZ2luPXtvcmlnaW58fG51bGx9IHsuLi5kZWZhdWx0c0FuZEV2ZW50SGFuZGxlcnN9Lz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG59XG4iXX0=
