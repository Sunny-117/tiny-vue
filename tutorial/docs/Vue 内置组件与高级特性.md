# Vue 内置组件与高级特性

> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial

# 属性透传

属性透传，指的是一些没有被组件声明为 props、emits 或自定义事件的属性，但依然能传递给子组件，例如常见的 class、style 和 id. 

**快速上手**

A.vue

```html
<template>
  <div>
  	<p>A组件</p>
  </div>
</template>
```

App.vue

```html
<template>
	<!-- 这些属性在A组件内部都没有声明为Props -->
  <A id="a" class="aa" data-test="test" />
</template>

<script setup>
import A from './components/A.vue'
</script>
```

观察渲染结构？

```html
<div id="app" data-v-app="">
  <!-- 这些属性在A组件内部都没有声明为Props -->
  <div id="a" class="aa" data-test="test">
    <p>A组件</p>
  </div>
</div>
```



**相关细节**

**1. 对 class 和 style 的合并**

如果一个子组件的根元素已经有了 class 或 style attribute，它会和从父组件上继承的值**合并**。

子组件其他同名的属性，**会被忽略**，应用父组件上继承的值。

**2. 深层组件继承**

1. 有些情况下，一个组件会在根节点上直接去渲染另一个组件，这种情况属性会**继续透传**。

2. 深层透传的属性不包含 A 组件上声明过的 props 或是针对 emits 声明事件的 v-on 侦听函数，可以理解为这些属性在 A 组件上消费了。

**3. 禁用属性透传**

属性会自动透传到根元素上，但有时我们想要控制透传属性的位置，此时可以这么做：

1. 禁用透传

   ```js
   defineOptions({
     inheritAttrs: false
   })
   ```

2. 通过 v-bind 绑定 $attrs 手动指定位置

   ```html
   <div>
     <p v-bind="$attrs">A组件</p>
   </div>
   ```

另外有两个注意点：

1. 和 props 不同，透传 attributes 在 JS 中**保留原始大小写**，所以像 foo-bar 这样的 attribute 需要通过 `$attrs['foo-bar']` 来访问。
2. 像 @click 这样的一个 v-on 事件监听器将在此对象下被暴露为一个函数 $attrs.onClick。

**4. 多根节点属性透传**

和单根节点组件有所不同，有着多个根节点的组件没有自动 attribute 透传行为。

```html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

这种情况下 Vue 不知道要将 attribute 透传到哪里，所以会抛出一个警告。

此时需要通过 $attrs 显式绑定。

```html
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

**5. JS中访问透传的属性**

如果需要，你可以在 \<script setup> 中使用 useAttrs API 来访问一个组件的所有透传 attribute：

```html
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

如果没有使用 \<script setup>，attrs 会作为 setup 方法上下文对象的一个属性暴露：

```js
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs)
  }
}
```

# 依赖注入

Props 逐级传递存在的问题：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-15-055646.png" alt="image-20240715135642336" style="zoom:50%;" />

使用 Pinia 能够解决该问题，但是如果不用 Pinia 呢？

可以用依赖注入。

## 快速上手

整个依赖注入分为两个角色：

1. 提供方：负责**提供数据**
2. 注入方：负责**接收数据**

**1. 提供方**

要提供数据，可以使用 provide 方法。例如：

```html
<script setup>
import { provide } from 'vue'

provide(/* 数据名称 */ 'message', /* 实际数据 */ 'hello!')
provide('message', 'hello!')
</script>
```

该方法接收的参数也很简单：

1. 数据对应的名称
2. 实际的数据

**2. 注入方**

注入方通过 inject 方法来取得数据。例如：

```html
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

## 相关细节

**1. 非 setup 语法糖**

