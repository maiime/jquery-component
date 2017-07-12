/**
 * 过滤型下拉框
 */
(function($) {
	var selectboxCache = new Map(), ELEMENT_ID = 'selectboxId';
	var MAX_OPTION_COUNT = 100;
	var origHookGet = null, origHookSet = null;
	if ($.isPlainObject($.valHooks.text)) {
		if ($.isFunction($.valHooks.text.get))
			origHookGet = $.valHooks.text.get;
		if ($.isFunction($.valHooks.text.set))
			origHookSet = $.valHooks.text.set;
	} else {
		$.valHooks.text = {};
	}

	$.valHooks.text.get = function(el) {
		var _el = $(el), _id = _el.attr(ELEMENT_ID);
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

	$.valHooks.text.set = function(el, val) {
		var _el = $(el), _id = _el.attr(ELEMENT_ID);
		if (_id) {
			var obj = selectboxCache.get(_id);
			var data = obj.optionDataMapping.get(val), label = '', value = val;

			if (null == data || undefined == data) {
				if (obj.options.valueSetting && null != obj.options.valueSetting.defaultVal && undefined != obj.options.valueSetting.defaultVal) {
					data = obj.optionDataMapping.get(obj.options.valueSetting.defaultVal);
					label = data.label;
					value = data.value;
				}
			} else {
				var _val = 'value', _label = 'label';
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

	function prepareOptions(param) {
		function fillMap(mapping, key, data) {
			if (mapping.has(key)) {
				var preData = mapping.get(key);
				if ($.isArray(preData)) {
					preData.push(data);
				} else {
					mapping.set(key, [ preData, data ]);
				}
			} else {
				mapping.set(key, data);
			}
		}

		var _this = param;
		var optionData = _this.options.optionData;
		if (!optionData) {
			return null;
		}

		var mapping = new Map(), unSorted = [], sourceData = null;
		var _val = 'value', _filter = 'filter', _pinyinFilter = 'pinyinFilter', _label = 'label';
		if ($.isArray(optionData)) {
			if (!optionData[0][_filter]) {
				_filter = _label;
			}

			if (!optionData[0][_pinyinFilter]) {
				_pinyinFilter = _filter;
			}
			sourceData = optionData;
		} else {
			if (optionData.adapter) {
				if (optionData.adapter.value) {
					_val = optionData.adapter.value;
				}
				if (optionData.adapter.label) {
					_label = optionData.adapter.label;
				}
				if (optionData.adapter.filter) {
					_filter = optionData.adapter.filter;
				} else {
					_filter = _label;
				}
				if (optionData.adapter.pinyinFilter) {
					_pinyinFilter = optionData.adapter.pinyinFilter;
				} else {
					_pinyinFilter = _filter;
				}
			}
			sourceData = optionData.data;
		}
		var supportCN = _pinyinFilter == _filter ? false : true;

		for ( var i in sourceData) {
			var _data = sourceData[i];
			if (!_data)
				continue;
			var packageData = null;
			if ('string' == typeof (_label)) {
				packageData = {
					label : '<li '.concat('value="').concat(_data[_val]).concat('">').concat(_data[_label]).concat('</li>'),
					data : _data
				};
			} else {
				packageData = {
					label : '<li '.concat('value="').concat(_data[_val]).concat('">').concat(_label(_data)).concat('</li>'),
					data : _data
				};
			}
			var filterKey = _data[_filter];
			fillMap(mapping, filterKey, packageData);
			unSorted.push(filterKey);
			if (_this.options.supportPinYin) {
				var cnFilterKey = _data[_pinyinFilter];
				if (supportCN) {
					if (filterKey != cnFilterKey) {
						fillMap(mapping, cnFilterKey, packageData);
						unSorted.push(cnFilterKey);
					}
				}
				var pinyinFilterKey = $.pinyin(cnFilterKey);
				if (filterKey != pinyinFilterKey && pinyinFilterKey != cnFilterKey) {
					fillMap(mapping, pinyinFilterKey, packageData);
					unSorted.push(pinyinFilterKey);
				}
			}
			_this.optionDataMapping.set(_data[_val], packageData);
		}

		var sorted = unSorted.sort(), __optionData = [], filterKey = null;
		for ( var i in sorted) {
			var __filter = sorted[i];
			if (__filter == filterKey) {
				continue;
			}
			filterKey = __filter;
			__optionData.push({
				filter : __filter,
				data : mapping.get(__filter)
			});
		}

		_this.optionData = __optionData;
	}

	function fuzzyFilter(obj, inputTerm) {
		var _inputTerm = $.trim(inputTerm);
		if (0 == _inputTerm.length) {
			return obj.blankOption;
		}

		var _index = obj.optionContianCache, __optionData = obj.optionData;

		var _indexSet = _index.get(_inputTerm);
		if (-1 == _indexSet) {
			return obj.blankOption;
		}

		var optionList = '', indexSet = _indexSet, size = __optionData.length;
		if (null == indexSet || undefined == indexSet) {
			var _length = _inputTerm.length;
			do {
				_length--;
				_indexSet = _index.get(_inputTerm.substring(0, _length));
				if (-1 == _indexSet) {
					_index.set(_inputTerm, -1);

					return obj.blankOption;
				} else if (_indexSet) {
					indexSet = _indexSet
					break;
				} else {
					indexSet = null;
				}
			} while (0 <= _length);
		}

		_indexSet = [], counter = 1;
		if (indexSet) {
			for ( var i in indexSet) {
				var _dataIdx = indexSet[i];
				var _data = __optionData[_dataIdx];
				if (_data.filter.indexOf(_inputTerm) >= 0) {
					if ($.isArray(_data.data)) {
						var __data = _data.data;
						for ( var j in __data) {
							optionList = optionList.concat(__data[j].label);
						}
					} else {
						optionList = optionList.concat(_data.data.label);
					}
					if (MAX_OPTION_COUNT == counter) {
						break;
					}
					counter++;
					_indexSet.push(_dataIdx);
				}
			}
		} else {
			for (var i = 0; i < size; i++) {
				var _data = __optionData[i];
				if (_data.filter.indexOf(_inputTerm) >= 0) {
					if ($.isArray(_data.data)) {
						var __data = _data.data;
						for ( var j in __data) {
							optionList = optionList.concat(__data[j].label);
						}
					} else {
						optionList = optionList.concat(_data.data.label);
					}
					if (MAX_OPTION_COUNT == counter) {
						break;
					}
					counter++;
					_indexSet.push(i);
				}
			}
		}

		if (_indexSet.length > 0) {
			_index.set(_inputTerm, _indexSet);

			return optionList;
		} else {
			_index.set(_inputTerm, -1);
			return obj.blankOption;
		}
	}

	function filter(obj, inputTerm) {
		var _inputTerm = $.trim(inputTerm);
		if (0 == _inputTerm.length) {
			return obj.blankOption;
		}

		var _index = obj.optionIdx, __optionData = obj.optionData;

		var _startPosition = _index.get(_inputTerm);
		if (-1 == _startPosition) {
			return obj.blankOption;
		}

		var optionList = '', start = _startPosition, realStart = -1, size = __optionData.length;
		if (null == _startPosition || undefined == _startPosition) {
			var _length = _inputTerm.length;
			do {
				_length--;
				_startPosition = _index.get(_inputTerm.substring(0, _length));
				if (-1 == _startPosition) {
					_index.set(_inputTerm, -1);

					return obj.blankOption;
				} else if (0 <= _startPosition) {
					start = _startPosition
					break;
				} else {
					start = 0;
				}
			} while (0 <= _length);
		}

		var counter = 1;
		for (var i = start; i < size; i++) {
			var _data = __optionData[i];
			if (_data.filter.startsWith(_inputTerm)) {
				if ($.isArray(_data.data)) {
					var __data = _data.data;
					for ( var j in __data) {
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
			_index.set(_inputTerm, realStart);

			return optionList;
		} else {
			_index.set(_inputTerm, -1);
			return obj.blankOption;
		}
	}

	function SelectBox(param) {
		var defaultOptions = {
			optionData : null,
			width : 160,
			valueSetting : null,
			supportPinYin : false,
			select : null,
			element : null,
			fuzzyMatch : false
		};

		this.options = $.extend(defaultOptions, param);
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
			'blankValue' : {
				value : '_osc_blank_'
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
					data : _valueSetting.selectAll.obj,
					label : null
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

		var eOffset = this.options.element.offset(), eOuterHeight = this.options.element.outerHeight(), eOuterWidth = this.options.element.outerWidth();
		this.optionContainer.css('width', this.options.width);
		this.optionInput.css('width', this.options.width - 12);
		this.optionContainer.appendTo('body');

		var filterDelay = 256, filterHandler = null, filterFun = this.options.fuzzyMatch ? fuzzyFilter : filter;
		var _this = this, oldVal = null, selectIndex = null, len = 0;
		this.optionInput.keyup(function(e) {
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
			default: {
				if (null != filterHandler) {
					clearTimeout(filterHandler);
				}
				filterHandler = setTimeout(function() {
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
			var theLi = _this.optionPanel.find('li').eq(selectIndex = selectIndex % len).addClass('oscSelected'), _h = 0;
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
				var st = _this.optionPanel.scrollTop(), ph = pt + _this.optionPanel.height(), d = theLi.offset().top < pt;
				while (theLi.offset().top < pt || theLi.offset().top + theLi.outerHeight() > ph) {
					_this.optionPanel.scrollTop(d ? --st : ++st);
				}
			}
		});
		_this.optionPanel.on('mouseover', 'li', function() {
			_this.optionPanel.find('li.oscSelected').removeClass('oscSelected');
			var _t = $(this).addClass('oscSelected');
			_this.optionPanel.find('li').each(function(i, obj) {
				if ($(this).is(_t)) {
					selectIndex = i;
					return false;
				}
			});
		});
		var triggerByMe = false;
		_this.options.element.focus(function(event) {
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

		$(document).click(function(e) {
			if (!triggerByMe) {
				_this.optionContainer.hide();
			}
			triggerByMe = false;
		});

		_this.optionClear.click(function(e) {
			if (_this.options.valueSetting) {
				var _valueSetting = _this.options.valueSetting;
				if (null != _valueSetting.defaultVal && undefined != _valueSetting.defaultVal) {
					_this.options.element.val(_valueSetting.defaultVal);
				}
			} else {
				_this.options.element.val('');
			}
		});

		_this.optionPanel.click(function(e) {
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

	$.widget("orientsec.selectbox", {
		options : {
			optionData : null,
			width : 160,
			valueSetting : null,
			supportPinYin : false,
			select : null
		},
		_create : function() {
			new SelectBox($.extend({}, this.options, {
				element : this.element
			}));
		}
	});
}(jQuery));