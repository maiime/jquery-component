/**
 * date utility
 */
(function ($) {
    const ONE_DAY_IN_MILLISECONDS = 86400000;
    const ONE_HOUR_IN_MILLISECONDS = 3600000;
    const TIME_EXP_REGEXP = /^([-+]?\d+Y)?([-+]?\d+M)?([-+]?\d+D)?([-+]?\d+H)?$/i;

    $.jqcDateUtil = {
        toMilliSeconds: function (date) {
            if (typeof (date) == 'string') {
                return new Date(date).getTime();
            } else if (typeof (date) == 'number') {
                return date;
            } else {
                return date.getTime();
            }
        },
        toDate: function (date) {
            if (typeof (date) == 'string') {
                return new Date(date);
            } else if (typeof (date) == 'number') {
                return new Date(date);
            } else {
                return date;
            }
        },
        plusHours: function (date, num, toMilliSeconds) {
            var milliseconds = this.toMilliSeconds(date) + num * ONE_HOUR_IN_MILLISECONDS;
            if (toMilliSeconds) {
                return milliseconds;
            } else {
                return new Date(milliseconds);
            }
        },
        plusDays: function (date, num, toMilliSeconds) {
            var milliseconds = this.toMilliSeconds(date) + num * ONE_DAY_IN_MILLISECONDS;
            if (toMilliSeconds) {
                return milliseconds;
            } else {
                return new Date(milliseconds);
            }
        },
        plusMonths: function (date, num, toMilliSeconds) {
            var _date = new Date(this.toMilliSeconds(date));
            _date.setMonth(_date.getMonth() + num);
            if (toMilliSeconds) {
                return _date.getTime();
            } else {
                return _date;
            }
        },
        plusYears: function (date, num, toMilliSeconds) {
            var _date = new Date(this.toMilliSeconds(date));
            _date.setFullYear(_date.getFullYear() + num);
            if (toMilliSeconds) {
                return _date.getTime();
            } else {
                return _date;
            }
        },
        plus: function (date, num, toMilliSeconds) {
            if (typeof (num) !== 'string' || $.trim(num).length == 0) {
                return null;
            }

            var timeExpPieces = num.match(TIME_EXP_REGEXP);
            if (!timeExpPieces) {
                return null;
            }

            var _date = date;
            var year = timeExpPieces[1];
            if (year) {
                _date = this.plusYears(_date, parseInt(year.substr(0, year.length - 1)));
            }
            var month = timeExpPieces[2];
            if (month) {
                _date = this.plusMonths(_date, parseInt(month.substr(0, month.length - 1)));
            }
            var day = timeExpPieces[3];
            if (day) {
                _date = this.plusDays(_date, parseInt(day.substr(0, day.length - 1)));
            }
            var hour = timeExpPieces[4];
            if (hour) {
                _date = this.plusHours(_date, parseInt(hour.substr(0, hour.length - 1)));
            }

            if (toMilliSeconds) {
                return _date.getTime();
            } else {
                return _date;
            }
        }
    };
}(jQuery));