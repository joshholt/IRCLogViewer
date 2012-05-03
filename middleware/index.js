var calcStart, calcEnd, calcDate;

calcDate = function(now) {
	var month, year, dayOfMonth, dayOfWeek;
	month = now.getUTCMonth();
	year  = now.getUTCFullYear();
	dayOfMonth = now.getUTCDate();
	dayOfWeek  = now.getUTCDay();
	return {month: month, year: year, dayOfMonth: dayOfMonth, dayOfWeek: dayOfWeek};
};

calcStart = function(now, wanted) {
	var d = calcDate(now), day;

	if (wanted > d.dayOfWeek) {
		day = (d.dayOfMonth + (wanted - d.dayOfWeek));
		return new Date(d.year, d.month, day, 0, 0, 0);
	}

	if (wanted < d.dayOfWeek) {
		day = (d.dayOfMonth - (d.dayOfWeek - wanted));
		return new Date(d.year, d.month, day, 0, 0, 0);
	}

	if (wanted === d.dayOfWeek) {
		return new Date(d.year, d.month, d.dayOfMonth, 0, 0, 0);
	}
};

calcEnd = function(now, wanted) {
	var d = calcDate(now), day;
	
	if (wanted > d.dayOfWeek) {
		day = (d.dayOfMonth + (wanted - d.dayOfWeek));
		return new Date(d.year, d.month, day, 23,59,59);
	}

	if (wanted < d.dayOfWeek) {
		day = (d.dayOfMonth - (d.dayOfWeek - wanted));
		return new Date(d.year, d.month, day, 23,59,59);
	}

	if (wanted === d.dayOfWeek) {
		return new Date(d.year, d.month, d.dayOfMonth, 23,59,59);
	}
};

module.exports = {
	generateDateRangeByName: function(req, res, next) {
		var dayOfWeek = req.params.day, now = new Date();

		switch (dayOfWeek) {
			case "monday":
				req.start = calcStart(now, 1);
				req.end = calcEnd(now, 1);
				next();
				break;
			case "tuesday":
				req.start = calcStart(now, 2);
				req.end = calcEnd(now, 2);
				next();
				break;
			case "wednesday":
				req.start = calcStart(now, 3);
				req.end = calcEnd(now, 3);
				next();
				break;
			case "thursday":
				req.start = calcStart(now, 4);
				req.end = calcEnd(now, 4);
				next();
				break;
			case "friday":
				req.start = calcStart(now, 5);
				req.end = calcEnd(now, 5);
				next();
				break;
		}
	},
	generateDateRangeByDate: function(req, res, next) {
		req.start = new Date(req.params.year, req.params.month, req.params.day, 0,0,0);
		req.end   = new Date(req.params.year, req.params.month, req.params.day, 23,59,59);
		next();
	}
};