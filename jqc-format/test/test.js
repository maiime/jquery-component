QUnit.test("format", function (assert) {
    var numberFormat = $.jqcFormat.number;
    assert.equal(numberFormat(123), '123', '123 -> 123');
    assert.equal(numberFormat(123, {
        decimals: 1
    }), '123.0', '123 -> 123.0');
    assert.equal(numberFormat(123, {
        decimals: 4
    }), '123.0000', '123 -> 123.0000');
    assert.equal(numberFormat(123, {
        decimals: 4,
        decPoint: '#',
    }), '123#0000', '123 -> 123#0000');
    assert.equal(numberFormat(123, {
        decimals: 4,
        thousandsSep: '*',
    }), '123.0000', '123 -> 123.0000');
    assert.equal(numberFormat(123, {
        toRound: false
    }), '123', '123 -> 123');
    assert.equal(numberFormat(123, {
        decimals: 1,
        toRound: false
    }), '123.0', '123 -> 123.0');
    assert.equal(numberFormat(123, {
        decimals: 4,
        toRound: false
    }), '123.0000', '123 -> 123.0000');
    assert.equal(numberFormat(123.5678), '124', '123.5678 -> 124');
    assert.equal(numberFormat(123.5678, {
        decimals: 1
    }), '123.6', '123.5678 -> 123.6');
    assert.equal(numberFormat(123.5678, {
        decimals: 4
    }), '123.5678', '123.5678 -> 123.5678');
    assert.equal(numberFormat(123.5678, {
        decimals: 4,
        decPoint: '#',
    }), '123#5678', '123.5678 -> 123#5678');
    assert.equal(numberFormat(123.5678, {
        decimals: 4,
        thousandsSep: '*',
    }), '123.5678', '123.5678 -> 123.5678');
    assert.equal(numberFormat(123.5678, {
        toRound: false
    }), '123', '123.5678 -> 123');
    assert.equal(numberFormat(123.5678, {
        decimals: 1,
        toRound: false
    }), '123.5', '123.5678 -> 123.5');
    assert.equal(numberFormat(123.5678, {
        decimals: 4,
        toRound: false
    }), '123.5678', '123.5678 -> 123.5678');
    assert.equal(numberFormat(123456123.5678), '123,456,124', '123456123.5678 -> 123,456,124');
    assert.equal(numberFormat(123456123.5678, {
        decimals: 1
    }), '123,456,123.6', '123456123.5678 -> 123,456,123.6');
    assert.equal(numberFormat(123456123.5678, {
        decimals: 4
    }), '123,456,123.5678', '123456123.5678 -> 123,456,123.5678');
    assert.equal(numberFormat(123456123.5678, {
        decimals: 4,
        decPoint: '#',
    }), '123,456,123#5678', '123456123.5678 -> 123,456,123#5678');
    assert.equal(numberFormat(123456123.5678, {
        decimals: 4,
        thousandsSep: '*',
    }), '123*456*123.5678', '123456123.5678 -> 123*456*123.5678');
    assert.equal(numberFormat(123456123.5678, {
        toRound: false
    }), '123,456,123', '123456123.5678 -> 123,456,123');
    assert.equal(numberFormat(123456123.5678, {
        decimals: 1,
        toRound: false
    }), '123,456,123.5', '123456123.5678 -> 123,456,123.5');
    assert.equal(numberFormat(123456123.5678, {
        decimals: 4,
        toRound: false
    }), '123,456,123.5678', '123456123.5678 -> 123,456,123.5678');
});