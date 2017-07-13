/**
 * select box, support filter & multi-select
 * 
 * Dependent on
 *  + jqc.baseElement.js
 *  + jqc.valHooks.js
 * Optional dependent on
 *  + jqc.pinyin.js
 */
(function ($) {
    if (undefined == $.jqcBaseElement || undefined == $.jqcValHooksCtrl) {
        throw new Error("Need library : jqc.baseElement.js,jqc.valHooks.js");
    }

    var optionCoreCache = new Map();
    var MAX_OPTION_COUNT = 10;
    var UNDEFINED_OPTION = '__undefined__';

    function fillMap(mapping, key, data) {
        if (mapping.has(key)) {
            var preData = mapping.get(key);
            if ($.isArray(preData)) {
                preData.push(data);
            } else {
                mapping.set(key, [preData, data]);
            }
        } else {
            mapping.set(key, data);
        }
    }
    /**
     * For param
     * {
     *  source : data source
     *  extOption : extension options
     * }
     * 
     * For source
     * [{
     *  value : literal,
     *  label : literal,
     *  filter : literal,
     *  pinyinFilter : literal
     * }]
     * or
     * {
     *  data : non-standard data source
     *  adapter : adapter for convert data to standard data
     * }
     * 
     * For adapter
     * {
     *  value : literal,
     *  label : literal or function,
     *  filter : literal,
     *  pinyinFilter : literal
     * }
     * 
     * @param {*} param 
     */
    function OptionCore(param) {
        var defaultOptions = {
            source: null,
            extOption: null,
            supportPinYin: false,
            pinyinParser: null,
            supportFuzzyMatch: false
        };
        this.option = $.extend(true, {}, defaultOptions, param);
        this.source = null;
        this.optionMapping = new Map();
        this.sortedFilterCache = [];
        this.filterIndex = new Map();
        this.optionsCache = new Map();
        this.undefinedOption = '<li value="'.concat(UNDEFINED_OPTION).concat('">无对应选项</li>');
    }

    OptionCore.prototype.get = function (key) {
        return this.optionMapping.get(key);
    };

    OptionCore.prototype.fetchLabel = function (key) {
        var data = this.get(key);
        if (data) {
            return data.text;
        } else {
            return undefined;
        }
    };

    OptionCore.prototype.fuzzyFilter = function (inputTerm) {
        var _inputTerm = $.trim(inputTerm);
        if (0 == _inputTerm.length) {
            return this.undefinedOption;
        }

        var matched = this.optionsCache.get(_inputTerm);
        if (-1 == matched) {
            return this.undefinedOption;
        }

        var optionList = '',
            size = this.sortedFilterCache.length;
        if (matched) {
            return matched;
        } else {
            var counter = 1,
                matched = false;
            for (var i = 0; i < size; i++) {
                var _data = this.sortedFilterCache[i];
                if (_data.filter.indexOf(_inputTerm) >= 0) {
                    if ($.isArray(_data.data)) {
                        var __data = _data.data;
                        for (var j in __data) {
                            optionList = optionList.concat(__data[j].label);
                        }
                    } else {
                        optionList = optionList.concat(_data.data.label);
                    }
                    if (MAX_OPTION_COUNT == counter) {
                        break;
                    }
                    counter++;
                    matched = true;
                }
            }
        }

        if (matched) {
            this.optionsCache.set(_inputTerm, optionList);

            return optionList;
        } else {
            this.optionsCache.set(_inputTerm, -1);

            return this.undefinedOption;
        }
    };

    OptionCore.prototype.filter = function (inputTerm) {
        var _inputTerm = $.trim(inputTerm);
        if (0 == _inputTerm.length) {
            return this.undefinedOption;
        }

        var matched = this.optionsCache.get(_inputTerm);
        if (-1 == matched) {
            return this.undefinedOption;
        }

        var startPosition = this.filterIndex.get(_inputTerm);
        if (-1 == startPosition) {
            return this.undefinedOption;
        }

        var optionList = '',
            start = startPosition,
            realStart = -1,
            size = this.sortedFilterCache.length;
        if (null == startPosition || undefined == startPosition) {
            var _length = _inputTerm.length;
            do {
                _length--;
                startPosition = this.filterIndex.get(_inputTerm.substring(0, _length));
                if (-1 == startPosition) {
                    this.filterIndex.set(_inputTerm, -1);

                    return this.undefinedOption;
                } else if (0 <= startPosition) {
                    start = startPosition
                    break;
                } else {
                    start = 0;
                }
            } while (0 <= _length);
        }

        var counter = 1;
        for (var i = start; i < size; i++) {
            var _data = this.sortedFilterCache[i];
            if (_data.filter.startsWith(_inputTerm)) {
                if ($.isArray(_data.data)) {
                    var __data = _data.data;
                    for (var j in __data) {
                        optionList = optionList.concat(__data[j].label);
                    }
                } else {
                    optionList = optionList.concat(_data.data.label);
                }
                if (MAX_OPTION_COUNT == counter) {
                    break;
                }
                counter++;
                if (-1 == realStart) {
                    realStart = i;
                }
            } else if (-1 < realStart) {
                break;
            }
        }

        if (-1 < realStart) {
            this.filterIndex.set(_inputTerm, realStart);
            this.optionsCache.set(_inputTerm, optionList);

            return optionList;
        } else {
            this.filterIndex.set(_inputTerm, -1);
            this.optionsCache.set(_inputTerm, -1);

            return this.undefinedOption;
        }
    };

    OptionCore.prototype.updateDataSource = function (newDataSource) {
        if (this.option.source.adapter) {
            this.option.source.data = newDataSource;
        } else {
            this.option.source = newDataSource;
        }
        this.optionMapping = new Map();
        this.sortedFilterCache = [];
        this.filterIndex = new Map();
        this.optionsCache = new Map();
        this.setup();
    };

    OptionCore.prototype.setup = function () {
        var _source = this.option.source;
        if (!_source) {
            throw new Error('The data source of selectbox should not be null or undefined.');
        }
        var keyVal = 'value',
            keyFilter = 'filter',
            keyPinyinFilter = 'pinyinFilter',
            keyLabel = 'label',
            mapping = new Map(),
            unSorted = [],
            sourceData = null;
        if ($.isArray(_source)) {
            if (!_source[0][keyFilter]) {
                keyFilter = keyLabel;
            }

            if (!_source[0][keyPinyinFilter]) {
                keyPinyinFilter = keyFilter;
            }
            sourceData = _source;
        } else {
            if (_source.adapter) {
                if (_source.adapter.value) {
                    keyVal = _source.adapter.value;
                }
                if (_source.adapter.label) {
                    keyLabel = _source.adapter.label;
                }
                if (_source.adapter.filter) {
                    keyFilter = _source.adapter.filter;
                } else {
                    if ('string' != typeof (keyLabel)) {
                        throw new Error('Must provide a field for filtering.');
                    }
                    keyFilter = keyLabel;
                }
                if (_source.adapter.pinyinFilter) {
                    keyPinyinFilter = _source.adapter.pinyinFilter;
                } else {
                    keyPinyinFilter = keyFilter;
                }
            }
            sourceData = _source.data;
        }

        if (this.option.extOption) {
            if ($.isArray(this.option.extOption)) {
                sourceData = sourceData.concat(this.option.extOption);
            } else {
                sourceData = sourceData.push(this.option.extOption);
            }
        }

        for (var i in sourceData) {
            var _data = sourceData[i];
            if (!_data)
                continue;
            var packageData = null;
            if ('string' == typeof (keyLabel)) {
                packageData = {
                    label: '<li '.concat('value="v').concat(_data[keyVal]).concat('">').concat(_data[keyLabel]).concat('</li>'),
                    text: _data[keyLabel],
                    data: _data
                };
            } else {
                var text = keyLabel(_data);
                packageData = {
                    label: '<li '.concat('value="v').concat(_data[keyVal]).concat('">').concat(text).concat('</li>'),
                    text: text,
                    data: _data
                };
            }

            var filterKey = _data[keyFilter].toString();
            fillMap(mapping, filterKey, packageData);
            unSorted.push(filterKey);
            if (this.option.supportPinYin) {
                var cnFilterKey = _data[keyPinyinFilter].toString();
                if (cnFilterKey != filterKey) {
                    fillMap(mapping, cnFilterKey, packageData);
                    unSorted.push(cnFilterKey);
                }
                if (!(this.option.pinyinParser && this.option.pinyinParser.firstAlphabet)) {
                    throw new Error('Need a pinyin parser that supports firstAlphabet.');
                }
                var pinyinFilterKey = this.option.pinyinParser.firstAlphabet(cnFilterKey);
                if (filterKey != pinyinFilterKey && cnFilterKey != pinyinFilterKey) {
                    fillMap(mapping, pinyinFilterKey, packageData);
                    unSorted.push(pinyinFilterKey);
                }
            }
            this.optionMapping.set(_data[keyVal].toString(), packageData);
        }

        var sorted = unSorted.sort(),
            filterKeyBrush = null;
        for (var i in sorted) {
            var __filter = sorted[i];
            if (__filter == filterKeyBrush) {
                continue;
            }
            filterKeyBrush = __filter;
            this.sortedFilterCache.push({
                filter: __filter,
                data: mapping.get(__filter)
            });
        }
    };

    $.jqcSelectBox = function (param) {
        var defaultOptions = {
            dataName: null, // for the same data type, in one application, should have the same name
            optionData: null, // data source
            extOption: null, // extension options
            width: 120, // option panel width
            defaultVal: null,
            supportPinYin: false, // for chinese
            supportMultiSelect: false,
            element: null,
            fuzzyMatch: false,
            filterDelay: 256,
            select: null, // call back for selecting event,
            updateDataSource: null // update data source
        };
        if (arguments.length > 0) {
            $.jqcBaseElement.apply(this, arguments);
        }
        this.options = $.extend(true, {}, defaultOptions, param);
        if (!this.options.dataName) {
            throw new Error('Must provide a unique data name to identify the same type select box');
        }
        this.optionCore = optionCoreCache.get(this.options.dataName);
        if (!this.optionCore) {
            this.optionCore = new OptionCore({
                source: this.options.optionData,
                extOption: this.options.extOption,
                supportPinYin: this.options.supportPinYin,
                supportFuzzyMatch: this.options.supportFuzzyMatch
            }); // data source
            this.optionCore.setup();
            optionCoreCache.set(this.options.dataName, this.optionCore);
        }

        this.el = this.options.element; // the jquery element for the target document node
        this.el.addClass('jqcSelectboxHooks');
        this.typeName = 'jqcSelectBox';
        this.elementId = 'jqc'.concat(Date.now().toString());
        this.el.attr($.jqcBaseElement.JQC_ELEMENT_TYPE, this.typeName);
        this.el.attr($.jqcBaseElement.JQC_ELEMENT_ID, this.elementId);
        $.jqcValHooksCtrl.addElement(this);

        if (this.options.defaultVal) {
            this.defaultVal = this.options.defaultVal;
        } else {
            this.defaultVal = UNDEFINED_OPTION;
        }

        if (this.options.supportMultiSelect) {
            renderMultiSelect(this);
        } else {
            renderSingleSelect(this);
        }

        this.el.val(this.defaultVal);
    }

    function renderMultiSelect(that) {
        that.container = $('<div class="jqcSelectboxContainer" style="display:none;">'); //container for option list & operation board
        that.operationBar = $('<div class="jqcSelectboxOperationBar">');
        that.input = $('<input placeholder="输入选项值">');
        that.resetter = $('<button class="jqcSelectboxResetter" title="清空当前所选项">重置</button>'); // reset handler to reset value to default
        that.refresher = $('<button class="jqcSelectboxRefresher" title="从服务器获取新选项">刷新</button>'); // refresh handler to refresh the data source
        that.optionUL = $('<ul class="jqcSelectboxOptions">');
        that.optionSelected = $('<ul class="jqcSelectboxSelectedOption"></ul>');

        that.operationBar.append(that.input).append(that.resetter).append(that.refresher);
        that.container.append(that.operationBar).append(that.optionUL).append(that.optionGap).append(that.optionSelected);
        var elOffset = that.el.offset(),
            elOuterHeight = that.el.outerHeight(),
            elOuterWidth = that.el.outerWidth();
        that.container.css('width', that.options.width * 2 + 116);
        that.input.css('width', that.options.width);
        that.optionUL.css('width', that.options.width + 50);
        that.optionSelected.css('width', that.options.width + 50);
        that.container.appendTo('body');

        that.valueCache = new Map();
        if (that.defaultVal !== UNDEFINED_OPTION && that.defaultVal && that.defaultVal.length > 0) {
            that.defaultVal.split(',').forEach(function (element) {
                that.valueCache.set(element, null);
            });
        }
        var triggerByMe = false;
        that.el.focus(function (e) {
            triggerByMe = true;
            var maxWidth = $('body').width();
            that.container.css('top', elOffset.top + elOuterHeight + 2);
            if (that.container.outerWidth() + elOffset.left + 5 > maxWidth) {
                that.container.css('right', maxWidth - (elOffset.left + elOuterWidth - 15));
            } else {
                that.container.css('left', elOffset.left);
            }
            that.container.show();
            that.input.focus();
        });

        var filterHandler = null,
            filterFun = that.options.fuzzyMatch ? that.optionCore.fuzzyFilter : that.optionCore.filter;
        var oldVal = null,
            selectIndex = null,
            optionSize = 0;
        that.input.keyup(function (e) {
            switch (e.keyCode) {
                case $.ui.keyCode.ENTER:
                    that.optionUL.find('li.jqcSelectboxSelected').trigger('click');
                    selectIndex = null;
                    return;
                case $.ui.keyCode.ESCAPE:
                    {
                        if (that.options.select) {
                            var result = [];
                            that.currentVal.split(',').forEach(function (element) {
                                result.push(that.optionCore.get(element).data);
                            });
                            that.options.select(result);
                        }
                        that.container.hide();
                        return;
                    }
                case $.ui.keyCode.UP:
                    selectIndex == null ? selectIndex = -1 : selectIndex--;
                    break;
                case $.ui.keyCode.DOWN:
                    selectIndex == null ? selectIndex = 0 : selectIndex++;
                    break;
                default:
                    {
                        if (null != filterHandler) {
                            clearTimeout(filterHandler);
                        }
                        filterHandler = setTimeout(function () {
                            if (oldVal != that.input.val()) {
                                that.optionUL.html(filterFun.call(that.optionCore, that.input.val()));
                                optionSize = that.optionUL.find('li').length;
                                selectIndex = null;
                            }
                            filterHandler = null;
                            oldVal = that.input.val();
                        }, that.filterDelay);
                        return;
                    }
            }
            if (optionSize === 0) {
                return;
            }
            that.optionUL.find('li.jqcSelectboxSelected').removeClass('jqcSelectboxSelected');
            that.optionUL.find('li').eq(selectIndex = selectIndex % optionSize).addClass('jqcSelectboxSelected');
        });

        $(document).click(function (e) {
            if (!triggerByMe) {
                if (that.options.select) {
                    var result = [];
                    that.currentVal.split(',').forEach(function (element) {
                        result.push(that.optionCore.get(element).data);
                    });
                    that.options.select(result);
                }
                that.container.hide();
            }
            triggerByMe = false;
        });

        that.container.click(function (e) {
            triggerByMe = true;
        });

        that.optionUL.click(function (e) {
            var eTarget = $(e.target);
            var _val = eTarget.attr('value');
            if (UNDEFINED_OPTION == _val) {
                return;
            }
            _val = _val.substr(1);
            if (!that.valueCache.has(_val)) {
                if (that.currentVal) {
                    that.el.val(that.currentVal.concat(',').concat(_val));
                } else {
                    that.el.val(_val);
                }
                that.valueCache.set(_val, null);
                eTarget.remove();
            }
        });

        that.optionSelected.click(function (e) {
            var eTarget = $(e.target);
            var _val = eTarget.attr('value');
            _val = _val.substr(1);
            that.valueCache.delete(_val);
            var result = '';
            that.valueCache.forEach(function (val, key) {
                result = result.concat(',').concat(key);
            });
            if (result.length === 0) {
                that.el.val(UNDEFINED_OPTION);
            } else {
                that.el.val(result.substr(1));
            }
            that.optionUL.append(eTarget);
        });


        function reset(toHide) {
            oldVal = null;
            that.input.val('');
            that.optionUL.empty();
            that.optionSelected.empty();
            that.valueCache.clear();
            that.el.val(that.defaultVal);
            if (toHide) {
                that.container.hide();
            }
        }
        that.resetter.click(function (e) {
            reset(true);
        });

        that.refresher.click(function (e) {
            if (!that.options.updateDataSource) {
                return;
            }
            var newDataSource = that.options.updateDataSource();
            if ($.isArray(newDataSource)) {
                that.optionCore.updateDataSource(newDataSource);
            }
            reset(false);
        });
    }

    function renderSingleSelect(that) {
        that.container = $('<div class="jqcSelectboxContainer" style="display:none;">'); //container for option list & operation board
        that.operationBar = $('<div class="jqcSelectboxOperationBar">');
        that.input = $('<input placeholder="输入选项值">');
        that.resetter = $('<button class="jqcSelectboxResetter" title="清空当前所选项">重置</button>'); // reset handler to reset value to default
        that.refresher = $('<button class="jqcSelectboxRefresher" title="从服务器获取新选项">刷新</button>'); // refresh handler to refresh the data source
        that.optionUL = $('<ul>');

        that.operationBar.append(that.input).append(that.resetter).append(that.refresher);
        that.container.append(that.operationBar).append(that.optionUL);
        var elOffset = that.el.offset(),
            elOuterHeight = that.el.outerHeight(),
            elOuterWidth = that.el.outerWidth();
        that.container.css('width', that.options.width + 116);
        that.input.css('width', that.options.width);
        that.container.appendTo('body');

        var triggerByMe = false;
        that.el.focus(function (e) {
            triggerByMe = true;
            var maxWidth = $('body').width();
            that.container.css('top', elOffset.top + elOuterHeight + 2);
            if (that.container.outerWidth() + elOffset.left + 5 > maxWidth) {
                that.container.css('right', maxWidth - (elOffset.left + elOuterWidth - 15));
            } else {
                that.container.css('left', elOffset.left);
            }
            that.container.show();
            that.input.focus();
        });

        var filterHandler = null,
            filterFun = that.options.fuzzyMatch ? that.optionCore.fuzzyFilter : that.optionCore.filter;
        var oldVal = null,
            selectIndex = null,
            optionSize = 0;
        that.input.keyup(function (e) {
            switch (e.keyCode) {
                case $.ui.keyCode.ENTER:
                    that.optionUL.find('li.jqcSelectboxSelected').trigger('click');
                    selectIndex = null;
                    return;
                case $.ui.keyCode.ESCAPE:
                    that.container.hide();
                    return;
                case $.ui.keyCode.UP:
                    selectIndex == null ? selectIndex = -1 : selectIndex--;
                    break;
                case $.ui.keyCode.DOWN:
                    selectIndex == null ? selectIndex = 0 : selectIndex++;
                    break;
                default:
                    {
                        if (null != filterHandler) {
                            clearTimeout(filterHandler);
                        }
                        filterHandler = setTimeout(function () {
                            if (oldVal != that.input.val()) {
                                that.optionUL.html(filterFun.call(that.optionCore, that.input.val()));
                                optionSize = that.optionUL.find('li').length;
                                selectIndex = null;
                            }
                            filterHandler = null;
                            oldVal = that.input.val();
                        }, that.filterDelay);
                        return;
                    }
            }
            if (optionSize === 0) {
                return;
            }
            that.optionUL.find('li.jqcSelectboxSelected').removeClass('jqcSelectboxSelected');
            that.optionUL.find('li').eq(selectIndex = selectIndex % optionSize).addClass('jqcSelectboxSelected');
        });

        $(document).click(function (e) {
            if (!triggerByMe) {
                that.container.hide();
            }
            triggerByMe = false;
        });

        that.container.click(function (e) {
            triggerByMe = true;
        });

        that.optionUL.click(function (e) {
            var _val = $(e.target).attr('value');
            if (UNDEFINED_OPTION == _val) {
                return;
            }
            _val = _val.substr(1);
            if (that.options.select) {
                that.options.select(that.optionCore.get(_val).data);
            }
            that.input.val('');
            that.optionUL.empty();
            that.el.val(_val);
            oldVal = null;
            that.container.hide();
        });

        function reset(toHide) {
            oldVal = null;
            that.input.val('');
            that.optionUL.empty();
            that.el.val(that.defaultVal);
            if (toHide) {
                that.container.hide();
            }
        }
        that.resetter.click(function (e) {
            reset(true);
        });

        that.refresher.click(function (e) {
            if (!that.options.updateDataSource) {
                return;
            }
            var newDataSource = that.options.updateDataSource();
            if ($.isArray(newDataSource)) {
                that.optionCore.updateDataSource(newDataSource);
            }
            reset(false);
        });
    }

    $.jqcSelectBox.prototype = new $.jqcBaseElement();
    $.jqcSelectBox.prototype.constructor = $.jqcSelectBox;
    $.jqcSelectBox.prototype.updateCurrentVal = function (val) {
        if (val === this.currentVal) {
            return;
        }

        if (val === UNDEFINED_OPTION) {
            this.currentVal = undefined;
            return '';
        }
        this.currentVal = val;
        if (this.options.supportMultiSelect) {
            var result = '',
                label = '';
            var _this = this;
            this.currentVal.split(',').forEach(function (element) {
                var option = _this.optionCore.get(element);
                label = label.concat(option.label);
                result = result.concat(',').concat(option.text);
            });
            this.optionSelected.html(label);
            return result.substr(1);
        } else {
            var packageData = this.optionCore.get(this.currentVal);
            return packageData.text;
        }
    };
}(jQuery));