/* global describe it */
'use strict'

var logml = require('../src/index')
var expect = require('expect.js')
var join = require('path').join
var fs = require('fs-extra')
var Graph = logml.Graph

function fixp (filename) {
  return join(__dirname, '/fixtures', filename)
}

function readfix (filename) {
  return fs.readFileSync(fixp(filename), 'utf8')
}

describe('logml()', function () {
  describe('Graph.parse()', function () {
    it('should parse a graphml file', function () {
      var graphml = fs.readFileSync(fixp('graphml/graph.graphml'), 'utf8')
      var graph = Graph.parse(graphml)
      expect(graph.nodes.length).to.eql(9)
      expect(graph.entities.length).to.eql(8)
      expect(graph.logicals.length).to.eql(1)
    })

    describe('graph.format(<FormatterFortran>)', function () {
      it('should build fortran sources', function () {
        var graph = Graph.parse(readfix('graphml/graph-fortran.graphml'))
        var result = graph.format(new logml.FormatterFortran({
          iterations: 100
        }))
        expect(result.constants).to.eql(readfix('expected/Fortran/src/constants.f95'))
        expect(result.upd_nodes).to.eql(readfix('expected/Fortran/src/upd_nodes.f95'))
        expect(result.upd_edges).to.eql(readfix('expected/Fortran/src/upd_edges.f95'))
        expect(result.cu_logical).to.eql(readfix('expected/Fortran/src/cu_logical.f95'))
        expect(result.makefile).to.eql(readfix('expected/Fortran/src/Makefile'))
      })

      it('should build fortran sources with edge inputs', function () {
        var graph = Graph.parse(readfix('graphml/graph-fortran.graphml'))
        var result = graph.format(new logml.FormatterFortran({
          iterations: 100,
          inputEdge: logml.parseCsvInput(fixp('vpop/graph-fortran-edge.csv')),
          inputNode: logml.parseCsvInput(fixp('vpop/graph-fortran-node.csv'))
        }))
        expect(result.constants).to.eql(readfix('expected/FortranInput/src/constants.f95'))
        expect(result.upd_nodes).to.eql(readfix('expected/FortranInput/src/upd_nodes.f95'))
        expect(result.upd_edges).to.eql(readfix('expected/FortranInput/src/upd_edges.f95'))
        expect(result.cu_logical).to.eql(readfix('expected/FortranInput/src/cu_logical.f95'))
        expect(result.makefile).to.eql(readfix('expected/FortranInput/src/Makefile'))
      })
    })
  })
})
