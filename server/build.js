'use strict'
const browserify = require('browserify')
const PassThrough = require('stream').PassThrough
const co = require('co')
const Promise = require('bluebird')
const fs = require('fs-extra-promise')
const concat = require('concat-stream')
const path = require('path')
const minifyify = require('minifyify')
const babelify = require('babelify')
const cssy = require('cssy')
const htmly = require('htmly')
const logml = require('../src')
const spawn = require('child_process').spawn
const debug = require('debug')('logml')

module.exports = build

const HEAD = fs.readFileSync(path.resolve(__dirname, './template/head.html'))
const DEV = process.env.NODE_ENV === 'development'
// const STYLE = fs.readFileSync(path.resolve(__dirname, './template/basestyle.css'))

const APP = path.resolve(__dirname, './src/index.js')
const RELOADER = path.resolve(__dirname, './src/reloader.js')

function build (filepath, options) {
  var stream = new PassThrough()
  co(function * () {
    stream.push(HEAD)
    // stream.push(`\n<style>${STYLE}</style>`)
    stream.push(`<div id="loading">Building and loading plots...</div>`)

    // Create temporary folder for generation
    options.output = path.resolve(options.output) || path.join('/tmp/logml', path.basename(filepath))
    debug('output', options.output)

    // Read graphml source
    debug('read source', filepath)
    var graphml
    try {
      graphml = yield fs.readFileAsync(filepath)
    } catch (_) {
      stream.push('Error: Unable to read graphml source')
      return stream.push(null)
    }

    // Data
    debug('build and generate datas')
    stream.push('\n<script type="text/plain" id="data">')
    try {
      var data = yield build.getDataBuffer(graphml, options)
    } catch (e) {
      console.error(e.stack)
      stream.push('Error: Unable to generate data')
      return stream.push(null)
    }
    stream.push(data)
    stream.push('</script>')

    // Bundle
    debug('bundle application')
    stream.push('\n<script>')
    try {
      var bundle = yield build.getBundleBuffer(options)
    } catch (e) {
      console.error(e.stack)
      stream.push('Error: Unable to generate application bundle')
      return stream.push(null)
    }
    stream.push(bundle)
    stream.push('</script>')

    debug('done')
    stream.push(null)
  })
  return stream
}

/**
 * Promise a data buffer
 *
 * @param  {Buffer|String} graphml
 *   The graphml source
 * @param  {Object} options
 * @return {Promise.<Buffer>} Data buffer
 */
build.getDataBuffer = function (graphml, options) {
  return co(function * () {
    var make = yield build.getDataSpawn(graphml, options)
    return new Promise(function (resolve, reject) {
      make.on('close', function (code) {
        if (code !== 0) { reject(new Error('Unable to build model')) }
      })
      make.stdout.pipe(concat(data => {
        resolve(data)
      }))
    })
  })
}

/**
 * Promise the data child_process spawn
 *
 * @param  {Buffer|String} graphml
 *   The graphml source
 * @param  {Object} options see logml options
 * @return {Promise.<child_process.spawn>}
 *   Data spawn with:
 *   - stdout {stream.Readable} The data stream
 *   - stderr {stream.Readable} The stderr stream (not error)
 *   - nb: .on('close', code => the process exit code, 0 if not error)
 */
build.getDataSpawn = function (graphml, options) {
  return co(function * () {
    // Generate source
    yield logml.graphml2fortran(graphml, options.output, options)

    return new Promise(function (resolve, reject) {
      var make = spawn('make', ['data'], {
        cwd: options.output
      })
      resolve(make)
    })
  })
}

/**
 * Bundle the application bundle (once and cache it)
 *
 * @param  {object} options
 *   Logml options
 *
 * @return {Promise.<Buffer>}
 */
build.getBundleBuffer = function (options) {
  if (!DEV && build.getBundleBuffer.cache) {
    return Promise.resolve(build.getBundleBuffer.cache)
  }
  return new Promise(function (resolve, reject) {
    build.getBundleStream(options).pipe(concat(function (data) {
      build.getBundleBuffer.cache = data
      resolve(data)
    }))
  })
}
build.getBundleBuffer.cache = null

/**
 * Return the application bundle stream
 * @param  {Object} options Logml options
 * @return {stream.Readable}
 */
build.getBundleStream = function (options) {
  var b = browserify({})
  b.add(APP)
  if (options.watch) {
    b.add(RELOADER)
  }
  b.transform(htmly)
  b.transform(cssy)
  b.transform(babelify, {
    presets: [
      'es2015'
    ],
    plugins: [
      'transform-runtime'
    ]
  })
  if (options.minifyify) {
    b.plugin(minifyify, options.minifyify)
  }
  return b.bundle()
}
