express        = require 'express'
routes         = require './routes'
middle         = require './middleware'
app            = express.createServer();
port           = process.env.PORT || 3000;
module.exports = app;

app.configure ->
  app.use express.static("#{__dirname}/public")
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'jade'
  app.use require('connect-assets')()
  app.use express.favicon()
  app.use express.logger('dev')
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router

app.configure 'development', ->
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })

app.configure 'production', ->
  app.use express.errorHandler()

app.get  '/',                     routes.index
app.get  '/graphs/:channel?',     routes.graphs
app.get  '/:channel/:day/:page?', middle.generateDateRange, routes.chanDay

app.listen port
console.log "IRCLOG server listening on port #{port}"
