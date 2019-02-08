const Element = require('./Element')
const DefaultAttr = require('../attr/DefaultAttr')

module.exports = class extends Element {

  constructor (tagName) {
    super(tagName)
    this.className = tagName
  }

  onReadyDom () {
    this
      .makeProperties()
      .makeAttributes()
  }

  makeProperties () {
    this.properties = {}

    this.attrs
      .filter(attr => attr.constructor === DefaultAttr)
      .forEach(({name, value}) => this.properties[name] = value)

    return this
  }

  makeAttributes () {
    this.attributes = this.attrs.filter(attr => attr.constructor !== DefaultAttr)

    return this
  }
}