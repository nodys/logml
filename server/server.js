'use strict'
const http = require('http')
const express = require('express')
const Router = require('express-promise-router')
const path = require('path')
const chokidar = require('chokidar')
const lrio = require('lrio')
const build = require('./build')
const fs = require('fs-extra-promise')
const co = require('co')
const extend = require('extend')
const pick = require('lodash.pick')

const config = require('./config')
const app = express()
const server = module.exports = http.createServer(app)
const preRouter = new Router()
const router = new Router()
const reloader = lrio(server, 'reload')
const watcher = chokidar.watch()

//
// Handle watched file change
//
watcher.on('change', function (file) {
  reloader.broadcast(file)
})

//
// Plug middlewares
//
app.use(function (req, res, next) {
  req.config = extend(true, {}, config) // Copy configuration for each request
  next()
})
app.use(preRouter)
app.use(router)

//
// Routing table
//
router.get('*', co.wrap(function * (req, res, next) {
  var config = req.config
  var filepath = path.resolve(process.cwd(), req.path.replace(/\.\.\/+/g, '').slice(1))
  // var filepath = config.filepath

  // Invalid
  if (path.extname(filepath) !== '.graphml') {
    return next()
  }

  // Not found
  if (!(yield fs.existsAsync(filepath))) {
    return next()
  }

  if (config.watch) {
    watcher.add(filepath)
  }

  var options = extend({}, config, pick(req.query, ['iterations']))
  res.type('text/html')
  build(filepath, options).pipe(res)
}))

router.get('*', function (req, res, next) {
  res.end('(logml index)')
})

/**
 * Override some default configuration for this server
 * @param  {Object} options See config options
 * @return {this}
 */
server.configure = function (options) {
  extend(true, config, options || {})
  return server
}

/**
 * Expose a pre-router to extend this application
 * @return {this}
 */
server.use = function () {
  preRouter.use.apply(preRouter, arguments)
  return this
}
