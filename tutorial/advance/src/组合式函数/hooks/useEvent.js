import { onMounted, onUnmounted } from 'vue'
/**
 *
 * @param {*} target 要绑定事件的元素
 * @param {*} event 要绑定的事件类型
 * @param {*} callback 事件触发时的回调函数
 */
export function useEvent(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
