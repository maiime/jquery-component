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
 */
(function ($) {
    if (undefined == $.jqcBaseElement || undefined == $.jqcUniqueKey) {
        throw new Error("Need library : jqc.baseElement.js,jqc.uniqueKey.js");
    }

    function DialogDomGenerator(param) {
        var defaultOptions = {
            modal: true // is it a modal box. Default is true
        };
        this.container = $('<div class="jqcDialogContainer" style="display:none;>');
        this.titleBar = $('<div class="jqcDialogTitleBar">');
        this.title = $('<span class="jqcDialogTitle">');
        this.closeBtn = $('<span class="jqcDialogCloseBtn">');
        this.minimunBtn = $('<span class="jqcDialogMinimunBtn">');
    }

    $.jqcDialog = function (param) {
        var defaultOptions = {
            element: null, // the jquery element for the target input,
            decimals: 0 // the number of decimal
        };
        if (arguments.length > 0) {
            $.jqcBaseElement.apply(this, arguments);
        }
        this.options = $.extend(true, {}, defaultOptions, param);
    }

    $.jqcDialog.prototype = new $.jqcBaseElement();
    $.jqcDialog.prototype.constructor = $.jqcDialog;
}(jQuery));