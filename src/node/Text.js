module.exports = class {

  constructor (value) {
    if (!value) {
      throw new Error('Text value must be not empty')
    }

    this.value = value

    this.makeIsProperty()
    if (!this.isProperty) {
      return
    }

    this
      .makeProperty()
      .makeByDefault()
      .makeTriggerOnSet()
  }

  makeIsProperty () {
    this.isProperty = '{' === this.value[0] && '}' === this.value[this.value.length - 1]

    return this
  }

  makeProperty () {
    this.property = this.value.replace(/^{+|}+$/gm, '')

    return this
  }

  makeByDefault () {
    const value = this.property.split('|')
    this.property = value[0]
    this.byDefault = value[1] || ''

    return this
  }

  makeTriggerOnSet () {
    if ('@' === this.property[0]) {
      this.property = this.property.substr(1)
      this.triggerOnSet = true
    }

    return this
  }
}