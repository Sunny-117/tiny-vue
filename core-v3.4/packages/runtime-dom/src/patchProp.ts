// 针对节点属性进行操作 class style event

import patchClass from "./modules/patchClass";
import patchStyle from "./modules/pathStyle";
import patchEvent from './modules/patchEvent'
import patchAttr from "./modules/patchAttr";


export default function patchProp(el, key, preValue, nextValue) {
    if (key === 'class') {
        return patchClass(el, nextValue)
    } else if (key === 'style') {
        return patchStyle(el, preValue, nextValue)
    } else if (/^on[^a-z]/.test(key)) {
        return patchEvent(el, key, nextValue)
    } else {
        return patchAttr(el, key, nextValue)
    }

}