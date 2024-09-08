// 编写<div id="app" style="color:red"> hello {{name}} <span>hello</span></div>

// 结果:render(){
//    return _c('div',{id:'app',style:{color:'red'}},_v('hello'+_s(name)),_c('span',null,_v('hello')))
//}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
//  语法层面的转义
function genProps(attrs) { //  id   "app"     / style  "fontSize:12px;color:red"
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            let obj = {}; // 对样式进行特殊的处理 
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }
    return `{${str.slice(0,-1)}}`;
}
function gen(node) {
    if (node.type == 1) {
        return generate(node); // 生产元素节点的字符串
    } else {
        let text = node.text; // 获取文本
        // 如果是普通文本 不带{{}}

        if(!defaultTagRE.test(text)){
            return `_v(${JSON.stringify(text)})` // _v('hello {{ name }} world {{msg}} aa')   => _v('hello'+_s(name) +'world' + _s(msg))
        }
        let tokens = []; // 存放每一段的代码
        let lastIndex = defaultTagRE.lastIndex = 0; // 如果正则是全局模式 需要每次使用前置为0
        let match,index; // 每次匹配到的结果

        while(match = defaultTagRE.exec(text)){
            index = match.index; // 保存匹配到的索引
            if(index > lastIndex){
                tokens.push(JSON.stringify(text.slice(lastIndex,index)))
            }
            tokens.push(`_s(${match[1].trim()})`);
            lastIndex = index+match[0].length;
        }
        if(lastIndex < text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return `_v(${tokens.join('+')})`;
    }
}
function genChildren(el) {
    const children = el.children;
    if (children) { // 将所有转化后的儿子用逗号拼接起来
        return children.map(child => gen(child)).join(',')
    }
}
export function generate(el) {
    let children = genChildren(el);// 儿子的生成
    let code = `_c('${el.tag}',${
        el.attrs.length? `${genProps(el.attrs)}`:'undefined'
    }${
        children?`,${children}`:''
    })`;
    return code;
}