/*
    项目核心配置文件，修改必须code review
    created by: xumingjie@iwaimai.baidu.com
    update:
 */
fis.require('smarty')(fis);
fis.set('namespace', 'demo');

var mactivityDeployRules = {
    '*': {
        deploy: 'webroot',
        release: '/${static}/${namespace}/$0'
    },

    '/(**.tpl)': {
        deploy: '',
        release: '/${template}/${namespace}/$1'
    },

    '/{plugin/**.*,smarty.conf,domain.conf,**.php}': {
        deploy: '',
        release: '$0'
    },

    'server.conf': {
        deploy: '',
        release: '/server-conf/${namespace}.conf'
    },

    '/static/(**)': {
        deploy: 'webroot',
        release: '/${static}/${namespace}/$1'
    },

    '/(test)/(**)': {
        deploy: '',
        release: '/$1/${namespace}/$2'
    },

    '/(config)/(**)': {
        deploy: '',
        release: '/$1/${namespace}/$2'
    },

    '${namespace}-map.json': {
        deploy: 'data/smarty',
        release: '/config/$0'
    }
};

// optimizer
fis.match('*.{js,jsx}', {
    optimizer: fis.plugin('uglify-js')
});
fis.match('*.{css,less}', {
    useHash: true,
    optimizer: fis.plugin('clean-css')
});
fis.match('*.png', {
  optimizer: fis.plugin('png-compressor')
});

// cdn
fis.match('**.{js,css,jsx,es6,less}', {
    domain : ['http://web4.waimai.bdimg.com/','http://web3.waimai.bdimg.com/','http://web2.waimai.bdimg.com/','http://web1.waimai.bdimg.com/']
});


!(function() {
    var _CONFIG = {
        mengmeng : {
            receiver : "http://cp01-xmj.epc.baidu.com:8086/receiver.php",
            root : "/home/map/odp_cater/"
        }
    };

    for (var name in _CONFIG) {
        var comp = _CONFIG[name];
        var media = fis.media(name);
        media.match('*.{js,jsx,es6,css,less,png}', {
            optimizer: null,
            useHash: true,
            useSprite: false,
            domain : null
        });

        for (var selector in mactivityDeployRules) {
            var deployRule = mactivityDeployRules[selector].deploy;
            var releaseRule = mactivityDeployRules[selector].release;
            var item = {
                receiver: comp.receiver,
                to: comp.root + deployRule
            };
            media.match(selector, {
                release: releaseRule,
                deploy: fis.plugin('http-push', item)
            });
        }
    }
})();

//自动验证JSfile
fis.match('*.js', {
    lint: fis.plugin('jshint', {
        ignored: 'static/libs/*.js',
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: "nofunc",
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        undef: true,
        unused: true,
        trailing: true,
        //quotmark : 'single',
        maxparams: 5,
        maxdepth: 4,
        maxlen: 150,
        boss: true,
        expr: true,
        iterator: true,
        laxcomma: true,
        proto: true,
        scripturl: true,
        sub: true,
        validthis: true,
        browser: true,
        jquery: true,
        node: true,
        onevar: true,
        globals: {
            _: true,
            PicView: true,
            Dialog: true,
            module: true,
            exports: true,
            define: true
        }
    })
});

//指定less插件
fis.match('*.less', {
    parser: fis.plugin('less'),
    rExt: '.css',
    isCssLike: true
});

//指定tmpl插件
fis.match('*.tmpl', {
    parser: fis.plugin('bdtmpl', {
        LEFT_DELIMITER: '<#',
        RIGHT_DELIMITER: '#>'
    }),
    isJsLike: true,
    release: false
});

fis.match('*.{css,less}', {
    postprocessor: fis.plugin('autoprefixer', {
        browsers: ['android 4', 'ios 6', 'last 1 Chrome versions', 'last 2 Safari versions'],
        "cascade": true
    })
});

// 启用 es6-babel 插件，解析 .es6 后缀为 .js
fis.set('project.fileType.text', 'es6,jsx');
fis.match('*.{jsx,es6}', {
    rExt: '.js',
    parser: fis.plugin('babel-5.x', {
        blacklist: ['regenerator'],
        stage: 3
    }),
    isMod: true,
    useHash: true,
    isJsLike: true,
});

//打包

//isMod

//debug
fis.media('debug').match('*.{js,jsx,es6,css,less,png}', {
    optimizer: null,
    useHash: false,
    useSprite: false,
    domain : null
});
