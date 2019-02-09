const Attr = require('../Import')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {name: alias, value: path, node} = attr

    if (!node.isRoot) {
      throw new Error('\'import:\' attribute location is incorrect')
    }

    template.addImport(alias, path)
  }
}