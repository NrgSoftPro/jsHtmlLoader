const Attr = require('../Class')
const Widget = require('../../node/Widget')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    let {node, property, byDefault, scope, names, classNames, triggerOnSet} = attr

    if (node.constructor === Widget) {
      element = `${element}.element`
    }

    if (classNames.length === 1) {
      template
        .addGetter(property, `return ${element}.classList.contains(${classNames[0]})`)
        .addSetter(property, `${element}.classList.toggle(${classNames[0]}, value)`, triggerOnSet)
    } else {
      template
        .addGetter(property, `
          const names = ['${names.join('\',\'')}']
          for (const [index, className] of [${classNames.join(',')}].entries()) {
            if (${element}.classList.contains(className)) {
              return names[index]
            }
          }
        `)
        .addSetter(property, `
          ${element}.classList.remove(${classNames.join(',')})
          ${element}.classList.add(${scope}[value])
        `, triggerOnSet
        )
    }

    if (byDefault !== '') {
      template.joinInitialize(`this.${property} = ${byDefault}`)
    }
  }
}