const AttrFactory = require('./attr/Factory')
const NodeFactory = require('./node/Factory')

const ElementHandler = require('./node/handler/Element')
const TextHandler = require('./node/handler/Text')
const WidgetHandler = require('./node/handler/Widget')

const DefaultAttrHandler = require('./attr/handler/DefaultAttr')
const AttrHandler = require('./attr/handler/Attr')
const ClassHandler = require('./attr/handler/Class')
const EventHandler = require('./attr/handler/Event')
const ExtendsHandler = require('./attr/handler/Extends')
const ImportHandler = require('./attr/handler/Import')
const InsertHandler = require('./attr/handler/Insert')
const MountHandler = require('./attr/handler/Mount')
const PropHandler = require('./attr/handler/Prop')
const StyleHandler = require('./attr/handler/Style')
const UseHandler = require('./attr/handler/Use')

module.exports = class {

  get nodeHandlers () {
    return [
      ElementHandler,
      TextHandler,
      WidgetHandler
    ]
  }

  get attrHandlers () {
    return [
      DefaultAttrHandler,
      AttrHandler,
      ClassHandler,
      EventHandler,
      ExtendsHandler,
      ImportHandler,
      InsertHandler,
      MountHandler,
      PropHandler,
      StyleHandler,
      UseHandler
    ]
  }

  constructor () {
    this.nodeMap = new Map()
    this.attrMap = new Map()

    this.nodeHandlers.forEach(handler => this.nodeMap.set(handler.nodeClass, new handler(this.nodeMap, this.attrMap)))
    this.attrHandlers.forEach(handler => this.attrMap.set(handler.attrClass, new handler()))

    const attrFactory = new AttrFactory(new Set([...this.attrMap.keys()]))
    this.nodeFactory = new NodeFactory(attrFactory)
  }

  build (xml) {
    const rootNode = this.nodeFactory.create(xml)

    if (!this.nodeMap.has(rootNode.constructor)) {
      throw new Error('Unknown type of the root node')
    }

    return this.nodeMap.get(rootNode.constructor).handle(rootNode)
  }
}
