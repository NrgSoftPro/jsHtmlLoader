const DefaultAttr = require('./DefaultAttr')

module.exports = class {

  constructor (attrs) {
    this.signMap = new Map()

    for (const attr of attrs) {
      this.signMap.set(attr.sign, attr)
    }
  }

  create (name, value, node) {
    const options = {
      triggerOnSet: false
    }

    if ('@' === name[0]) {
      options.triggerOnSet = true
      name = name.substr(1)
    }

    const sign = name.substr(0, name.indexOf(':'))
    if (!this.signMap.has(sign)) {
      throw new Error(`Unknown attribute '${name}'`)
    }

    const attrClass = this.signMap.get(sign)

    if (attrClass !== DefaultAttr) {
      name = name.substr(name.indexOf(':') + 1)
    }

    return new attrClass(name, value, node, options)
  }
}