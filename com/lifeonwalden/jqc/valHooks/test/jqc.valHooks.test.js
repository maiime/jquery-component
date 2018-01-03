QUnit.test("valHooks", function (assert) {
    function ValHooksTest(param) {
        if (arguments.length > 0) {
            $.jqcBaseElement.apply(this, arguments);
        }
        this.el = param.el;
        this.extProps = null;
        this.typeName = 'ValHooksTest';
        this.elementId = 'ValHooksTest001';
        this.el.attr($.jqcBaseElement.JQC_ELEMENT_TYPE, this.typeName);
        this.el.attr($.jqcBaseElement.JQC_ELEMENT_ID, this.elementId);
    }
    ValHooksTest.prototype = new $.jqcBaseElement();
    ValHooksTest.prototype.constructor = ValHooksTest;
    ValHooksTest.prototype.updateCurrentVal = function (val) {
        this.currentVal = val;
        this.extProps = parseInt(val) + 1;

        return this.extProps;
    };

    var $el = $('#testText');
    var instance = new ValHooksTest({
        el: $el
    });
    $.jqcValHooksCtrl.addElement(instance);
    $el.val(15);

    var el = document.getElementById('testText');
    assert.equal(el.value, 16, 'Set value');
    assert.equal($el.val(), 15, 'Get value');
});