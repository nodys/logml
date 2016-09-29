'use strict'
var Formatter = require('./Formatter')
var extend = require('extend')
var lTemplate = require('lodash.template')
var fs = require('fs')
var join = require('path').join
var sprintf = require('sprintf-js').sprintf

var template_constants = lTemplate(fs.readFileSync(join(__dirname, '../templates/fortran_constants.f95'), 'utf8'))
var template_upd_nodes = lTemplate(fs.readFileSync(join(__dirname, '../templates/fortran_upd_nodes.f95'), 'utf8'))
var template_upd_edges = lTemplate(fs.readFileSync(join(__dirname, '../templates/fortran_upd_edges.f95'), 'utf8'))
var template_cu_logical = lTemplate(fs.readFileSync(join(__dirname, '../templates/fortran_cu_logical.f95'), 'utf8'))
var template_Makefile = lTemplate(fs.readFileSync(join(__dirname, '../templates/fortran_Makefile'), 'utf8'))
var template_lib_function = lTemplate(fs.readFileSync(join(__dirname, '../templates/fortran_lib_functions.f95'), 'utf8'))

class Fortran extends Formatter {

  constructor (options) {
    super()
    this.options = extend({
      iterations: 100,
      run: 3
    }, options || {})
    this.edges = []
    this.nodes = []
  }

  node (node, formatter, inEquation) {
    return (inEquation ? 'nodes_0' : 'nodes') + '(' + node.cid + ')'
  }

  edge (logicalEdge, formatter) {
    return 'edges(' + logicalEdge.cid + ')'
  }

  operator (operator, content, formatter) {
    return '' + operator.label + '_([' + content + '])'
  }

  equation (equation, formatter) {
    formatter = formatter || new Formatter()
    var items = []

    if (!equation.nodes.length) {
      return equation.toNode.format(formatter, true)
    }

    equation.nodes.forEach(element => {
      // element is a LogicalEdge or a LogicalEquation
      items.push(element.format(formatter, true))
    })

    if (equation.operator) {
      return equation.operator.format(items.join(', '), formatter)
    } else {
      return items.join(', ')
    }
  }

  getNodeValue (key, node) {
    let value = node[key]
    if (this.options.inputNode) {
      let altNode = this.options.inputNode.find(n => n.id === node.cid)
      if (altNode && (typeof altNode[key] !== 'undefined')) {
        value = altNode[key]
      }
    }
    return value
  }

  getEdgeValue (key, edge) {
    let value = edge[key]
    if (this.options.inputEdge) {
      let altEdge = this.options.inputEdge.find(n => n.id === edge.cid)
      if (altEdge && (typeof altEdge[key] !== 'undefined')) {
        value = altEdge[key]
      }
    }
    return value
  }

  graph (graph, formatter) {
    var equations = graph.entities.map(e => e.getEquation())
    var edges = this.edges = []
    equations.forEach(eq => eq.logicalEdges.forEach(le => edges.push(le)))
    var nodes = this.nodes = graph.entities

    var edgesList = edges.map(edge => [
      edge.format(this),
      edge.from.format(this)
    ])

    var nodesList = equations.map(equation => [
      equation.toNode.format(this),
      equation.format(this)
    ])

    var edgesIndex = edges.map((edge, index) => [
      'INTEGER, PARAMETER:: ' + edge.cid,
      index + 1
    ])

    var nodesIndex = nodes.map((node, index) => [
      'INTEGER, PARAMETER:: ' + node.cid,
      index + 1
    ])

    var initialValues = nodes.map((node, index) => [
      node.format(this),
      this.getNodeValue('initialValue', node) + ' / int_convert'
    ])

    var pert_pws = nodes.map((node, index) => [
      'pert_pw(' + node.cid + ')',
      this.getNodeValue('pwd', node) + ' / int_convert'
    ])
    var pert_inits = nodes.map((node, index) => [
      'pert_init(' + node.cid + ')',
      this.getNodeValue('pertStart', node) + ' * it_convert'
    ])

    var pert_ends = nodes.map((node, index) => [
      'pert_end(' + node.cid + ')',
      this.getNodeValue('pertEnd', node) + ' * it_convert'
    ])

    var ps = edges.map((edge, index) => [
      'p(' + edge.cid + ')',
      this.getEdgeValue('p', edge) + ' / int_convert'
    ])

    var qs = edges.map((edge, index) => [
      'q(' + edge.cid + ')',
      this.getEdgeValue('q', edge) + ' / int_convert'
    ])

    var results = {}

    results.constants = template_constants({
      edgesIndex: new VariableList(edgesIndex, '  '),
      nodesIndex: new VariableList(nodesIndex, '  '),
      nbEdges: edges.length,
      nbNodes: nodes.length
    })

    results.upd_nodes = template_upd_nodes({
      nodesList: new VariableList(nodesList, '        ')
    })

    results.upd_edges = template_upd_edges({
      edgesList: new VariableList(edgesList, '        ')
    })

    results.cu_logical = template_cu_logical({
      iterations: this.options.iterations,
      initialValues: new VariableList(initialValues, '  '),
      pert_pws: new VariableList(pert_pws, '  '),
      pert_inits: new VariableList(pert_inits, '  '),
      pert_ends: new VariableList(pert_ends, '  '),
      ps: new VariableList(ps, ''),
      qs: new VariableList(qs, '')
    })

    results.makefile = template_Makefile({})
    results.lib_function = template_lib_function({})
    return results
  }
}

class VariableList {
  constructor (items, indent) {
    this.items = items || []
    this.indent = indent || ''
  }

  add (left, right) {
    this.items.push([left, right])
  }

  toString () {
    var len = this.items.length
    var maxLen = this.items.reduce((memo, item) => Math.max(memo, item[0].length), 0)
    var s = []
    for (var i = 0; i < len; i++) {
      s.push(this.indent + sprintf('%-' + maxLen + 's = %s', this.items[i][0], this.items[i][1]))
    }
    return s.join('\n')
  }
}

module.exports = Fortran
