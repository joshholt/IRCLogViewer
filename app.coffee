express        = require 'express'
routes         = require './routes'
middle         = require './middleware'
app            = express.createServer();
port           = process.env.PORT || 3000;
module.exports = app;

allowCrossDomain = (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', "*"
  res.header 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'
  res.header 'Access-Control-Allow-Headers', 'origin, x-requested-with, if-modified-since, cache-control, content-type'
  next()

app.configure ->
  app.use express.static("#{__dirname}/public")
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'jade'
  app.use require('connect-assets')()
  app.use express.favicon()
  app.use express.logger('dev')
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use allowCrossDomain
  app.use app.router

app.configure 'development', ->
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })

app.configure 'production', ->
  app.use express.errorHandler()

app.get  '/',                                          routes.index
app.get  '/archives',                                  routes.archives
app.get  '/archives/index',                            routes.archivesBase
app.get  '/archives/:channel/:year/:month/:day',       middle.generateDateRangeByDate, routes.archivesChanDay
app.get  '/graphs/:channel?',                          routes.graphs
app.get  '/:channel/:day/:page?',                      middle.generateDateRangeByName, routes.chanDay

app.listen port
console.log "IRCLOG server listening on port #{port}"
