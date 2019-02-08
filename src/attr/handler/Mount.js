const Attr = require('../Mount')

module.exports = class {

  static get attrClass () {
    return Attr
  }

  handle (attr, element, template) {
    const {name: eventName} = attr

    template.joinInitialize(`this.trigger('${eventName}', {element: ${element}})`)
  }
}