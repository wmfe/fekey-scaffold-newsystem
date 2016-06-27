/**
 * @description 一些基础的工具，用util模块包装
 * @example
 * var util = require("common:static/util.js");
 */

/**
 * @external Date
 */
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @param {date} fmt 要格式化的日期对象
 * @memberof Date.prototype
 * @returns {string}
 * @example
 * (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
 * (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function(fmt) {
    var o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds(), //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            'S': this.getMilliseconds() //毫秒
        }, k;
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

var util = {
    format: function(str, obj) {
        return str.replace(/\{(\w+)\}/g, function(a, b) {
            return (typeof (obj[b]) == "undefined" || obj[b] == null) ? "" : obj[b];
        });
    },
    getNoPicUrl: function() {
        return __uri('images/nopic.gif');
    },
    /**
     * 按照容器大小为中心，截取图
     * @author [liuping]
     * @param  {[type]} imgD        [img对象]
     * @param  {[type]} iwidth      [要固定的宽度]
     * @param  {[type]} iheight     [要固定的高度]
     * @param  {[type]} alignCenter [是否居中]
     */
    stretchImg: function(imgD, iwidth, iheight, alignCenter, isShowAll) {
        var image = new Image();
        imgD.onerror = function() {
            this.src = util.getNoPicUrl();
            this.style.display = "";
        };
        image.onload = function() {
            var _w = this.width,
                _h = this.height,
                _scale = _h / _w,
                _finalWidth,
                _finalHeight,
                moveLeft,
                moveTop;

            var maxRatio = Math.max(iwidth / _w, iheight / _h);
            isShowAll && (maxRatio = Math.min(iwidth / _w, iheight / _h))
            _finalWidth = parseInt(maxRatio * _w, 10) || iwidth;
            _finalHeight = parseInt(maxRatio * _h, 10) || iheight;

            imgD.style.width = _finalWidth + "px";
            imgD.style.height = _finalHeight + "px";

            moveTop = parseInt((iheight - _finalHeight) / 2, 10);
            moveLeft = parseInt((iwidth - _finalWidth) / 2, 10);
            if (alignCenter) {
                $(imgD).css({
                    "margin-top": moveTop,
                    "margin-left": moveLeft
                });
            }
            imgD.style.display = "";
        };
        image.src = imgD.src;
    },
    reloadImg: function(el) {
        var self = this;
        var img = el.find("img");
        img = img[0] ? img : el;
        img.css("visibility", "hidden").hide();
        var src = img.attr("src");
        var image = new Image();

        function showImg(_src) {
            img.css("visibility", "visible").show().attr("src", _src);
        }

        image.onload = function() {
            showImg(src);
        };
        image.onerror = function() {
            showImg(self.getNoPicUrl());
        }
        image.src = src;
    },
    errorImg: function(imD) {
        imD.src = util.getNoPicUrl();
    },
    getPartnerslink: function(name, url, opts) {
        if (!name || !url || !opts) {
            return url || '';
        }
        return url + "&" + $.param($.extend({}, opts, {
                from: 'inf',
                fun: name
            }));
    },

    /**
     * 将geo字符串转换成点线面geo对象
     * @param {String} geo 字符串
     * @param {Object} Geo对象
     */
    parseGeo: function(geo) {
        if (typeof (geo) != "string")
            return;
        var info = geo.split("|");
        var type = parseInt(info[0]);
        var bound = info[1];
        var points = info[2];
        var parts = points.split(";");
        var arr = [];
        switch (type) {
            case 1:
                arr.push(parts[0]);
                break;
            case 2:
            case 3:
                for (var i = 0; i < parts.length - 1; i++) {
                    var coords = parts[i];
                    if (coords.length > 100) {
                        coords = coords.replace(/([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*),([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*)(,)/g, "$1,$2;");
                        arr.push(coords);
                    } else {
                        var str = [];
                        var ps = coords.split(",");
                        for (var j = 0; j < ps.length; j += 2) {
                            var x = ps[j];
                            var y = ps[j + 1];
                            str.push(x + "," + y);
                        }
                        ;
                        arr.push(str.join(";"));
                    }
                }
                ;
                break;
        }
        ;
        if (arr.length <= 1) {
            arr = arr.toString();
        }
        return {
            type: type,
            bound: bound,
            points: arr
        };
    },
    /**
     * 将坐标字符串转化为BMap.Point对象
     * @type {String} "lng,lat"
     */
    getPointByStr: function(ptstr, map) {
        if (typeof ptstr != "string") {
            return;
        }
        var ptarr = ptstr.split(",");
        if (ptarr.length < 2) {
            return;
        }
        var pixel = new BMap.Pixel(ptarr[0], ptarr[1]),
            map = map || window.map;
        return map.getMapType().getProjection().pointToLngLat(pixel);
    },
    loadJs: function(url, callback) {
        var head = document.getElementsByTagName('head')[0],
            script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = script.onreadystatechange = function() {
            script.onload = script.onreadystatechange = null;
            callback();
        }

        head.appendChild(script);
    },
    loadCss: function(url, callback) {

        var head = document.getElementsByTagName('head')[0],
            link = document.createElement('link'),
            callback = callback || function() {};
        link.type = 'text/css';
        link.href = url;
        link.rel = "stylesheet";
        head.appendChild(link);
        if ('sheet' in link) { //FF/CM/OP
            sheet = 'sheet';
            cssRules = 'cssRules';
        } else { //IE
            sheet = 'styleSheet';
            cssRules = 'rules';
        }
        var _timer1 = setInterval(function() { // 通过定时器检测css是否加载成功
                try {
                    if (link[sheet] && link[sheet][cssRules].length) { // css被成功加载
                        // console.log(link[sheet][cssRules]);
                        clearInterval(_timer1); // 清除定时器
                        clearTimeout(_timer2);
                        callback();
                    }
                } catch ( e ) {
                    // FF看到的可能的报错：
                    //本地：nsresult: "0x8053000f (NS_ERROR_DOM_INVALID_ACCESS_ERR)" ，因为没加载完成还不能读取，加载完毕就不会报错了
                    //跨域：Security error, code: "1000" nsresult: "0x805303e8"，因为不能跨域读取CSS。。。
                    //关于跨域访问：FF/OP/CM都禁止，IE6-9都可以跨域读取css。
                }
                finally {}
            }, 20),
            // 创建超时定时器，如果过10秒没检测到加载成功
            _timer2 = setTimeout(function() {
                clearInterval(_timer1); // 清除定时器
                clearTimeout(_timer2);
                callback(); // 都过了这么长时间了，虽然没判断加载成功也执行callback（这里可能本身就加载失败，也可能是跨域的情况）
            }, 1000);
    },

    //-----------------------------------------------------------------------
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2013-07-05 08:09:04.423
    // dateFormat(new Date(),"yyyy-M-d h:m:s.S")      ==> 2013-7-5 8:9:4.18
    // dateFormat(new Date(),"yyyy/M/d h:m:s.S")       ==> 2013/7/5 8:9:4.18
    //-------------------------------------------------------------------------
    dateFormat: function(__data, __fmt) {
        var data = __data;
        var o = {
            "M+": data.getMonth() + 1, //月份
            "d+": data.getDate(), //日
            "h+": data.getHours(), //小时
            "m+": data.getMinutes(), //分
            "s+": data.getSeconds(), //秒
            "q+": Math.floor((data.getMonth() + 3) / 3), //季度
            "S": data.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(__fmt)) {
            __fmt = __fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o)
            if (new RegExp("(" + k + ")").test(__fmt)) {
                __fmt = __fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
        return __fmt;
    },
    jstime: function(msg) {
        if (msg) {
            if (this.__start) {
                this.__time = this.__time || [];
                this.__time.push(msg + ":" + (new Date().getTime() - this.__start) + "ms");
            }
            this.__start = new Date().getTime();
        } else {
            alert(this.__time.join("\n"));
        }
    },
    //-----------------------------------------------------------------------
    // 获取包含中文在内的字符串长度一个中文长度为二
    // @param {String} str 字符串
    //-------------------------------------------------------------------------
    getStrLength: function(str) {
        var cArr = str.match(/[^\x00-\xff]/ig);
        return str.length + (cArr == null ? 0 : cArr.length);
    },
    //-----------------------------------------------------------------------
    // 无乱码字符串截取，如： var a="www.cnblogs.com";SubString(a,3)//返回www
    // @param {String} str 字符串
    //-------------------------------------------------------------------------
    SubString: function(str, n) {
        var r = /[^\x00-\xff]/g;
        if (str.replace(r, "mm").length <= n) return str;
        var m = Math.floor(n / 2);
        for (var i = m; i < str.length; i++) {
            if (str.substr(0, i).replace(r, "mm").length >= n) {
                return str.substr(0, i);
            }
        }
        return str;
    },
    //-------------------------------------------------------------------------
    //scrollController，将在下面超出显示区域的元素滚动到显示区域内
    //@author [lengdonglin]
    //@param {str} string 选择器字符串
    //@param {number} time 动画执行的时间，单位是毫秒
    //如scrollController('.xxx', 100);
    //-------------------------------------------------------------------------
    scrollController: function(str, time) {
        var toL = $(str)[0].getBoundingClientRect().bottom - Math.min(document.documentElement.clientHeight, document.body.clientHeight);
        var posB = document.body.scrollTop;
        var posH = document.documentElement.scrollTop;
        var fromL = 0;
        var startTime = new Date().getTime();
        var finishPoint = 1;
        var t = setInterval(function() {
            var endTime = new Date().getTime();
            var finishPercent = Math.min(1, ((endTime - startTime)) / time);
            var currentL = fromL + ((toL - fromL) * finishPercent);
            document.body.scrollTop = posB + currentL;
            document.documentElement.scrollTop = posH + currentL;
            if (finishPercent >= finishPoint) {
                clearInterval(t);
                document.body.scrollTop = posB + toL;
                document.documentElement.scrollTop = posH + toL;
            }
        }, 15);
    },
    /**
     * @description 获取url中所有的参数
     * @param {string} url 指定的url
     * @return {object} params 所有的参数
     */
    getParams: function(url) {
        var vars = {},
            hash, hashes, i;

        url = url || window.location.href;

        // 没有参数的情况
        if (url.indexOf('?') == -1) {
            return vars;
        }

        hashes = url.slice(url.indexOf('?') + 1).split('&');

        for (i = 0; i < hashes.length; i++) {
            if (!hashes[i] || hashes[i].indexOf('=') == -1) {
                continue;
            }
            hash = hashes[i].split('=');
            vars[hash[0]] = (hash[1].indexOf("#") != -1) ? hash[1].slice(0, hash[1].indexOf("#")) : hash[1];
        }

        return vars;
    },
    /**
     * @description 获取指定name的参数
     * @param {string} name 指定的name值
     * @param {string} url  可选参数指定url，不传时用window.loaction
     * @return {string} value
     */
    getParam: function(name, url) {
        return this.getParams(url)[name];
    },
    /**
     * 得到当前时间戳
     */
    now: function() {
        return new Date().getTime();
    },
    /**
     * 将url参数部分解析成key/value形式
     * @param {string} url，格式key=value&key=value
     * @returns {Object} json对象{key:value,key:value}
     */
    urlToJSON: function(url) {
        if (!url) {
            return {};
        }
        var result = {},
            pairs = url.split('&'),
            i, keyValue, len;
        for (i = 0, len = pairs.length; i < len; i++) {
            keyValue = pairs[i].split('=');
            result[keyValue[0]] = decodeURIComponent(keyValue[1]);
        }
        return result;
    },
    /**
     * json转换为url
     * @param {Object} json数据
     * @returns {string} url
     */
    jsonToUrl: function(json) {
        if (!json) {
            return '';
        }
        var arr = [],
            key;
        for (key in json) {
            if (json.hasOwnProperty(key)) {
                arr.push(key + '=' + encodeURIComponent(json[key]));
            }
        }
        return arr.join('&');
    },
    sub: function(str, hash) {
        var reg = /\{([^\}]+)\}/g;

        return ("" + str).replace(/\{([^\}]+)\}/g, function(m, k) {
            return typeof hash[k] != "undefined" ? hash[k] : "";
        });
    }
};

util.hashUtils = {
    sep: "&",
    parseParams: function(paramsStr, sep) {
        var reg = new RegExp("([^=]+)=([^" + (sep || this.sep) + "]*)" + (sep || this.sep) + "?", "g"),
            hashObj = {},
            match = null;

        while (match = reg.exec(paramsStr)) {
            hashObj[match[1]] = match[2];
        }

        return hashObj;
    },
    stringifyParams: function(hashParams, sep) {
        var hash = "";

        sep = sep || this.sep;

        for (var param in hashParams) {
            if (hashParams.hasOwnProperty(param)) {
                hash += param + "=" + hashParams[param] + sep;
            }
        }

        return hash.substr(0, hash.length - 1);
    },
    getParams: function() {
        return this.parseParams(location.hash.substr(1));
    },
    setParams: function(params) {
        location.hash = this.stringifyParams(params);
    },
    getParam: function(name) {
        var hash = this.getParams();

        return hash[name];
    },
    setParam: function(name, value) {
        var me = this,
            hash = me.getParams();

        hash[name] = value;

        me.setParams(hash);
    }
}

module.exports = util;
