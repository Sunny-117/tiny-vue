import { ref } from 'vue'
import { useEvent } from './useEvent'
export function useMouse() {
  // 定义了两个状态变量 x 和 y，分别用于保存鼠标的 x 和 y 坐标
  const x = ref(0)
  const y = ref(0)

  // 根据鼠标事件对象更新 x 和 y 的值
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 在组件挂载和卸载时分别添加和移除鼠标移动事件监听器
  //   onMounted(() => window.addEventListener('mousemove', update))
  //   onUnmounted(() => window.removeEventListener('mousemove', update))
  useEvent(window, 'mousemove', update)

  return { x, y }
}
