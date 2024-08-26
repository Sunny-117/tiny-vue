<template>
  <div class="tree-node" v-for="(node, index) in data" :key="node.label">
    <div class="node-label">
      <!-- 折叠/展开按钮 -->
      <button
        class="toggle-button"
        @click="isOpenArr[index] = !isOpenArr[index]"
        v-if="hasChildren(node)"
      >
        {{ isOpenArr[index] ? '▼' : '►' }}
      </button>
      <!-- 复选框 -->
      <input
        type="checkbox"
        v-if="showCheckbox"
        v-model="node.checked"
        @change="handleCheckboxChange(node)"
      />
      <!-- 节点名称 -->
      <label :for="node.label">{{ node.label }}</label>
    </div>
    <!-- 要渲染子树，直接再次使用 Tree 组件即可 -->
    <div v-if="transition">
      <!-- 要使用动画 -->
      <Transition
        name="expand"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <div v-show="isOpenArr[index]" v-if="hasChildren(node)">
          <Tree
            :data="node.children"
            :show-checkbox="showCheckbox"
            :transition="transition"
            @update:child-check="$emit('update:child-check', node)"
          />
        </div>
      </Transition>
    </div>
    <div v-else>
      <!-- 不使用动画 -->
      <div v-show="isOpenArr[index]" v-if="hasChildren(node)">
        <Tree
          :data="node.children"
          :show-checkbox="showCheckbox"
          :transition="transition"
          @update:child-check="$emit('update:child-check', node)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, inject } from 'vue'
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  showCheckbox: {
    type: Boolean,
    default: true
  },
  transition: {
    type: Boolean,
    default: true
  }
  //   parent: {
  //     type: Object,
  //     default: null
  //   }
})

// 每一层通过状态来控制面板是折叠还是展开
const isOpenArr = ref(props.data.map(() => false))
// 判断是否有子节点
const hasChildren = (node) => {
  return node.children && node.children.length > 0
}

// 采用依赖注入的方式向下一级提供父节点
const parentNode = inject('parentNode', null) // 拿到父节点
provide('parentNode', props.data) // 向下一级提供父节点

const emits = defineEmits(['update:child-check'])

// 处理复选框的变化
function handleCheckboxChange(node) {
  // 1. 更新子节点
  const updateChildCheck = (node, checked) => {
    node.checked = checked
    if (hasChildren(node)) {
      node.children.forEach((child) => {
        updateChildCheck(child, checked)
      })
    }
  }

  updateChildCheck(node, node.checked)

  // 2. 更新父节点

  // 第一版设计：采用了 parent Props 的方式
  // 但是这个 Props 用户也可以使用，会有一定的风险
  //   const updateParentCheck = () => {
  //     const parent = props.parent // 精准拿到父节点
  //     if (parent) {
  //       const allChildrenChecked = parent.children.every((child) => child.checked)
  //       if (parent.checked !== allChildrenChecked) {
  //         parent.checked = allChildrenChecked
  //         updateParentCheck()
  //       }
  //     }
  //   }

  //   updateParentCheck()

  // 第二版：采用依赖注入的方式提供父节点

  const updateParentCheck = (node) => {
    if (parentNode) {
      // parentNode 拿到的是父节点的这一层数据
      for (const pNode of parentNode) {
        if (pNode.children.includes(node)) {
          // 如果进入此分支，说明当前的 pNode 就是父节点
          const allChildrenChecked = pNode.children.every((child) => child.checked)
          if (pNode.checked !== allChildrenChecked) {
            pNode.checked = allChildrenChecked
            updateParentCheck(pNode)
          }
        }
      }
    }
  }

  updateParentCheck(node)

  // 触发自定义事件
  emits('update:child-check', node)
}

// 过渡动画相关的方法
function beforeEnter(el) {
  el.style.maxHeight = '0'
  el.style.opacity = '0'
  el.style.overflow = 'hidden'
}

function enter(el) {
  el.style.transition = 'max-height 0.3s ease, opacity 0.3s ease'
  el.style.maxHeight = el.scrollHeight + 'px'
  el.style.opacity = '1'
}

function afterEnter(el) {
  el.style.maxHeight = 'none'
}

function beforeLeave(el) {
  el.style.maxHeight = el.scrollHeight + 'px'
  el.style.opacity = '1'
  el.style.overflow = 'hidden'
}

function leave(el) {
  el.style.transition = 'max-height 0.3s ease, opacity 0.3s ease'
  el.style.maxHeight = '0'
  el.style.opacity = '0'
}

function afterLeave(el) {
  el.style.maxHeight = 'none'
}
</script>

<style scoped>
.tree-node {
  margin-left: 20px;
  font-family: Arial, sans-serif;
}
.node-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
}
.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  color: black;
}
</style>
