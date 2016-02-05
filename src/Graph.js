'use strict'
// Import external libs
var cheerio = require('cheerio')

// Import local libs
var Edge = require('./Edge')
var Key = require('./Key')
var Node = require('./Node')
var Formatter = require('./Formatter')

class Graph {

  /**
   * Parse a graphml source and store nodes and edges
   * @param  {string} graphml Graphml source
   * @return {Graph}
   */
  static parse (graphml) {
    var graph = new Graph()

    var $ = cheerio.load(graphml.toString(), {
      xmlMode: true
    })

    var keys = graph.keys
    var nodes = graph.nodes
    var edges = graph.edges

    // Parse keys
    $('key').each(function () {
      var el = $(this)
      if (!el.attr('attr.name')) return
      var key = new Key(
        el.attr('id'),
        el.attr('for'),
        el.attr('attr.type'),
        el.attr('attr.name'))
      keys.push(key)
    })

    var urlKey = graph.getKeyFor('node', 'url')
    var descKey = graph.getKeyFor('node', 'description')

    $('node').each(function () {
      var el = $(this)
      var node = new Node(el.attr('id'))
      urlKey && (node.url = el.children('data[key="' + urlKey.id + '"]').text().trim())
      descKey && (node.desc = el.children('data[key="' + descKey.id + '"]').text().trim())
      node.label = el.find('y\\:NodeLabel').text().trim()
      nodes.push(node)
    })

    $('edge').each(function () {
      var el = $(this)
      var edge = new Edge(el.attr('id'))
      edge.source = graph.getNode(el.attr('source'))
      edge.target = graph.getNode(el.attr('target'))
      edge.source.out.push(edge)
      edge.target.in.push(edge)
      edge.label = el.find('y\\:EdgeLabel').text().trim()
      edges.push(edge)
    })

    return graph
  }

  constructor () {
    this.keys = []
    this.nodes = []
    this.edges = []
  }

  /**
   * Get all entities (nodes representing entities)
   * @return {Array.<Node>}
   */
  get entities () {
    return this.nodes.filter(n => !n.isLogical)
  }

  /**
   * Get all nodes representing logical operation
   * @return {Array.<Node>}
   */
  get logicals () {
    return this.nodes.filter(n => n.isLogical)
  }

  getKeyFor (kfor, kname) {
    return this.keys.find(function (key) {
      return key.isFor === kfor && key.name === kname
    })
  }

  getNode (id) {
    return this.nodes.find(node => node.id === id)
  }

  format (formatter) {
    formatter = formatter || Formatter
    return formatter.graph(this, formatter)
  }

}

module.exports = Graph
