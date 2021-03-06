const parentAlias = Symbol()
const imports = Symbol()
const events = Symbol()
const traits = Symbol()
const content = Symbol()
const counter = Symbol()
const getters = Symbol()
const setters = Symbol()
const setterTriggers = Symbol()
const customTriggers = Symbol()
const joinImports = Symbol()
const joinEvents = Symbol()
const joinTraits = Symbol()
const joinGetters = Symbol()
const joinSetters = Symbol()

const rootVariable = 'this.element'
const variableSymbol = 'e'
const defaultParentAlias = 'require(\'@nrg/core\').Component'

const self = class {

  get currentVariable () {
    return 0 === this[counter] ? rootVariable : `this[${variableSymbol}${this[counter]}]`
  }

  get nextVariable () {
    ++this[counter]

    return this.currentVariable
  }

  constructor () {
    this[content] = {imports: [], body: [], constructor: [], initialize: []}
    this[parentAlias] = defaultParentAlias
    this[imports] = new Map()
    this[events] = new Map()
    this[traits] = new Set()
    this[getters] = new Map()
    this[setters] = new Map()
    this[setterTriggers] = new Set()
    this[customTriggers] = new Set()
    this[counter] = -1
  }

  addImport (alias, path) {
    this[imports].set(alias, path)

    return this
  }

  setParent (alias) {
    this[parentAlias] = alias

    return this
  }

  addTrait (alias) {
    this[traits].add(alias)

    return this
  }

  addEvent (event, fromEvent, property) {
    if (!this[events].has(event)) {
      this[events].set(event, new Set())
    }

    this[events].get(event).add({property, fromEvent})

    return this
  }

  addGetter (name, expression) {
    if (!this[getters].has(name)) {
      this[getters].set(name, expression)
    }

    return this
  }

  addSetter (name, expression, triggerOnSet = false) {
    if (!this[setters].has(name)) {
      this[setters].set(name, [])
    }

    this[setters].get(name).push(expression)
    if (triggerOnSet) {
      this[setterTriggers].add(name)
    }

    return this
  }

  createWidget (className, properties) {
    const services = '{t: this.t}'
    properties = JSON.stringify(properties)

    this.joinConstructor(`${this.nextVariable} = this.injector ?
      this.injector.createObject(${className}, ${properties}, ${services}) :
      new ${className}(${properties}, ${services})`
    )

    return this.currentVariable
  }

  createElement (tagName) {
    this.joinConstructor(`${this.nextVariable} = document.createElement('${tagName}')`)

    return this.currentVariable
  }

  createTextNode (value) {
    this.joinConstructor(`${this.nextVariable} = document.createTextNode('${value}')`)

    return this.currentVariable
  }

  setAttribute (element, name, value, likeProperty = false) {
    return this.joinConstructor(likeProperty ?
      `${element}.${name} = '${value}'` :
      `${element}.setAttribute('${name}', '${value}')`
    )
  }

  append (parent, child) {
    this.joinConstructor(`${parent}.appendChild(${child})`)

    return this
  }

  addClassName (element, className) {
    this.joinConstructor(`${element}.classList.add(${className})`)

    return this
  }

  joinBody (expression) {
    this[content].body.push(expression)

    return this
  }

  joinConstructor (expression) {
    this[content].constructor.push(expression)

    return this
  }

  joinInitialize (expression) {
    this[content].initialize.push(expression)

    return this
  }

  toString () {
    this
      [joinTraits]()
      [joinImports]()
      [joinEvents]()
      [joinGetters]()
      [joinSetters]()

    return this.getClassCode({
      importList: this[content].imports.join('\n'),
      privateList: [...Array(this[counter]).keys()].map(i => `const e${i + 1} = Symbol()`).join('\n'),
      parent: this[parentAlias],
      body: this[content].body.join('\n\t'),
      constructor: this[content].constructor.join('\n\t'),
      initialize: this[content].initialize.join('\n\t')
    })
  }

  [joinTraits] () {
    if (!this[traits].size) {
      return this
    }

    this.addGetter('traits', `return [
      ...super.traits || [],
      ${[...this[traits]].join(',\n\t  ')}
    ]`)

    return this
  }

  [joinImports] () {
    for (const [alias, path] of this[imports]) {
      this[content].imports.push(`import ${alias} from '${path}'`)
    }

    return this
  }

  [joinEvents] () {
    for (const [toEvent, set] of this[events]) {
      for (const {property, fromEvent} of set) {
        this.joinInitialize(`this.mapEvent(this${property}, '${fromEvent}', '${toEvent}')`)
      }
    }

    return this
  }

  [joinGetters] () {
    for (const [name, expression] of this[getters]) {
      this.joinBody(`
  get ${name} () {
    ${expression}
  }`)
    }

    return this
  }

  [joinSetters] () {
    for (const [name, expressions] of this[setters]) {
      if (this[setterTriggers].has(name) && !this[customTriggers].has(name)) {
        const beforeSetEvent = self.beforeSetEventName(name)
        const setEvent = self.setEventName(name)
        expressions.unshift(`value = event.value`)
        expressions.unshift(`this.trigger('${beforeSetEvent}', event)`)
        expressions.unshift(`const event = {value}`)
        expressions.push(`this.trigger('${setEvent}', event)`)
      }

      this.joinBody(`
  set ${name} (value) {
    ${expressions.join('\n\t').trim()}
  }`)
    }

    return this
  }

  static beforeSetEventName (name) {
    return 'beforeSet' + name.charAt(0).toLocaleUpperCase() + name.slice(1)
  }

  static setEventName (name) {
    return 'set' + name.charAt(0).toLocaleUpperCase() + name.slice(1)
  }
}

module.exports = self