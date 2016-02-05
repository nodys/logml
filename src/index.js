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

logml.graphml2fortran = function (graphml, output, options) {
  return co(function * () {
    var graph = Graph.parse(graphml)
    output = resolve(output)
    var result = graph.format(new logml.FormatterFortran(options))
    yield fs.outputFileAsync(resolve(output, 'constants.f95'), result.constants)
    yield fs.outputFileAsync(resolve(output, 'upd_nodes.f95'), result.upd_nodes)
    yield fs.outputFileAsync(resolve(output, 'upd_edges.f95'), result.upd_edges)
    yield fs.outputFileAsync(resolve(output, 'cu_logical.f95'), result.cu_logical)
    yield fs.outputFileAsync(resolve(output, 'lib_functions.f95'), result.lib_function)
    yield fs.outputFileAsync(resolve(output, 'Makefile'), result.makefile)
  })
}
