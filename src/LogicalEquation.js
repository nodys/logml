'use strict'
var Formatter = require('./Formatter.js')

class LogicalEquation {

  constructor (toNode) {
    this.operator = null
    this.toNode = toNode
    this.nodes = []
    this.logicalEdges = []
    this.type = 'LogicalEquation'
  }

  getNodeList () {
    var list = []
    this.nodes.forEach(n => {
      if (n instanceof LogicalEquation) {
        list = list.concat(n.getNodeList())
      } else {
        list.push(n)
      }
    })
    return list
  }

  format (formatter) {
    formatter = formatter || new Formatter()
    return formatter.equation(this, formatter)
  }
}

module.exports = LogicalEquation
