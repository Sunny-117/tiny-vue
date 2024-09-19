import {
  toDisplayString as _toDisplayString,
  createElementVNode as _createElementVNode,
  Fragment as _Fragment,
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
} from "vue";

// 普通节点
// export function render(_ctx: any) {
//   return (
//     _openBlock(),
//     _createElementBlock(
//       _Fragment,
//       null,
//       [
//         _createElementVNode(
//           "div",
//           null,
//           _toDisplayString(_ctx.name),
//           1 /* TEXT */
//         ),
//         _createElementVNode("p", null, [
//           _createElementVNode(
//             "span",
//             null,
//             _toDisplayString(_ctx.age),
//             1 /* TEXT */
//           ),
//         ]),
//       ],
//       64 /* STABLE_FRAGMENT */
//     )
//   );
// }
// const res = render({
//     name: 'zf',
//     age: 1
// })
// console.log(res)
