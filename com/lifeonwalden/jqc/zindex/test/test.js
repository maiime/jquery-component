$JqcLoader.importScript('../../../../../qunit/jquery-3.1.1.js')
    .importScript('../../../../../qunit/version.js')
    .importScript('../../../../../qunit/keycode.js')
    .importScript('../../../../../qunit/qunit-2.1.1.js')
    .importCss('../../../../../qunit/qunit-2.1.1.css').execute(function () {
        $JqcLoader.registerModule($JqcLoader.newModule('com.lifeonwalden.jqc', '../../../../../')
            .registerComponent('zindex'));

        $JqcLoader.importComponents('com.lifeonwalden.jqc', ['zindex']).execute(function () {
            QUnit.test("format", function (assert) {
                var popupMgr = $.jqcZindex.popupMgr;
                assert.equal($.jqcZindex.popup, 100, 'popup zindex');
                assert.equal($.jqcZindex.selectbox, 200, 'selectbox zindex');
                assert.equal($.jqcZindex.notification, 300, 'notification zindex');
                assert.equal($.jqcZindex.waiting, 400, 'waiting zindex');

                assert.equal(popupMgr.fetchIndex(), $.jqcZindex.popup, 'first one'); // 100
                assert.equal(popupMgr.fetchIndex(), $.jqcZindex.popup + 1, 'second one'); // 101
                popupMgr.returnIndex($.jqcZindex.popup); // 101
                assert.equal(popupMgr.fetchIndex(), $.jqcZindex.popup + 2, 'third one'); // 102
                popupMgr.returnIndex($.jqcZindex.popup + 2); // 101
                popupMgr.returnIndex($.jqcZindex.popup + 1); // null
                assert.equal(popupMgr.fetchIndex(), $.jqcZindex.popup, 'first one'); // 100
            });
        });
    });