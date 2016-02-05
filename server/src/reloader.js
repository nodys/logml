// Reloader client (only with --watch)
require('lrio')('reload')
  .on('message', message => document.location.reload())
