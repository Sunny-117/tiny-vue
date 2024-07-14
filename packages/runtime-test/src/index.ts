import { createRenderer } from "@tiny-vue/runtime-core";
import { extend } from "@tiny-vue/shared";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

export const { render } = createRenderer(extend({ patchProp }, nodeOps));
export * from "./nodeOps";
export * from "./serialize"
export * from '@tiny-vue/runtime-core'