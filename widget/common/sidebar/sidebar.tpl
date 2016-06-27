<div id="sddp-widget-sidebar">
    <div class="sddp-sp-nav">
        <div class="sddp-sp-nav-pannel">
            <div id="widget-common-sidebar">
                <div class="sddp-sp-title sddp-sp-platform">
                    <i class="glyphicon glyphicon-logo"></i>新系统demo
                </div>
                <div class="sddp-sp-division"></div>
                <div>
                    <div class="sddp-sp-title">
                        <i class="glyphicon glyphicon-user-image"></i>搜索数据
                    </div>
                    <ul class="unstyled">
                        <li class="sddp-url {%if $selected == "demo"%}active{%/if%}">
                            <a class="sddp-nav-link" href="/platform/searchdata/summary">数据demo</a>
                        </li>
                        <li class="sddp-url {%if $selected == "querydata"%}active{%/if%}">
                            <a class="sddp-nav-link" href="/platform/searchdata/querydata">query数据</a>
                        </li>
                        <li class="sddp-url {%if $selected == "moduledata"%}active{%/if%}">
                            <a class="sddp-nav-link" href="/platform/searchdata/moduledata">模块数据</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="draw-handler">
            <div class="toExp"><i class="glyphicon glyphicon-chevron-right"></i><a>展开菜单</a></div>
            <div class="toFold"><i class="glyphicon glyphicon-chevron-left"></i><a>收起菜单</a></div>
        </div>
    </div>
</div>
{%script%}
    require("./sidebar.js").createWidget({%json_encode($data)%});
{%/script%}
