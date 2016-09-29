'use strict'
var Formatter = require('./Formatter')

class FormatterEdgeCsv extends Formatter {
    graph (graph, formatter) {
      var output = [['id', 'p', 'q']]
      graph.entities.forEach(node => {
        var equation = node.getEquation()
        if (equation.logicalEdges.length) {
          equation.logicalEdges.forEach(edge => {
            output.push([edge.cid, edge.p, edge.q])
          })
        }
      })
      return output.map(row => row.join(';')).join('\n')
    }
}

module.exports = FormatterEdgeCsv
