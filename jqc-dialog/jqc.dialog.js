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

    function renderDialog(dialog) {
        dialog.title = $('<span class="jqcDialogTitle">');
        dialog.closeBtn = $('<span class="jqcDialogCloseBtn" title="close">');
        dialog.minimizeBtn = $('<span class="jqcDialogMinimizeBtn" title="minimize">');

        dialog.titleBar = $('<div class="jqcDialogTitleBar">');
        dialog.titleBar.append(dialog.title).append(dialog.closeBtn).append(dialog.minimizeBtn);

        dialog.content = $('<div class="jqcDialogContent">');

        // dialog.resizeHandleS = $('<div class="jqcDialogResizeHandleS" title="resize">');
        // dialog.resizeHandleE = $('<div class="jqcDialogResizeHandleE" title="resize">');
        // dialog.resizeHandleSE = $('<div class="jqcDialogResizeHandleSE" title="resize">');

        dialog.container = $('<div class="jqcDialogContainer" style="display:none;">');
        dialog.container.append(dialog.titleBar).append(dialog.content).append(dialog.resizeHandleS).appendTo('body');
    }

    function bindEventForDialog(dialog) {
        dialog.closeBtn.on('click', function (e) {
            dialog.close();
        });

        dialog.minimizeBtn.on('click', function (e) {
            dialog.minimize();
        });

        new $.jqcDraggable({
            dragHandler: dialog.titleBar,
            movableBox: dialog.container
        });
    }

    function renderBiz(dialog) {
        dialog.title.html(dialog.options.title);
        dialog.container.width(dialog.options.width);
        dialog.content.html(dialog.options.content);
    }

    var DIALOG_DEFAULT_OPTIONS = {
        modal: true, // is it a modal box. Default is true
        width: 680,
        content: null, // content that appended to dialog
        title: null, // dialog title
        beforeClose: null, // callback before dialog close
        afterClose: null, // callback after dialog close
        beforeOpen: null, // callback before dialog open
        afterOpen: null // callback after dialog open
    };
    const DIALOG_CACHE = [];

    $.jqcDialog = function (param) {
        var that = DIALOG_CACHE.pop();
        if (!that) {
            if (arguments.length > 0) {
                $.jqcBaseElement.apply(this, arguments);
            }

            var that = this;
            that.options = $.extend(true, {}, DIALOG_DEFAULT_OPTIONS, param);
            renderDialog(that);
            bindEventForDialog(that);
        }
        renderBiz(that);
    };

    $.jqcDialog.prototype = new $.jqcBaseElement();
    $.jqcDialog.prototype.constructor = $.jqcDialog;

    $.jqcDialog.prototype.open = function (param) {
        var that = this;
        that.show();
    };

    $.jqcDialog.prototype.show = function (param) {
        var that = this;
        that.container.show();
    };

    $.jqcDialog.prototype.close = function (param) {
        var that = this;
        if (that.options.beforeClose) {
            that.options.beforeClose();
        }
        that.hide();
        if (that.options.afterClose) {
            that.options.afterClose();
        }

    };

    $.jqcDialog.prototype.hide = function (param) {
        var that = this;
        that.container.hide();
    };

    $.jqcDialog.prototype.minimize = function (param) {
        var that = this;
        that.container.hide();
    };
}(jQuery));