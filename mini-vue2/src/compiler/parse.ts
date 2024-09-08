

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
// ?:匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // </my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的    aaa="aaa"  a='aaa'   a=aaa
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >    >   <div></div>  <br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
// 数据结构 树、栈、链表、队列、
export function parseHTML(html) {
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName, // 标签名
            type: 1, // 元素类型
            children: [], // 孩子列表
            attrs, // 属性集合
            parent: null // 父元素
        }
    }
    let root;
    let currentParent;
    let stack = [];
    function start(tagName, attrs) { // 创建一个元素 作为根元素
        let element = createASTElement(tagName, attrs);
        if(!root){
            root = element;
        }
        currentParent = element; // 当前解析的标签 保存起来
        stack.push(element); // 将生产的ast元素放到栈中
    }

    // <div> <p></p> hello</div>    currentParent=p
    function end(tagName) { // 在结尾标签处 创建父子关系
        let element = stack.pop(); // 取出栈中的最后一个
        currentParent = stack[stack.length-1];
        if(currentParent){ // 在闭合时可以知道这个标签的父亲是谁
            element.parent = currentParent;
            currentParent.children.push(element);
        }
    }
    function chars(text) {
        text = text.trim();
        if(text){
            currentParent.children.push({
                type:3,
                text
            })
        }
    }

    while (html) { // 只要html不为空字符串就一直解析
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            // 肯定是标签
            const startTagMatch = parseStartTag(); // 开始标签匹配的结果 处理开始
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            const endTagMatch = html.match(endTag);
            if (endTagMatch) { // 处理结束标签
                advance(endTagMatch[0].length);
                end(endTagMatch[1]); // 将结束标签传入 
                continue;
            }
        }
        let text;
        if (textEnd > 0) { // 是处理文本
            text = html.substring(0, textEnd)
        }
        if (text) { // 处理文本
            advance(text.length);
            chars(text);
        }

    }

    function advance(n) { // 将字符串进行截取操作 在更新html内容
        html = html.substring(n)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length); // 删除开始标签
            // 如果直接是闭合标签了 说明没有属性
            let end, attr;
            // 不是结尾标签 能匹配到属性
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
                advance(attr[0].length); // 去掉当前属性
            }
            if (end) { // >  删除匹配到的结束标签
                advance(end[0].length);
                return match;
            }
        }
    }

    return root;
}