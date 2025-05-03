import { NodeTypes } from "../ast";
import { isText } from "../utils";

/**
 * 处理"+"："hi,{{message}}"->"hi," + _toDisplayString(_ctx.message)
 */
export function transformText(node) {
  // 处理："hi,{{message}}"->"hi," + _toDisplayString(_ctx.message)=> 中间的+
  if (node.type === NodeTypes.ELEMENT) {
    // 注意处理时机：是onExit阶段处理的
    return () => {
      const { children } = node;

      let currentContainer;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (isText(child)) {
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j];
            if (isText(next)) {
              // 只处理text和插值相邻的节点，所以需要两层判断isText
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child],
                };
              }

              currentContainer.children.push(" + ");
              currentContainer.children.push(next);
              children.splice(j, 1);
              j--;
            } else {
              currentContainer = undefined;
              break;
            }
          }
        }
      }
    };
  }
}
