const Attr = require('../Event')
const Widget = require('../../node/Widget')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    let {node, name, fromEvent, property} = attr

    if (!property) {
      property = element.substr(4)
    } else if (node.constructor === Widget) {
      property = `${element.substr(4)}.${property}`
    }

    template.addEvent(name, fromEvent, property)
  }
}