$JqcLoader.importScript('../../../../../qunit/jquery-3.1.1.js')
    .importScript('../../../../../qunit/version.js')
    .importScript('../../../../../qunit/keycode.js')
    .importScript('../../../../../qunit/qunit-2.1.1.js')
    .importCss('../../../../../qunit/qunit-2.1.1.css').execute(function () {
        $JqcLoader.registerModule($JqcLoader.newModule('com.lifeonwalden.jqc', '../../../../../')
            .registerComponent('uniqueKey'));

        $JqcLoader.importComponents('com.lifeonwalden.jqc', ['uniqueKey']).execute(function () {
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
        });
    });