如果没有使用 setup 语法糖，那么需要**保证 provide 和 inject 方法是在 setup 方法中同步调用的**：

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
  }
}
```

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

因为 Vue 的依赖注入机制需要在组件初始化期间同步建立依赖关系，这样可以**确保所有组件在渲染之前就已经获取到必要的依赖数据**。如果 provide 和 inject 在 setup 之外或异步调用，Vue 无法保证组件初始化完成之前所有的依赖关系已经正确建立。

**2. 全局依赖提供**

```js
// main.js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
```

在应用级别提供的数据在该应用内的所有组件中都可以注入。

**3. 注入默认值**

注入方可以提供一个默认值，这一点类似于 props 的默认值。

```js
// 如果没有祖先组件提供 "message"
// value 会是 "这是默认值"
const value = inject('message', '这是默认值')
```

**4. 提供响应式数据**

提供方所提供的值**可以是任意类型的值**，**包括响应式的值**。

注意点：

1. 如果提供的值是一个 ref，注入进来的会是该 ref 对象，而**不会自动解包**为其内部的值。

2. **尽可能将任何对响应式状态的变更都保持在提供方组件中**

   ```html
   <!-- 在供给方组件内 -->
   <script setup>
   import { provide, ref } from 'vue'
   
   // 响应式数据
   const location = ref('North Pole')
   // 修改响应式数据的方法
   function updateLocation() {
     location.value = 'South Pole'
   }
   
   provide('location', {
     location,
     updateLocation
   })
   </script>
   ```

   ```html
   <!-- 在注入方组件 -->
   <script setup>
   import { inject } from 'vue'
   // 同时拿到响应式数据，以及修改该数据的方法
   const { location, updateLocation } = inject('location')
   </script>
   
   <template>
     <button @click="updateLocation">{{ location }}</button>
   </template>
   ```

3. 使用 readonly 来提供只读值

   ```html
   <script setup>
   import { ref, provide, readonly } from 'vue'
   
   const count = ref(0)
   provide('read-only-count', readonly(count))
   </script>
   ```

**5. 使用Symbol作为数据名**

大型的应用建议最好使用 Symbol 来作为注入名以避免潜在的冲突。推荐在一个单独的文件中导出这些注入名 Symbol：

```js
// keys.js
export const myInjectionKey = Symbol()
```

```js
// 在供给方组件中
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, { /* 要提供的数据 */ });
```

```js
// 注入方组件
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```



实战案例：整个应用程序在多个组件中共享一些全局配置（主题颜色、用户信息...）


# 组合式函数

组合式函数，本质上也就是**代码复用**的一种方式。

- 组件：对结构、样式、逻辑进行复用
- 组合式函数：侧重于对 **有状态** 的逻辑进行复用



**快速上手**

实现一个鼠标坐标值的追踪器。

```html
<template>
  <div>当前鼠标位置: {{ x }}, {{ y }}</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<style scoped></style>
