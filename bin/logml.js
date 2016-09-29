#!/usr/bin/env node
'use strict'

const program = require('commander')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const clc = require('cli-color')
const open = require('open')
const path = require('path')

program
  .usage('<input>')
  .version(require('../package.json').version)
  .option('-d, --dolphin', 'Output an human readable version of the parsed graph')
  .option('-i, --iterations <n>', 'The number of iterations performed during a run', parseInt)
  .option('-o, --output <folder>', 'The output folder')
  .option('-w, --watch', 'Watch for any changes and update the output (if input is a file)')
  .option('-v, --verbose', 'Print out informations on build (activate --verbose)')
  .option('-s, --server [port]', 'Create a plotting server (activate --verbose)')
  .option('-p, --open', 'Open url on start')
  .option('-f --faster', 'Prevent some size optimisation, faster, bigger (stronger)')
  .option('--output-edge', 'Output default vpop edges to csv stream')
  .option('--output-node', 'Output default vpop nodes to csv stream')
  .option('--input-edge <string>', 'Input vpop edges from csv file')
  .option('--input-node <string>', 'Input vpop nodes from csv file')
  .option('--silent', 'Prevent verbose mode')

program.parse(process.argv)

var verbose = !program.silent && (program.verbose || program.watch || program.server)
if (verbose) {
  process.env.DEBUG = (process.env.DEBUG || '') + ' logml* logml:*'
}

// Load logml after process env configuration
const logml = require('../src')
const Graph = logml.Graph
const debug = require('debug')('logml')

/**
 * print error and kill process
 * @param  {String} err Error message
 */
function leaveError (err) {
  console.error(clc.red('Error:'), err.message)
  process.exit(1)
}

/**
 * Return input path or kill process
 * @return {string} Graphml filepath
 */
function ensureInputPath () {
  var inputPath = getInputPath()

  if (!inputPath) {
    leaveError(new Error('Missing input path argument or invalid input file'))
  }

  return inputPath
}

/**
 * Loozy get input path (or null)
 * @return {string|null} Graphml filepath
 */
function getInputPath () {
  try {
    var inputPath = program.args[0]
    inputPath = path.resolve(inputPath)
    if (!fs.existsSync(inputPath)) {
      return null
    }
    if (!fs.statSync(inputPath).isFile()) {
      return null
    }
    if (path.extname(inputPath) !== '.graphml') {
      return null
    }
  } catch (e) {
    return null
  }
  return inputPath
}

function run () {
  var inputPath = ensureInputPath()
  var graphml
  try {
    graphml = fs.readFileSync(inputPath, 'utf8')
  } catch (err) {
    leaveError(err)
  }
  var options = {
    iterations: program.iterations,
    output: program.output,
    inputNode: program.inputNode,
    inputEdge: program.inputEdge
  }
  if (program.outputEdge) {
    console.log(graphml2EdgeCsv(graphml, options))
  } else if (program.outputNode) {
    console.log(graphml2NodeCsv(graphml, options))
  } else if (program.dolphin || !program.output) {
    console.log(graphml2Dolphin(graphml, options))
  } else {
    debug('Generate model ./%s -> ./%s/',
      path.relative(process.cwd(), inputPath),
      path.relative(process.cwd(), program.output))
    logml.graphml2fortran(graphml, program.output, options)
  }
}

function graphml2Dolphin (graphml, options) {
  var graph = Graph.parse(graphml)
  return graph.format(new logml.FormatterCli(options))
}

function graphml2EdgeCsv (graphml, options) {
  var graph = Graph.parse(graphml)
  return graph.format(new logml.FormatterEdgeCsv(options))
}

function graphml2NodeCsv (graphml, options) {
  var graph = Graph.parse(graphml)
  return graph.format(new logml.FormatterNodeCsv(options))
}

if (program.server) {
  let port = typeof program.server === 'boolean' ? 3000 : parseInt(program.server, 10)
  let server = require('../server/server')
  let conf = {
    model: {
      iterations: program.iterations
    },
    output: program.output,
    filepath: getInputPath(),
    watch: program.watch,
    verbose: program.verbose
  }
  if (program.faster) {
    conf.minifyify = false
  }
  server.configure(conf)
  server.listen(port, function (err) {
    if (err) { leaveError(err) }
    var url
    if (conf.filepath) {
      url = `http://localhost:${port}/` + path.relative(process.cwd(), conf.filepath)
    } else {
      url = `http://localhost:${port}/`
    }
    debug('Ok server listen on', url)
    if (program.open) {
      open(url)
    }
  })
} else if (program.watch) {
  chokidar.watch(ensureInputPath())
    .on('ready', run)
    .on('change', run)
    .on('error', leaveError)
    .on('unlink', function () {
      leaveError(new Error('File do not longer exists...'))
    })
} else {
  run()
}
