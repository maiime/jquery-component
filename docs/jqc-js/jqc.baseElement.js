(function ($) {
    $.jqcBaseElement = function () {
        this.typeName = null;
        this.elementId = null;
        this.currentVal = null;
    }

    $.jqcBaseElement.JQC_ELEMENT_ID = "jqcElementId";
    $.jqcBaseElement.JQC_ELEMENT_TYPE = "jqcElementType";

    $.jqcBaseElement.prototype.getJqcTypeName = function () {
        return this.typeName;
    };

    $.jqcBaseElement.prototype.getJqcElementId = function () {
        return this.elementId;
    };

    $.jqcBaseElement.prototype.getCurrentVal = function () {
        return this.currentVal;
    };

    $.jqcBaseElement.prototype.updateCurrentVal = function (val) {
        this.currentVal = val;

        return this.currentVal;
    };
}(jQuery));