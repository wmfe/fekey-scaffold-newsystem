/*
* 表单
* 获取整个表单 或者 获取某个具体表单元素的值
* boye.liu
**/
function vForm(){};
$.extend(vForm,{
    getRadioValue : function(name){
        var $radioEl = $("input[name='" + name + "']").filter(':checked');
        if ($radioEl.length) {
            return $radioEl.val();
        }
        return null;
    },
    getCheckBoxValue : function(name) {
        var result = [],
            $chxEles = $("input[name='" + name + "']:checkbox");
            len = $chxEles.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                if ($chxEles[i].checked) {
                    result.push($chxEles[i].value);
                }
            }
        }
        return result.length ? result : null;
    },
    getEleValue : function($el){
        var tagName = $el.get(0).tagName.toLowerCase(),
            name = $el.attr('name'),
            type = $el.attr('type');
        switch(tagName){
            case "input":
                switch (type) {
                    case "radio":
                        return this.getRadioValue(name);
                        break;
                    case "checkbox":
                        return this.getCheckBoxValue(name);
                        break;
                    default:
                        return $el.val();
                        break;
                };
                break;
            case "select":
                return $el.val();
                break;
            case "textarea":
                return $el.val();
                break;
            default:
                return null;
                break;
        }
    },
    fetchAll : function($formEl,selectorText,keyAttr){
        var self = this;
        var rs = {};
        var elements;

        if(!$formEl || !$formEl.length)
            return rs;

        elements = $formEl.find(selectorText);
        if(!elements.length)
            return rs;
        keyAttr = keyAttr ? keyAttr : "name"
        elements.each(function(){
            var $this = $(this);
            var key = $this.attr(keyAttr);
            var value = self.getEleValue($this);
            rs[key] = value;
        });
        return rs;
    }

});

module.exports = vForm;