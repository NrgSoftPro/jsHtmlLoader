const ClassBuilder = require('./src/ClassBuilder')

module.exports = function (html) {
  this.callback(null, new ClassBuilder().build(html).toString())
}
