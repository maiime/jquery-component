QUnit.test("format", function (assert) {
    var numberFormat = $.jqcFormat.number;
    assert.equal(numberFormat(1234), '1,234', '1,234');
});