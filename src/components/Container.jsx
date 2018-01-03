/**
 * # Component: Container
 *
 * Update & delegation layer
 */

import React, { Component } from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'

import { getSelector, getDepth, setDeep } from '../utilities'
import Node from './Node'

const isBrowser = typeof HTMLElement !== 'undefined'

/**
 *
 */
export default class Container extends Component {

  static propTypes = {
    tree: PropTypes.array.isRequired,
    origin: PropTypes.instanceOf(isBrowser && HTMLElement),
    defaultExpandedTags: PropTypes.array.isRequired,
    customRender: PropTypes.func,
    onHover: PropTypes.func,
    onExpand: PropTypes.func,
    onSelect: PropTypes.func,
    onUnfocus: PropTypes.func
  };

  constructor (props) {
    super(props)
    this.state = {
      root: this.getRoot(props),
      latest: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.tree !== this.props.tree) {
      this.setState({
        root: this.getRoot(nextProps),
        latest: null
      })
    }
  }

  render(){
    const { onHover, customRender } = this.props
    const { root } = this.state
    return (
      <div className="Container">
        <div className="Container__Nodes">
          <Node node={root} update={::this.onUpdate} onHover={onHover} customRender={customRender}/>
        </div>
        <input className="Container__Input" type="text" ref={(input) => { this.input = input; }} />
          onFocus={::this.toggleFocus}
          onBlur={::this.toggleFocus}
        />
      </div>
    )
  }

  /**
   * Retrieve an immutable representation of the nodes (incl. extended/trimmed data)
   * @param  {Object}  props.tree                - [description]
   * @param  {Array}   props.defaultExpandedTags - [description]
   * @return {Object}                            - [description]
   */
  getRoot ({ tree, defaultExpandedTags }) {
    transformNodes(tree, [], true)
    return Immutable.fromJS(tree[0])

    // recursive enumeration
    function transformNodes (tree, keyPath, initial) {
      tree.forEach((node, i) => {
        node.depth = getDepth(node)
        node.selector = getSelector(node.name ? node : node.parent)
        node.keyPath = initial ? keyPath : [...keyPath, 'children', i]
        node.state = defaultExpandedTags.indexOf(node.name) > -1 ? { expanded: true } : {}
        if (node.children) {
          if (node.children.length) {
            node.children = node.children.filter((child) => child.type !== 'text' || child.data.trim().length)
            transformNodes(node.children, node.keyPath)
          } else {
            delete node.children
          }
        }
        if (node.attribs && !Object.keys(node.attribs).length) {
          delete node.attribs
        }
        delete node.parent
        delete node.next
        delete node.prev
      })
    }
  }

  /**
   * [toggleFocus description]
   * @param  {Event} e - [description]
   */
  toggleFocus (e) {
    e.preventDefault()
    e.stopPropagation()

    const { latest } = this.state

    if (e.type === 'focus') {
      return this.onUpdate(null, latest, 'toggleFocus', { selected: true, unfocused: false })
    }
    // === blur || delay to check upcoming click
    this.timeout = setTimeout(() => {
      return this.onUpdate(null, latest, 'toggleFocus', { selected: false, unfocused: true })
    }, 100)
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
  onUpdate (e, component, type, data) {
    if (e && e.preventDefault) e.preventDefault()
    if (e && e.stopPropagation) e.stopPropagation()

    clearTimeout(this.timeout)

    const { origin, onHover, onExpand, onSelect, onUnfocus } = this.props
    const { node } = component.props
    const { root, latest } = this.state

    const name = node.get('name')
    const attribs = node.get('attribs')
    const selector = node.get('selector')

    const element = origin ? (selector.match('>') ? origin.querySelectorAll(selector)[0] : origin) :
                    { // shallow representation
                      tagName: name || node.get('type'),
                      attributes: attribs && attribs.toJS(),
                      selector: selector
                    }

    var keyPath = [...node.get('keyPath').toJS(), 'state']
    var updater = null // toggle: (value) => !value

    switch (type) {

      case 'toggleHover':
        if (onHover && onHover.call(this, element, component) !== undefined) return
        if (typeof data.tailed !== 'undefined') {
          keyPath = [...keyPath, 'tailed']
          updater = () => data.tailed
          break
        }
        return

      case 'toggleExpand':
        if (onExpand && onExpand.call(this, element, component) !== undefined) return
        // check: unfolding all children
        if (e.altKey && e.ctrlKey) {
          return this.setState({
            root: root.setIn([...node.get('keyPath').toJS()], setDeep(node, 'children', ['state', 'expanded'], true))
          })
        }
        // TODO:
        // - fix [issue#1]('tailed')
        // console.log(node.toJSON(), data, e.target)
        keyPath = [...keyPath, 'expanded']
        updater = (expanded) => !expanded
        break

      case 'triggerSelect':
        if (latest) {
          this.input.blur()
          const latestKeyPath = [...latest.props.node.get('keyPath').toJS(), 'state']
          return this.setState({
            root: root.withMutations((map) => map
                        .setIn([...latestKeyPath, 'tailed'], false)
                        .setIn([...latestKeyPath, 'selected'], false)
                        .setIn([...latestKeyPath, 'unfocused'], false)
                        .setIn([...keyPath, 'tailed'], data.tailed)
                  ),
            latest: component
          }, ::this.input.focus)
        }
        return this.setState({
          root: root.setIn([...keyPath, 'tailed'], data.tailed),
          latest: component
        }, ::this.input.focus)

      case 'toggleFocus':
        if (data.selected) {
          if (onSelect && onSelect.call(this, element, component) !== undefined) return
        } else {
          if (onUnfocus && onUnfocus.call(this, element, component) !== undefined) return
        }
        return this.setState({
          root: root.withMutations((map) => map
                      .setIn([...keyPath, 'selected'], data.selected)
                      .setIn([...keyPath, 'unfocused'], data.unfocused)
                )
        })
    }

    this.setState({
      root: root.updateIn(keyPath, updater)
    })
  }

}
