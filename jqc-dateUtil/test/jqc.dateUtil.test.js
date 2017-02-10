QUnit.test("toDate", function (assert) {
    var _date = $.jqcDateUtil.toDate(new Date());
    assert.equal(_date instanceof (Date) && !isNaN(_date.valueOf()), true, 'date');

    var _dateNum = $.jqcDateUtil.toDate(new Date().getTime());
    assert.equal(_dateNum instanceof (Date) && !isNaN(_dateNum.valueOf()), true, 'number');

    var _dateSting = $.jqcDateUtil.toDate('2017-02-09');
    assert.equal(_dateSting instanceof (Date) && !isNaN(_dateSting.valueOf()), true, 'String yyyy-MM-dd');

    var _dateSting = $.jqcDateUtil.toDate('2017/02/09');
    assert.equal(_dateSting instanceof (Date) && !isNaN(_dateSting.valueOf()), true, 'String yyyy/MM/dd');

    assert.throws(function () { $.jqcDateUtil.toDate('20170209'); }, Error, 'Error Catch : invalid format yyyyMMdd');

    assert.throws(function () { $.jqcDateUtil.toDate('2017/02/32'); }, Error, 'Error Catch : invalid date');
});

QUnit.test("toMilliSeconds", function (assert) {
    var _dateFull = new Date();
    var _date =
        new Date(_dateFull.getFullYear(), _dateFull.getMonth(), _dateFull.getDate(), 0, 0, 0, 0);
    assert.equal($.jqcDateUtil.toMilliSeconds(_dateFull), _dateFull.getTime(), 'date & full');
    assert.equal($.jqcDateUtil.toMilliSeconds(_dateFull, true), _date.getTime(), 'date & only date');
    assert.equal($.jqcDateUtil.toMilliSeconds(_dateFull), _dateFull.getTime(), 'date & full');
    assert.equal($.jqcDateUtil.toMilliSeconds(_dateFull, true), _date.getTime(), 'date & only date');
});