# Vue 经典场景开发

> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial

# 封装树形组件

**效果**

支持的属性：

1. data：树形结果的数据，例如：

   ```js
   const data = ref([
     {
       label: '水果',
       checked: false, // 添加初始勾选状态
       children: [
         {
           label: '苹果',
           checked: false,
           children: [
             {
               label: '红富士',
               checked: false
             },
             {
               label: '黄元帅',
               checked: false
             }
           ]
         },
       ]
     },
   ])
   ```

2. show-checkbox：是否显示复选框

3. transition：是否应用过渡效果

4. 支持事件 @update:child-check，可以获取最新的状态

使用示例：

```html
<Tree
  :data="data"
  :show-checkbox="true"
  :transition="true"
  @update:child-check="handleChildCheck"
/>
```



关于复选框需要处理一些细节：

1. 父节点 选中/取消 会控制所有的子节点 选中/取消 状态
2. 子节点的 选中/取消 状态也会影响父节点


# 自定义ref实现防抖

首先是一个防抖最基本的实现：

```html
<template>
  <div class="container">
    <input @input="debounceInputHandler" type="text" />
    <p class="result">{{ text }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash'
const text = ref('')

function inputHandler(e) {
  text.value = e.target.value
}

const debounceInputHandler = debounce(inputHandler, 1000)
</script>

<style scoped>
.container {
  width: 80%;
  margin: 1em auto;
}
.result {
  color: #333;
}
.container input {
  width: 100%;
  height: 30px;
}
</style>
```

假设Vue给我们提供了一个防抖的ref：

```html
<template>
  <div class="container">
    <input v-model="text" type="text" />
    <p class="result">{{ text }}</p>
  </div>
</template>

<script setup>
import { debounceRef } from 'vue'
const text = debounceRef('', 1000)
</script>
```

上面的设想是美好的，代码能够简洁很多，但是 Vue 并没有给我们提供 debounceRef.

怎么办？？？自己实现

Vue内置API：customRef

Type

```js
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```

下面是 customRef 的一个基本使用示例：

```js
import { customRef } from 'vue'
let value = ''
const text = customRef(() => {
  return {
    get() {
      console.log('get')
      return value
    },
    set(val) {
      value = val
      console.log('set')
    }
  }
})
console.log(text)
console.log(text.value)
text.value = 'test'
```

官方文档：https://vuejs.org/api/reactivity-advanced.html#customref

通过 customRef 实现 ref 原有的功能：

```html
<template>
  <div class="container">
    <input v-model="text" type="text" />
    <p class="result">{{ text }}</p>
  </div>
</template>

<script setup>
import { customRef } from 'vue'
let value = '111'
const text = customRef((track, trigger) => {
  return {
    get() {
      track()
      console.log('get方法被调用')
      return value
    },
    set(val) {
      trigger()
      console.log('set方法被调用')
      value = val
    }
  }
})
</script>

<style scoped>
.container {
  width: 80%;
  margin: 1em auto;
}
.result {
  color: #333;
}
.container input {
  width: 100%;
  height: 30px;
}
</style>
```

下面是通过自定义ref来实现防抖：

```js
import { customRef } from 'vue'
import { debounce } from 'lodash'
export function debounceRef(value, delay = 1000) {
  return customRef((track, trigger) => {
    let _value = value

    const _debounce = debounce((val) => {
      _value = val
      trigger() // 派发更新
    }, delay)

    return {
      get() {
        track() // 收集依赖
        return _value
      },
      set(val) {
        _debounce(val)
      }
    }
  })
}
```