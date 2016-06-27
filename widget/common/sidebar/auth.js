/**
 *  ---------------------------------------------
 *  Author : IndexXuan(https://github.com/IndexXuan)
 *  Date   : Fri 01 Apr 2016 02:56:35 PM CST
 */

// mock数据

var testauth = {
    "target": {
        "username": "zhoumeimei_iwm",
        "name": "",
        "phone": "",
        "info": "",
        "is_root": "1",
        "privileges": null
    },
    "all_nodes": [{
        "node": "operator",
        "title": "操作员",
        "nav": "1",
        "root": "1",
        "child": [{
            "node": "manage",
            "title": "权限管理",
            "nav": "1",
            "tpl": "mirror-page-operator-manage"
        }]
    },
    {
        "node": "recommend",
        "title": "个性化推荐",
        "nav": "1",
        "child": [{
            "node": "basedata",
            "title": "推荐数据",
            "tpl": "mirror-page-recommend-basedata",
            "nav": "1"
        },
        {
            "node": "simulate",
            "title": "策略分析",
            "tpl": "mirror-page-recommend-simulate",
            "nav": "1"
        }]
    },
    {
        "node": "uprofile",
        "title": "用户画像",
        "nav": "1",
        "child": [{
            "node": "userinfo",
            "title": "用户信息",
            "nav": "1",
            "tpl": "mirror-page-userImage-userinfo"
        },
        {
            "node": "disinfo",
            "title": "城市画像",
            "nav": "1",
            "tpl": "mirror-page-userImage-cityimage"
        },
        {
            "node": "multiquery",
            "title": "用户筛选",
            "nav": "1",
            "tpl": "mirror-page-userImage-userfilter"
        }]
    },
    {
        "node": "rank",
        "title": "Rank",
        "nav": "1",
        "child": [{
            "node": "data", // override
            "title": "Rank 数据",
            "nav": "1",
            "tpl": "mirror-page-rank-data"
        },
        {
            "node": "adjust",
            "title": "调权后台",
            "nav": "1",
            "tpl": "mirror-page-rank-adjust"
        },
        {
            "node": "debugging",
            "title": "Rank Debug",
            "nav": "1",
            "tpl": "mirror-page-rank-debug"
        }]
    }],
    "_operator": {
        "is_login": true,
        "username": null,
        "navs": [],
        "privileges": []
    }
}

module.exports = testauth;
