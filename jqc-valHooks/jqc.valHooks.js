function JQCElementBase() {
    this.typeName = null;
    this.elementId = null;
}

JQCElementBase.prototype.JQC_ELEMENT_ID = "jqcElementId";
JQCElementBase.prototype.JQC_ELEMENT_TYPE = "jqcElementType";

JQCElementBase.prototype.getJqcTypeName = function () {
    return this.typeName;
}

JQCElementBase.prototype.getJqcElementId = function () {
    return this.elementId;
}

(function ($) {
    function JQCValHooksCtrl() {
        this.typeCache = new Map();
    }

    JQCValHooksCtrl.prototype.addElement = function (jqcElementBase) {
        var typeName = jqcElementBase.getJqcTypeName();
        if (typeName) {
            var cache = this.typeCache.get(typeName);
            if (cache) {
                cache.addElement(jqcElementBase.getJqcElementId, jqcElementBase);
            }
        }
    }

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
        var _el = $(el),
            _id = _el.attr(ELEMENT_ID);
        if (_id) {
            var obj = selectboxCache.get(_id);
            return obj.options.currentVal;
        } else {
            if ($.isFunction(origHookGet)) {
                return origHookGet(el);
            } else {
                return undefined;
            }
        }
    };

    $.valHooks.text.set = function (el, val) {
        var _el = $(el),
            _id = _el.attr(ELEMENT_ID);
        if (_id) {
            var obj = selectboxCache.get(_id);
            var data = obj.optionDataMapping.get(val),
                label = '',
                value = val;

            if (null == data || undefined == data) {
                if (obj.options.valueSetting && null != obj.options.valueSetting.defaultVal && undefined != obj.options.valueSetting.defaultVal) {
                    data = obj.optionDataMapping.get(obj.options.valueSetting.defaultVal);
                    label = data.label;
                    value = data.value;
                }
            } else {
                var _val = 'value',
                    _label = 'label';
                var optionData = obj.options.optionData;
                if (!$.isArray(optionData) && optionData.adapter) {
                    if (optionData.adapter.value) {
                        _val = optionData.adapter.value;
                    }
                    if (optionData.adapter.label) {
                        _label = optionData.adapter.label;
                    }
                }
                if (null == _label || 'string' == typeof (_label)) {
                    label = data.data[_label];
                } else {
                    label = _label(data.data);
                }
                value = data.data[_val];
            }
            obj.options.currentVal = value;
            return el.value = label;
        } else {
            if ($.isFunction(origHookSet)) {
                return origHookSet(el, val);
            } else {
                return undefined;
            }
        }
    };
}(jQuery));