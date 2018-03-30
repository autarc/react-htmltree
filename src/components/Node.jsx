/**
 * # Component: Node
 *
 * Representation of an HTML element
 */

import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

// http://www.w3.org/TR/html-markup/syntax.html#void-elements
const voidTags = [
  'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
  'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source',
  'track', 'wbr'
]

/**
 *
 */
export default class Node extends Component {

  static propTypes = {
    node: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    onHover: PropTypes.func,
    customRenderer: PropTypes.func
  };

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.node !== this.props.node
  }

  render(){
    const { customRender } = this.props
    const Renderable = this.getRenderable()
    return (!customRender) ? Renderable : customRender((decorate) => {
      return decorate(Renderable) || <Renderable {...Renderable.props}/>
    }, this.props.node.toJS())
  }

  getRenderable(){
    const { node, update, onHover } = this.props

    const type = node.get('type')
    const name = node.get('name')
    const data = node.get('data')
    const attribs = node.get('attribs')
    const depth = node.get('depth')
    const children = node.get('children')

    const expanded = node.getIn(['state', 'expanded'])
    const selected = node.getIn(['state', 'selected'])
    const tailed = node.getIn(['state', 'tailed'])
    const unfocused = node.getIn(['state', 'unfocused'])

    const tagEventHandlers = {
      onMouseDown: (e) => update(e, this, 'triggerSelect', { tailed: false })
    }
    if (onHover) {
      Object.assign(tagEventHandlers, {
        onMouseOver: (e) => update(e, this, 'toggleHover'),
        onMouseOut: (e) => update(e, this, 'toggleHover')
      })
    }
    if (children && children.size && name !== 'html') {
      Object.assign(tagEventHandlers, {
        onDoubleClick: (e) => update(e, this, 'toggleExpand')
      })
    }

    // indentation
    var base = {
      paddingLeft: (depth + 1) * 10
    }

    var modifier = {
      selected: selected,
      unfocused: unfocused,
      tailed
    }

    // render: text + comments
    if (type === 'text' || type === 'comment') {
      return (
        <div className="Node">
          <div className={classnames(["Node__Tag", "Node__Head", modifier])} style={base} {...tagEventHandlers}>
            {type === 'text' ? (
              <span className="Node__Wrap">
                "<span className="Node__Text">{data}</span>"
              </span>
            ) : (
              <span className="Node__Comment">
                {`<!--${data}-->`}
              </span>
            )}
          </div>
        </div>
      )
    }

    // format: single-line tag, entries without children or just one + self-closing tags (e.g. images)
    if (!children || children.size === 1 && children.getIn([0, 'type']) === 'text') {
      const content = children && children.getIn([0, 'data']) || voidTags.indexOf(name) === -1
      if (typeof content === 'boolean' ||content.length < 500) { // only include less than 500
        return (
          <div className="Node">
            <div className={classnames(["Node__Tag", "Node__Head", modifier])} style={base} {...tagEventHandlers}>
              <span className="Node__Container">
                {this.getOpenTag(!content)}
                {content && <span className="Node__Content">{content}</span>}
                {content && this.getCloseTag()}
              </span>
            </div>
          </div>
        )
      }
    }

    // indentation
    var baseExpander = {
      left: base.paddingLeft - 12
    }

    // render: collapsed + extended content
    const head = (
      <div className={classnames(["Node__Tag", "Node__Head", modifier])} style={base} {...tagEventHandlers}>
        {name !== 'html' && (
          <span className="Node__Expander" style={baseExpander} onMouseDown={(e) => update(e, this, 'toggleExpand')}>
            {!expanded ? <span>&#9654;</span> : <span>&#9660;</span>}{/** '▶' : '▼' **/}
          </span>
        )}
        <span className="Node__Container">
          {this.getOpenTag()}
          {!expanded && <span>&hellip;</span>}
          {!expanded && this.getCloseTag()}
        </span>
      </div>
    )

    // invoke head styling
    if (!selected && !unfocused) {
      Object.assign(tagEventHandlers, {
        onMouseOver: (e) => update(e, this, 'toggleHover', { tailed: true }),
        onMouseOut: (e) => update(e, this, 'toggleHover', { tailed: false })
      })
    }

    return (
      <div className="Node">
        {head}
        {expanded && (
          <div className="Node__Children">
            {children.map((child, i) => <Node {...this.props} node={child} key={i}/>)}
          </div>
        )}
        {expanded && (
          <div
            className={classnames(["Node__Tag", "Node__Tail", modifier])} style={base}
            {...tagEventHandlers}
            onMouseDown={(e) => update(e, this, 'triggerSelect', { tailed: true })}
          >
            {this.getCloseTag()}
          </div>
        )}
      </div>
    )
  }

  getOpenTag (selfclosing) {
    const { node } = this.props
    const name = node.get('name')
    const attribs = node.get('attribs')
    return  (
      <span className="Node__Wrap">
        &lt;
        <span className="Node__Name">{name}</span>
        {attribs && attribs.entrySeq().map(([ key, value ]) => {
          const isLink = ['src', 'href'].indexOf(key) > -1
          return (
            <span className="Node__Wrap" key={key}>
              &nbsp;
              <span className="Node__AttributeKey">{key}</span>="
              {!isLink ?
                <span className="Node__AttributeValue">{value}</span> :
                <a className={classnames(['Node__AttributeValue'], {
                    link: true,
                    external: /^https?:/.test(value)
                  })}
                  href={value} target="_blank"
                >
                  {value}
                </a>
              }"
            </span>
          )
        })}
        {selfclosing && '/'}
        &gt;
      </span>
    )
  }

  getCloseTag(){
    const { node } = this.props
    const name = node.get('name')
    return (
      <span className="Node__Wrap">
        &lt;
        <span className="Node__Name">{`/${name}`}</span>
        &gt;
      </span>
    )
  }

}
