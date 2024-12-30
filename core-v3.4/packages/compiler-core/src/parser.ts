// 1.模板转为ast语法树
// 2.生成codegennode
// 3.转换成render函数

import { NodeTypes } from "./ast"


export function parse(template) {
    // 根据template 产生树 
    const context = createParserContext(template)
    return createRoot(parseChildren(context))
}

function createRoot(children) {
    return {
        type: NodeTypes.ROOT,
        children
    }
}

function createParserContext(content: any) {
    return {
        originalSource: content,
        source: content, // 字符串会不停减少
        line: 1,
        column: 1,
        offset: 0
    }
}

function parseChildren(context) {
    const nodes = []
    while (!isEnd(context)) {
        const c = context.source // 现在解析的内容
        let node
        if (c.startsWith("{{")) { // 表达式 {{ xxx }}
            node = parseInterpolation(context)
        } else if (c[0] === "<") { // 元素标签
            node = parseElement(context)
        } else { // 文本
            node = parseText(context)
        }
        nodes.push(node)
    }
    // 状态机
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        // 将空节点进行压缩
        if (node.type === NodeTypes.TEXT) {
            // 如果是空白字符 清空
            if (!/[^\t\r\n\f ]/.test(node.content)) {
                nodes[i] = null; // 空白字符清空
            } else {
                node.content = node.content.replace(/[\t\r\n\f ]+/g, " ");
            }
        }
    }
    return nodes.filter(item => Boolean(item))
}


function parseInterpolation(context) {
    const start = getCursor(context)
    // {{ xxx }} {{xxx}}  
    const closeIndex = context.source.indexOf("}}", "{{".length) // 查找结束的大括号下标
    advanceBy(context, 2) // 删掉{{ 

    const innerStart = getCursor(context)
    const innerEnd = getCursor(context)

    // 拿到原始内容  {{  xxx}} 中的 xxx 包含前面空格
    const rawContentLength = closeIndex - 2
    let preContent = parseTextData(context, rawContentLength)
    let content = preContent.trim()
    let startOffset = preContent.indexOf(content)

    if (startOffset > 0) { // 说明xxx前面有空格
        advancePositionWithMutation(innerStart, preContent, startOffset)
    }
    let endOffset = startOffset + content.length
    advancePositionWithMutation(innerEnd, preContent, endOffset)
    advanceBy(context, 2)

    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            content,
            type: NodeTypes.SIMPLE_EXPRESSION,
            loc: getSelection(context, innerStart, innerEnd)
        },
        loc: getSelection(context, start)
    }
}

function parseText(context) {
    let tokens = ['<', '{{']
    let endIndex = context.source.length  // 先假设找不到
    for (let i = 0; i < tokens.length; i++) {
        const index = context.source.indexOf(tokens[i], 1) // 跳过第一个字符
        if (index !== -1 && endIndex > index) {
            endIndex = index
        }
    }
    const start = getCursor(context)
    // 0 - endIndex为文字内容
    let content = parseTextData(context, endIndex)
    return {
        type: NodeTypes.TEXT,
        content,
        loc: getSelection(context, start)
    }
}

function parseTextData(context, endIndex) {
    const content = context.source.slice(0, endIndex)
    advanceBy(context, endIndex)
    return content
}

function parseAttribute(context) {
    const props = []

    while (context.source.length && !context.source.startsWith(">")) {
        const prop = parseSingleAttribute(context)
        props.push(prop)
        advanceSpaces(context)

    }

    return props
}

function parseSingleAttribute(context) {
    const start = getCursor(context)
    // a   = '1'
    let match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source);

    const name = match[0]
    advanceBy(context, name.length)
    advanceSpaces(context)
    advanceBy(context, 1) // 删除等号

    let value = parseAttributeValue(context)
    return {
        type: NodeTypes.ATTRIBUTE,
        name,
        value: {
            type: NodeTypes.TEXT,
            ...value
        },
        loc: getSelection(context, start)
    }
}

function parseAttributeValue(context) {
    const start = getCursor(context)
    let quote = context.source[0]
    let content
    if (["'", '"'].includes(quote)) { // 单引号或者双引号
        advanceBy(context, 1)
        const endIndex = context.source.indexOf(quote)
        content = parseTextData(context, endIndex)
        advanceBy(context, 1)
    }

    return {
        content,
        loc: getSelection(context, start)
    }

}

function parseTag(context) {
    const start = getCursor(context)
    const match = /^<\/?([a-z][^ \t\r\n/>]*)/.exec(context.source);
    const tag = match[1]
    advanceBy(context, match[0].length)
    advanceSpaces(context)
    let props = parseAttribute(context)
    const isSelfClosing = context.source.startsWith("/>")
    advanceBy(context, isSelfClosing ? 2 : 1)
    return {
        type: NodeTypes.ELEMENT,
        tag,
        isSelfClosing,
        loc: getSelection(context, start),
        props
    }
}

function parseElement(context) {
    const ele = parseTag(context);
    const children = parseChildren(context)
    if (context.source.startsWith("</")) {
        parseTag(context) // 闭合标签直接移除
    }
    (ele as any).loc = getSelection(context, ele.loc.start);
    (ele as any).children = children
    return ele
}

function advanceBy(context, endIndex) {
    // 每次删掉内容的时候 都需要更新最新的行列和偏移量信息
    let source = context.source
    advancePositionWithMutation(context, source, endIndex)
    context.source = source.slice(endIndex)
}

function advancePositionWithMutation(context, source, endIndex) {
    let linesCount = 0
    let linePos = -1
    for (let i = 0; i < endIndex; i++) {
        if (source.charCodeAt(i) === 10) { // 换行
            linesCount++
            linePos = i
        }
    }
    context.line += linesCount
    context.column = linePos === -1 ? context.column + endIndex : endIndex - linePos
    context.offset += endIndex
}

function advanceSpaces(context) {
    const match = /^[ \t\r\n]+/.exec(context.source);
    if (match) {
        // 删除空格
        advanceBy(context, match[0].length);
    }
}

// 计算最新的位置信息
function getSelection(context, start, e?) {
    let end = e || getCursor(context);
    // eslint 可以根据 start，end找到要报错的位置
    return {
        start,
        end,
        source: context.originalSource.slice(start.offset, end.offset),
    };
}

function getCursor(context) {
    let { line, column, offset } = context;
    return { line, column, offset };
}

function isEnd(context) {
    const c = context.source
    if (c.startsWith("</")) return true
    return !context.source
}




