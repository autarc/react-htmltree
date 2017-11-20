'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

            this.refs.input.blur();
            var latestKeyPath = [].concat(_toConsumableArray(latest.props.node.get('keyPath').toJS()), ['state']);
            return this.setState({
              root: root.withMutations(function (map) {
                return map.setIn([].concat(_toConsumableArray(latestKeyPath), ['tailed']), false).setIn([].concat(_toConsumableArray(latestKeyPath), ['selected']), false).setIn([].concat(_toConsumableArray(latestKeyPath), ['unfocused']), false).setIn([].concat(_toConsumableArray(keyPath), ['tailed']), data.tailed);
              }),
              latest: component
            }, (_context = this.refs.input).focus.bind(_context));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29udGFpbmVyLmpzeCJdLCJuYW1lcyI6WyJpc0Jyb3dzZXIiLCJIVE1MRWxlbWVudCIsIkNvbnRhaW5lciIsInByb3BzIiwic3RhdGUiLCJyb290IiwiZ2V0Um9vdCIsImxhdGVzdCIsIm5leHRQcm9wcyIsInRyZWUiLCJzZXRTdGF0ZSIsIm9uSG92ZXIiLCJjdXN0b21SZW5kZXIiLCJvblVwZGF0ZSIsInRvZ2dsZUZvY3VzIiwiZGVmYXVsdEV4cGFuZGVkVGFncyIsInRyYW5zZm9ybU5vZGVzIiwiZnJvbUpTIiwia2V5UGF0aCIsImluaXRpYWwiLCJmb3JFYWNoIiwibm9kZSIsImkiLCJkZXB0aCIsInNlbGVjdG9yIiwibmFtZSIsInBhcmVudCIsImluZGV4T2YiLCJleHBhbmRlZCIsImNoaWxkcmVuIiwibGVuZ3RoIiwiZmlsdGVyIiwiY2hpbGQiLCJ0eXBlIiwiZGF0YSIsInRyaW0iLCJhdHRyaWJzIiwiT2JqZWN0Iiwia2V5cyIsIm5leHQiLCJwcmV2IiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwic2VsZWN0ZWQiLCJ1bmZvY3VzZWQiLCJ0aW1lb3V0Iiwic2V0VGltZW91dCIsImNvbXBvbmVudCIsImNsZWFyVGltZW91dCIsIm9yaWdpbiIsIm9uRXhwYW5kIiwib25TZWxlY3QiLCJvblVuZm9jdXMiLCJnZXQiLCJlbGVtZW50IiwibWF0Y2giLCJxdWVyeVNlbGVjdG9yQWxsIiwidGFnTmFtZSIsImF0dHJpYnV0ZXMiLCJ0b0pTIiwidXBkYXRlciIsImNhbGwiLCJ1bmRlZmluZWQiLCJ0YWlsZWQiLCJhbHRLZXkiLCJjdHJsS2V5Iiwic2V0SW4iLCJyZWZzIiwiaW5wdXQiLCJibHVyIiwibGF0ZXN0S2V5UGF0aCIsIndpdGhNdXRhdGlvbnMiLCJtYXAiLCJmb2N1cyIsInVwZGF0ZUluIiwicHJvcFR5cGVzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwiaW5zdGFuY2VPZiIsImZ1bmMiXSwibWFwcGluZ3Mi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O0FBQ1pMLGNBQU1BLEtBQUtzRSxRQUFMLENBQWN6RCxPQUFkLEVBQXVCMkMsT0FBdkI7QUFETSxPQUFkO0FBR0Q7Ozs7OztBQXhNa0IzRCxTLENBRVowRSxTLEdBQVk7QUFDakJuRSxRQUFNLGlCQUFVb0UsS0FBVixDQUFnQkMsVUFETDtBQUVqQjVCLFVBQVEsaUJBQVU2QixVQUFWLENBQXFCL0UsYUFBYUMsV0FBbEMsQ0FGUztBQUdqQmMsdUJBQXFCLGlCQUFVOEQsS0FBVixDQUFnQkMsVUFIcEI7QUFJakJsRSxnQkFBYyxpQkFBVW9FLElBSlA7QUFLakJyRSxXQUFTLGlCQUFVcUUsSUFMRjtBQU1qQjdCLFlBQVUsaUJBQVU2QixJQU5IO0FBT2pCNUIsWUFBVSxpQkFBVTRCLElBUEg7QUFRakIzQixhQUFXLGlCQUFVMkI7QUFSSixDO2tCQUZBOUUsUyIsImZpbGUiOiJjb21wb25lbnRzL0NvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBDb21wb25lbnQ6IENvbnRhaW5lclxuICpcbiAqIFVwZGF0ZSAmIGRlbGVnYXRpb24gbGF5ZXJcbiAqL1xuXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJ1xuXG5pbXBvcnQgeyBnZXRTZWxlY3RvciwgZ2V0RGVwdGgsIHNldERlZXAgfSBmcm9tICcuLi91dGlsaXRpZXMnXG5pbXBvcnQgTm9kZSBmcm9tICcuL05vZGUnXG5cbmNvbnN0IGlzQnJvd3NlciA9IHR5cGVvZiBIVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCdcblxuLyoqXG4gKlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdHJlZTogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgb3JpZ2luOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihpc0Jyb3dzZXIgJiYgSFRNTEVsZW1lbnQpLFxuICAgIGRlZmF1bHRFeHBhbmRlZFRhZ3M6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgIGN1c3RvbVJlbmRlcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25Ib3ZlcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25FeHBhbmQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uU2VsZWN0OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblVuZm9jdXM6IFByb3BUeXBlcy5mdW5jXG4gIH07XG5cbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHJvb3Q6IHRoaXMuZ2V0Um9vdChwcm9wcyksXG4gICAgICBsYXRlc3Q6IG51bGxcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLnRyZWUgIT09IHRoaXMucHJvcHMudHJlZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHJvb3Q6IHRoaXMuZ2V0Um9vdChuZXh0UHJvcHMpLFxuICAgICAgICBsYXRlc3Q6IG51bGxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCl7XG4gICAgY29uc3QgeyBvbkhvdmVyLCBjdXN0b21SZW5kZXIgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXMuc3RhdGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJDb250YWluZXJfX05vZGVzXCI+XG4gICAgICAgICAgPE5vZGUgbm9kZT17cm9vdH0gdXBkYXRlPXs6OnRoaXMub25VcGRhdGV9IG9uSG92ZXI9e29uSG92ZXJ9IGN1c3RvbVJlbmRlcj17Y3VzdG9tUmVuZGVyfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiQ29udGFpbmVyX19JbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgcmVmPVwiaW5wdXRcIlxuICAgICAgICAgIG9uRm9jdXM9ezo6dGhpcy50b2dnbGVGb2N1c31cbiAgICAgICAgICBvbkJsdXI9ezo6dGhpcy50b2dnbGVGb2N1c31cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbiBpbW11dGFibGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5vZGVzIChpbmNsLiBleHRlbmRlZC90cmltbWVkIGRhdGEpXG4gICAqIEBwYXJhbSAge09iamVjdH0gIHByb3BzLnRyZWUgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge0FycmF5fSAgIHByb3BzLmRlZmF1bHRFeHBhbmRlZFRhZ3MgLSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZXRSb290ICh7IHRyZWUsIGRlZmF1bHRFeHBhbmRlZFRhZ3MgfSkge1xuICAgIHRyYW5zZm9ybU5vZGVzKHRyZWUsIFtdLCB0cnVlKVxuICAgIHJldHVybiBJbW11dGFibGUuZnJvbUpTKHRyZWVbMF0pXG5cbiAgICAvLyByZWN1cnNpdmUgZW51bWVyYXRpb25cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1Ob2RlcyAodHJlZSwga2V5UGF0aCwgaW5pdGlhbCkge1xuICAgICAgdHJlZS5mb3JFYWNoKChub2RlLCBpKSA9PiB7XG4gICAgICAgIG5vZGUuZGVwdGggPSBnZXREZXB0aChub2RlKVxuICAgICAgICBub2RlLnNlbGVjdG9yID0gZ2V0U2VsZWN0b3Iobm9kZS5uYW1lID8gbm9kZSA6IG5vZGUucGFyZW50KVxuICAgICAgICBub2RlLmtleVBhdGggPSBpbml0aWFsID8ga2V5UGF0aCA6IFsuLi5rZXlQYXRoLCAnY2hpbGRyZW4nLCBpXVxuICAgICAgICBub2RlLnN0YXRlID0gZGVmYXVsdEV4cGFuZGVkVGFncy5pbmRleE9mKG5vZGUubmFtZSkgPiAtMSA/IHsgZXhwYW5kZWQ6IHRydWUgfSA6IHt9XG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZC50eXBlICE9PSAndGV4dCcgfHwgY2hpbGQuZGF0YS50cmltKCkubGVuZ3RoKVxuICAgICAgICAgICAgdHJhbnNmb3JtTm9kZXMobm9kZS5jaGlsZHJlbiwgbm9kZS5rZXlQYXRoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5hdHRyaWJzICYmICFPYmplY3Qua2V5cyhub2RlLmF0dHJpYnMpLmxlbmd0aCkge1xuICAgICAgICAgIGRlbGV0ZSBub2RlLmF0dHJpYnNcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnRcbiAgICAgICAgZGVsZXRlIG5vZGUubmV4dFxuICAgICAgICBkZWxldGUgbm9kZS5wcmV2XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBbdG9nZ2xlRm9jdXMgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge0V2ZW50fSBlIC0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgdG9nZ2xlRm9jdXMgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBjb25zdCB7IGxhdGVzdCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgaWYgKGUudHlwZSA9PT0gJ2ZvY3VzJykge1xuICAgICAgcmV0dXJuIHRoaXMub25VcGRhdGUobnVsbCwgbGF0ZXN0LCAndG9nZ2xlRm9jdXMnLCB7IHNlbGVjdGVkOiB0cnVlLCB1bmZvY3VzZWQ6IGZhbHNlIH0pXG4gICAgfVxuICAgIC8vID09PSBibHVyIHx8IGRlbGF5IHRvIGNoZWNrIHVwY29taW5nIGNsaWNrXG4gICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5vblVwZGF0ZShudWxsLCBsYXRlc3QsICd0b2dnbGVGb2N1cycsIHsgc2VsZWN0ZWQ6IGZhbHNlLCB1bmZvY3VzZWQ6IHRydWUgfSlcbiAgICB9LCAxMDApXG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciBmb3IgZGlmZmVyZW50IGFjdGlvbnMgYmFzZWQgb24gdGhlIHR5cGVcbiAgICogQHBhcmFtICB7U3RyaW5nfSB0eXBlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge09iamVjdH0gY29tcG9uZW50IC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG5leHRTdGF0ZSAtIFtkZXNjcmlwdGlvbl1cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgZm9yIGRpZmZlcmVudCBhY3Rpb25zIGJhc2VkIG9uIHRoZSB0eXBlXG4gICAqIEBwYXJhbSAge0V2ZW50fSAgICAgICAgICBlICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1JlYWN0Q29tcG9uZW50fSBjb21wb25lbnQgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICB0eXBlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBkYXRhICAgICAgLSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBvblVwZGF0ZSAoZSwgY29tcG9uZW50LCB0eXBlLCBkYXRhKSB7XG4gICAgaWYgKGUgJiYgZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgKGUgJiYgZS5zdG9wUHJvcGFnYXRpb24pIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG5cbiAgICBjb25zdCB7IG9yaWdpbiwgb25Ib3Zlciwgb25FeHBhbmQsIG9uU2VsZWN0LCBvblVuZm9jdXMgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IG5vZGUgfSA9IGNvbXBvbmVudC5wcm9wc1xuICAgIGNvbnN0IHsgcm9vdCwgbGF0ZXN0IH0gPSB0aGlzLnN0YXRlXG5cbiAgICBjb25zdCBuYW1lID0gbm9kZS5nZXQoJ25hbWUnKVxuICAgIGNvbnN0IGF0dHJpYnMgPSBub2RlLmdldCgnYXR0cmlicycpXG4gICAgY29uc3Qgc2VsZWN0b3IgPSBub2RlLmdldCgnc2VsZWN0b3InKVxuXG4gICAgY29uc3QgZWxlbWVudCA9IG9yaWdpbiA/IChzZWxlY3Rvci5tYXRjaCgnPicpID8gb3JpZ2luLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpWzBdIDogb3JpZ2luKSA6XG4gICAgICAgICAgICAgICAgICAgIHsgLy8gc2hhbGxvdyByZXByZXNlbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICAgIHRhZ05hbWU6IG5hbWUgfHwgbm9kZS5nZXQoJ3R5cGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJzICYmIGF0dHJpYnMudG9KUygpLFxuICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvclxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICB2YXIga2V5UGF0aCA9IFsuLi5ub2RlLmdldCgna2V5UGF0aCcpLnRvSlMoKSwgJ3N0YXRlJ11cbiAgICB2YXIgdXBkYXRlciA9IG51bGwgLy8gdG9nZ2xlOiAodmFsdWUpID0+ICF2YWx1ZVxuXG4gICAgc3dpdGNoICh0eXBlKSB7XG5cbiAgICAgIGNhc2UgJ3RvZ2dsZUhvdmVyJzpcbiAgICAgICAgaWYgKG9uSG92ZXIgJiYgb25Ib3Zlci5jYWxsKHRoaXMsIGVsZW1lbnQsIGNvbXBvbmVudCkgIT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YS50YWlsZWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAga2V5UGF0aCA9IFsuLi5rZXlQYXRoLCAndGFpbGVkJ11cbiAgICAgICAgICB1cGRhdGVyID0gKCkgPT4gZGF0YS50YWlsZWRcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuXG4gICAgICBjYXNlICd0b2dnbGVFeHBhbmQnOlxuICAgICAgICBpZiAob25FeHBhbmQgJiYgb25FeHBhbmQuY2FsbCh0aGlzLCBlbGVtZW50LCBjb21wb25lbnQpICE9PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgICAvLyBjaGVjazogdW5mb2xkaW5nIGFsbCBjaGlsZHJlblxuICAgICAgICBpZiAoZS5hbHRLZXkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcm9vdDogcm9vdC5zZXRJbihbLi4ubm9kZS5nZXQoJ2tleVBhdGgnKS50b0pTKCldLCBzZXREZWVwKG5vZGUsICdjaGlsZHJlbicsIFsnc3RhdGUnLCAnZXhwYW5kZWQnXSwgdHJ1ZSkpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOlxuICAgICAgICAvLyAtIGZpeCBbaXNzdWUjMV0oJ3RhaWxlZCcpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG5vZGUudG9KU09OKCksIGRhdGEsIGUudGFyZ2V0KVxuICAgICAgICBrZXlQYXRoID0gWy4uLmtleVBhdGgsICdleHBhbmRlZCddXG4gICAgICAgIHVwZGF0ZXIgPSAoZXhwYW5kZWQpID0+ICFleHBhbmRlZFxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlICd0cmlnZ2VyU2VsZWN0JzpcbiAgICAgICAgaWYgKGxhdGVzdCkge1xuICAgICAgICAgIHRoaXMucmVmcy5pbnB1dC5ibHVyKClcbiAgICAgICAgICBjb25zdCBsYXRlc3RLZXlQYXRoID0gWy4uLmxhdGVzdC5wcm9wcy5ub2RlLmdldCgna2V5UGF0aCcpLnRvSlMoKSwgJ3N0YXRlJ11cbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByb290OiByb290LndpdGhNdXRhdGlvbnMoKG1hcCkgPT4gbWFwXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0SW4oWy4uLmxhdGVzdEtleVBhdGgsICd0YWlsZWQnXSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0SW4oWy4uLmxhdGVzdEtleVBhdGgsICdzZWxlY3RlZCddLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ubGF0ZXN0S2V5UGF0aCwgJ3VuZm9jdXNlZCddLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ua2V5UGF0aCwgJ3RhaWxlZCddLCBkYXRhLnRhaWxlZClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICBsYXRlc3Q6IGNvbXBvbmVudFxuICAgICAgICAgIH0sIDo6dGhpcy5yZWZzLmlucHV0LmZvY3VzKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICByb290OiByb290LnNldEluKFsuLi5rZXlQYXRoLCAndGFpbGVkJ10sIGRhdGEudGFpbGVkKSxcbiAgICAgICAgICBsYXRlc3Q6IGNvbXBvbmVudFxuICAgICAgICB9LCA6OnRoaXMucmVmcy5pbnB1dC5mb2N1cylcblxuICAgICAgY2FzZSAndG9nZ2xlRm9jdXMnOlxuICAgICAgICBpZiAoZGF0YS5zZWxlY3RlZCkge1xuICAgICAgICAgIGlmIChvblNlbGVjdCAmJiBvblNlbGVjdC5jYWxsKHRoaXMsIGVsZW1lbnQsIGNvbXBvbmVudCkgIT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9uVW5mb2N1cyAmJiBvblVuZm9jdXMuY2FsbCh0aGlzLCBlbGVtZW50LCBjb21wb25lbnQpICE9PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICByb290OiByb290LndpdGhNdXRhdGlvbnMoKG1hcCkgPT4gbWFwXG4gICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5rZXlQYXRoLCAnc2VsZWN0ZWQnXSwgZGF0YS5zZWxlY3RlZClcbiAgICAgICAgICAgICAgICAgICAgICAuc2V0SW4oWy4uLmtleVBhdGgsICd1bmZvY3VzZWQnXSwgZGF0YS51bmZvY3VzZWQpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcm9vdDogcm9vdC51cGRhdGVJbihrZXlQYXRoLCB1cGRhdGVyKVxuICAgIH0pXG4gIH1cblxufVxuIl19