```

多个组件中**复用这个相同的逻辑**，该怎么办？

答：使用组合式函数。将包含了状态的相关逻辑，一起提取到一个单独的函数中，该函数就是组合式函数。



**相关细节**

**1. 组合式函数本身还可以相互嵌套**

**2. 和Vue2时期mixin区别**

解决了 Vue2 时期 mixin 的一些问题。

1. 不清晰的数据来源：当使用多个 minxin 的时候，实例上的数据属性来自于哪一个 mixin 不太好分辨。

2. 命名空间冲突：如果多个 mixin 来自于不同的作者，可能会注册相同的属性名，造成命名冲突

   mixin

   ```js
   const mixinA = {
     methods: {
       fetchData() {
         // fetch data logic for mixin A
         console.log('Fetching data from mixin A');
       }
     }
   };
   
   const mixinB = {
     methods: {
       fetchData() {
         // fetch data logic for mixin B
         console.log('Fetching data from mixin B');
       }
     }
   };
   
   new Vue({
     mixins: [mixinA, mixinB],
     template: `
       <div>
         <button @click="fetchData">Fetch Data</button>
       </div>
     `
   });
   ```

   组合式函数：

   ```js
   // useMixinA.js
   import { ref } from 'vue';
   
   export function useMixinA() {
     function fetchData() {
       // fetch data logic for mixin A
       console.log('Fetching data from mixin A');
     }
   
     return { fetchData };
   }
   
   // useMixinB.js
   import { ref } from 'vue';
   
   export function useMixinB() {
     function fetchData() {
       // fetch data logic for mixin B
       console.log('Fetching data from mixin B');
     }
   
     return { fetchData };
   }
   ```

   组件使用上面的组合式函数：

   ```js
   import { defineComponent } from 'vue';
   import { useMixinA } from './useMixinA';
   import { useMixinB } from './useMixinB';
   
   export default defineComponent({
     setup() {
       // 这里必须要给别名
       const { fetchData: fetchDataA } = useMixinA();
       const { fetchData: fetchDataB } = useMixinB();
   
       fetchDataA();
       fetchDataB();
   
       return { fetchDataA, fetchDataB };
     },
     template: `
       <div>
         <button @click="fetchDataA">Fetch Data A</button>
         <button @click="fetchDataB">Fetch Data B</button>
       </div>
     `
   });
   ```

3. 隐式的跨mixin交流

   mixin

   ```js
   export const mixinA = {
     data() {
       return {
         sharedValue: 'some value'
       };
     }
   };
   ```

   ```js
   export const minxinB = {
     computed: {
       dValue(){
         // 和 mixinA 具有隐式的交流
         // 因为最终 mixin 的内容会被合并到组件实例上面，因此在 mixinB 里面可以直接访问 mixinA 的数据
         return this.sharedValue + 'xxxx';
       }
     }
   }
   ```

   组合式函数：交流就是显式的

   ```js
   import { ref } from 'vue';
   
   export function useMixinA() {
     const sharedValue = ref('some value');
     return { sharedValue };
   }
   ```

   ```js
   import { computed } from 'vue';
   
   export function useMixinB(sharedValue) {
     const derivedValue = computed(() => sharedValue.value + ' extended');
     return { derivedValue };
   }
   ```

   ```html
   <template>
     <div>
       {{ derivedValue }}
     </div>
   </template>
   
   <script>
   import { defineComponent } from 'vue';
   import { useMixinA } from './useMixinA';
   import { useMixinB } from './useMixinB';
   
   export default defineComponent({
     setup() {
       const { sharedValue } = useMixinA();
       
       // 两个组合式函数的交流是显式的
       const { derivedValue } = useMixinB(sharedValue);
   
       return { derivedValue };
     }
   });
   </script>
   ```

   

**异步状态**

根据异步请求的情况显示不同的信息：

```html
<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref } from 'vue'

// 发送请求获取数据
const data = ref(null)
// 错误
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>
```

如何复用这段逻辑？仍然是提取成一个组合式函数。

如下：

```js
import { ref } from 'vue'
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

现在重构上面的组件：

```html
<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import {useFetch} from './hooks/useFetch';
const {data, error} = useFetch('xxxx')
</script>
```



这里为了更加灵活，我们想要传递一个响应式数据：

```js
const url = ref('first-url');
// 请求数据
const {data, error} = useFetch(url);
// 修改 url 的值后重新请求数据
url.value = 'new-url';
```

此时我们就需要重构上面的组合式函数：

```js
import { ref, watchEffect, toValue } from 'vue'
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // 每次执行 fetchData 的时候，重制 data 和 error 的值
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```



**约定和最佳实践**

**1. 命名**：组合式函数约定用**驼峰命名法**命名，并**以“use”作为开头**。例如前面的 useMouse、useEvent.

**2. 输入参数**：注意参数是**响应式数据**的情况。如果你的组合式函数在输入参数是 ref 或 getter 的情况下创建了响应式 effect，为了让它能够被正确追踪，请确保要么使用 watch( ) 显式地监视 ref 或 getter，要么在 watchEffect( ) 中调用 toValue( )。

