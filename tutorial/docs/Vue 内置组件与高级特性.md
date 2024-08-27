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


# Transition

Transition 是 Vue 提供的一个内置组件，作用：会在一个元素或组件**进入**和**离开** DOM 时应用动画。

在 Web 应用中，有一个很常见的需求，就是针对元素的进入或者离开应用动画。

不用 Transition 组件行不行？

当然可以。

1. 不用 Transition 代码示例

   ```html
   <template>
     <div>
       <button @click="show = !show">切换</button>
       <div :class="['fade', { active: show, leave: !show }]">
         <h1>动画</h1>
         <p>淡入淡出</p>
       </div>
     </div>
   </template>
   
   <script setup>
   import { ref } from 'vue'
   const show = ref(true)
   </script>
   
   <style scoped>
   .fade {
     transition: 1s;
   }
   
   .active {
     opacity: 1;
   }
   
   .leave {
     opacity: 0;
   }
   </style>
   ```

2. 使用 Transition 代码示例

   ```html
   <template>
     <div>
       <button @click="show = !show">切换</button>
       <div :class="['fade', { active: show, leave: !show }]">
         <h1>动画</h1>
         <p>淡入淡出</p>
       </div>
       <Transition>
         <div v-if="show">
           <h1>动画</h1>
           <p>淡入淡出</p>
         </div>
       </Transition>
     </div>
   </template>
   
   <script setup>
   import { ref } from 'vue'
   const show = ref(true)
   </script>
   
   <style scoped>
   .fade {
     transition: 1s;
   }
   
   .active {
     opacity: 1;
   }
   
   .leave {
     opacity: 0;
   }
   
   .v-enter-active,
   .v-leave-active {
     transition: opacity 1s;
   }
   
   .v-enter-from,
   .v-leave-to {
     opacity: 0;
   }
   
   .v-enter-to,
   .v-leave-from {
     opacity: 1;
   }
   </style>
   ```

思考🤔：使用 Transition 带来的好处是什么？

使用 Transition，它会自动的控制一组特定样式类的挂载和移除，这样的话模板就会清爽很多。但是对应的样式类还是要自己来写，因为 Vue无法预知你要如何进入和离开，它只负责在特定时间挂载和移除样式类。

Transition 样式类有 6 个，分别对应两大阶段：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-16-061603.png" alt="image-20240716141603030" style="zoom:65%;" />

1. 进入
   - v-enter-from
   - v-enter-to
   - v-enter-active
2. 离开
   - v-leave-from
   - v-leave-to
   - v-leave-active

以进入为例，Vue 会在元素**插入之前**，自动的挂上 v-enter-from 以及 v-enter-active 类，类似于：

```html
<div v-if="show" class="v-enter-from v-enter-active">
  <h1>动画</h1>
  <p>淡入淡出</p>
</div>
```

**元素插入完成后**，会移除 v-enter-from 样式类，然后插入 v-enter-to，类似于：

```html
<div v-if="show" class="v-enter-to v-enter-active">
  <h1>动画</h1>
  <p>淡入淡出</p>
</div>
```

也就是说，整个从插入前到插入后，v-enter-active 样式类是一直有的，不过插入前会挂载 v-enter-from，插入后会挂载 v-enter-to

而这 3 个样式类所对应的样式分别是：

- v-enter-from：opacity: 0;
- v-enter-to：opacity: 1;
- v-enter-active：transition: opacity 3s;

这就自然出现了淡入淡出的效果。**当整个过渡效果结束后，这 3 个辅助样式类会一并被移除掉**。



**其他相关细节**

**1. 过渡效果命名**

假设 Transition 传递了 name 属性，那么就不会以 v 作为前缀，而是以 name 作为前缀：

```html
<Transition name="fade">
  ...
</Transition>
```

- fade-enter-from
- fade-enter-to
- fade-enter-active

另外还可以直接指定过渡的类是什么，可以传递这些 props 来指定自定义 class：

- enter-from-class
- enter-active-class
- enter-to-class
- leave-from-class
- leave-active-class
- leave-to-class

**2. 搭配animation**

也可以搭配 CSS 的 animation 来使用，这个时候只需要简单的在 *-enter/leave-active 样式类下使用动画即可。

```html
<template>
  <div>
    <button @click="show = !show">切换</button>
    <Transition name="bounce">
      <div v-if="show">
        <h1>动画</h1>
        <p>淡入淡出</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<style scoped>
.fade {
  transition: 1s;
}

.active {
  opacity: 1;
}

.leave {
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 1s;
}

.bounce-leave-active {
  animation: bounce-in 1s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

**3. 常用属性**

1. appear：在初始渲染时就应用过渡

2. mode：用于指定过渡模式，可选值有

   - in-out：新元素先执行过渡，旧元素等待新元素过渡完成后再离开
   - out-in：旧元素先执行过渡，旧元素过渡完成后新元素再进入

**4. 使用key**

有些时候会存在这么一种情况，就是不存在元素的进入和离开，仅仅是文本节点的更新，此时就不会发生过渡。

要解决这种情况也很简单，添加上 key 即可。

```html
<template>
  <div>
    <button @click="show = !show">切换</button>
    <Transition name="fade" mode="out-in">
      <p :key="message">{{ message }}</p>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const show = ref(true)
