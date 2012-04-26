apps = {
  "hot-or-not": require('./lib/hotOrNot').HotOrNot
}

Server= require('./lib/server.coffee').Server
RRD = require('./lib/rrd/rrd').RRD

task 'server', 'Serve the app, and occasionally check for updates', () ->
  new Server(apps)

task 'server:local', 'Serve the app, but don\'t check for updates', () ->
  new Server(apps, false)
