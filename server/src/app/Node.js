'use strict'

class Node {
  constructor (id, color, lstyle) {
    this.id = id
    this.label = id
    this.activated = false
    this.color = color
    this.lstyle = lstyle
  }
}

module.exports = Node
