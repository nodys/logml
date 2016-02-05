'use strict'
const elastomer = require('elastomer')
const HTMLElastomer = require('elastomer').HTMLElastomer
const d3 = require('d3')

require('./plot.css')()

class LogmlViewer extends HTMLElastomer {
  initialize (elasto) {
    elasto.html = require('./layout.html')
    elasto.css = require('./style.css')
  }

  link (scope, elasto) {
    const model = elasto.useModel({
      activatedNodes: [],
      state: null
    })

    var stateWatcher

    elasto.watchProperty('state', function (state) {
      if (!state) {
        return
      }
      model.state = state

      if (stateWatcher) {
        stateWatcher.close()
      }

      stateWatcher = elasto.on(state, 'change', function (key) {
        switch (key) {
          case 'fusion':
            elasto.setTimeout(updatePlot, 50)
            break
          case 'ids':
            updateActivatedNodes()
            updatePlot()
            break
        }
      })

      updateActivatedNodes()
      elasto.setTimeout(updatePlot, 50) // NB: Fix rendering layout size
    })

    function updateActivatedNodes () {
      model.activatedNodes = model.state.nodes.filter(node => node.activated)
    }

    function updatePlot () {
      var parent = elasto.$.plot
      parent.innerHTML = ''
      var width
      var height

      if (model.state.fusion) {
        width = parent.clientWidth
        height = parent.clientHeight
        createAxis(parent, {
          width: width,
          height: height,
          iterations: model.state.data.length
        })
      } else {
        width = null
        height = null
      }

      model.state.nodes.forEach(function (node) {
        if (!node.activated) return
        createGraph(parent, model.state.data, {
          node: node.label,
          color: node.color,
          lstyle: node.lstyle,
          axis: !model.state.fusion,
          label: !model.state.fusion,
          width: width,
          height: height
        })
      })
    }

    scope.handleItemClick = function (event, local) {
      if (event.metaKey) {
        model.state.onlyNode(local.node.id)
      } else {
        model.state.toggleNode(local.node.id)
      }
    }

    scope.handleLegendClick = function (event, local) {
      model.state.onlyNode(local.node.id)
    }

    scope.handleToogleFusion = function () {
      model.state.fusion = !model.state.fusion
    }

    scope.handleActivateAll = function () {
      model.state.addAll()
    }

    scope.handleDesactivateAll = function () {
      model.state.removeAll()
    }

    elasto.on(window, 'resize', updatePlot)
  }
}

/**
 * Generate a axis
 *
 * @param  {HTMLElement} parent
 *         Owner dom element
 *
 * @param  {Object} options
 *   - width {Number}
 *   - height {Number}
 *
 * @return {Object} Graph instance
 */
function createAxis (parent, options) {
  options = options || {}

  var graphWidth = options.width || 500
  var graphHeight = options.height || 300

  var margin = {top: 20, right: 20, bottom: 30, left: 50}
  var width = graphWidth - margin.left - margin.right
  var height = graphHeight - margin.top - margin.bottom

  var x = d3.scale.linear()
      .range([0, width])

  var y = d3.scale.linear()
      .range([height, 0])

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')

  var svg = d3.select(parent).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  y.domain([0, 1])
  x.domain([0, options.iterations])

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
}

/**
 * Generate a graph
 *
 * @param  {HTMLElement} parent
 *         Owner dom element
 *
 * @param  {Array.<Array>} data
 *   Parsed data
 *
 * @param  {Object} options
 *   - node {String} Node name (todo: change to label)
 *   - width {Number}
 *   - height {Number}
 *
 * @return {Object} Graph instance
 */
function createGraph (parent, data, options) {
  options = options || {}

  var graphWidth = options.width || 500
  var graphHeight = options.height || 300

  var margin = {top: 20, right: 20, bottom: 30, left: 50}
  var width = graphWidth - margin.left - margin.right
  var height = graphHeight - margin.top - margin.bottom

  var x = d3.scale.linear()
      .range([0, width])

  var y = d3.scale.linear()
      .range([height, 0])

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')

  var line = d3.svg.line()
      .x(function (d, row) {
        return x(row)
      })
      .y(function (d) {
        return y(d[options.node])
      })

  var svg = d3.select(parent).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  x.domain(d3.extent(data, function (d, i) {
    return i
  }))

  y.domain([0, 1])

  if (options.axis) {
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
  }

  svg
    .append('path')
      .datum(data)
      .attr('class', 'line ' + options.lstyle)
      .attr('stroke', options.color)
      .attr('d', line)

  if (options.label) {
    svg.append('text')
      .attr('transform', 'translate(' + (width + 3) + ',' + (y(data[data.length - 1][options.node]) - 10) + ')')
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .style('fill', options.color)
      .text(options.node)
  }
}

module.exports = elastomer('nova-logml-viewer', { prototype: LogmlViewer.prototype })
