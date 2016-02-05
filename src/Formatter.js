'use strict'
class Formatter {

  node (node, formatter) {
    return 'nodes(' + node.cid + ')'
  }

  edge (logicalEdge, formatter) {
    return 'edges(' + logicalEdge.cid + ')'
  }

  operator (operator, content, formatter) {
    return operator.label + '(' + content + ')'
  }

  equation (equation, formatter) {
    formatter = formatter || new Formatter()
    var items = []

    if (!equation.nodes.length) {
      return equation.toNode.format(formatter)
    }

    equation.nodes.forEach(element => {
      // element is a LogicalEdge or a LogicalEquation
      items.push(element.format(formatter))
    })

    if (equation.operator) {
      return equation.operator.format(items.join(', '), formatter)
    } else {
      return items.join(', ')
    }
  }

  graph (graph, formatter) {
    var output = []
    graph.entities.forEach(node => {
      var equation = node.getEquation()
      output.push('# node:')
      let nodeComment =
        '# v0=' + node.initialValue +
        ' pwd=' + node.perturbationPwd +
        ' int=' + node.pertInterval
      output.push(node.format(formatter) + ' ' + nodeComment)
      output.push('# equation:')
      output.push(equation.format(formatter))
      if (equation.logicalEdges.length) {
        let len = equation.logicalEdges.length
        output.push('# edges (' + len + '):')
        equation.logicalEdges.forEach(edge => {
          output.push(edge.format(formatter) + ' ' + '# [p=' + edge.p + ' q=' + edge.q + ']')
        })
      }
      output.push('')
    })
    return output.join('\n')
  }

}

module.exports = Formatter
