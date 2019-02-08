const Template = require('./Template')

module.exports = class extends Template {

  getClassCode ({importList, privateList, parent, body, constructor, initialize}) {

    return `
${importList}

${privateList}

export default class extends ${parent} {
${body}

  _constructor(properties) {
    super._constructor(properties)
    
    ${constructor}
    
    ${initialize}
  }
}
`
  }
}