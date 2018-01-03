QUnit.test("duplicate check", function (assert) {
    var times = 100,
        keySize = 60000;
    for (var i = 0; i < times; i++) {
        var map = new Map();
        for (var idx = 0; idx < keySize; idx++) {
            map.set($.jqcUniqueKey.fetchIntradayKey(), true);
        }

        assert.equal(keySize == map.size, true, 'date');
    }
});