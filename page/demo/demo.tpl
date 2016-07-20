{%extends file="#{namespace}/page/layout.tpl"%}
{%block name="main-body"%}
    <div class="#{namespace}-sp-body">
        <div class="#{namespace}-sp-main">
            <div class="#{namespace}-sp-left">
                {%widget name="#{namespace}:widget/common/sidebar/sidebar.tpl" selected="demo" %}
            </div>
            <div class="#{namespace}-sp-right">
                <div class="page-main clearfix">
                    {%block name="page-main"%}
                        {%widget name="#{namespace}:widget/demo/demo.tpl"%}
                    {%/block%}
                </div>
            </div>
        </div>
    </div>
{%/block%}