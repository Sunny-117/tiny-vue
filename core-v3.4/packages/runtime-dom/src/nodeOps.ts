// 针对节点的增删改查


export const nodeOps = {
    insert(el, parent, anchor) {
        // 如果null不存在 等价于appendChild
        parent.insertBefore(el, anchor || null)
    },
    remove(el) {
        const parent = el.parentNode
        if (parent) {
            parent.removeChild(el)
        }
    },
    createElement(type) {
        return document.createElement(type)
    },
    createText(text) {
        return document.createTextNode(text)
    },
    setText(node, text) { // 给文本节点设置文本
        node.nodeValue = text
    },
    setElementText(el, text) { // 给dom元素设置文本
        el.textContent = text
    },
    parentNode(node) {
        return node.parentNode
    },
    nextSibling(node) {
        return node.nextSibling
    }
}