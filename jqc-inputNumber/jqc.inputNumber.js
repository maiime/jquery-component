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

        var newValue = '';
        var removedCharNumber = 0;
        var newLength = that.input.value.length;
        var newCursorPosition = that.input.selectionStart;
        var duplicatePoint = false;
        for (var i = 0; i < newLength; i++) {
            var charCode = that.input.value.charCodeAt(i);
            if (charCode > 47 && charCode < 58) {
                newValue = newValue.concat(match);
            } else if (46 == charCode || 12290 == charCode) {
                if (duplicatePoint) {
                    
                    removedCharNumber += newCursorPosition - i;
                    break;
                }
                newValue = newValue.concat('.');
                duplicatePoint = true;
            } else if (charCode > 65297 && charCode < 65306) {
                newValue = newValue.concat(String.fromCharCode(charCode - 65248));
            } else if (45 == charCode || 65293 == charCode) {
                newValue = newValue.concat('-');
            } else if (i < newCursorPosition) {
                removedCharNumber++;
            }
        }
        var newRealLength = newValue.length;
        var pointIdx = newValue.indexOf('.'),
            lastPointIdx = newValue.lastIndexOf('.');
        if (-1 != pointIdx && pointIdx != lastPointIdx) {
            newValue = newValue.substr(0, lastPointIdx);
        }
        var removedCharNumber = countCommaNumber(newValue, newCursorPosition);
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

    function countCommaNumber(string, position) {
        var num = 0;
        for (var i = 0; i < position; i++) {
            if (string.charCodeAt(i) == 44) {
                num++;
            }
        }

        return num;
    }

    $.jqcInputNumber.prototype = new $.jqcBaseElement();
    $.jqcInputNumber.prototype.constructor = $.jqcInputNumber;
}(jQuery));