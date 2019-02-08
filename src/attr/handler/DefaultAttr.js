const Attr = require('../DefaultAttr')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {name, value} = attr

    //todo: check if not like property
    template.setAttribute(element, name, value)
  }
}