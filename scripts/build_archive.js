var db = require('../lib/db');

module.exports = buildArchives;

function mapFun() {
	var key = {
		channel: this.message.to,
		year: this.timestamp.getFullYear(),
		month: this.timestamp.getMonth(),
		day: this.timestamp.getDate()
	};
	emit(key, {count:1});
}

function redFun(keys, values) {
	var sum = 0;
	values.forEach(function (value) { sum += value['count']; });
	return {count: sum};
}

function buildArchives() {
	db.logs.mapReduce(mapFun, redFun, {out: 'messages_per_day', query: {"message.to": {$exists: true}}});
}