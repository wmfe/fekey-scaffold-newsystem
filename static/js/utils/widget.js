/**
 * @fileoverview  window.Widget是组件基类
 * window.Widget是基类的构造函数，有一个静态方法extend用于扩展组件，extend方法返回组件构造函数，window.Widget形如：
 * window.Widget = function(pageName) {
 * 		_init(pageName);
 * }
 * window.Widget.extend = function() {}
 * @author xiaole@baidu.com
 * @date 2013/1/25
 */
window.Widget = (function() {
    var bindBrowserEventArray = [],
        bindChannelEventArray = [];
    var _init = function(pageName) {
        var self = this;
        self.$el = $(self.el);
        _paeseDOM.call(self);
        if (self.init && $.isFunction(self.init)) {
            self.init(pageName);
        }
        _bind.call(self);
    };
    //TO-DO
    var _paeseDOM = function() {
        var self = this;
        self.$dom = {};
        var html = self.$el.html() || '';
        var selectors = html.match(/data-node="([^"]*)"/img) || [];
        var item, key;
        for (var i = selectors.length - 1; i >= 0; i--) {
            item = selectors[i];
            key = item.split('=')[1].replace(/"/g, '');
            self.$dom[key] = self.$el.find('[' + item + ']');
        };
    };
    var _bind = function() {
        var self = this;
        var events = self.events,
            channels = self.channels;
        var bindEventSplitter = /^(\S+)\s*(.*)$/;
        var eventName, selector, channelName, match;
        if (events && events instanceof Object) {
            $.each(events, function(key, method) {
                if (!$.isFunction(method)) {
                    method = self[method];
                }
                if (!method) {
                    return true; //true类似continue,false类似break
                }
                match = key.match(bindEventSplitter);
                eventName = match[1];
                selector = match[2];
                _bindBrowserEvent.call(self, eventName, selector, method);
            });
        }
        if (channels && channels instanceof Object) {
            $.each(channels, function(key, method) {
                if (!$.isFunction(method)) {
                    method = self[method];
                }
                if (!method) {
                    return true; //true类似continue,false类似break
                }
                match = key.match(bindEventSplitter);
                channelName = match[1];
                eventName = match[2];
                _bindCustomerEvent.call(self, channelName, eventName, method);
            });
        }
        listener.once('common.page', 'pagearrived', $.proxy(_destroy, self));
    };
    /**
     * 浏览器事件绑定
     * @param  {String} eventName 事件名，如click等
     * @param  {String} selector  出发事件的元素
     * @param  {function} method  事件处理函数
     */
    var _bindBrowserEvent = function(eventName, selector, method) {
        var self = this;
        var el = self.el || 'body';
        if (selector) {
            $(el).on(eventName, selector, $.proxy(method, self));
        } else {
            $(el).on(eventName, $.proxy(method, self));
        }
        bindBrowserEventArray.push([eventName, selector, method]);
    };
    /**
     * 绑定广播事件
     * @param  {string} eventName 事件触发的频道，如common.page
     * @param  {string} selector  自定义事件名称，如switchstart等
     * @param  {function} method  事件处理函数
     */
    var _bindCustomerEvent = function(channelName, eventName, method) {
        listener.on(channelName, eventName, $.proxy(method, this));
        bindChannelEventArray.push([channelName, eventName, method]);
    };
    /**
     * 解绑浏览器事件
     */
    var _unbindBrowserEvent = function(eventName, selector, method) {
        var self = this;
        var el = self.el || 'body';
        if (selector) {
            $(el).off(eventName, selector, method);
        } else {
            $(el).off(eventName, method);
        }
    };
    /**
     * 解绑广播事件
     */
    var _unbindChannelEvent = function(channelName, eventName, method) {
        listener.off(channelName, eventName, method);
    };
    /**
     * 切页后的处理，包括调用组件自定义destroy方法,解绑事件，解除引用，利于垃圾回收
     */
    var _destroy = function() {
        var self = this;
        if (self.destroy && $.isFunction(self.destroy)) {
            self.destroy();
            self.destroy = null;
        }
        $.each(bindBrowserEventArray, function(index, arr) {
            _unbindBrowserEvent.call(this, arr[0], arr[1], arr[2]);
        });
        $.each(bindChannelEventArray, function(index, arr) {
            _unbindChannelEvent.call(this, arr[0], arr[1], arr[2]);
        });
        bindBrowserEventArray = [];
        bindChannelEventArray = [];
        self.el = undefined;
    };

    function Widget(pageName) {
        _init.call(this, pageName);
    }
    Widget.prototype._io=function(data,url,type){
        var me=this,
            dfd=$.Deferred();

        if($.isPlainObject(data) && url){
            $.ajax({
                url:url,
                data:data,
                type:type,
                dataType:"json",
                success:function(result){
                    if(result.errno==0){
                        dfd.resolve(result.data);
                    }
                    else{
                        dfd.reject(result.errmsg || "操作失败");
                    }
                },
                error:function(){
                    dfd.reject("操作失败");
                }
            });
        }

        return dfd;
    },
    /**
     * 根据传进来的对象实例扩展组件基类，会返回child而不是Widget是因为如果在Widget基类上直接扩展，多个组件会相互影响
     * @param  {Object} obj 组件对象实例
     * @return {function}  扩展Widget基类后的组件构造函数
     */
    Widget.extend = function(obj) {
        var parent = this;
        var child = function() {
            return parent.apply(this, arguments);
        };
        var Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
        child.super = parent.prototype;
        Surrogate = null;
        $.extend(child.prototype, obj);
        child.createWidget = function(pageName) {
            return new child(pageName);
        }
        child.extend = Widget.extend;
        return child;
    };
    return Widget;
})();