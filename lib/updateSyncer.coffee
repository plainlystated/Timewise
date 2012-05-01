http = require('http')
fs = require('fs')
DateFormatter = require('./dateFormatter').DateFormatter
RRD = require('./rrd/rrd').RRD

class UpdateSyncer
  constructor: (@app) ->
    @appName = @app.viewData.slug
    @host = app.xmlHost
    @port = app.xmlPort
    this.checkForUpdates()
    setInterval () =>
      this.checkForUpdates()
    , 1000 * 60 * 10

  checkForUpdates: () =>
    timestamp = new DateFormatter(new Date).filenameTimestamp()
    path = "./db"
    newFilenameBase = "#{@appName}-#{timestamp}"
    file = fs.createWriteStream("#{path}/#{newFilenameBase}.xml")

    console.log "Checking for updates from #{@host}:#{@port} for #{@appName} @ #{timestamp}"
    request = http.request {
      host: @host,
      port: @port,
      path: "/#{@appName}",
      method: "GET"
    }, (response) =>
      console.log(" - #{response.statusCode}")
      response.setEncoding('utf8')
      response.on('data', (chunk) ->
        file.write(chunk)
      )
      response.on('end', () =>
        file.end()
        this.importRRD(path, newFilenameBase)
      )
    request.end()

  importRRD: (path, filenameBase) =>
    RRD.restore "#{path}/#{filenameBase}.xml", "#{path}/#{filenameBase}.rrd", (err, i, out) =>

      fs.unlink "#{path}/#{filenameBase}.xml"

      symlink = @app.rrdFilepath
      fs.unlink symlink, () ->
        fs.symlink "#{filenameBase}.rrd", symlink

exports.UpdateSyncer = UpdateSyncer