**3. 返回值**

组合式函数中推荐返回一个普通对象，该对象的每一项是 ref 数据，这样可以保证在解构的时候仍然能够保持其响应式的特性：

```js
// 组合式函数
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  // ...
  
  return { x, y }
}
```

```js
import { useMouse } from './hooks/useMouse'
// 可以解构
const { x, y } = useMouse()
```

如果希望以对象属性的形式来使用组合式函数中返回的状态，可以将返回的对象用 reactive 再包装一次即可：

```js
import { useMouse } from './hooks/useMouse'
const mouse = reactive(useMouse())
```

**4. 副作用**

在组合式函数中可以执行副作用，例如添加 DOM 事件监听器或者请求数据。但是请确保在 onUnmounted 里面清理副作用。

例如在一个组合式函数设置了一个事件监听器，那么就需要在 onUnmounted 的时候移除这个事件监听器。

```js
export function useMouse() {
  // ...

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

	// ...
}
```

也可以像前面 useEvent 一样，专门定义一个组合式函数来处理副作用：

```js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 专门处理副作用的组合式函数
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

**5. 使用限制**

1. 只能在 \<script setup>或 setup( ) 钩子中调用：确保在组件实例被创建时，所有的组合式函数都被正确初始化。特别如果你使用的是选项式 API，那么需要在 setup 方法中调用组合式函数，并且返回，这样才能暴露给 this 及其模板使用

   ```js
   import { useMouse } from './mouse.js'
   import { useFetch } from './fetch.js'
   
   export default {
     setup() {
       // 因为组合式函数会返回一些状态
       // 为了后面通过 this 能够正确访问到这些数据状态
       // 必须在 setup 的时候调用组合式函数
       const { x, y } = useMouse()
       const { data, error } = useFetch('...')
       return { x, y, data, error }
     },
     mounted() {
       // setup() 暴露的属性可以在通过 `this` 访问到
       console.log(this.x)
     }
     // ...其他选项
   }
   ```

2. 只能被同步调用：组合式函数需要同步调用，以确保在组件实例的初始化过程中，所有相关的状态和副作用都能被正确地设置和处理。如果组合式函数被异步调用，可能会导致在组件实例还未完全初始化时，尝试访问未定义的实例数据，从而引发错误。

3. 可以在像 onMounted 生命周期钩子中调用：在某些情况下，可以在如 onMounted 生命周期钩子中调用组合式函数。这些生命周期钩子也是**同步执行**的，并且在组件实例已经被初始化后调用，因此可以安全地使用组合式函数。


# 自定义指令

Vue内置指令：

- v-if
- v-for
- v-show
- v-html
- v-model
- v-on
- v-bind
- ....

自定义指令的本质也是一种复用。

目前为止复用的方式有：

- 组件: 对结构、样式、逻辑的一种复用
- 组合式函数：侧重于对**有状态的逻辑**进行复用
- 自定义指令：重用涉及普通元素的底层 DOM 访问的逻辑

**快速上手**

App.vue

```html
<template>
  <input type="text" v-focus />
</template>

<script setup>
// 这里是局部注册自定义指令，只在 App.vue里面生效
const vFocus = {
  // 键值对
  // 键：生命周期钩子 值：函数
  mounted: (el) => {
    // 这个是 DOM 原生方法，用来让元素获取焦点
    el.focus()
  }
}
</script>

<style scoped></style>
```


**相关细节**

**1. 不同组件写法下的自定义指令**

1. Vue3 setup 语法

   setup 写法中**任何以 v 开头的驼峰式命名的变量**都可以被用作一个自定义指令。

2. 非 setup 语法：**需要在 directives 中进行注册**，例如：

   App.vue

   ```html
   <script>
   export default {
     // 有一个directives的配置选项
     directives: {
       focus: {
         mounted: (el) => el.focus()
       }
     }
   }
   </script>
   
   <template>
     <input v-focus />
   </template>
   ```

**2. 全局注册**

在 app 应用实例上面通过 directive 来进行注册。

main.js

```js
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// 创建一个全局的自定义指令 v-focus
// 全局注册的自定义指令可以在所有组件里面使用
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});

