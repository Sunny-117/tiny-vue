export function isObject(obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

//姓名：{{name}}, 年龄：{{age}}，居住省份：{{addr.province}}
//返回：["{{name}}", "{{age}}", "{{addr.province}}"]
export function getFragments(template) {
    var matches = template.match(/{{[^}]+}}/g);
    return matches || [];
}

/**
 * 
 * 根据片段的内容，从环境对象中取出相应的数据
 * @param {*} fragment 
 * @param {*} envObj 
 */
export function getValue(fragment, envObj) {
    // exp: 花括号内部的表达式
    var exp = fragment.replace("{{", "").replace("}}", "");
    var props = exp.split("."); //将表达式分割为一个属性数组
    var obj = envObj;
    for (var i = 0; i < props.length; i++) {
        obj = obj[props[i]];
    }
    return obj;
}