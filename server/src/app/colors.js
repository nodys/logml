'use strict'
const Color = require('color-js')

exports.createScheme = function (size, base) {
  var max = 360 - (360 / size)
  var degrees = (new Array(size)).fill(0).map((_, index) => max / size * index)
  var list = (new Color(base || '#008ABE')).schemeFromDegrees(degrees)
    .map((c, index) => {
      if (Math.floor(index / 3) % 2) {
        c = c.setLightness(0.2)
      } else {
        c = c.setLightness(0.4)
      }
      return c
    })
  return list.map(c => c.toString())
}
