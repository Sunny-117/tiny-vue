import { getFragments, getValue } from 'shared'

/**
 * 根据模板和环境对象，得到编译结果
 * @param {*} template 模板字符串
 * @param {*} envObj 环境对象
 */
export default function compile(template, envObj) {
    //提取模板中的 {{xxxx}}
    var frags = getFragments(template);
    var result = template; //先保存模板到result中, result保存了最终的编译结果
    for (var i = 0; i < frags.length; i++) {
        var frag = frags[i]; //拿到其中一个片段
        result = result.replace(frag, getValue(frag, envObj));
    }
    return result;
}