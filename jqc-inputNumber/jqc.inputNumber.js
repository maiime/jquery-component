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
    const ACCEPT_INPUT_REG_EXP = /[^0-9０-９－。\-.]/g;
    const TO_BE_REPLACED_REG_EXP = /./g;
    const FINAL_VALUE_REG_EXP = /[^0-9\-.]/g;

    $.jqcInputNumber = function (param) {
        var defaultOptions = {
            element: null, // the jquery element for the target input,
            decimals: 0 // the number of decimal
        };
        if (arguments.length > 0) {
            $.jqcBaseElement.apply(this, arguments);
        }
        this.options = $.extend(true, {}, defaultOptions, param);
        this.inputDelay = 200;
        this.el = this.options.element;
        this.input = this.el.get(0);
        this.typeName = 'jqcInputNumber';
        this.elementId = 'jqc'.concat($.jqcUniqueKey.fetchIntradayKey());
        this.el.attr($.jqcBaseElement.JQC_ELEMENT_TYPE, this.typeName);
        this.el.attr($.jqcBaseElement.JQC_ELEMENT_ID, this.elementId);
        $.jqcValHooksCtrl.addElement(this);

        this.currentVal = '';
        this.formatted = '';
        this.cursorPosition = -1;
        this.commaNumber = 0;
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

        var newLength = that.input.value.length;
        var newValue = that.input.value.replace(TO_BE_REPLACED_REG_EXP, replaceFullWidthChar);
        var newRealLength = newValue.length;
        var newCursorPosition = that.input.selectionStart - (newLength - newRealLength);
        var pointIdx = newValue.indexOf('.'),
            lastPointIdx = newValue.lastIndexOf('.');
        if (-1 != pointIdx && pointIdx != lastPointIdx) {
            newValue = newValue.substr(0, lastPointIdx);
        }
        if (newValue == that.currentVal) {
            that.input.value = that.formatted;
        } else {
            var newFormatted = $.jqcFormat.number(newValue, {
                decimals: that.options.decimals,
                toRound: false
            });
            if (newValue.endsWith('.') && 0 < that.options.decimals) {
                newFormatted = newFormatted.concat('.');
            }
            that.input.value = newFormatted;
        }
        that.input.setSelectionRange(newCursorPosition, newCursorPosition);
        that.currentVal = newValue;
        that.formatted = that.input.value;

        that.processing = false;
        that.inputting = false;
    }


    function replaceFullWidthChar(match, offset, string) {
        var charCode = match.charCodeAt(0);
        if (charCode > 47 && charCode < 58) {
            return match;
        } else if (44 == charCode) {
            return ',';
        } else if (46 == charCode || 12290 == charCode) {
            return '.';
        } else if (charCode > 65297 && charCode < 65306) {
            return String.fromCharCode(charCode - 65248);
        } else if (45 == charCode || 65293 == charCode) {
            return '-';
        } else {
            return '';
        }
    }

    $.jqcInputNumber.prototype = new $.jqcBaseElement();
    $.jqcInputNumber.prototype.constructor = $.jqcInputNumber;
}(jQuery));