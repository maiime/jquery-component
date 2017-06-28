/**
 * select box, support filter & multi-select
 * 
 */
(function ($) {
    var selectboxCache = new Map(),
        ELEMENT_ID = 'jqcSelectboxId';
    var MAX_OPTION_COUNT = 16;

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
            supportFuzzyMatch: false
        };
        this.option = $.extend(true, {}, defaultOptions, param);
        this.source = null;
        this.optionMapping = new Map();
        this.sortedFilterCache = [];
        this.filterIndex = new Map();
        this.optionsCache = new Map();
        this.undefinedOption = '<li value="__undefined__">无对应选项</li>';
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
            if (!_source[0][_filter]) {
                _filter = _label;
            }

            if (!_source[0][_pinyinFilter]) {
                _pinyinFilter = _filter;
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
                var pinyinFilterKey = $.pinyin(cnFilterKey);
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

    // try something
    function SelectBox(param) {
        var defaultOptions = {
            dataName: null, // for the same data type, in one application, should have the same name
            optionData: null, // data source
            width: 160, // option panel width
            valueSetting: null,
            supportPinYin: false, // for chinese
            supportMultiSelect: false,
            element: null,
            fuzzyMatch: false,
            select: null // call back for selecting event
        };

        this.options = $.extend(true, {}, defaultOptions, param);
        this.optionContainer = null;
        this.optionInput = null;
        this.optionClear = null;
        this.optionPanel = null;
        this.optionData = null;
        this.optionDataMapping = new Map();
        this.optionIdx = new Map();
        this.optionContianCache = new Map();
        this.currentVal = null;
        this.blankOption = null;
        Object.defineProperties(this, {
            'blankValue': {
                value: '_osc_blank_'
            }
        });

        var elementId = Date.now().toString();
        this.options.element.attr(ELEMENT_ID, elementId);
        selectboxCache.set(elementId, this);
        prepareOptions(this);

        if (this.options.valueSetting) {
            var _valueSetting = this.options.valueSetting;
            if (_valueSetting.selectAll) {
                this.optionDataMapping.set(_valueSetting.selectAll.value, {
                    data: _valueSetting.selectAll.obj,
                    label: null
                });
            }
            if (null != _valueSetting.defaultVal && undefined != _valueSetting.defaultVal) {
                this.options.element.val(_valueSetting.defaultVal);
            }
        }

        this.blankOption = '<li value="'.concat(this.options.blankValue).concat('">无对应选项</li>');
        this.optionContainer = $('<div class="oscSelectbox" style="display:none;">');
        this.optionClear = $('<div class="oscSelectboxClear">点击此处清空或重置</div>');
        this.optionInput = $('<input>');
        this.optionPanel = $('<ul>');

        this.optionContainer.append(this.optionClear).append(this.optionInput).append(this.optionPanel);

        var eOffset = this.options.element.offset(),
            eOuterHeight = this.options.element.outerHeight(),
            eOuterWidth = this.options.element.outerWidth();
        this.optionContainer.css('width', this.options.width);
        this.optionInput.css('width', this.options.width - 12);
        this.optionContainer.appendTo('body');

        var filterDelay = 256,
            filterHandler = null,
            filterFun = this.options.fuzzyMatch ? fuzzyFilter : filter;
        var _this = this,
            oldVal = null,
            selectIndex = null,
            len = 0;
        this.optionInput.keyup(function (e) {
            switch (e.keyCode) {
                case $.ui.keyCode.ENTER:
                    _this.optionPanel.find('li.oscSelected').trigger('click');
                    return;
                case $.ui.keyCode.ESCAPE:
                    _this.optionContainer.hide();
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
                            if (oldVal != _this.optionInput.val()) {
                                _this.optionPanel.html(filterFun(_this, _this.optionInput.val()));
                                len = _this.optionPanel.find('li').length;
                                selectIndex = null;
                            }
                            filterHandler = null;
                            oldVal = _this.optionInput.val();
                        }, filterDelay);
                        return;
                    }
            }
            if (len == 0) {
                return;
            }
            _this.optionPanel.find('li.oscSelected').removeClass('oscSelected');
            var theLi = _this.optionPanel.find('li').eq(selectIndex = selectIndex % len).addClass('oscSelected'),
                _h = 0;
            switch (selectIndex) {
                case 0:
                    _this.optionPanel.scrollTop(0);
                    break;
                case -1:
                case len - 1:
                    _this.optionPanel.scrollTop(_this.optionPanel.get(0).scrollHeight);
                    break;
                default:
                    var pt = _this.optionPanel.offset().top + Number.parseInt(_this.optionPanel.css('border-top-width')) + Number.parseInt(_this.optionPanel.css('padding-top'));
                    var st = _this.optionPanel.scrollTop(),
                        ph = pt + _this.optionPanel.height(),
                        d = theLi.offset().top < pt;
                    while (theLi.offset().top < pt || theLi.offset().top + theLi.outerHeight() > ph) {
                        _this.optionPanel.scrollTop(d ? --st : ++st);
                    }
            }
        });
        _this.optionPanel.on('mouseover', 'li', function () {
            _this.optionPanel.find('li.oscSelected').removeClass('oscSelected');
            var _t = $(this).addClass('oscSelected');
            _this.optionPanel.find('li').each(function (i, obj) {
                if ($(this).is(_t)) {
                    selectIndex = i;
                    return false;
                }
            });
        });
        var triggerByMe = false;
        _this.options.element.focus(function (event) {
            triggerByMe = true;
            var maxWidth = $('body').width();
            eOffset = _this.options.element.offset();
            _this.optionContainer.css('top', eOffset.top + eOuterHeight + 2);
            if (_this.optionContainer.outerWidth() + eOffset.left + 5 > maxWidth) {
                _this.optionContainer.css('right', maxWidth - (eOffset.left + eOuterWidth));
            } else {
                _this.optionContainer.css('left', eOffset.left);
            }
            _this.optionContainer.show();
            _this.optionInput.focus();
        });

        $(document).click(function (e) {
            if (!triggerByMe) {
                _this.optionContainer.hide();
            }
            triggerByMe = false;
        });

        _this.optionClear.click(function (e) {
            if (_this.options.valueSetting) {
                var _valueSetting = _this.options.valueSetting;
                if (null != _valueSetting.defaultVal && undefined != _valueSetting.defaultVal) {
                    _this.options.element.val(_valueSetting.defaultVal);
                }
            } else {
                _this.options.element.val('');
            }
        });

        _this.optionPanel.click(function (e) {
            var _val = $(e.target).attr('value');
            if (_this.options.blankValue == _val) {
                return;
            }
            if (_this.options.select) {
                _this.options.select(_this.optionDataMapping.get(_val).data);
            }
            _this.options.element.val(_val);
        });

    }
}(jQuery));