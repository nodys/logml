'use strict'

const State = require('./State')
const Promise = require('bluebird')
const EventEmitter = require('events').EventEmitter

const LOCALSTORAGEKEY = 'logml://'

class StateManager extends EventEmitter {
  constructor (data) {
    super()
    var self = this
    this._data = data
    this._states = []
    this._storagekey = LOCALSTORAGEKEY + document.location.pathname
    this._changeListener = function (type, state) {
      self.emit('change', type, state)
    }
  }

  close () {
    this._states.forEach(state => this.remove(state))
  }

  load () {
    var states
    if (window.localStorage.getItem(this._storagekey)) {
      try {
        states = JSON.parse(window.localStorage.getItem(this._storagekey))
      } catch (e) {}
    } else {
      states = [{ fusion: true, ids: [] }]
    }
    states.forEach(raw => this.add(new State(raw, this._data)))
    return Promise.resolve(this._states)
  }

  add (state) {
    state.on('change', this._changeListener)
    this._states.push(state)
  }

  remove (state) {
    var index = this._states.indexOf(state)
    if (!~index) { return }
    state.removeListener('change', this._changeListener)
    this._states.splice(index, 1)
  }

  save () {
    window.localStorage.setItem(this._storagekey, JSON.stringify(this._states))
    return Promise.resolve()
  }
}

module.exports = StateManager
