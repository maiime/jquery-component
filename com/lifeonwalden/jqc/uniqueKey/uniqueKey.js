/**
 * A tool to generate unique key
 */
(function ($) {
    const DAY_MILLISECONDS_SIZE = 9;
    const RANDOM_NUMBER_SIZE = 11;
    $.jqcUniqueKey = {
        /**
         * not a critical unique key generator, don't use it for global business key requirments
         * In a single application and an intraday business, only 1~2 duplicate key in 100*6000000 times
         */
        fetchIntradayKey: function () {
            var key = ''.concat(Date.now()).substr(4);
            key = key.concat(''.concat(Math.random()).substr(2, RANDOM_NUMBER_SIZE));
            return key;
        }
    };
}(jQuery));