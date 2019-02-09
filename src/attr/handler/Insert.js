const Attr = require('../Insert')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {name, triggerOnSet} = attr

    const getterExpression = `return this._${name}`
    const setterExpression = `
    ${element}.innetHTML = ''
    ${element}.appendChild(value instanceof Node ? value : (value.element || document.createTextNode(value)))
    
    this._${name} = value
    `

    template
      .addGetter(name, getterExpression)
      .addSetter(name, setterExpression, triggerOnSet)
  }
}