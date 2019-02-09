const Handler = require('./Handler')
const Widget = require('../Widget')
const Template = require('../../template/Widget')

module.exports = class extends Handler {

  static get nodeClass () {
    return Widget
  }

  handle (node, parent, template = new Template()) {
    const {className, properties, attributes, children} = node

    if (node.isRoot) {
      template.setParent(className)
      template.nextVariable
      attributes.forEach(attr => this.handleAttr(attr, 'this', template))
      children.forEach(child => this.handleNode(child, 'this', template))
      template.joinConstructor(`properties = {...${JSON.stringify(properties)}, ...properties || {}}`)

    } else {
      const widget = template.createWidget(className, properties)

      attributes.forEach(attr => this.handleAttr(attr, widget, template))
      children.forEach(child => this.handleNode(child, widget, template))

      if (node.parentNode.constructor === Widget) {
        template.joinInitialize(`${parent}.trigger('appendChild', {child: ${widget}})`)
      } else {
        template.append(parent, `${widget}.element`)
      }
    }

    return template
  }
}