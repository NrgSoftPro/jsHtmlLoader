const Attr = require('../Attr')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {name, property, byDefault, likeProperty, triggerOnSet} = attr

    if (byDefault) {
      template.setAttribute(element, name, byDefault, likeProperty)
    }

    const getterExpression = likeProperty ?
      `return ${element}.${name}` :
      `return ${element}.getAttribute('${name}')`

    const setterExpression = likeProperty ?
      `${element}.${name} = value` :
      `${element}.setAttribute('${name}', value)`

    template
      .addGetter(property, getterExpression)
      .addSetter(property, setterExpression, triggerOnSet)
  }
}