const message = computed(() => {
  return show.value ? 'Hello' : 'World'
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>

```



**实战案例**

图片切换效果



**JS钩子**

除了通过 CSS 来实现动画，常见的实现动画的方式还有就是 JS. Transition 组件也支持 JS 钩子的写法：

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>

<script setup>
const onEnter = (el, done) => {
  // ...
}
</script>
```

done 方法的作用如下：

1. 通知 Vue 过渡完成：在执行完自定义的进入或离开动画后，调用 done 方法告诉 Vue 当前过渡已完成，从而允许 Vue 继续处理 DOM 更新。
2. 处理异步操作：如果在过渡期间需要进行异步操作（例如等待数据加载或执行网络请求），可以在异步操作完成后调用 done 方法。

示例如下：

```html
<template>
  <div class="container">
    <div class="btns">
      <button @click="show = !show">切换</button>
    </div>
    <!-- 之前是在特定的时间挂对应的 CSS 样式类 -->
    <!-- 现在是在特定的时间触发事件处理函数 -->
    <Transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <p v-if="show" class="box">Hello World</p>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(true)

function beforeEnter(el) {
  // 在元素进入之前，设置初始样式
  el.style.opacity = 0
  el.style.transform = 'translateY(-20px)'
}

function enter(el, done) {
  // 这里设置 setTimeout 是为了让浏览器有时间应用初始样式
  // 将这个函数推到下一个事件循环中执行
  // 避免初始样式和目标样式在同一帧中执行
  setTimeout(() => {
    el.style.transition = 'all 1s'
    el.style.opacity = 1
    el.style.transform = 'translateY(0)'
    done()
  }, 0)
}

function leave(el, done) {
  // 因为元素已经在文档中了，直接设置样式即可
  el.style.transition = 'all 1s'
  el.style.opacity = 0
  el.style.transform = 'translateY(-20px)'
  // 这里的 setTimeout 是为了让动画执行完毕后再调用 done
  // 保证和过渡时间一致
  setTimeout(() => {
    done()
  }, 1000)
}
</script>

<style scoped>
.container {
  text-align: center;
}
.btns button {
  margin: 1em 0.5em;
}
.box {
  width: 200px;
  height: 50px;
  background-color: #42b983;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
}
</style>
```



相比前面纯 CSS 的方式，JS 钩子在动画控制方面会更加灵活:

1. 精确控制过渡效果
2. 处理异步操作
3. 动态计算和条件逻辑
4. 与第三方库集成

# TransitionGroup

TransitionGroup 仍然是 Vue 里面一个内置的组件。作用：用于解决**多个元素**的过渡问题。

**案例演示**

下面的代码使用 Transition 为项目添加过渡效果，但是没有生效：

```html
<template>
  <div class="container">
    <div class="btns">
      <button @click="addItem">添加项目</button>
      <button @click="removeItem">移除项目</button>
    </div>
    <Transition name="fade">
      <ul>
        <li v-for="item in items" :key="item" class="box">{{ item }}</li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref(['内容1', '内容2', '内容3'])

const addItem = () => {
  items.value.push(`内容${items.value.length + 1}`)
}

const removeItem = () => {
  items.value.pop()
}
</script>

<style>
.container {
  text-align: center;
}
.btns button {
  margin: 1em 0.5em;
}
.box {
  background-color: #42b983;
  color: white;
  margin: 5px auto;
  padding: 10px;
  width: 200px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

问题🙋 为什么过渡不生效？

答案：因为这里对项目的新增和移除都是针对的 li 元素，但是 Transition 下面是 ul，ul 是一直存在的。

并且 Transition 下面只能有一个根元素。如果存放多个根元素，会报错：\<Transition> expects exactly one child element or component.

此时就可以使用 TransitionGroup 来解决这个问题。代码重构如下：

```html
<TransitionGroup name="fade" tag="ul">
  <li v-for="item in items" :key="item" class="box">{{ item }}</li>
</TransitionGroup>
```



**相关细节**

TransitionGroup 可以看作是 Transition 的一个升级版，它支持和 Transition 基本相同的 props、CSS 过渡 class 和 JavaScript 钩子监听器，但有以下几点区别： 

1. 默认情况下，它不会渲染一个容器元素。但可以通过传入 tag prop 来指定一个元素作为容器元素来渲染。 
2. 过渡模式 mode 在这里**不可用**，因为不再是在互斥的元素之间进行切换。 
3. 列表中的每个元素都必须有一个独一无二的 key attribute。
4. CSS 过渡 class **会被应用在列表内的元素上**，而不是容器元素上。



**实战案例**

使用过渡效果优化待办事项的显示效果

# Teleport

这是 Vue 里面的一个内置组件。作用：将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。

**快速上手**

模态框：理想情况下，模态框的按钮和模态框本身是在同一个组件中，因为它们都与组件的开关状态有关。但这意味着该模态框将与按钮一起渲染在应用 DOM 结构里很深的地方。

例如：

```html
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">打开模态框</button>

  <div v-if="open" class="modal">
    <p>模态框内容</p>
    <button @click="open = false">关闭</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  border: 1px solid #ccc;
  text-align: center;
}
.modal p {
  padding: 10px;
  margin: 0;
  background-color: #f4f4f4;
  text-align: center;
}
</style>
```

打开该模态框，观察渲染结构：

```html
<div id="app" data-v-app="">
  <div class="outer">
    <h1>Teleport示例</h1>
    <div>
      <button data-v-381af681="">打开模态框</button>
      <div data-v-381af681="" class="modal">
        <p data-v-381af681="">模态框内容</p>
        <button data-v-381af681="">关闭</button>
      </div>
    </div>
  </div>
</div>
```

这里的渲染结构其实是不太合适的。

1. position: fixed 能够相对于浏览器窗口放置有一个条件，那就是不能有任何祖先元素设置了 transform、perspective 或者 filter 样式属性。也就是说如果我们想要用 CSS transform 为祖先节点 \<div class="outer"> 设置动画，就会不小心破坏模态框的布局！
2. 这个模态框的 z-index 受限于它的容器元素。如果有其他元素与 \<div class="outer"> 重叠并有更高的 z-index，则它会覆盖住我们的模态框。

总结起来，就是**模态框的样式会受到所在位置的祖级元素的影响**。



以前书写原生 HTML 的时候，模特框一般都是在最外层：

```html
<body>
  <div class="container">
  	<!-- 其他代码 -->
  </div>
  <div class="modal"></div>
</body>
```

这种场景就可以使用 Teleport

```html
<Teleport to="body">
  <div v-if="open" class="modal">
    <p>模态框内容</p>
    <button @click="open = false">关闭</button>
  </div>
</Teleport>
```

使用 to 属性来指定要渲染的位置。



**实战案例**

用户管理模块中，有一个全局的“用户详情”对话框，该对话框可以在页面的任何地方被触发显示。为了使该对话框在 DOM 结构上位于应用的根元素下，并且避免它受到父组件的 CSS 样式影响，可以使用 Teleport 组件将该对话框传送到指定的 DOM 节点。

# 异步组件

异步组件：指的是**在需要时才加载**的组件。

**基本用法**

在 Vue 中，可以通过 defineAsyncComponent 来定义一个异步组件

```js
import { defineAsyncComponent } from 'vue'

// 之后就可以像使用普通组件一样，使用 AsyncCom 这个异步组件
const AsyncCom = defineAsyncComponent(()=>{
  // 这是一个工厂函数，该工厂函数一般返回一个 Promise
  return new Promise((resolve, reject)=>{
    resolve(/* 获取到的组件 */)
  })
})
```

ES模块的动态导入返回的也是一个 Promise，所以多数情况下可以和 defineAsyncComponent 配合着一起使用

```js
import { defineAsyncComponent } from 'vue'

// 之后就可以像使用普通组件一样，使用 AsyncCom 这个异步组件
const AsyncCom = defineAsyncComponent(()=>{
 	import('.../MyCom.vue')
})
```



**快速上手**

```
src/
├── components/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

App.vue

```html
<template>
  <div id="app">
    <button @click="currentComponent = Home">访问主页</button>
    <button @click="currentComponent = About">访问关于</button>
    <component :is="currentComponent" v-if="currentComponent"></component>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'
import Home from './components/Home.vue'
import About from './components/About.vue'
const currentComponent = shallowRef(null)
</script>
```

在 App.vue 中，通过 import 导入了 Home 和 About，这相当于在应用启动时立即加载所有被导入的组件，这会导致初始加载时间较长，特别是在组件数量较多的时候。

重构 App.vue，使用异步组件来进行优化：

```html
<template>
  <div id="app">
    <button @click="loadComponent('Home')">访问主页</button>
    <button @click="loadComponent('About')">访问关于</button>
    <component :is="currentComponent" v-if="currentComponent"></component>
  </div>
</template>

<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'
// import Home from './components/Home.vue'
// import About from './components/About.vue'

const currentComponent = shallowRef(null)
/**
 *
 * @param name 组件名
 */
const loadComponent = (name) => {
  currentComponent.value = defineAsyncComponent(() => import(`./components/${name}.vue`))
}
</script>
```

相比之前一开始就通过 import 导入 Home 和 About 组件，现在改为了点击按钮后才会 import，从而实现了懒加载的特性。



**其他细节**

**1. 全局注册**

与普通组件一样，异步组件可以使用 app.component( ) 全局注册：

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

**2. 可以在父组件中定义**

```html
<script setup>
import { defineAsyncComponent } from 'vue'

// 在父组件里面定义了一个异步组件
const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
	<!-- 使用异步组件就像使用普通组件一样 -->
  <AdminPage />
</template>
```

**3. 支持的配置项**

defineAsyncComponent 方法支持传入一些配置项，此时不再是传递工厂函数，而是传入一个**配置对象**

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  // 如果提供了一个加载组件，它将在内部组件加载时先行显示。
  loadingComponent: LoadingComponent,
  
  // 展示加载组件前的延迟时间，默认为200ms
  // 在网络状况较好时，加载完成得很快，加载组件和最终组件之间的替换太快可能产生闪烁，反而影响用户感受。
  // 通过延迟来解决闪烁问题
  delay: 200,

  // 加载失败后展示的组件
  // 如果提供了一个报错组件，则它会在加载器函数返回的 Promise 抛错时被渲染。
  errorComponent: ErrorComponent,
  
  // 你还可以指定一个超时时间，在请求耗时超过指定时间时也会渲染报错组件。
  // 默认值是：Infinity
  timeout: 3000
})
```

异步组件经常和内置组件 Suspense 搭配使用，给用户提供更好的用户体验。

# Suspense

Suspense，本意是“悬而未决”的意思，这是 Vue3 新增的一个内置组件，主要用来在组件树中协调对异步依赖的处理。

假设有如下目录结构：

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>（内容一）
   │  └─ <FriendStatus>（好友状态组件：有异步的setup方法）
   └─ <Content>（内容二）
      ├─ <ActivityFeed> （活动提要：异步组件）
      └─ <Stats>（统计组件：异步组件）
```

