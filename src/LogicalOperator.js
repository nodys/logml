'use strict'
var Formatter = require('./Formatter')

class LogicalOperator {
  constructor () {
    this.label = ''
    this.type = 'LogicalOperator'
  }

  toString () {
    return this.label
  }

  format (content, formatter) {
    formatter = formatter || new Formatter()
    return formatter.operator(this, content, formatter)
  }

  static fromLabel (label) {
    switch (label) {
      case 'AND': return new LogicalAnd()
      case 'NOT': return new LogicalNot()
      case 'OR': return new LogicalOr()
    }
  }
}

class LogicalAnd extends LogicalOperator {
  constructor () {
    super()
    this.label = 'AND'
  }
}

class LogicalOr extends LogicalOperator {
  constructor () {
    super()
    this.label = 'OR'
  }
}

class LogicalNot extends LogicalOperator {
  constructor () {
    super()
    this.label = 'NOT'
  }
}

module.exports = LogicalOperator
