'use strict'

const elastomer = require('elastomer')
const HTMLElastomer = require('elastomer').HTMLElastomer
const d3 = require('d3')
const StateManager = require('./StateManager')

require('../viewer')

class LogmlApp extends HTMLElastomer {
  initialize (elasto) {
    elasto.html = require('./layout.html')
    elasto.css = require('./style.css')
  }

  link (scope, elasto) {
    const model = elasto.useModel({
      states: []
    })

    // Parse data
    var rawData = document.getElementById('data').innerText
    var data = d3.csv.parse(rawData)
    var stateManager = new StateManager(data)
    elasto.addClosable(stateManager)

    stateManager.load()
      .then(states => {
        model.states = states
      })

    stateManager.on('change', function (type, state) {
      stateManager.save()
    })
  }
}

module.exports = elastomer('nova-logml-app', { prototype: LogmlApp.prototype })
