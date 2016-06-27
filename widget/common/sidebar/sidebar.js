/**
 * @file 左侧导航条
 * 
 */
var utils = require('sddp:static/js/utils/utils.js');
var Cookie = require('sddp:static/js/utils/cookie.js');
// 页面链接特征，用于高亮导航选项
// var NavLinkFeatrue = require('nav_feature_config.js');
// 貌似废弃了, edit by peng 0328

var SidebarMask = {
    elem: $('.sddp-sp-body .bottom-mask'),
    elemHeight: $('.sddp-sp-body .bottom-mask').height(),
    contentHeight: $('#widget-common-sidebar').height(),
    container: $('.sddp-sp-body .sddp-sp-nav-pannel'),
    setShowStatus: function () {
        if (this.contentHeight - this.container.scrollTop() - this.elemHeight > this.container.height()) {
            this.elem.show();
        }
        else {
            this.elem.hide();
        }
    }
};

module.exports = Widget.extend({
    el: '.sddp-sp-body',
    init: function (data) {
        this.data = data;
        window.injectedData = data;
        // console.log('====  注意: 此处将PHP灌入的数据暴露到全局，产生依赖，一定关注后端返回数据的变化，做适应！！！！！ ====');
        this.initElem();
        this.markActive();
        this.initLeftbarStyle();
        this.initEvent();
        SidebarMask.setShowStatus();
    },
    initEvent: function () {
        this.onLeftbarScroll();
        this.onResizeWindow();
        this.onScrollWindow();
        this.toggleLeftsideBar();
    },
    initElem: function () {
        this.header = this.$el.find('.sp-header');
        this.main = this.$el.find('.sddp-sp-main');
        this.left = this.$el.find('.sddp-sp-left');
        this.right = this.$el.find('.sddp-sp-right');
        this.footer = this.$el.find('.sp-footer');
        this.mask = this.$el.find('.bottom-mask');
        this.scrollElem = this.left.find('.sddp-sp-nav-pannel');
    },
    initLeftbarStyle: function () {
        // 恢复滚动位置
        this.scrollElem.scrollTop(Cookie.get('nav-leftbar-scrolltop') || 0);
        this.checkToSetLeftbarFixed();
    },
    onLeftbarScroll: function () {
        var me = this;
        me.scrollElem.bind('mousewheel DOMMouseScroll', function (e) {
            var scrollTo = null;

            if (e.type === 'mousewheel') {
                scrollTo = (e.originalEvent.wheelDelta * -1);
            }
            else if (e.type === 'DOMMouseScroll') {
                scrollTo = 40 * e.originalEvent.detail;
            }

            if (scrollTo) {
                e.preventDefault();
                $(this).scrollTop(scrollTo + $(this).scrollTop());
            }
        });

        me.scrollElem.scroll(function (e) {
            clearTimeout(me._leftbarScrollTimer);
            SidebarMask.setShowStatus();

            me._leftbarScrollTimer = setTimeout(function () {
                Cookie.set('nav-leftbar-scrolltop', me.scrollElem.scrollTop());
            }, 800);

            return false;
        });

    },
    onResizeWindow: function () {
        var me = this;
        $(window).resize(function () {
            me.initLeftbarStyle();
        // 重置窗口高度会引起边栏高度变化，需要重新检查是否需要显示底部mask
            SidebarMask.setShowStatus();
        });
    },
    isLeftbarNeedFixed: function () {
        var me = this;
        var headHeight = me.header.outerHeight();
        return $(window).scrollTop() >= headHeight;
    },
    checkToSetLeftbarFixed: function () {
        var me = this;
        if (this.isLeftbarNeedFixed()) {
            me.main.addClass('fixed');
        }
        else {
            me.main.removeClass('fixed');
        }
    },
    onScrollWindow: function () {
        var me = this;
        var headHeight = me.header.outerHeight();
        $(window).scroll(function () {
            if ($(window).scrollTop() >= headHeight) {
                if (!me.main.is('.fixed')) {
                    me.main.addClass('fixed');
                }
            }
            else {
                me.main.removeClass('fixed');
            }
        });
    },
    markActive: function () {
        var me = this;
        /*
         根据配置的特征来识别当前url对应的导航高亮项
         根据url中的qt参数，以及对应qt的配置下params特征参数是否匹配来确认
         配置中无params的，忽略params
         (这种方法维护成本很大，导航有新增链接时，需要更新配置，还很有可能影响配置中的其他选项)
         --s 暂时注释废弃，edit BY shdong 20150818  -e
         */
        // var _getActiveElemDatanode = function (qt, params) {
        //     var dataNode;
        //     var featrues = NavLinkFeatrue[qt];
        //     if (featrues) {
        //         $.each(featrues, function (index, item) {
        //             var _params = item.params;
        //             if (!_params) { // 此时忽略params
        //                 dataNode = item['data-node'];
        //                 return true;
        //             }
        //             else {
        //                 var hint = parseSecondParams(_params);
        //                 if (hint) {
        //                     dataNode = item['data-node'];
        //                     // return true;
        //                     return false;
        //                 }
        //             }
        //         });
        //     }
        //     return dataNode;
        //     // 匹配多参状况
        //     // 并且多参数状况必须同时满足条件
        //     function parseSecondParams(_params) {
        //         var urlParamValue;
        //         var hint = false;
        //         $.each(_params, function (index, item) {
        //             urlParamValue = decodeURIComponent(params[index]);
        //             // regexp
        //             if (toString.call(_params[index])  === '[object RegExp]') {
        //                 hint = _params[index].test(urlParamValue);
        //             } // function
        //             else if (toString.call(_params[index]) === '[object Function]') {
        //                 hint = _params[index].call(null, urlParamValue);
        //             } // string
        //             else if (typeof _params[index] === 'string') {
        //                 hint = urlParamValue === _params[index];
        //             }
        //             // string
        //             return hint;
        //         })
        //         return hint;
        //     }
        // };
        // edit in 20160406 drop
        // var params = utils.getParams(),
            // qt = params['tpl'],
            // activeElemDatanode = '';
        // if(qt) {
            // activeElemDatanode = (qt.split('-'))[3];
        // } else {
            // activeElemDatanode = 'index';
        // }
        /*
         * 左侧选中规则
         *
        */
        // $.each(me.left.find('.nav-link'), function(i, item) {
        //     var $target = $(item),
        //         dataNode = $target.data('node');
        //     if(dataNode) {
        //         dataNode = dataNode.split(',');
        //         if($.inArray(activeElemDatanode, dataNode) != -1) {
        //             $target.parent().addClass('active');
        //             return false;
        //         }
        //     }
        // });
    },
    toggleLeftsideBar: function () {
        var me = this;
        me.$el.find('.draw-handler').click(function () {
            me.main.toggleClass('fold');
        });
    }
});
