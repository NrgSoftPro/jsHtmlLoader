const Attr = require('../Prop')
const Widget = require('../../node/Widget')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {name, value, triggerOnSet} = attr

    if (!value) {
      template.addGetter(name, `return ${element}`)
    } else {
      if (template.hasImportAlias(value)) {
        template
          .addGetter(name, `return this._${name} || ${value}`)
          .addSetter(name, `this._${name} = value`, triggerOnSet)
      } else if (attr.node.constructor === Widget) {
        template
          .addGetter(name, `return ${element}.${value}`)
          .addSetter(name, `${element}.${value} = value`, triggerOnSet)
      } else {
        template
          .addGetter(name, `return this.${value}`)
          .addSetter(name, `this.${value} = value`, triggerOnSet)
      }
    }
  }
}