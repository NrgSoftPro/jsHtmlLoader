const parse = require('node-html-parser').parse
const Element = require('./Element')
const Text = require('./Text')
const Widget = require('./Widget')

module.exports = class {

  constructor (attrFactory) {
    this.attrFactory = attrFactory
  }

  create (xml) {
    return this.compose(parse(xml).childNodes[0])
  }

  compose (element, imports = null) {
    const isRoot = !imports
    const tagName = element.tagName
    const attrs = this.extractAttrs(element)
    const children = this.extractChildren(element)

    imports = imports || this.extractImports(attrs)
    const node = imports.has(tagName) ? new Widget(tagName) : new Element(tagName)

    if (isRoot) {
      node.isRoot = true
      node.imports = imports
    }

    for (const [name, value] of attrs) {
      node.attrs.push(this.attrFactory.create(name, value, node))
    }

    children.forEach(child => {
      const childNode = typeof child === 'string' ? new Text(child) : this.compose(child, imports)
      childNode.parentNode = node
      node.children.push(childNode)
    })

    if (isRoot) {
      this.domIsReady(node)
    }

    return node
  }

  domIsReady (node) {
    node.attrs && node.attrs.forEach(attr => attr.onReadyDom && attr.onReadyDom())
    node.children && node.children.forEach(child => this.domIsReady(child))
    node.onReadyDom && node.onReadyDom()
  }

  extractAttrs (element) {
    const str = element.rawAttrs
    const regex = /(\S+)\s*=\s*["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))?[^"']*)["']?/g
    const regex2 = /(\S+)/g
    const attrs = new Map()

    let m
    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++
      }
      attrs.set(m[1], m[2])
    }

    while ((m = regex2.exec(str.replace(regex, ''))) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++
      }
      attrs.set(m[1], '')
    }

    return attrs
  }

  extractImports (attrs) {
    const imports = new Map()

    for (const [name, value] of attrs) {
      const position = name.indexOf(':')
      if ('import' === name.substr(0, position)) {
        imports.set(name.substr(position + 1), value)
        attrs.delete(name)
      }
    }

    return imports
  }

  extractChildren (element) {
    let children = []

    for (const child of element.childNodes) {
      if (3 !== child.nodeType) {
        children.push(child)
        continue
      }
      if (!child.rawText.trim()) {
        continue
      }

      children = children.concat(this.splitText(child.rawText))
    }

    return children
  }

  splitText (text) {
    const textNodes = []
    let str = text.replace(/\n/gm, '')

    while (true) {
      let openIndex = str.indexOf('{')
      let closeIndex = str.indexOf('}')

      if (-1 === openIndex || -1 === closeIndex) {
        if (str) {
          textNodes.push(str)
        }
        break
      }

      let justText = str.substr(0, openIndex)
      if (justText) {
        textNodes.push(justText)
      }

      textNodes.push(str.substr(openIndex, closeIndex - openIndex + 1))

      str = str.substr(closeIndex + 1)
    }

    return textNodes
  }
}