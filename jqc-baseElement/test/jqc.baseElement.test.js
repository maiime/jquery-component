QUnit.test("inherit", function (assert) {
    function InheritTest() {
        if (arguments.length > 0) {
            $.jqcBaseElement.apply(this, arguments);
        }
        this.extProps = null;
    }
    InheritTest.prototype = new $.jqcBaseElement();
    InheritTest.prototype.constructor = InheritTest;
    InheritTest.prototype.updateCurrentVal = function (val) {
        this.currentVal = val;
        this.extProps = val + 1;

        return this.extProps;
    };

    var instance = new InheritTest();
    instance.typeName = 'InheritTest';
    instance.elementId = 'helloworld';
    var _extProps = instance.updateCurrentVal(1);

    assert.equal(_extProps, 2, 'Return Label');
    assert.equal(instance.getCurrentVal(), 1, 'Set value');
    assert.equal(instance.getJqcTypeName(), 'InheritTest', 'Set typeName');
    assert.equal(instance.getJqcElementId(), 'helloworld', 'Set elementId');
});