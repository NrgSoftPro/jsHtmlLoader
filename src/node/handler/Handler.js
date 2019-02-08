module.exports = class {

  constructor (nodeHandlers, attrHandlers) {
    this.nodeHandlers = nodeHandlers
    this.attrHandlers = attrHandlers
  }

  handleAttr (attr, element, template) {
    if (!this.attrHandlers.has(attr.constructor)) {
      throw new Error('Unknown type of attribute')
    }

    return this.attrHandlers.get(attr.constructor).handle(attr, element, template)
  }

  handleNode (node, parent, template) {
    if (!this.nodeHandlers.has(node.constructor)) {
      throw new Error('Unknown type of node')
    }

    return this.nodeHandlers.get(node.constructor).handle(node, parent, template)
  }
}