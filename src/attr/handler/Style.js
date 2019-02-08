const Attr = require('../Style')
const Widget = require('../../node/Widget')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {node, name: scope, value: classNames} = attr

    if (node.constructor === Widget) {
      element = `${element}.element`
    }

    classNames.trim().split(/\s+/).forEach(className => template.addClassName(element, `${scope}.${className}`))
  }
}