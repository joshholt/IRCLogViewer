(function() {
  var allowCrossDomain, app, express, middle, port, routes;

  express = require('express');

  routes = require('./routes');

  middle = require('./middleware');

  app = express.createServer();

  port = process.env.PORT || 3000;

  module.exports = app;

  allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, x-requested-with, if-modified-since, cache-control, content-type');
    return next();
  };

  app.configure(function() {
    app.use(express["static"]("" + __dirname + "/public"));
    app.set('views', "" + __dirname + "/views");
    app.set('view engine', 'jade');
    app.use(require('connect-assets')());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    return app.use(app.router);
  });

  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', routes.index);

  app.get('/archives', routes.archives);

  app.get('/archives/index', routes.archivesBase);

  app.get('/archives/:channel/:year/:month/:day', middle.generateDateRangeByDate, routes.archivesChanDay);

  app.get('/graphs/:channel?', routes.graphs);

  app.get('/:channel/:day/:page?', middle.generateDateRangeByName, routes.chanDay);

}).call(this);
