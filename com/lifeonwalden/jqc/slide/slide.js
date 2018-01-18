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
 * slideshow
 * 
 */
(function ($) {
    $JqcLoader.importComponents('com.lifeonwalden.jqc', ['baseElement', 'uniqueKey'])
        .importCss($JqcLoader.getCmpParentURL('com.lifeonwalden.jqc', 'slide').concat('css/slide.css'))
        .execute(function () {
            var DEFAULT_OPTIONS = {
                slides: null, // slide set
                mode: 'fade', // fade, horizontal, vertical
                switchSpeed: 400, // speed
                switchGap: 5000, // switch gap time
                container: null, // container
                mask: null
            };
            $.jqcSlide = function (param) {
                if (arguments.length > 0) {
                    $.jqcBaseElement.apply(this, arguments);
                }
                this.options = $.extend(true, {}, DEFAULT_OPTIONS, param);

                this.el = this.options.container; // the jquery element for the target document node
                this.el.addClass('jqcSlideContainer');
                this.typeName = 'jqcSlide';
                this.elementId = 'jqc'.concat($.jqcUniqueKey.fetchIntradayKey());
                this.el.attr($.jqcBaseElement.JQC_ELEMENT_TYPE, this.typeName);
                this.el.attr($.jqcBaseElement.JQC_ELEMENT_ID, this.elementId);

                setup(this);
            };

            function setup(that) {
                if (that.options.mask) {
                    that.options.mask.addClass('jqcSlideMask');
                }
                var slides = that.options.slides;
                for (var i in slides) {
                    var slide = slides[i];
                    if (slide.type == 'img') {
                        that.el.append($('<img src="'.concat(slide.url).concat('">')));
                    }
                }
            }

            $.jqcSlide.prototype = new $.jqcBaseElement();
            $.jqcSlide.prototype.constructor = $.jqcSlide;

            superDestroy = $.jqcSlide.prototype.destroy;
            $.jqcSlide.prototype.destroy = function () {
                superDestroy.apply(this);
                this.container.remove();
            };
        });
}(jQuery));