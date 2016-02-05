'use strict'
require('elastomer/webcomponents-lite')

require('./app')

require('./style.css')()
require('./print.css')(document.header, 'print')

// Remove loader
document.getElementById('loading').remove()

var app = document.createElement('nova-logml-app')
document.body.appendChild(app)