在这个组件树中有多个嵌套组件，要渲染出它们，首先得解析一些异步资源。

每个异步组件需要处理自己的加载、报错和完成状态。在最坏的情况下，可能会在页面上看到三个旋转的加载状态，然后在不同的时间显示出内容。

有了 \<Suspense> 组件后，我们就可以在等待整个多层级组件树中的各个异步依赖获取结果时，**在顶层统一处理加载状态**。

\<Suspense> 可以等待的异步依赖有两种：

1. 带有**异步 setup( ) 钩子的组件**。这也包含了使用 \<script setup> 时有**顶层 await 表达式的组件**

   ```js
   export default {
     async setup() {
       const res = await fetch(...)
       const posts = await res.json()
       return {
         posts
       }
     }
   }
   ```

   ```html
   <script setup>
   const res = await fetch(...)
   const posts = await res.json()
   </script>
   
   <template>
     {{ posts }}
   </template>
   ```

2. 异步组件



在 \<Suspense> 组件中有两个插槽，两个插槽都只允许**一个**直接子节点。

1. \#default：当所有的异步依赖都完成后，会进入**完成**状态，展示默认插槽内容。
2. \#fallback：如果有任何异步依赖未完成，则进入**挂起**状态，在挂起状态期间，**展示的是后备内容**。



**快速上手**

```
App.vue
└─ Dashboard.vue
   ├─ Profile.vue
   │  └─ FriendStatus.vue（组件有异步的 setup）
   └─ Content.vue
      ├─ AsyncActivityFeed（异步组件）
      │  └─ ActivityFeed.vue
      └─ AsyncStats（异步组件）
         └─ Stats.vue
```

实现效果：使用 Suspense 统一显示状态

🤔 思考：假设想要让 Profile 组件内容先显示出来，不等待 Content 组件的异步完成状态，该怎么做？



**其他细节**

**1. 内置组件嵌套顺序**

\<Suspense> 经常会和 \<Transition>、\<KeepAlive> 搭配着一起使用，此时就涉及到一个**嵌套的顺序**问题，谁在外层，谁在内层。

下面是一个模板：

```html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- 主要内容 -->
          <component :is="Component"></component>

          <!-- 加载中状态 -->
          <template #fallback>
            正在加载...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

你可以根据实际开发需求，删减你不需要的组件。

**2. 事件**

\<Suspense> 组件会触发三个事件：

- pending：在进入挂起状态时触发
- resolve：在 default 插槽完成获取新内容时触发
- fallback：显示后备内容的时候触发


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
