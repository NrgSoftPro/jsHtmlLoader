module.exports = class {

  static get sign () {
    return ''
  }

  constructor (name, value, node, options = {}) {
    this.name = name
    this.value = value
    this.node = node
    this.triggerOnSet = options.triggerOnSet
  }
}
