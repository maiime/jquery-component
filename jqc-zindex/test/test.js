QUnit.test("format", function (assert) {
    var popupMgr = $.jqcZindex.popupMgr;
    assert.equal($.jqcZindex.popup, 100, 'popup zindex');
    assert.equal($.jqcZindex.selectbox, 200, 'selectbox zindex');
    assert.equal($.jqcZindex.notification, 300, 'notification zindex');
    assert.equal($.jqcZindex.waiting, 400, 'waiting zindex');

    assert.equal(popupMgr.fetchIndex(), $.jqcZindex.popup, 'first one');
    assert.equal(popupMgr.fetchIndex(), $.jqcZindex.popup + 1, 'second one');
    popupMgr.returnIndex();
    assert.equal(popupMgr.fetchIndex(), $.jqcZindex.popup + 1, 'still second one');
});