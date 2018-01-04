$JqcLoader.importScript('../../../../../qunit/jquery-3.1.1.js')
    .importScript('../../../../../qunit/qunit-2.1.1.js')
    .importCss('../../../../../qunit/qunit-2.1.1.css').execute(function () {
        $JqcLoader.registerModule($JqcLoader.newModule('com.lifeonwalden.jqc', '../../../../../')
            .registerComponent('dateUtil'));

        $JqcLoader.importComponents('com.lifeonwalden.jqc', ['dateUtil']).execute(function () {
            QUnit.test("toDate", function (assert) {
                var _date = $.jqcDateUtil.toDate(new Date());
                assert.equal(_date instanceof(Date) && !isNaN(_date.valueOf()), true, 'date');

                var _dateNum = $.jqcDateUtil.toDate(new Date().getTime());
                assert.equal(_dateNum instanceof(Date) && !isNaN(_dateNum.valueOf()), true, 'number');

                var _dateSting = $.jqcDateUtil.toDate('2017-02-09');
                assert.equal(_dateSting instanceof(Date) && !isNaN(_dateSting.valueOf()), true, 'String yyyy-MM-dd');

                _dateSting = $.jqcDateUtil.toDate('2017-02-09 12:12:12');
                assert.equal(_dateSting instanceof(Date) && !isNaN(_dateSting.valueOf()), true, 'String yyyy-MM-dd hh:mm:ss');

                _dateSting = $.jqcDateUtil.toDate('2017/02/09');
                assert.equal(_dateSting instanceof(Date) && !isNaN(_dateSting.valueOf()), true, 'String yyyy/MM/dd');

                assert.throws(function () {
                    $.jqcDateUtil.toDate('20170209');
                }, Error, 'Error Catch : invalid format yyyyMMdd');

                assert.throws(function () {
                    $.jqcDateUtil.toDate('2017/02/32');
                }, Error, 'Error Catch : invalid date');
            });

            QUnit.test("toMilliSeconds", function (assert) {
                var _dateFull = new Date();
                var _date =
                    new Date(_dateFull.getFullYear(), _dateFull.getMonth(), _dateFull.getDate(), 0, 0, 0, 0);
                assert.equal($.jqcDateUtil.toMilliSeconds(_dateFull), _dateFull.getTime(), 'date & full');
                assert.equal($.jqcDateUtil.toMilliSeconds(_dateFull, true), _date.getTime(), 'date & only date');

                assert.equal($.jqcDateUtil.toMilliSeconds(_dateFull.getTime()), _dateFull.getTime(), 'number & full');
                assert.equal($.jqcDateUtil.toMilliSeconds(_dateFull.getTime(), true), _date.getTime(), 'number & only date');

                var _dateOnlyString = '2017-02-09 00:00:00';
                var _dateSting = '2017-02-09 12:12:12';
                assert.equal($.jqcDateUtil.toMilliSeconds(_dateSting), new Date(_dateSting).getTime(), 'yyyy-MM-dd hh:mm:ss & full');
                assert.equal($.jqcDateUtil.toMilliSeconds(_dateSting, true), new Date(_dateOnlyString).getTime(), 'yyyy-MM-dd hh:mm:ss & only date');

                _dateOnlyString = '2017/02/09 00:00:00';
                _dateSting = '2017/02/09 12:12:12';
                assert.equal($.jqcDateUtil.toMilliSeconds(_dateSting), new Date(_dateSting).getTime(), 'yyyy/MM/dd hh:mm:ss & full');
                assert.equal($.jqcDateUtil.toMilliSeconds(_dateSting, true), new Date(_dateOnlyString).getTime(), 'yyyy/MM/dd hh:mm:ss & only date');
            });

            QUnit.test("plusHours", function (assert) {
                var _date = new Date('2017-02-09 12:12:12');
                assert.equal($.jqcDateUtil.plusHours(_date, 1).getTime(), new Date('2017-02-09 13:12:12').getTime(), '+1 & date');
                assert.equal($.jqcDateUtil.plusHours(_date, 1, true), new Date('2017-02-09 13:12:12').getTime(), '+1 & number');

                assert.equal($.jqcDateUtil.plusHours(_date, -1).getTime(), new Date('2017-02-09 11:12:12').getTime(), '-1 & date');
                assert.equal($.jqcDateUtil.plusHours(_date, -1, true), new Date('2017-02-09 11:12:12').getTime(), '-1 & number');

                assert.equal($.jqcDateUtil.plusHours(_date, 24).getTime(), new Date('2017-02-10 12:12:12').getTime(), '+24 & date');
                assert.equal($.jqcDateUtil.plusHours(_date, 24, true), new Date('2017-02-10 12:12:12').getTime(), '+24 & number');

                assert.equal($.jqcDateUtil.plusHours(_date, -24).getTime(), new Date('2017-02-08 12:12:12').getTime(), '-24 & date');
                assert.equal($.jqcDateUtil.plusHours(_date, -24, true), new Date('2017-02-08 12:12:12').getTime(), '-24 & number');
            });
        });
    });