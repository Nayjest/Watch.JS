/**
 * DEVELOPED BY
 * GIL LOPES BUENO
 * gilbueno.mail@gmail.com
 *
 * WORKS WITH:
 * IE 9+, FF 4+, SF 5+, WebKit, CH 7+, OP 12+, BESEN, Rhino 1.7+
 *
 * FORK:
 * https://github.com/melanke/Watch.JS
 */

/**
 *  Watch.JS is a small library that brings a lot of possibilities.
 *  You may know that the "Observer" design pattern involves executing some function when an observed object changes.
 *  Other libraries exist that do this, but with Watch.JS you will not have to change the way you develop.
 *  Take a look at the examples to see how simple it is to add Watch.JS to your code.
 *
 *  @module WatchJS
 *  @class WatchJS
 *  @static
 */
"use strict";
(function (factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        window.WatchJS = factory();
    }
}(function () {
    var WatchJS = {

        noMore:false,

        isFunction:function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        },
        isInt:function (x) {
            return x % 1 === 0;
        },
        isArray:function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },

        /**
         * @method defineGetAndSet
         * @static
         *
         * @param {Object} obj
         * @param {String} propName
         * @param {Function} getter
         * @param {Function} setter
         */
        defineGetAndSet:function (obj, propName, getter, setter) {
            try {
                Object.defineProperty(obj, propName, {
                    get:getter,
                    set:setter,
                    enumerable:true,
                    configurable:true
                });
            } catch (error) {
                try {
                    Object.prototype.__defineGetter__.call(obj, propName, getter);
                    Object.prototype.__defineSetter__.call(obj, propName, setter);
                } catch (error2) {
                    throw "watchJS error: browser not supported :/";
                }
            }
        },
        /**
         * @method defineProp
         * @static
         *
         * @param {Object} obj
         * @param {String} propName
         * @param value
         */
        defineProp:function (obj, propName, value) {
            try {
                Object.defineProperty(obj, propName, {
                    enumerable:false,
                    configurable:true,
                    writable:false,
                    value:value
                });
            } catch (error) {
                obj[propName] = value;
            }
        }
    };

    WatchJS.defineProp(Object.prototype, "watch", function () {

        if (arguments.length === 1) {
            this.watchAll.apply(this, arguments);
        } else if (WatchJS.isArray(arguments[0])) {
            this.watchMany.apply(this, arguments);
        } else {
            this.watchOne.apply(this, arguments);
        }

    });


    WatchJS.defineProp(Object.prototype, "watchAll", function (watcher) {

        var obj = this;

        if (obj instanceof String || (!(obj instanceof Object) && !WatchJS.isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        var props = [];

        if (WatchJS.isArray(obj)) {
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
        } else {
            for (var prop2 in obj) { //for each attribute if obj is an object
                props.push(prop2); //put in the props
            }
        }

        obj.watchMany(props, watcher); //watch all itens of the props
    });

    WatchJS.defineProp(Object.prototype, "watchMany", function (props, watcher) {
        var obj = this;

        if (WatchJS.isArray(obj)) {
            for (var prop in props) { //watch each iten of "props" if is an array
                obj.watchOne(props[prop], watcher);
            }
        } else {
            for (var prop2 in props) { //watch each attribute of "props" if is an object
                obj.watchOne(props[prop2], watcher);
            }
        }
    });

    WatchJS.defineProp(Object.prototype, "watchOne", function (prop, watcher) {
        var obj = this;

        var val = obj[prop];

        if (obj[prop] === undefined || WatchJS.isFunction(obj[prop])) { //dont watch if it is null or a function
            return;
        }

        if (obj[prop] != null) {
            obj[prop].watchAll(watcher); //recursively watch all attributes of this
        }

        obj.watchFunctions(prop);

        if (!obj.watchers) {
            WatchJS.defineProp(obj, "watchers", {});
        }

        if (!obj.watchers[prop]) {
            obj.watchers[prop] = [];
        }

        obj.watchers[prop].push(watcher); //add the new watcher in the watchers array

        var getter = function () {
            return val;
        };

        var setter = function (newval) {
            var oldval = val;
            val = newval;

            if (obj[prop]) {
                obj[prop].watchAll(watcher);
            }

            obj.watchFunctions(prop);

            if (JSON.stringify(oldval) !== JSON.stringify(newval)) {
                if (!WatchJS.noMore) {
                    obj.callWatchers(prop, newval, oldval);
                    WatchJS.noMore = false;
                }
            }
        };

        WatchJS.defineGetAndSet(obj, prop, getter, setter);
    });

    WatchJS.defineProp(Object.prototype, "unwatch", function () {

        if (arguments.length === 1) {
            this.unwatchAll.apply(this, arguments);
        } else if (WatchJS.isArray(arguments[0])) {
            this.unwatchMany.apply(this, arguments);
        } else {
            this.unwatchOne.apply(this, arguments);
        }

    });

    WatchJS.defineProp(Object.prototype, "unwatchAll", function (watcher) {

        var obj = this;

        if (obj instanceof String || (!(obj instanceof Object) && !WatchJS.isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        var props = [];

        if (WatchJS.isArray(obj)) {
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
        } else {
            for (var prop2 in obj) { //for each attribute if obj is an object
                props.push(prop2); //put in the props
            }
        }

        obj.unwatchMany(props, watcher); //watch all itens of the props
    });


    WatchJS.defineProp(Object.prototype, "unwatchMany", function (props, watcher) {
        var obj = this;

        if (WatchJS.isArray(obj)) {
            for (var prop in props) { //watch each iten of "props" if is an array
                obj.unwatchOne(props[prop], watcher);
            }
        } else {
            for (var prop2 in props) { //watch each attribute of "props" if is an object
                obj.unwatchOne(props[prop2], watcher);
            }
        }
    });

    WatchJS.defineProp(Object.prototype, "unwatchOne", function (prop, watcher) {
        for (var i in this.watchers[prop]) {
            var w = this.watchers[prop][i];

            if (w === watcher) {
                this.watchers[prop].splice(i, 1);
            }
        }
    });

    WatchJS.defineProp(Object.prototype, "callWatchers", function (prop, newval, oldval) {
        var obj = this;

        for (var wr in obj.watchers[prop]) {
            if (WatchJS.isInt(wr)) {
                obj.watchers[prop][wr](prop, newval, oldval);
            }
        }
    });

    // @todo code related to "watchFunctions" is certainly buggy
    var methodNames = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift'];
    var defineArrayMethodWatcher = function(obj, prop, original, methodName) {
        WatchJS.defineProp(obj[prop], methodName, function () {
            var response = original.apply(this, arguments);
            obj.watchOne(obj[prop]);
            if (methodName !== 'slice') {
                obj.callWatchers(prop);
            }
            return response;
        });
    };

    WatchJS.defineProp(Object.prototype, "watchFunctions", function (prop) {
        var obj = this;

        if ((!obj[prop]) || (obj[prop] instanceof String) || (!WatchJS.isArray(obj[prop]))) {
            return;
        }

        for (var i = methodNames.length, methodName; i--;) {
            methodName = methodNames[i];
            defineArrayMethodWatcher(obj, prop, obj[prop][methodName], methodName);
        }

    });

    return WatchJS;

}));