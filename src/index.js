'use strict'

var Graph = require('./Graph')
var co = require('co')
var fs = require('fs-extra-promise')
var resolve = require('path').resolve

module.exports = logml

function logml (graphml) {
  return Graph.parse(graphml)
}

logml.Graph = Graph
logml.Formatter = require('./Formatter')
logml.FormatterCli = require('./FormatterCli')
logml.FormatterFortran = require('./FormatterFortran')
logml.FormatterEdgeCsv = require('./FormatterEdgeCsv')
logml.FormatterNodeCsv = require('./FormatterNodeCsv')

logml.graphml2fortran = function (graphml, output, options) {
  return co(function * () {
    var graph = Graph.parse(graphml)
    output = resolve(output)

    // Parse csv inputs (async ??)
    if (options.inputNode) {
      options.inputNode = logml.parseCsvInput(options.inputNode)
    }

    if (options.inputEdge) {
      options.inputEdge = logml.parseCsvInput(options.inputEdge)
    }

    // Format results
    var result = graph.format(new logml.FormatterFortran(options))

    // Write out fortran
    yield fs.outputFileAsync(resolve(output, 'constants.f95'), result.constants)
    yield fs.outputFileAsync(resolve(output, 'upd_nodes.f95'), result.upd_nodes)
    yield fs.outputFileAsync(resolve(output, 'upd_edges.f95'), result.upd_edges)
    yield fs.outputFileAsync(resolve(output, 'cu_logical.f95'), result.cu_logical)
    yield fs.outputFileAsync(resolve(output, 'lib_functions.f95'), result.lib_function)
    yield fs.outputFileAsync(resolve(output, 'Makefile'), result.makefile)
  })
}

logml.parseCsvInput = function (filepath) {
  var raw = fs.readFileSync(filepath, 'utf8').trim() // TODO: Refactor / catch errors

  // Basic csv parser...
  var matrix = raw.split('\n').map(row => row.trim().split(','))

  // Read headers
  var headers = matrix[0].map(key => key.trim())
  matrix.splice(0, 1)

  // Generate objects
  var results = matrix.map((row) => {
    var obj = {}
    headers.forEach((key, index) => { obj[key] = row[index].trim() })
    return obj
  })

  return results
}
