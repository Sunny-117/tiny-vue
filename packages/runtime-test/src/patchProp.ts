import { logNodeOp, NodeOpTypes } from "./nodeOps";

export function patchProp(el, key, prevValue, nextValue) {
  logNodeOp({
    type: NodeOpTypes.PATCH,
    targetNode: el,
    propKey: key,
    propPrevValue: prevValue,
    propNextValue: nextValue,
  })
  el.props[key] = nextValue;
}
