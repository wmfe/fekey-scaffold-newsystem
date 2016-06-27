/*
* 通用检验器
* 接受两个参数 value 与 rules
* boye.liu
**/
function Validation(){}
var ruleExtends = {
    isNumber : function(v) {
        return /^([-]){0,1}([0-9]){1,}([.]){0,1}([0-9]){0,}$/.test(v);
    },
    isDigits : function(v) {
        return /^(-?[1-9]\d*|0)$/.test(v);
    },
    isAlnum : function(v) {
        return /^[0-9A-Za-z]+$/.test(v);
    },
    isAlpha : function(v) {
        return /^[A-Za-z]+$/.test(v);
    },
    isCommaNum : function(v) {
        return /^(\d+[,])*(\d+)$/.test(v);
    },
    isEmail : function(v) {
        var regInvalid = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
        var regValid = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/;
        return (!regInvalid.test(v) && regValid.test(v));
    },
    isMobile : function(v) {
        return /^1\d{10}$/.test(v);
    }
}
$.extend(Validation, {
    isValid : function(value, rules){
        var _type = typeof rules;
        if(_type == "undefined")
            return true;
        if(_type == "string")
            rules = eval("(" + rules + ")");

        this.value = value;
        for(var key in rules){
            this.param = rules[key];
            this.ruleName = key.toLowerCase();
            if(!this.validate()){
                this.setError();
                return false;
            }
        }
        this.clearError();
        return true;
    },
    clearError : function(){
        this.error = "";
    },
    setError : function(){
        switch (this.ruleName) {
            case "required" :
                this.error = "此项不能为空";
                break;
            case "number" :
                this.error = "此项只能为数字";
                break;
            case "alnum" :
                this.error = "此项只能为数字或字母";
                break;
            case "alpha" :
                this.error = "此项只能为字母";
                break;
            case "digits" :
                this.error = "此项只能为整数";
                break;
            case "maxlength" :
                this.error = "此项最大长度不能超过" + this.param + "位";
                break;
            case "minlength" :
                this.error = "此项最小长度不能少于" + this.param + "位";
                break;
            case "rangelength" :
                this.error = "此项长度必须介于" + this.param[0] + "位到"
                        + this.param[1] + "位之间";
                break;
            case "max" :
                this.error = "请输入一个不大于" + this.param + "的数";
                break;
            case "min" :
                this.error = "请输入一个不小于" + this.param + "的数";
                break;
            case "range" :
                this.error = "请输入一个介于" + this.param[0] + "和" + this.param[1]
                        + "之间的数";
                break;
            case "commanum" :
                this.error = "输入的格式不正确";
                break;
            case "email" :
                this.error = "请输入一个正确的电子邮件地址";
                break;
            case "phone" :
                this.error = "请输入一个正确的手机号码";
                break;
            default :
                this.error = "";
                break;
        }
    },
    getError : function(){
        return this.error;
    },
    getRuleName : function(){
        return this.ruleName;
    },
    validate : function(){
        switch (this.ruleName) {
            case "required" :
                return $.trim(this.value).length > 0;
                break;
            case "number" :
                return ruleExtends.isNumber(this.value);
                break;
            case "alpha" :
                return ruleExtends.isAlpha(this.value);
                break;
            case "alnum" :
                return ruleExtends.isAlnum(this.value);
                break;
            case "digits" :
                return ruleExtends.isDigits(this.value);
                break;
            case "maxlength" :
                var length = $.trim(this.value).length;
                return length <= this.param;
                break;
            case "minlength" :
                var length = $.trim(this.value).length;
                return length >= this.param;
                break;
            case "rangelength" :
                var length = $.trim(this.value).length;
                return length >= this.param[0]
                        && length <= this.param[1];
                break;
            case "max" :
                return this.value <= this.param;
                break;
            case "min" :
                return this.value >= this.param;
                break;
            case "range" :
                return this.value >= this.param[0]
                        && this.value <= this.param[1];
                break;
            case "commanum" :
                return ruleExtends.isCommaNum(this.value);
                break;
            case "email" :
                return ruleExtends.isEmail(this.value);
                break;
            case "phone" :
                return ruleExtends.isMobile(this.value);
                break;
            default :
                return true;
                break;
        }
    }

});
module.exports = Validation;