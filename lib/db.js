var Mongolian     = require('mongolian'),
    server        = new Mongolian(require('./logger'), "s-wheeljack"),
    db            = server.db('irclogs'),
    logs          = db.collection('log');

module.exports = {
  all: function(collection, query, cb) {
    collection.find(query).sort({timestamp: 1}).toArray(function(err, data) {
      if (err) return cb(err);
      cb(null, {records: data, count: data.length});
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
  logs: logs
};
