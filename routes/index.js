var db = require('../lib/db');

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generatedQueryCallback(channel, day, res, next) {
  return function (err, data) {
    if (err) return next(err);

    if (data.records.length > 0) {
      data.records = data.records.map(function(r) {
        var when = new Date(r.timestamp);
        r.when = when.toLocaleTimeString();
        data.title = "#"+channel+" ("+when.toLocaleDateString()+")";
        return r;
      });
    } else {
      data.title = "#"+channel+" ("+capitalize(day)+")";
    }
    data.hasRecords = data.records.length > 0;
    data.channel = channel;
    data.day = day;

    res.send(data);
  };
}

module.exports = {

  index: function(req, res, next) {
    res.render( 'index', { title: "IRC Logs" });
  },

  chanDay: function(req, res, next) {
    var channel = req.params.channel, day = req.params.day;
    var query   = {"message.to": "#" + channel, timestamp: {$gte: req.start, $lte: req.end}};
    
    db.all(
      db.logs,
      query,
      generatedQueryCallback(channel, day, res, next)
    );
  }

};
