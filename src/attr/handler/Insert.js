const Attr = require('../Insert')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {name, triggerOnSet} = attr

    const elem = template.uniqueImport('Element', '@nrgsoft/ui/Element')

    const getterExpression = `return this._${name}`
    const setterExpression = `this._${name} = ${elem}.insert(${element}, value)`

    template
      .addGetter(name, getterExpression)
      .addSetter(name, setterExpression, triggerOnSet)
  }
}