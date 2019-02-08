const DefaultAttr = require('./DefaultAttr')

const self = class extends DefaultAttr {

  static get sign () {
    return 'attr'
  }

  static get notLikeProperty () {
    return ['class', 'for', 'colspan']
  }

  constructor (...args) {
    super(...args)

    this
      .makeProperty()
      .makeByDefault()
      .makeLikeProperty()
  }

  makeProperty () {
    this.property = this.value

    return this
  }

  makeByDefault () {
    const value = this.property.split('|')
    this.property = value[0]
    this.byDefault = value[1] || ''

    return this
  }

  makeLikeProperty () {
    this.likeProperty = !self.notLikeProperty.includes(this.name)

    return this
  }
}

module.exports = self