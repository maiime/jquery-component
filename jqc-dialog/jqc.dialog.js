/*
   Copyright 2017 cmanlh

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
/**
 * dialog
 * 
 * Dependent on
 *  + jqc.baseElement.js
 *  + jqc.uniqueKey.js
 *  + jqc.draggable.js
 */
(function ($) {
    if (undefined == $.jqcBaseElement || undefined == $.jqcUniqueKey || undefined == $.jqcDraggable) {
        throw new Error("Need library : jqc.baseElement.js,jqc.uniqueKey.js,jqc.draggable.js");
    }

    function DialogDom(param) {
        var defaultOptions = {
            modal: true // is it a modal box. Default is true
        };
        var that = this;

        that.title = $('<span class="jqcDialogTitle">');
        that.closeBtn = $('<span class="jqcDialogCloseBtn">');
        that.minimizeBtn = $('<span class="jqcDialogMinimizeBtn">');

        that.titleBar = $('<div class="jqcDialogTitleBar">');
        that.titleBar.append(that.title).append(that.closeBtn).append(that.minimizeBtn);

        that.content = $('<div class="jqcDialogContent">');

        that.resizeHandleS = $('<div class="jqcDialogResizeHandleS">');
        that.resizeHandleE = $('<div class="jqcDialogResizeHandleE">');
        that.resizeHandleSE = $('<div class="jqcDialogResizeHandleSE">');

        that.container = $('<div class="jqcDialogContainer" style="display:none;">');
        that.container.append(that.titleBar).append(that.content).append(that.resizeHandleS).append(that.resizeHandleE).append(that.resizeHandleSE).appendTo('body');

        bindEventForDialogDom(that);
    }

    DialogDom.prototype.show = function () {
        var that = this;
        that.container.show();
    };

    DialogDom.prototype.close = function () {
        var that = this;

    };

    DialogDom.prototype.minimize = function () {
        var that = this;
        that.hide();
    };

    DialogDom.prototype.hide = function () {
        var that = this;
        that.container.hide();
    };

    function bindEventForDialogDom(dom) {
        dom.closeBtn.on('click', function (e) {
            dom.close();
        });

        dom.minimizeBtn.on('click', function (e) {
            dom.minimize();
        });

        new $.jqcDraggable({
            dragHandler: dom.titleBar,
            movableBox: dom.container
        });
    }

    $.jqcDialog = function (param) {
        var defaultOptions = {
            element: null, // the jquery element for the target input,
            decimals: 0 // the number of decimal
        };
        if (arguments.length > 0) {
            $.jqcBaseElement.apply(this, arguments);
        }

        var that = this;
        that.options = $.extend(true, {}, defaultOptions, param);
        that.dom = new DialogDom();
    };

    $.jqcDialog.prototype = new $.jqcBaseElement();
    $.jqcDialog.prototype.constructor = $.jqcDialog;

    $.jqcDialog.prototype.show = function (param) {
        var that = this;
        that.dom.show();
    };

    $.jqcDialog.prototype.close = function (param) {

    };

    $.jqcDialog.prototype.hide = function (param) {
        var that = this;
        that.dom.hide();
    };
}(jQuery));