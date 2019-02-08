const DefaultAttr = require('./DefaultAttr')

module.exports = class extends DefaultAttr {

  static get sign () {
    return 'mount'
  }
}