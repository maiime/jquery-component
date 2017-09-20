/**
 * format utility
 */
(function ($) {
    $.jqcFormat = {
        /**
         * the first version excellent number formatting method from locutus.io
         * http://locutus.io/php/strings/number_format/
         */
        number: function (_number, decimals, decPoint, thousandsSep) {
            _number = (_number + '').replace(/[^0-9+\-Ee.]/g, '')
            var n = !isFinite(+_number) ? 0 : +_number
            var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
            var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
            var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
            var s = ''
            var toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec)
                return '' + (Math.round(n * k) / k)
                    .toFixed(prec)
            }
            // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || ''
                s[1] += new Array(prec - s[1].length + 1).join('0')
            }
            return s.join(dec)
        }
    };
}(jQuery));