var Mongolian     = require('mongolian'),
    server        = new Mongolian(require('./logger'), "s-wheeljack"),
    db            = server.db('irclogs'),
    logs          = db.collection('log'),
    mpd           = db.collection('messages_per_day');

function generateDateString(y,m,d) {
  return (new Date(y,m,d)).toLocaleDateString();
}

function findProperty(key, value, array) {
  var ret, len = array.length;
  for (var i = 0; i < len; i++) {
    if (array[i] && array[i][key] && array[i][key] === value) {
      ret = array[i];
      break;
    }
  }
  return ret;
}

function archiveMap(r) {
  var ret = {};
  Object.keys(r._id).forEach(function (k) { ret[k] = r._id[k]; });
  Object.keys(r.value).forEach(function (k) { ret[k] = r.value[k]; });
  return ret;
}

function archiveReduce(p,c,idx) {
  var year, month;
  c.channel = c.channel.replace("#", '');
  c.linkTitle = generateDateString(c.year, c.month, c.day);
  p.channel = c.channel;
  if (idx === 0 || !findProperty('year', c.year, p.years)) {
    p.years.push({year: c.year, months: [{month: c.month, days: [c] }] });
  }
  else {
    year = findProperty('year', c.year, p.years);
    month = findProperty('month', c.month, year.months);
    if (!month) year.months.push({month: c.month, days: [c] });
    else month.days.push(c);
  }
  return p;
}

module.exports = {
  all: function(collection, query, cb) {
    collection.find(query).sort({timestamp: 1}).toArray(function(err, data) {
      if (err) return cb(err);
      var recs;
      if (collection === mpd) {
        recs = [data.map(archiveMap).reduce(archiveReduce, {years: []})];
      } else {
        recs = data;
      }
      cb(null, {records: recs, count: data.length});
    });
  },
  one: function(collection, criteria, cb) {
    collection.findOne(criteria, cb);
  },
  save: function(collection, obj, cb) {
    collection.save(obj, cb);
  },
  saveMany: function(collection, array, cb) {
    collection.insert(array, cb);
  },
  cleanup: function() {
    server.close();
  },
  paginate: function(collection, q, sort, pageNumber, resultsPerPage, cb) {
    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    var cursor   = collection.find(q).skip(skipFrom).limit(resultsPerPage);
    if (sort) cursor.sort(sort);
    cursor.toArray(function (err, data) {
      if (err) return cb(err);
      collection.count(q, function (err, cnt) {
        if (err) return cb(err);
        cb(null, {
          queryObject: q,
          query: JSON.stringify(q),
          page: parseInt(pageNumber,10),
          pages: Math.floor(cnt / resultsPerPage),
          hasPrevious: parseInt(pageNumber,10)-1 > 0,
          hasNext: parseInt(pageNumber,10)+1 <= Math.floor(cnt / resultsPerPage),
          next: parseInt(pageNumber,10)+1,
          previous: parseInt(pageNumber,10)-1,
          records: data});
      });
    });
  },
  asyncLog: function(prefix, next) {
    return function (err,value) {
      if (err) {
        console.warn("Error getting "+prefix+': '+err, err.stack);
      } else {
        console.log(prefix+':',value);
      }
      if(next && typeof(next) === "function") next();
    };
  },
  logs: logs,
  mpd: mpd
};
