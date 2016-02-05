'use strict'
const EventEmitter = require('events').EventEmitter
const Node = require('./Node')
const colors = require('./colors')
const lstyle = require('./lstyle')

class State extends EventEmitter {

  constructor (raw, data) {
    super()

    this._data = data

    this._nodeIds = Object.keys(this._data[0]).sort((a, b) => {
      a = a.toLowerCase()
      b = b.toLowerCase()
      return a < b ? -1 : a > b ? 1 : 0
    })

    this._raw = {
      ids: [],
      fusion: false
    }

    this.fromJSON(raw)
  }

  set fusion (val) {
    if (val === this._raw.fusion) {
      return
    }
    this._raw.fusion = val
    this.emit('change', 'fusion', this)
  }

  get fusion () {
    return this._raw.fusion
  }

  get data () {
    return this._data
  }

  get nodes () {
    return this._nodes
  }

  set nodes (nodes) {
    this._nodes = nodes
  }

  get ids () {
    return this._raw.ids
  }

  get idLength () {
    return this._raw.ids.length
  }

  toJSON () {
    return {
      ids: this.ids.slice(),
      fusion: this.fusion
    }
  }

  fromJSON (raw) {
    var colorScheme = colors.createScheme(this._nodeIds.length)
    this.nodes = this._nodeIds.map((id, index) => new Node(id, colorScheme[index], lstyle(index)))

    // Init fusion state
    this.fusion = Boolean(raw.fusion)

    // Add ids
    var rawIds = raw.ids || []
    this.removeAll()
    this.addMany(rawIds)
  }

  nodeExists (id) {
    return Boolean(~this._nodeIds.indexOf(id))
  }

  hasNode (id) {
    return Boolean(~this._raw.ids.indexOf(id))
  }

  _spliceIds () {
    var result = this._raw.ids.splice.apply(this._raw.ids, arguments)
    this._nodes.forEach(node => node.activated = this.hasNode(node.id))
    this.allAreActivated = this.idLength === this._nodeIds.length
    this.emit('change', 'ids', this)
    return result
  }

  toggleNode (id) {
    if (this.hasNode(id)) {
      this.removeNode(id)
    } else {
      this.addNode(id)
    }
  }

  onlyNode (id) {
    this._spliceIds(0, this.idLength, id)
  }

  addNode (id) {
    if (this.hasNode(id) || !this.nodeExists(id)) {
      return
    }
    this._spliceIds(0, this, id)
  }

  removeNode (id) {
    var index = this._raw.ids.indexOf(id)
    if (!~index) {
      return
    }
    this._spliceIds(index, 1)
  }

  addAll () {
    var args = [0, this.idLength].concat(this._nodeIds)
    this._spliceIds.apply(this, args)
  }

  addMany (list) {
    var args = [0, this.idLength].concat(list)
    this._spliceIds.apply(this, args)
  }

  removeAll () {
    this._spliceIds(0, this.idLength)
  }
}

module.exports = State
