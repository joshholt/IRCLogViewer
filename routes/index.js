var db = require('../lib/db');

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generatedQueryCallback(channel, day, res, next) {
  return function (err, data) {
    if (err) return next(err);

    if (data.records.length > 0) {
      data.records = data.records.map(function(r) {
        delete r._id;
        if (r.timestamp) {
          var when = new Date(r.timestamp);
          r.when = when.toLocaleTimeString();
          data.title = "#"+channel+" ("+when.toLocaleDateString()+")";
        }
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
    var channel = req.params.channel, day = req.params.day,
        query   = {"message.to": "#" + channel, timestamp: {$gte: req.start, $lte: req.end}};
    
    db.all(
      db.logs,
      query,
      generatedQueryCallback(channel, day, res, next)
    );
  },

  graphs: function (req, res, next) {
    res.render('graphs', { title: 'IRC Logs' });
  },

  archives: function(req, res, next) {
    res.render('archives', { title: 'IRC Logs' });
  },

  archivesBase: function(req, res, next) {
    var channel = req.params.channel || '#developers',
        query   = {"_id.channel": channel};

    db.all(
      db.mpd,
      query,
      generatedQueryCallback(channel, "Archive", res, next)
    );
  },

  archivesChanDay: function(req, res, next) {
    var channel = req.params.channel, day = req.params.day,
        query   = {"message.to": "#" + channel, timestamp: {$gte: req.start, $lte: req.end}};
    
    db.all(
      db.logs,
      query,
      generatedQueryCallback(channel, day, res, next)
    );
  }

};
