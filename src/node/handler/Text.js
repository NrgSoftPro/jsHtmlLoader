const Node = require('../Text')

module.exports = class {

  static get nodeClass () {
    return Node
  }

  handle (node, parent, template) {
    const {value, isProperty, property, byDefault, triggerOnSet} = node

    if (!isProperty) {
      template.append(parent, template.createTextNode(value))

      return
    }

    const element = template.createTextNode(byDefault)

    template
      .append(parent, element)
      .addGetter(property, `return ${element}.nodeValue`)
      .addSetter(property, `${element}.nodeValue = this.t ? this.t(value) : value`, triggerOnSet)
  }
}