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
 * enable dom node draggable function
 * 
 * Dependent on
 *  + jqc.location.js
 */
(function ($) {
    if (undefined == $.location) {
        throw new Error("Need library : jqc.location.js");
    }

    $.jqcDraggable = function (param) {
        var defaultOptions = {
            dragHandler: null, // the drag handler
            movableBox: null // move box when drag
        };
        var that = this;
        that.options = $.extend(true, {}, defaultOptions, param);

        var readyToDrag = false;
        that.options.dragHandler.mousedown(function (e) {
            console.log('mousedown to true');
            readyToDrag = true;
        });
        that.options.dragHandler.on('mouseup mouseenter', function () {
            console.log('mouseup');
            if (readyToDrag) {
                console.log('mouseup to false');
                readyToDrag = false;
            }
        });
        that.options.dragHandler.mousemove(function (e) {
            if (readyToDrag) {
                that.options.movableBox.css('top', e.pageY - that.options.dragHandler.outerHeight() / 2);
                that.options.movableBox.css('left', e.pageX - that.options.dragHandler.outerWidth() / 2);
            }
        });
    };
}(jQuery));
//http://www.cnblogs.com/NNUF/archive/2012/04/02/2430132.html
//https://javascript.info/mouse-drag-and-drop