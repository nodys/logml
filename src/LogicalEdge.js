'use strict'
var Edge = require('./Edge')
var Formatter = require('./Formatter')

class LogicalEdge {

  constructor (from, to, path) {
    this.index = null
    this.from = from
    this.to = to
    this.path = path
    this.type = 'LogicalEdge'
  }

  get uid () {
    return this.from.uid + '__' + this.to.uid
  }

  get cid () {
    return 'EDGE_' + this.uid
  }

  get p () {
    for (let item of this.path) {
      if ((item instanceof Edge) && (item.p !== 0)) {
        return item.p
      }
    }
    return 0
  }

  get q () {
    for (let item of this.path) {
      if ((item instanceof Edge) && (item.q !== 0)) {
        return item.q
      }
    }
    return 0
  }

  format (formatter) {
    formatter = formatter || new Formatter()
    return formatter.edge(this, formatter)
  }
}

module.exports = LogicalEdge
