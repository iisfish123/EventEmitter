/**
 author:weber yang
 2015.7.31
 浏览器端模拟EventEmitter的实现，拓展了部分功能，添加了定制实践促发的次数的功能，
 使用方式和其他的EventEmiiter类似。
 **/
;(function (window, undefined) {
    'use strict';
    /*构造函数*/
    var EventEmitter = function() {
        this.events = {};//保存事务，存储结构为{'eventName1':[{listener:function触发的函数, time:触发的次数}], 'eventName2':[],}
    };

    EventEmitter.prototype.once = function(evt, listener) {
        return this.addListener(evt, listener, 0);
    };
    /*获取所有的事务*/
    EventEmitter.prototype.getEvents = function() {
        return this.events || (this.events = {});
    }
    /*获取某个实践的所有触发函数*/
    EventEmitter.prototype.getListeners = function(evt) {
        var events = this.getEvents();
        return events[evt] || (events[evt] = []);
    };
    /**
     注册实践触发函数
     evet:事件名称
     listener:事件监听函数
     time:可选，选择可以触发的次数，-1表示无数次，默认为-1
     **/
    EventEmitter.prototype.on = function(evt, listener, time) {
        time = typeof(time) == 'number' ? time : -1;
        time = time >= -1 ? time : -1;
        var listeners = this.getListeners(evt);
        var listenerWrapper = {
            listener:listener,
            time:time,
        };
        listeners.push(listenerWrapper);

        return this;
    };
    /*addListener 和on 同义 */
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    /*移除事件的所有监听函数*/
    EventEmitter.prototype.off = function(evt) {
        var events = this.getEvents();
        events[evt] = [];
    };
    EventEmitter.prototype.removeEvent = EventEmitter.prototype.off;

    /**
     会删除同一事件中的所有listener
     **/
    EventEmitter.prototype.removeListener = function(evt, listener) {
        var listeners = this.getListeners(evt);
        for(var i=0; i<listeners.length; i++) {
            if(listeners[i].listener == listener) {
                delete listeners[i];
            }
        }
    };
    /**
     触发事件
     **/
    EventEmitter.prototype.trigger = function(evt, args) {
        var listeners = this.getListeners(evt);
        for(var i=0; i<listeners.length; i++){
            var listener = listeners[i];
            if(listener.time != -1) {
                listener.time--;
            }
            if (listener.time == 0) {
                this.removeListener(evt, listener.listener);//可以同步或异步执行
            }
            listener.listener.apply(this, args || []);
        }
    };
    EventEmitter.prototype.fire = EventEmitter.prototype.trigger;
    /**
     触发事件
     **/
    EventEmitter.prototype.emit = function(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.trigger(evt, args);
    };

    EventEmitter.inherit = function(target) {

        if(typeof(target.prototype) == 'undefined') {
            throw 'target:' + target + 'must have prototype';
        }
        var souPto = EventEmitter.prototype;
        var tarPto = target.prototype;
        for(var key in souPto) {
            tarPto[key] = souPto[key];
        }
        return target;
    };

    window.EventEmitter = EventEmitter;

})(window);