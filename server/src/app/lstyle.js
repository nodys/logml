'use strict'

var style = ['dotted', 'dashed', 'solid']
module.exports = function (index) {
  return style[index % 3]
}
