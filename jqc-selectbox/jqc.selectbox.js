(function ($) {
    function SelectBox(param) {
        var defaultOptions = {
            optionData: null, // data source
            width: 160, // option panel width
            valueSetting: null,
            supportPinYin: false, // for chinese
            element: null,
            fuzzyMatch: false,
            supportMultiSelect: false,
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