app.mount('#app');
```

简化写法：

```js
// 注意第二个参数，不再是对象而是函数
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

第二个参数是一个函数而非对象，之前对象可以指定具体哪个生命周期，而**函数对应的就固定是 mounted 和 updated 生命周期**。

**3. 指令钩子**

对象内是和生命周期钩子相关的键值对，可以选择其他生命周期钩子函数：

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {}
}
```

指令的钩子函数，会有这么一些参数：

1. el：**指令绑定到的元素**。这可以用于直接操作 DOM。

2. binding：这是一个**对象**

   - value：传递给指令的值。例如在 v-my-directive="1 + 1" 中，值是 2。 
   - oldValue：之前的值，仅在 beforeUpdate 和 updated 中可用。无论值是否更改，它都可用。 
   - arg：传递给指令的**参数** (如果有的话)。例如在 v-my-directive:foo 中，参数是 "foo"。 
   - modifiers：一个包含**修饰符的对象**。例如在 v-my-directive.foo.bar 中，修饰符对象是 { foo: true, bar: true }。 
   - instance：使用该指令的**组件实例**。 
   - dir：指令的定义对象。

   例如：

   ```html
   <div v-example:foo.bar="baz">
   ```

   binding 参数如下：

   ```js
   {
     arg: 'foo',
     modifiers: { bar: true },
     value: /* baz 的值 */,
     oldValue: /* 上一次更新时 baz 的值 */
   }
   ```

   换句话说，通过 binding 对象，可以获取到用户在使用指令时的一些 **详细** 信息，回头需要根据这些详细信息做不同处理。

   再来看一个前面学过的内置指令：

   ```html
   <div v-bind:id="id">
   ```

   binding 参数如下：

   ```js
   {
     arg: 'id',
     value: /* id 的值 */,
     oldValue: /* 上一次更新时 id 的值 */
   }
   ```

3. vnode：代表绑定元素的底层 VNode。

4. preVnode：代表之前的渲染中指令所绑定元素的 VNode。仅在 beforeUpdate 和 updated 钩子中可用。

**4. 传递多个值**

正常情况下，会给指令传递一个值，例如：

```html
<div v-bind:id="id">
```

这里给指令传递的值就是 id.

但是有些时候的需求是传递多个值，这个时候可以使用**对象字面量**，例如：

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

这里就通过对象的方式传递了多个值：

```js
app.directive('demo', (el, binding) => {
  // binding.value 
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

**实战案例**

1. 创建一个自定义指令 v-permission，用于控制 DOM 元素根据用户权限列表来显示
```html
<template>
  <div>
    <!-- 具有 read 权限的用户才能看到这个按钮 -->
    <button v-permission="['read']">读取按钮</button>
    <!-- 具有 write 权限的用户才能看到这个按钮 -->
    <button v-permission="['write']">写入按钮</button>
    <!-- 具有 admin 权限的用户才能看到这个按钮 -->
    <button v-permission="['admin']">管理权限</button>
  </div>
</template>

```
```js

// 模拟用户权限
const userPermissions = ['admin', 'read']

const app = createApp(App)

app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding
    if (value && value instanceof Array) {
      // 检查用户权限是否包含指令传入的权限
      const hasPermission = value.some((item) => userPermissions.includes(item))
      if (!hasPermission) {
        el.style.display = 'none'
      }
    } else {
      throw new Error('请传入一个权限数组')
    }
  }
})

app.mount('#app')
```
2. 创建一个自定义指令 v-time，用于显示相对时间，例如 XX秒前、XX分前、XX小时前、20XX-XX-XX

```js
// 接下来需要对时间戳进行一个转换
const time = {
  // 获取当前时间戳
  getUnix() {
    const date = new Date()
    return date.getTime()
  },
  // 获取今天0时0分0秒的时间戳
  getTodayUnix() {
    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },
  // 获取今年 1 月 1 日 0 点 0 分 0 秒的时间戳
  getYearUnix: function () {
    var date = new Date()
    date.setMonth(0)
    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },
  // 获取标准年月日
  getLastDate: function (time) {
    var date = new Date(time)
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return date.getFullYear() + '-' + month + '-' + day
  },
  // 转换时间
  getFormatTime(timestamp) {
    // 根据时间戳来决定返回的提示信息
    var now = this.getUnix()
    var today = this.getTodayUnix()
    var timer = (now - timestamp) / 1000
    var tip = ''

    if (timer <= 0) {
      tip = '刚刚'
    } else if (Math.floor(timer / 60) <= 0) {
      tip = '刚刚'
    } else if (timer < 3600) {
      tip = Math.floor(timer / 60) + '分钟前'
    } else if (timer >= 3600 && timestamp - today >= 0) {
      tip = Math.floor(timer / 3600) + '小时前'
    } else if (timer / 86400 <= 31) {
      tip = Math.ceil(timer / 86400) + '天前'
    } else {
      tip = this.getLastDate(timestamp)
    }
    return tip
  }
}

app.directive('time', {
  mounted(el, binding) {
    // 拿到时间戳
    const { value } = binding
    el.innerHTML = time.getFormatTime(value)
    // 并且创建一个计时器，实时的更新提示信息
    el.timeout = setInterval(() => {
      el.innerHTML = time.getFormatTime(value)
    }, 60000)
  },
  unmounted(el) {
    clearInterval(el.timeout)
    delete el.timeout
  }
})
```

# 「❤️ 感谢大家」

如果你觉得这篇内容对你挺有有帮助的话：
点赞支持下吧，让更多的人也能看到这篇内容（收藏不点赞，都是耍流氓 -\_-）欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。觉得不错的话，也可以阅读 Sunny 近期梳理的文章（感谢掘友的鼓励与支持 🌹🌹🌹）：

**我的博客：**

**Github：**[**https://github.com/sunny-117/**](https://github.com/sunny-117/)

**前端八股文题库：**[https://sunny-117.github.io/blog/](https://sunny-117.github.io/blog/)

**前端面试手写题库：**[https://github.com/Sunny-117/js-challenges](https://github.com/Sunny-117/js-challenges)

**手写前端库源码教程：**[https://sunny-117.github.io/mini-anything](https://sunny-117.github.io/mini-anything/)

**热门文章**

- [✨ 爆肝 10w 字，带你精通 React18 架构设计和源码实现【上】](https://juejin.cn/spost/7381371976035532835)
- [✨ 爆肝 10w 字，带你精通 React18 架构设计和源码实现【下】](https://juejin.cn/spost/7381395976676196387)
- [前端包管理进阶：通用函数库与组件库打包实战](https://juejin.cn/post/7376827589909266458)
- [🍻 前端服务监控原理与手写开源监控框架 SDK](https://juejin.cn/post/7374265502669160482)
- [🚀 2w 字带你精通前端脚手架开源工具开发](https://juejin.cn/post/7363607004348989479)
- [🔥 爆肝 5w 字，带你深入前端构建工具 Rollup 高阶使用、API、插件机制和开发](https://juejin.cn/post/7363607004348923943)
- [🚀 Rust 构建简易实时聊天系统](https://juejin.cn/post/7389952004792434688)

**专栏**

- [精通现代前端工具链及生态](https://juejin.cn/column/7287224080172302336)
- [Vue 3 设计哲学与源码揭秘](https://juejin.cn/column/7391745629876830208)
- [esbuild 原理与应用实战](https://juejin.cn/column/7285233095058718756)
- [js-challanges 题解来了，迎接你的校招提前批](https://juejin.cn/column/7244788137410560055)
