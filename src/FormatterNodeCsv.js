'use strict'
var Formatter = require('./Formatter')

class FormatterNodeCsv extends Formatter {
    graph (graph, formatter) {
      var output = [
        ['id', 'initialValue', 'pwd', 'pertStart', 'pertEnd']
      ]
      graph.entities.forEach(node => {
        output.push([
          node.cid,
          node.initialValue,
          node.perturbationPwd,
          node.pertInterval[0],
          node.pertInterval[1]
        ])
      })
      return output.map(row => row.join(',')).join('\n')
    }
}

module.exports = FormatterNodeCsv
