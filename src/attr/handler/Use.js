const Attr = require('../Use')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {name: alias, value: aliasesList} = attr

    if (alias) {
      template.addTrait(alias)
    } else {
      aliasesList.trim().split(/\s+/).forEach(alias => template.addTrait(alias))
    }
  }
}