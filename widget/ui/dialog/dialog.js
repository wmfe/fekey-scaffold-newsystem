var DIALOG_TMPL = __inline("./dialog.tmpl");

var BaseWidget = require("nerve_common:static/js/utils/base-widget.js");

var TRUE = true,
    FALSE = false,
    ALERT_MODAL_CLS = "alert-modal",
    CONFIRM_MODAL_CLS = "confirm-modal",
    DIALOG_MODAL_CLS = "dialog-modal",
    DISABLED_CLS = "disabled";

var DEFAULT_CONFIG = {
    backdrop: FALSE,
    keyboard: FALSE,
    fade: TRUE,
    modalSize: "modal-sm" //可选值：modal-lg，modal-sm
}

var Dialog = BaseWidget.extend({
    initialize: function(config) {
        var me = this,
            $el;

        config = $.extend({}, DEFAULT_CONFIG, config);

        Dialog.superclass.initialize.call(this, config);

        me.okCallback = $.noop;
        me.cancelCallback = $.noop;

        me.render("body");

        me._bindEvent();
    },
    _bindEvent: function() {
        var me = this,
            clickEventType = "click";

        me.$okBtn.on(clickEventType, $.proxy(me._onOk, me));
        me.$cancelBtn.on(clickEventType, $.proxy(me._onCancel, me));
        me.$closeBtn.on(clickEventType, $.proxy(me._onCancel, me));
        // me.$el.on("hide.bs.modal", function(e) {
        // 	me.hide(TRUE);
        // });
    },
    _onOk: function(e) {
        var me = this,
            eventFacade = {
                preventHide: FALSE
            };

        if ($.isFunction(me.okCallback)) {
            me.okCallback(eventFacade);
        }

        if (!eventFacade.preventHide) {
            me.hide();
        }
    },
    _onCancel: function(e) {
        var me = this,
            eventFacade = {
                preventHide: FALSE
            };

        if ($.isFunction(me.cancelCallback)) {
            me.cancelCallback(eventFacade);
        }

        if (!eventFacade.preventHide) {
            me.hide();
        }
    },
    /**
     * @override
     * @param  {jQuery}     wrap    容器
     */
    render: function(wrap) {
        var me = this;

        me._renderHTML = DIALOG_TMPL({
            backdrop: me.get("backdrop"),
            keyboard: me.get("keyboard"),
            modalSize: me.get("modalSize"),
            fade: me.get("fade")
        });

        Dialog.superclass.render.call(me, wrap);

        //复制一份引用的目的是为了向前兼容（其他代码中已存在对$header、$body等属性的引用）
        me.$header = me.$dom.modalTitle;
        me.$body = me.$dom.modalBody;
        me.$footer = me.$dom.modalFooter;
        me.$okBtn = me.$dom.okBtn;
        me.$cancelBtn = me.$dom.cancelBtn;
        me.$closeBtn = me.$dom.closeBtn;
    },
    /**
     * 显示“确认弹框”效果
     *
     * @param innerHTML {string} 弹框内容
     * @param okCallback {Function} 确认回调
     * 回调函数接收一个参数
     * {
     *	preventHide:true|false   //是否取消弹框的隐藏
     * }
     * @param cancelCallback {Function} 取消回调，接收一个参数
     * @return instance
     */
    confirm: function(innerHTML, okCallback, cancelCallback) {
        var me = this;

        me.$el.removeClass(ALERT_MODAL_CLS).removeClass(DIALOG_MODAL_CLS).addClass(CONFIRM_MODAL_CLS);
        me.$body.empty();
        me.$body.html(innerHTML);
        me.show();
        me.okCallback = okCallback;
        me.cancelCallback = cancelCallback;

        return me;
    },
    /**
     * 弹框显示
     *
     * @param innerHTML {string} 弹框显示内容
     * @param okCallback {Function} 点击确定后的回调，回调函数接收一个参数
     * 回调函数包含一个参数，参数内容为：
     * {
     *	preventHide:true|false   //true表示取消隐藏弹框行为
     * }
     * @return instance
     */
    alert: function(innerHTML, okCallback) {
        var me = this;

        me.$el.removeClass(CONFIRM_MODAL_CLS).removeClass(DIALOG_MODAL_CLS).addClass(ALERT_MODAL_CLS);
        me.$body.empty();
        me.$body.html(innerHTML);
        me.show();

        me.okCallback = okCallback;

        return me;
    },
    dialog: function(title, content, okCallback, cancelCallback) {
        var me = this
        title = title || "提示";

        me.$el.removeClass(CONFIRM_MODAL_CLS).removeClass(ALERT_MODAL_CLS).addClass(DIALOG_MODAL_CLS);
        me.$header.empty();
        me.$body.empty();
        me.$header.html(title);
        me.$body.html(content);
        me.show();
        me.okCallback = okCallback;
        me.cancelCallback = cancelCallback;

        return me;
    },
    /**
     * 显示弹框
     * @chainable
     */
    show: function() {
        var me = this;

        /**
         * 在启用动画隐藏时，bootstrap内部在动画完成前已经将内部标识isShown改为了false
         * 如果在隐藏动画进行中时又执行了一次dialog的show会导致isShown置为true，但隐藏动画完成后会将DOM节点隐藏
         * 此时就会出现isShown为true，但DOM节点已经隐藏的问题
         * 正确的方式应该是在DOM节点隐藏时再将isShown置为false，但需要修改bootstrap源码
         * 此处采用另外一种方式解决，每次show之前先将isShown改为false
         */
        if (me.$el.data("bs.modal")) {
            me.$el.data("bs.modal").isShown = false;
        }

        /*
         * 显示前将btn可能存在的disable状态清除
         * dialog作为一个与具体业务无关的组件，不应该处理由业务导致的btn disable
         * 但每次的show操作都可以认为是弹框的重新显示的过程，所以，移除disable状态也不为过
         * 而且这样可以减轻使用方的操作，不用在第二次show之前关注当前dialog是否被disable了
         */
        me.$okBtn.removeClass(DISABLED_CLS);
        me.$cancelBtn.removeClass(DISABLED_CLS);
        me.$el.modal("show");

        me.trigger("show");

        return me;
    },
    /**
     * 隐藏弹框
     * @passivity 	{boolean} 	为true表示由bootstrap的modal触发的hide
     * @chainable
     */
    hide: function(passivity) {
        var me = this;

        // if (!passivity) {
        me.$el.modal("hide");
        // }
        // //每次隐藏都需要重置回调
        // me.okCallback=$.noop;
        // me.cancelCallback=$.noop;

        me.trigger("hide");

        return me;
    }
});

module.exports = Dialog;