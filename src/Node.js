'use strict'

var deburr = require('lodash.deburr')
var LogicalEquation = require('./LogicalEquation')
var LogicalOperator = require('./LogicalOperator')
var LogicalEdge = require('./LogicalEdge')
var Formatter = require('./Formatter')

class Node {
  constructor (id) {
    this.id = id
    this.label = null
    this.url = null
    this.desc = null
    this.in = []
    this.out = []
    this.type = 'Node'
  }

  get uid () {
    return deburr(this.label).replace(/\-/ig, '_').replace(/[^a-z0-9\-]+/ig, '_')
  }

  get cid () {
    return 'NODE_' + this.uid
  }

  get initialValue () {
    if (!this.desc) return 0
    var result = /v0\s*=\s*(\-?[\d\.]+)/.exec(this.desc)
    if (!result) return 0
    return parseFloat(result[1], 10)
  }

  get perturbationPwd () {
    if (!this.desc) return 0
    var result = /pwd\s*=\s*(\-?[\d]+)/.exec(this.desc)
    if (!result) return 0
    return parseInt(result[1], 10)
  }

  get pertInterval () {
    if (!this.desc) return [0, 0]
    var result = /int\s*=\s*([\d]+\,[\d]+)/.exec(this.desc)
    result = result ? result[1] : '0,0'
    return result.split(',').map(v => parseInt(v, 10))
  }

  get p () {
    var edge = this.in[0]
    if (!edge) return 0
    return edge.p
  }

  get q () {
    var edge = this.in[0]
    if (!edge) return 0
    return edge.q
  }

  get isLogical () {
    return Boolean(~['AND', 'OR', 'NOT'].indexOf(this.label))
  }

  get isRoot () {
    return !Boolean(this.in.length)
  }

  get isLeaf () {
    return !Boolean(this.out.length)
  }

  getEquation (fromNode, path, logicalEdges) {
    var isRoot = false
    if (!fromNode) {
      isRoot = true
      fromNode = this
      path = []
      logicalEdges = []
    }
    var eq = new LogicalEquation(fromNode)
    path.push(this)
    if (this.isLogical) {
      eq.operator = LogicalOperator.fromLabel(this.label)
    }
    this.in.forEach(edge => {
      var sourceNode = edge.source
      let localPath = path.slice()
      localPath.push(edge)
      if (sourceNode.isLogical) {
        eq.nodes.push(sourceNode.getEquation(fromNode, localPath, logicalEdges))
      } else {
        localPath.push(sourceNode)
        let logicalEdge = new LogicalEdge(sourceNode, fromNode, localPath)
        logicalEdges.push(logicalEdge)
        eq.nodes.push(logicalEdge)
      }
    })
    if (isRoot) {
      eq.logicalEdges = logicalEdges
    }
    return eq
  }

  isChildOf (node) {
    for (let edge in this.in) {
      if (edge.isChildOf(node)) {
        return true
      }
    }
    return false
  }

  isParentOf (node) {
    return node.isChildOf(this)
  }

  format (formatter, inEquation) {
    formatter = formatter || new Formatter()
    return formatter.node(this, formatter, inEquation)
  }

}

module.exports = Node
