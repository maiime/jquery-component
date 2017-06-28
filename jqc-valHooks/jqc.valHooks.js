/**
 * Dependent on
 *  + jqc.baseElement.js
 */
(function ($) {
    function JQCValHooksCtrl() {
        this.typeCache = new Map();
    }

    JQCValHooksCtrl.prototype.addElement = function (jqcElementBase) {
        var typeName = jqcElementBase.getJqcTypeName(),
            elementId = jqcElementBase.getJqcElementId();
        if (typeName && elementId) {
            var cache = this.typeCache.get(typeName);
            if (!cache) {
                cache = new Map();
                this.typeCache.set(typeName, cache);
            }
            cache.set(elementId, jqcElementBase);
        } else {
            if (typeName) {
                throw new Error("valHooks request a jqc element id.");
            }
            if (elementId) {
                throw new Error("valHooks request a jqc type name.");
            }
        }
    };

    JQCValHooksCtrl.prototype.getElement = function (e) {
        var typeName = e.attr($.jqcBaseElement.JQC_ELEMENT_TYPE),
            elementId = e.attr($.jqcBaseElement.JQC_ELEMENT_ID);
        if (typeName && elementId) {
            var cache = this.typeCache.get(typeName);
            if (cache) {
                return cache.get(elementId);
            }

            return undefined;
        } else {
            throw new Error("Not a valid JQC Element.");
        }
    };

    $.jqcValHooksCtrl = new JQCValHooksCtrl();

    var origHookGet = null,
        origHookSet = null;
    if ($.isPlainObject($.valHooks.text)) {
        if ($.isFunction($.valHooks.text.get))
            origHookGet = $.valHooks.text.get;
        if ($.isFunction($.valHooks.text.set))
            origHookSet = $.valHooks.text.set;
    } else {
        $.valHooks.text = {};
    }

    $.valHooks.text.get = function (el) {
        var jqcElement = $.jqcValHooksCtrl.getElement($(el));
        if (jqcElement) {
            return jqcElement.getCurrentVal();
        } else {
            if ($.isFunction(origHookGet)) {
                return origHookGet(el);
            } else {
                return undefined;
            }
        }
    };

    $.valHooks.text.set = function (el, val) {
        var jqcElement = $.jqcValHooksCtrl.getElement($(el));
        if (jqcElement) {
            return el.value = jqcElement.updateCurrentVal(val);
        } else {
            if ($.isFunction(origHookSet)) {
                return origHookSet(el, val);
            } else {
                return undefined;
            }
        }
    };
}(jQuery));