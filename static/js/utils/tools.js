
module.exports = {

	dateFormat: function (a1, a2) {

		var time = '';
		var format = '';
		if (typeof a1 === 'number' && a1 > 0) {
			time = a1;
			format = a2;
		} else {
			time = a2;
			format = a1;
		}
		var date = time ? new Date(time) : new Date();
		var date_year = 1900 + date.getYear();
		var date_month = date.getMonth() + 1;
		var date_date = date.getDate();
		var date_date_str = [date_year, date_month > 9 ? date_month : ('0' + date_month), date_date > 9 ? date_date : ('0' + date_date)].join('-');
		if (format === 'yy-mm-dd') {
			return date_date_str;
		}
		var date_hours = date.getHours();
		var date_minutes = date.getMinutes();
		var date_time_str = [date_hours > 9 ? date_hours : ('0' + date_hours), date_minutes > 9 ? date_minutes : ('0' + date_minutes)].join(':');
		if (format === 'yy-mm-dd HH:mm') {
			return [date_date_str, date_time_str].join(' ');
		}
		var date_seconds = date.getSeconds();
		date_time_str += ':' + (date_seconds > 9 ? date_seconds : ('0' + date_seconds));
		return [date_date_str, date_time_str].join(' ');
		
	}

};