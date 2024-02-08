import { camelize, toHandlerKey } from "@tiny-vue/shared";

export function emit(instance, event, ...args) {
  const { props } = instance;
  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}
