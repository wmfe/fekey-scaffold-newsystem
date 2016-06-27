{%extends file="demo/page/layout.tpl"%}
{%block name="main-body"%}
    <div class="sddp-sp-body">
        <div class="sddp-sp-main">
            <div class="sddp-sp-left">
                {%widget name="demo:widget/common/sidebar/sidebar.tpl" selected="demo" %}
            </div>
            <div class="sddp-sp-right">
                <div class="page-main clearfix">
                    {%block name="page-main"%}
                        {%widget name="demo:widget/demo/demo.tpl"%}
                    {%/block%}
                </div>
            </div>
        </div>
    </div>
{%/block%}