/**
 * client site cache component
 * 
 * Dependent on
 *  + jqc.dateUtil.js
 */
(function ($) {
    const ExistCache = new Map();
    const DEFAULT_OPTIONS = {
        name: null, // cache name, has to be unique in the same domain
        init: {
            immediate: false, // setup the cache immediatelly
            data: null, // object array to initial cache
            url: null // if not provide object array as above, fetch data through url
        },
        patchUrl: null, // patch new data into cache through common or special patchUrl
        localstorage: {
            delay: 1000, // data be pushed to local database in delay time
            expiryTime: false, // data is or not expiry in data, if it will be expiry, how long will be valid
            refreshUrl: null, // when a data is expiry, refresh data through refreshUrl
            primaryKey: null, // primary key for data
            enable: false // enable local storage
        }
    };
    const DB_NAME = 'jqcCacheDatabase';
    const DB_DATA_EXPIRY_TIMESTAMP = '__expiryTimestamp__';

    $.jqcCache = function (options) {
        this.options = $.extend(true, DEFAULT_OPTIONS, options);
        this.data = [];
        this.initialled = false;

        if ($.trim(this.options.name).length == 0) {
            throw new Error("cache name cann't be null");
        }
        if (ExistCache.has(this.options.name)) {
            throw new Error('duplicate cache :'.concat(this.options.name));
        } else {
            ExistCache.set(this.options.name, 0);
        }

        if (this.options.immediate) {
            init(this);
        }
    };

    $.jqcCache.prototype.build = function (options) {
        var _this = this;
        var cache = null;

        if ('string' == typeof (param)) {
            cache = new CacheMap({
                context: _this
            });
            for (var i in _this.data) {
                var data = _this.data[i];
                cache.set(data[param], data);
            }
        } else if ('function' == typeof (param)) {
            cache = new CacheMap({
                context: _this
            });
            for (var i in _this.data) {
                var data = _this.data[i];
                cache.set(param.call(_this, data), data);
            }
        } else if ('object' == typeof (param)) {
            cache = new CacheMap({
                context: _this,
                packData: param.packParam
            });
            for (var i in _this.data) {
                var data = _this.data[i];
                var key = param.packKey;
                if ('string' == typeof (key)) {
                    cache.set(data[key], data);
                } else if ('function' == typeof (key)) {
                    cache.set(key.call(_this, data), data);
                }
            }
        }

        return cache;
    };

    $.jqcCache.prototype.isInitialled = function () {
        return this.unfinishedInit == false;
    };

    $.jqcCache.prototype.queryAll = function () {
        return this.data;
    };

    function init(context) {
        var data = context.options.init.data;
        if ($.isArray(data)) {
            context.data = data;
            context.initialled = true;
        } else if ($.trim(url).length > 0) {

        } else {
            return;
        }

        if (context.localstorage.enable) {
            setTimeout(function () {
                updateStore(context.options.name, context.localstorage.primaryKey, context.data);
            }, context.localstorage.delay);
        }
    }

    function updateStore(name, primaryKey, data, expiryTime) {
        var req = indexedDB.open(DB_NAME);
        req.onsuccess = function (event) {
            var db = event.target.result;
            if (db.objectStoreNames.contains(name)) {
                pushDataToDB(db, name, data, expiryTime);
            } else {
                var version = db.version;
                db.close();
                req = indexedDB.open(DB_NAME, parseInt(version) + 1);
                req.onupgradeneeded = function (event) {
                    db = event.target.result;
                    var objectStore = db.createObjectStore(name, {
                        keyPath: primaryKey
                    });
                    objectStore.transaction.oncomplete = function (event) {
                        pushDataToDB(db, name, data, expiryTime);
                    };
                };
            }
        };
    }

    function pushDataToDB(db, name, data, expiryTime) {
        var newExpiryTimestamp = 0;
        if (typeof (expiryTime) == 'string') {
            newExpiryTimestamp = $.jqcDateUtil.plus(new Date(), expiryTime, true);
        }

        var transaction = db.transaction(name, 'readwrite');
        if ($.isArray(data)) {
            var objectStore = transaction.objectStore(name);
            if (newExpiryTimestamp > 0) {
                for (var i in data) {
                    var _data = data[i];
                    _data[DB_DATA_EXPIRY_TIMESTAMP] = newExpiryTimestamp;
                    objectStore.add(_data);
                }
            } else {
                for (var i in data) {
                    objectStore.add(data[i]);
                }
            }
        } else {
            if (newExpiryTimestamp > 0) {
                data[DB_DATA_EXPIRY_TIMESTAMP] = newExpiryTimestamp;
            }
            transaction.objectStore(name).add(data);
        }
    }
}(jQuery));