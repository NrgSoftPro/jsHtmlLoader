const Handler = require('./Handler')
const Widget = require('../Widget')
const Node = require('../Element')
const Template = require('../../template/Element')

module.exports = class extends Handler {

  static get nodeClass () {
    return Node
  }

  handle (node, parent, template = new Template()) {
    const {attrs, children, tagName} = node

    const element = template.createElement(tagName)

    if (!node.isRoot) {
      if (node.parentNode.constructor === Widget) {
        template.joinInitialize(`${parent}.trigger('appendChild', {child: ${element}})`)
      } else {
        template.append(parent, element)
      }
    }

    attrs.forEach(attr => this.handleAttr(attr, element, template))
    children.forEach(child => this.handleNode(child, element, template))

    return template
  }
}