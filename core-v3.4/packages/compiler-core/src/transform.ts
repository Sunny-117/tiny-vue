import { CREATE_ELEMENT_BLOCK, CREATE_ELEMENT_VNODE, CREATE_TEXT_VNODE, FRAGMENT, OPEN_BLOCK, TO_DISPLAY_STING } from "./runtimeHelpers";
import { PatchFlags } from "packages/shared/src/patchFlags";
import { createCallExpression, createObjectExpression, createVnodeCall, NodeTypes } from "./ast";


// 处理元素
function transformElement(node, context) {
    if (NodeTypes.ELEMENT === node.type) {
        return function () {
            let { tag, props, children } = node
            let vnodeTag = tag
            let properties = []

            for (let i = 0; i < props.length; i++) {
                properties.push({ key: props[i].name, value: props[i].value.content })
            }
            const propsExpression = properties.length ? createObjectExpression(properties) : null
            let vnodeChildren = null
            if (children.length === 1) {
                vnodeChildren = children[0]
            } else if (children.length > 1) {
                vnodeChildren = children
            }
            node.codegenNode = createVnodeCall(context, vnodeTag, propsExpression, vnodeChildren)
        }
    }
}

function isText(node) {
    return node.type === NodeTypes.INTERPOLATION || node.type === NodeTypes.TEXT
}


// 处理文本
function transformText(node, context) {
    if (NodeTypes.ELEMENT === node.type || NodeTypes.ROOT === node.type) {
        // 等待所有子节点全部处理后，再赋值给父元素   
        return function () {
            const children = node.children
            let container = null
            let hasText = false
            for (let i = 0; i < children.length; i++) {
                let child = children[i]
                if (isText(child)) {
                    hasText = true
                    for (let j = i + 1; j < children.length; j++) {
                        const next = children[j]
                        if (isText(next)) {
                            if (!container) {
                                container = children[i] = {
                                    type: NodeTypes.COMPOUND_EXPRESSION,
                                    children: [child]
                                }
                            }
                            container.children.push(`+`, next)
                            children.splice(j, 1)
                            j--
                        } else {
                            container = null
                            break
                        }
                    }
                }
            }
            // 检查文本节点是否只有一个 只有一个不需要createTextVnode
            if (!hasText || children.length === 1) return
            for (let i = 0; i < children.length; i++) {
                const child = children[i]
                if (isText(child) || child.type === NodeTypes.COMPOUND_EXPRESSION) {
                    const args = []
                    args.push(child)
                    if (child.type !== NodeTypes.TEXT) {
                        args.push(PatchFlags.TEXT)
                    }
                    children[i] = {
                        type: NodeTypes.TEXT_CALL, // 标识得调用createTextVnode
                        content: child,
                        codegenNode: createCallExpression(context, args)
                    }
                }
            }
        }
    }
}


// 处理表达式
function transformExpression(node, context) {
    if (NodeTypes.INTERPOLATION === node.type) {
        node.content.content = `_ctx.${node.content.content}`
    }
}

function traverseNode(node, context) {
    context.currentNode = node
    const transforms = context.transformNode
    const exits = []
    for (let i = 0; i < transforms.length; i++) {
        let exit = transforms[i](node, context)
        exit && exits.push(exit)
    }

    switch (node.type) {
        case NodeTypes.ROOT: {

        }
        case NodeTypes.ELEMENT: {
            for (let i = 0; i < node.children.length; i++) {
                context.parent = node
                traverseNode(node.children[i], context)
            }
            break
        }
        case NodeTypes.INTERPOLATION: {
            context.helper(TO_DISPLAY_STING)
            break
        }
    }

    context.currentNode = node
    let i = exits.length
    if (i > 0) {
        while (i--) {
            exits[i]()
        }
    }
}


export function transform(ast) {
    const context = createTransformContext(ast)
    traverseNode(ast, context)

    // 对根节点来做处理 1.文本  2.一个元素 x createElementVnode -> createElementBlock
    // 3.多个 createElementBlock(Fragment)

    createRootCodegenNode(ast, context)
    ast.helpers = [...context.helpers.keys()]

    console.log('转换后的ast', ast)
}

function createRootCodegenNode(ast, context) {
    let { children } = ast
    if (children.length === 1) {
        let child = children[0]
        if (child.type === NodeTypes.ELEMENT) {
            ast.codegenNode = child.codegenNode
            context.removeHelper(CREATE_ELEMENT_VNODE)
            context.helper(CREATE_ELEMENT_BLOCK)
            context.helper(OPEN_BLOCK)
            ast.codegenNode.isBlock = true
        } else {
            ast.codegenNode = child
        }
    } else {
        ast.codegenNode = createVnodeCall(context, context.helper(FRAGMENT), undefined, children)
        context.helper(CREATE_ELEMENT_BLOCK)
        context.helper(OPEN_BLOCK)
        ast.codegenNode.isBlock = true
    }
}

function createTransformContext(root) {
    const context = {
        currentNode: root,
        parent: null,
        transformNode: [transformElement, transformText, transformExpression],
        helpers: new Map(),
        helper(name) {
            let count = context.helpers.get(name) || 0
            context.helpers.set(name, count + 1)
            return name
        },
        removeHelper(name) {
            let count = context.helpers.get(name) || 0
            if (count) {
                let c = count - 1
                if (!c) {
                    context.helpers.delete(name)
                } else {
                    context.helpers.set(name, c)
                }
            }
        }
    }
    return context
}
