const DefaultAttr = require('./DefaultAttr')

module.exports = class extends DefaultAttr {

  static get sign () {
    return 'event'
  }

  constructor (...args) {
    super(...args)

    this.makeFromEventList()
  }

  makeFromEventList () {
    this.fromEventList = this.value.trim().split(/\s+/).map(value => {
      const position = this.value.lastIndexOf('.')

      return {
        property: value.substr(0, position),
        fromEvent: value.substr(position + 1)
      }
    })

    return this
  }
}