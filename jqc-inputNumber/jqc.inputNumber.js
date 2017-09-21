/**
 * number input, support number formatting display
 * 
 * Dependent on
 *  + jqc.baseElement.js
 *  + jqc.valHooks.js
 *  + jqc.format.js
 *  + jqc.uniqueKey.js
 */
(function ($) {
    if (undefined == $.jqcBaseElement || undefined == $.jqcValHooksCtrl || undefined == $.jqcFormat || undefined == $.jqcUniqueKey) {
        throw new Error("Need library : jqc.baseElement.js,jqc.valHooks.js,jqc.jqcFormat.js,jqc.uniqueKey.js");
    }

    /*
     * /[^0-9０-９＋－。+\-Ee.]/g;
     */
    const ACCEPT_INPUT_REG_EXP = /[^0-9０-９＋－。+\-.]/g;
    const FINAL_VALUE_REG_EXP = /[^0-9+\-.]/g;

    $.jqcInputNumber = function (param) {
        var defaultOptions = {
            element: null // the jquery element for the target input
        };
        if (arguments.length > 0) {
            $.jqcBaseElement.apply(this, arguments);
        }
        this.options = $.extend(true, {}, defaultOptions, param);
        this.inputDelay = 50;
        this.el = this.options.element;
        this.input = this.element.get(0);
        this.typeName = 'jqcInputNumber';
        this.elementId = 'jqc'.concat($.jqcUniqueKey.fetchIntradayKey());
        this.el.attr($.jqcBaseElement.JQC_ELEMENT_TYPE, this.typeName);
        this.el.attr($.jacBaseElement.JQC_ELEMENT_ID, this.elementId);
        $.jqcValHooksCtrl.addElement(this);

        this.currentVal = '';
        this.cursorPosition = -1;
        this.inputting = false;
        this.processing = false;

        var inputHanlder = null;
        var that = this;
        that.el.keyup(function (e) {
            if (that.processing) {
                e.preventDefault();
                return;
            }

            if (!that.inputting) {
                that.inputting = true;
                that.cursorPosition = that.input.selectionStart;
            }

            if (null != inputHanlder) {
                clearTimeout(inputHanlder);
            }
            inputHanlder = setTimeout(function () {
                setupFormatProcessor(that);
            }, that.inputDelay);
        });
    }

    function setupFormatProcessor(that) {
        that.processing = true;
        var newValue = that.el.val().replace(ACCEPT_INPUT_REG_EXP, '');
        that.processing = false;
    }
}(jQuery));