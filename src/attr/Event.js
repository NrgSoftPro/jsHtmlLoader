const DefaultAttr = require('./DefaultAttr')

module.exports = class extends DefaultAttr {

  static get sign () {
    return 'event'
  }

  constructor (...args) {
    super(...args)

    this.makeFromEvent()
  }

  makeFromEvent () {
    const position = this.value.lastIndexOf('.')

    this.property = this.value.substr(0, position)
    this.fromEvent = this.value.substr(position + 1)

    return this
  }
}