<template>
    <div>
        <template v-if="flag">
            <p>hello</p>
            <div>{{ xxx }}</div>
        </template>
        <template v-else>
            <div>{{ xxx }}</div>
            <p>hello</p>
        </template>
    </div>
</template>

全量diff
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("template", null, [
    _createElementVNode("div", null, [
      (_ctx.flag)
        ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            _createElementVNode("p", null, "hello"),
            _createElementVNode("div", null, _toDisplayString(_ctx.xxx), 1 /* TEXT */)
          ], 64 /* STABLE_FRAGMENT */))
        : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
            _createElementVNode("div", null, _toDisplayString(_ctx.xxx), 1 /* TEXT */),
            _createElementVNode("p", null, "hello")
          ], 64 /* STABLE_FRAGMENT */))
    ])
  ]))
}

// Check the console for the AST