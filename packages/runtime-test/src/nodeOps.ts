export enum TestNodeTypes {
  TEXT = 'text',
  ELEMENT = 'element',
  COMMENT = 'comment',
}

export interface TestText {
  id: number
  type: TestNodeTypes.TEXT
  parentNode: TestElement | null
  text: string
}

export interface TestComment {
  id: number;
  type: TestNodeTypes.COMMENT;
  parentNode: TestElement | null;
  text: string;
}

export type TestNode = TestElement | TestText | TestComment

export interface TestElement {
  id: number
  type: TestNodeTypes.ELEMENT
  parentNode: TestElement | null
  tag: string
  children: TestNode[]
  props: Record<string, any>
  eventListeners: Record<string, Function | Function[]> | null
}

export enum NodeOpTypes {
  CREATE = 'create',
  INSERT = 'insert',
  REMOVE = 'remove',
  SET_TEXT = 'setText',
  SET_ELEMENT_TEXT = 'setElementText',
  PATCH = 'patch',
}

export interface NodeOp {
  type: NodeOpTypes
  nodeType?: TestNodeTypes
  tag?: string
  text?: string
  targetNode?: TestNode // 可能的类型：Element、Text、Comment
  parentNode?: TestElement // 只有Element类型才能做parent
  refNode?: TestNode | null
  propKey?: string,
  propPrevValue?: any,
  propNextValue?: any
}


let recordedNodeOps: NodeOp[] = []

export function logNodeOp(op: NodeOp) {
  recordedNodeOps.push(op)
}

export function resetOps() {
  recordedNodeOps = []
}

export function dumpOps(): NodeOp[] {
  const ops = recordedNodeOps.slice()
  resetOps()
  return ops
}

let nodeId = 0;
// 这个函数会在 runtime-core 初始化 element 的时候调用
function createElement(tag: string) {
  // 如果是基于 dom 的话 那么这里会返回 dom 元素
  // 这里是为了测试 所以只需要反正一个对象就可以了
  // 后面的话 通过这个对象来做测试
  const node: TestElement = {
    tag,
    id: nodeId++,
    type: TestNodeTypes.ELEMENT,
    props: {},
    children: [],
    parentNode: null,
    eventListeners: null
  };
  logNodeOp({
    type: NodeOpTypes.CREATE,
    nodeType: TestNodeTypes.ELEMENT,
    targetNode: node,
    tag,
  })

  return node;
}

function insert(child, parent) {
  logNodeOp({
    type: NodeOpTypes.INSERT,
    targetNode: child,
    parentNode: parent,
    refNode: null,
  })
  parent.children.push(child);
  child.parentNode = parent;
}

function parentNode(node) {
  return node.parentNode;
}

function setElementText(el, text) {
  logNodeOp({
    type: NodeOpTypes.SET_ELEMENT_TEXT,
    targetNode: el,
    text,
  })
  // TODO
  el.children = [
    {
      id: nodeId++,
      type: TestNodeTypes.TEXT,
      text,
      parentNode: el,
    },
  ];
}

export const nodeOps = { createElement, insert, parentNode, setElementText };
