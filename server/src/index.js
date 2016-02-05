'use strict'

// Splash screen on console
console.log(
  '%c⅋%c %s',
  'color:#000; font-size: 30px',
  'color:#666; font-size: 9px; margin-bottom: 10px; font-family: sans-serif', 'logml')

require('domready')(_ => require('./main.js'))
