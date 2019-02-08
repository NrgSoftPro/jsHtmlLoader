const DefaultAttr = require('./DefaultAttr')

module.exports = class extends DefaultAttr {

  static get sign () {
    return 'class'
  }

  constructor (...args) {
    super(...args)

    this
      .makeScope()
      .makeClassNames()
      .makeProperty()
      .makeByDefault()
  }

  makeScope () {
    this.scope = this.name.substr(0, this.name.indexOf(':'))

    return this
  }

  makeClassNames () {
    this.names = this.name
      .substr(this.name.indexOf(':') + 1)
      .split('|')

    this.classNames = this.names.map(className => `${this.scope}.${className}`)

    return this
  }

  makeProperty () {
    this.property = this.value

    return this
  }

  makeByDefault () {
    const value = this.property.split('|').map(item => item.trim())

    this.property = value[0]
    this.byDefault = value[1] || ''

    if (!this.byDefault) {
      return this
    }

    if (this.classNames.length === 1) {
      if (!['true', 'false'].includes(this.byDefault)) {
        throw new Error('Default value must be \'true\' or \'false\'')
      }
      this.byDefault = 'true' === this.byDefault

    } else {
      if (!this.names.includes(this.byDefault)) {
        throw new Error(`Default value must be from list: ${this.names.join(',')}`)
      }
      this.byDefault = `'${this.byDefault}'`
    }

    return this
  }
}