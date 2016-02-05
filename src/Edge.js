'use strict'
class Edge {
  constructor (id) {
    this.id = id
    this.label = null
    this.source = null
    this.target = null
    this.type = 'Edge'
  }

  get p () {
    if (!this.label) return 0
    var result = /p\s*=\s*(\-?[\d\.]+)/.exec(this.label)

    if (!result) return 0
    return parseFloat(result[1])
  }

  get q () {
    if (!this.label) return 0
    var result = /q\s*=\s*(\-?[\d\.]+)/.exec(this.label)
    if (!result) return 0
    return parseFloat(result[1])
  }

  isChildOf (node) {
    if (this.source === node || this.source.isChildOf(node)) {
      return true
    }
    return false
  }
}

module.exports = Edge
