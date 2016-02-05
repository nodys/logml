'use strict'
var Formatter = require('./Formatter')
var clc = require('cli-color')

class FormatterCli extends Formatter {
  node (node, formatter) {
    return clc.blue('nodes(') + clc.white.bold(node.cid) + clc.blue(')')
  }
  edge (logicalEdge, formatter) {
    return clc.green('edges(') + clc.white.bold(logicalEdge.cid) + clc.green(')')
  }
  operator (operator, content, formatter) {
    return clc.magenta(operator.label + '(') + content + clc.magenta(')')
  }

  graph (graph, formatter) {
    var output = []
    graph.entities.forEach(node => {
      var equation = node.getEquation()
      let nodeComment =
        '# v0=' + node.initialValue +
        ' pwd=' + node.perturbationPwd +
        ' int=' + node.pertInterval
      output.push(node.format(formatter) + clc.blackBright(nodeComment))
      output.push(clc.blackBright('  # equation:'))
      output.push('  ' + equation.format(formatter))
      if (equation.logicalEdges.length) {
        let len = equation.logicalEdges.length
        output.push(clc.blackBright('  # edges (' + len + '):'))
        equation.logicalEdges.forEach(edge => {
          output.push('  ' + edge.format(formatter) + ' ' + clc.blackBright('# [p=' + edge.p + ' q=' + edge.q + ']'))
        })
      }
      output.push('')
    })
    return output.join('\n')
  }
}

module.exports = FormatterCli
