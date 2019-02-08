const Attr = require('../Extends')
const Widget = require('../../node/Widget')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {name: alias, node} = attr

    if (!node.isRoot || node.constructor === Widget) {
      throw new Error('\'extends:\' attribute location is incorrect')
    }

    template.setParent(alias)
  }
}