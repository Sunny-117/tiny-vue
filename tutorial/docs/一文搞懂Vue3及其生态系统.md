# 一文搞懂 Vue3 及其生态系统

## 搭建工程

### 包管理器

搭建工程首先需要一个包管理器

- npm
- pnpm
- yarn
- bun

搭建工程文档：https://vuejs.org/guide/quick-start.html

### 项目结构

项目结构如下：

- **.vscode**：这个文件夹通常包含了 Visual Studio Code 的配置文件，用来设置代码格式化、主题样式等。
- **node_modules**：这个文件夹内包含项目所需的所有 node 包。当运行 npm install 或 yarn 时，所有在 package.json 中列出的依赖都会被安装到这个文件夹下。
- **public**：用来存放静态资源的文件夹，这部分静态资源是不会经过构建工具处理的。例如 favicon 图标文件。
- **src**：源码文件夹，我们的开发工作主要就是在这个目录下面。通常包括 Vue 组件、JavaScript 文件、样式文件等。
  - assets：这个同样是静态资源目录，放在该目录下的静态资源在打包的时候会被构建工具处理。
  - components：组件目录，存放各种功能组件
  - App.vue：根组件
  - main.js：入口 JS 文件
- **.eslintrc.cjs**：ESLint 的配置文件，用于检查代码错误和风格问题，cjs 是 CommonJS 的配置文件格式。
- **.gitignore**：Git 的配置文件，用于设置不需要加入版本控制的文件或文件夹。
- **.prettierrc.json**：Prettier 的配置文件，Prettier 是一个代码格式化工具。
- **index.html**：项目的入口 HTML 文件，Vite 将利用它来处理应用的加载。
- **jsconfig.json**：JavaScript 的配置文件，用于告诉 VS Code 如何处理 JavaScript 代码，例如设置路径别名。
- **package-lock.json**：锁定安装时的包的版本，确保其他人在 npm install 时，大家的依赖能保持一致。
- **package.json**：定义了项目所需的各种模块以及项目的配置信息（例如项目的名称、版本、许可证等）。
- **README.md**：项目的说明文件，通常包含项目介绍、使用方法、贡献指南等。
- **vite.config.js**：Vite 的配置文件，用于定制 Vite 的构建和开发服务等。

### VSCode 插件

- **Vue VSCode Snippets**：可以快速生成 Vue 代码的模板
- **Vue-Official**
  - 在 Vue2 时间，大家接触更多的是 Vetur，该插件主要是对 Vue 单文件组件提供高亮，语法支持和检测功能。
  - 后面随着 Vue3 版本的发布，Vue 官方团队推荐使用 Volar 插件，该插件覆盖了 Vetur 所有的功能，并且支持 Vue3 版本，还支持 TS 的语法检测。
  - 但是现在，无论是 Vetur、Volar、TypeScript Vue Plugin 已经成为历史了，目前官方推出了 Vue-Official，这个最新的插件将前面插件的所有功能都涵盖了。

### Vite

官网：https://vitejs.dev/

官方推荐的构建工具，显著提升开发体验。

Vite 之所以能够提升开发体验，是因为它的工作原理和 Webpack 完全不同。Vite 压根儿就不打包，而是通过请求本地服务器的方式来获取文件。

常用的配置如下：

1. **base**：用于设置项目的基础路径。这对于部署到非根目录的项目特别有用。
2. **server**：配置开发服务器的选项，例如
   - 端口（port）
   - 自动打开浏览器（open）
   - 跨源资源共享（cors）
   - 代理配置（proxy）
   - .....
3. **build**：包含构建过程的配置，例如
   - 输出目录（outDir）
   - 生产环境源码地图（sourcemap）
   - 压缩（minify）
   - 分块策略（rollupOptions）
   - .....
4. **css**：用于配置 CSS 相关选项，如预处理器配置、模块化支持等。
5. **esbuild**：可以自定义 ESBuild 的配置，例如指定 JSX 的工厂函数和片段。
6. **optimizeDeps**：用于预构建依赖管理，可以指定需要预构建的依赖，以加速冷启动时间。
7. **define**：允许你定义在源码中全局可用的常量替换。
8. **publicDir**：设置公共静态资源目录，默认为 public。



## 模板语法

所谓模板，是 Vue 中构建视图的地方。

模板的写法基本上和 HTML 是一模一样的，上手无难度。

不过这个之所以被称之为模板，就是因为这个和之前的模板引擎类似，提供了一些不同于纯 HTML 的特性。


### 文本插值

可以在模板里面使用一对大括号（双大括号、猫须语法），括号内部就可以绑定动态的数据。

```html
<template>
  <div>{{ name }}</div>
</template>

<script setup>
const name = 'Steve'
</script>

<style lang="scss" scoped></style>

```



### 原始HTML

有些时候，变量的值对应的是一段 HTML 代码，但是普通的文本插值只会将这段 HTML 代码原封不动的输出

例如：

```html
<template>
  <div>{{ htmlCode }}</div>
</template>

<script setup>
const htmlCode = '<span style="color:red">this is a test</span>'
</script>

<style lang="scss" scoped></style>
```

如果想要让上面的 HTML 字符串以 HTML 的形式渲染出来，那么需要指令。

指令是带有 v- 前缀的特殊属性。Vue 提供了一部分内置指令，开发者还可以自定义指令。

Vue 中所有内置的指令：https://cn.vuejs.org/api/built-in-directives.html

这里我们需要用到 v-html 的指令，例如：

```html
<template>
  <div v-html="htmlCode"></div>
</template>

<script setup>
const htmlCode = '<span style="color:red">this is a test</span>'
</script>

<style lang="scss" scoped></style>
```



### 绑定属性

Vue 中的核心思想，就是将模板中所有的东西都通过数据来控制，除了普通文本以外，属性应该由数据来控制，这就是所谓的属性绑定。

例如：

```html
<template>
  <div v-bind:id="id">hello</div>
</template>

<script setup>
const id = 'my-id'
</script>

<style lang="scss" scoped></style>
```

属性的动态绑定用得非常的多，因此有一种简写形式，直接用一个冒号（ : ）表示该属性是动态绑定的

```html
<template>
  <div :id="id">hello</div>
</template>

<script setup>
const id = 'my-id'
</script>

<style lang="scss" scoped></style>
```

另外还有一种简写形式，这种形式 **<u>Vue3.4 以上版本才能用</u>**，如果动态绑定的属性和数据同名，那么可以直接简写：

```html
<template>
  <div :id>hello</div>
</template>

<script setup>
const id = 'my-id'
</script>

<style lang="scss" scoped></style>
```



在 HTML 中，有一类属性是比较特殊的，就是布尔类型属性，例如 disabled，针对这一类布尔属性，绑定的数据不同，会有不同的表现

- 如果所绑定的数据是真值或者空字符串，该布尔值属性会存在
- 如果所绑定的数据是假值（null 和 undefined），该布尔值属性会被忽略



有些时候，如果想要绑定多个属性，那么这个时候可以直接绑定成一个对象：

```html
<template>
  <div v-bind="attrObj">hello</div>
</template>

<script setup>
const attrObj = {
  id: 'container',
  class: 'wrapper'
}
</script>

<style lang="scss" scoped></style>
```



### 使用JS表达式

目前为止，模板可以绑定数据，但是目前数据是什么，模板中就渲染什么。

但是实际上模板中是可以对要渲染的数据进行一定处理的，通过 JavaScript 表达式来进行处理。

```html
<template>
  <div>{{ number + 1 }}</div>
  <div>{{ ok ? '晴天' : '雨天' }}</div>
  <div>{{ message.split('').reverse().join('') }}</div>
  <div :id="`list-${id}`">{{ id + 100 }}</div>
</template>

<script setup>
const number = 1
const ok = true
const message = 'hello'
const id = 1
</script>

<style lang="scss" scoped></style>
```

这里有一个关键点，就是你要区分什么是表达式，什么是语句

```html
<!-- 这是一个语句，而非表达式 -->
{{ var a = 1 }}
<!-- 条件控制也不支持，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

有一个简单的判断方法：看是否能够写在 return 后面。如果能够写在 return 后面，那么就是表达式，如果不能那么就是语句。

例如函数调用，其实就是一个表达式

```js
return test();
```

```html
{{ test() }}
```



### 模板沙盒化

模板中可以使用表达式，这些表达式都是沙盒化的，沙盒的意义主要在于安全，这里在模板中能够访问到全局对象，但是由于沙盒的存在，对能够访问到的全局对象进行了限制，只能访问 [部分的全局对象](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3)

```html
<template>
  <div>{{ Math.random() }}</div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
```

但是如果是不在上述列表中的，则无法访问到：

```html
<template>
  <div>{{ Math.random() }}</div>
  <div>{{ Test.a }}</div>
</template>

<script setup>
window.Test = {
  a: 1
}
</script>

<style lang="scss" scoped></style>
```

在上面的例子中，我们尝试给 window 挂载一个新的全局对象，然后在模板中进行访问，但是会报错：Cannot read properties of undefined (reading 'a')

如果真的有此需求，需要在 window 上挂载一个全局对象供模板访问，可以使用 app.config.globalProperties，例如：

```js
// main.js
// import './assets/main.css'

import { createApp } from 'vue'
// 引入了根组件
import App from './App.vue'

// 挂载根组件
const app = createApp(App)

// 在这里新增全局对象属性
app.config.globalProperties.Test = {
  a: 'Hello, Global Object!'
}

app.mount('#app')

```




## 响应式基础

### 使用ref

可以使用 ref 创建一个响应式的数据：

```html
<template>
  <div>{{ name }}</div>
</template>

<script setup>
import { ref } from 'vue'
// 现在的 name 就是一个响应式数据
let name = ref('Bill')
console.log(name)
console.log(name.value)
setTimeout(() => {
  name.value = 'Tom'
}, 2000)
</script>

<style lang="scss" scoped></style>
```

ref 返回的响应式数据是一个对象，我们需要通过 .value 访问到内部具体的值。模板中之所以不需要 .value，是因为在模板会对 ref 类型的响应式数据自动解包。

ref 可以持有任意的类型，可以是对象、数组、普通类型的值、Map、Set...

对象的例子：

```html
<template>
  <div>{{ Bill.name }}</div>
  <div>{{ Bill.age }}</div>
</template>

<script setup>
import { ref } from 'vue'
// 现在的 name 就是一个响应式数据
let Bill = ref({
  name: 'Biil',
  age: 18
})
setTimeout(() => {
  Bill.value.name = 'Biil2'
  Bill.value.age = 20
}, 2000)
</script>

<style lang="scss" scoped></style>
```

数组的例子：

```html
<template>
  <div>{{ arr }}</div>
</template>

<script setup>
import { ref } from 'vue'
// 现在的 name 就是一个响应式数据
let arr = ref([1, 2, 3])
setTimeout(() => {
  arr.value.push(4, 5, 6)
}, 2000)
</script>

<style lang="scss" scoped></style>
```



第二个点，ref 所创建的响应式数据是具备深层响应式，这一点主要体现在值是对象，对象里面又有嵌套的对象：

```html
<template>
  <div>{{ Bill.name }}</div>
  <div>{{ Bill.age }}</div>
  <div>{{ Bill.nested.count }}</div>
</template>

<script setup>
import { ref } from 'vue'
// 现在的 name 就是一个响应式数据
let Bill = ref({
  name: 'Biil',
  age: 18,
  nested: {
    count: 1
  }
})
setTimeout(() => {
  Bill.value.name = 'Biil2'
  Bill.value.age = 20
  Bill.value.nested.count += 2
}, 2000)
</script>

<style lang="scss" scoped></style>
```

如果想要放弃深层次的响应式，可以使用 shallowRef，通过 shallowRef 所创建的响应式，不会深层地递归将对象每一层转为响应式，而只会将 .value 的访问转为响应式：

```js
const state = shallowRef({ count: 1});
// 这个操作不会触发响应式更新
state.value.count += 2;
// 只针对 .value 值的更改会触发响应式更新
state.value = { count: 2}
```

具体示例：

```html
<template>
  <div>{{ Bill.name }}</div>
  <div>{{ Bill.age }}</div>
  <div>{{ Bill.nested.count }}</div>
</template>

<script setup>
import { shallowRef } from 'vue'
let Bill = shallowRef({
  name: 'Biil',
  age: 18,
  nested: {
    count: 1
  }
})
// 下面的更新不会触发视图更新
setTimeout(() => {
  Bill.value.name = 'Biil2'
  Bill.value.age = 20
  Bill.value.nested.count += 2
}, 2000)
// 下面的更新会触发视图更新
setTimeout(() => {
  Bill.value = {
    name: 'Biil3',
    age: 30,
    nested: {
      count: 3
    }
  }
}, 4000)
</script>

<style lang="scss" scoped></style>
```



响应式数据的更新，带来了 DOM 的自动更新，但是这个 DOM 的更新并非是同步的，这意味着当响应式数据发生修改后，我们去获取 DOM 值，拿到的是之前的 DOM 数据：

```html
<template>
  <div id="container">{{ count }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
let count = ref(1)
let container = null
setTimeout(() => {
  count.value = 2 // 修改响应式状态
  console.log('第二次打印：', container.innerText)
}, 2000)
// 这是一个生命周期钩子方法
// 会在组件完成初始渲染并创建 DOM 节点后自动调用
onMounted(() => {
  container = document.getElementById('container')
  console.log('第一次打印：', container.innerText)
})
</script>

<style lang="scss" scoped></style>
```

如果想要获取最新的 DOM 数据，可以使用 nextTick，这是 Vue 提供的一个工具方法，会等待下一次的 DOM 更新，从而方便后面能够拿到最新的 DOM 数据。

```html
<template>
  <div id="container">{{ count }}</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
let count = ref(1)
let container = null
setTimeout(async () => {
  count.value = 2 // 修改响应式状态
  // 等待下一个 DOM 更新周期
  await nextTick()
  // 这个时候再打印就是最新的值了
  console.log('第二次打印：', container.innerText)
}, 2000)
// 这是一个生命周期钩子方法
// 会在组件完成初始渲染并创建 DOM 节点后自动调用
onMounted(() => {
  container = document.getElementById('container')
  console.log('第一次打印：', container.innerText)
})
</script>

<style lang="scss" scoped></style>
```

如果不用 async await，那么就是通过回调的形式：

```js
setTimeout(() => {
  count.value = 2 // 修改响应式状态
  // 等待下一个 DOM 更新周期
  nextTick(() => {
    // 这个时候再打印就是最新的值了
    console.log('第二次打印：', container.innerText)
  })
}, 2000)
```

当然还是推荐使用 async await，看上去代码的逻辑更加清晰一些。



### 使用 reactive

reactive 通常将一个对象转为响应式对象

```html
<template>
  <div>{{ state.count1 }}</div>
  <div>{{ state.nested.count2 }}</div>
</template>

<script setup>
import { reactive } from 'vue'
const state = reactive({
  count1: 0,
  nested: {
    count2: 0
  }
})
setTimeout(()=>{
  state.count1++
  state.nested.count2 += 2;
},2000);
</script>

<style lang="scss" scoped></style>
```

Vue 中的响应式底层是通过 ProxyAPI 来实现的，但是这个 ProxyAPI 只能对对象进行拦截，无法对原始值进行拦截。

这里就会产生一个问题：如果用户想要把一个原始值转为响应式，该怎么办？

两种方案：

1. 让用户自己处理，用户需要将自己想要转换的原始值包装为对象，然后再使用 reactive API 🙅
2. 框架层面来处理，多提供一个 API，这个 API 可以帮助用户简化操作，将原始值也能转为响应式数据 🙆

ref 的背后其实也调用了 reactive API

- 原始值：Object.defineProperty
- 复杂值：reactive API



reactive 还有一个相关的 API shallowReactiveAPI，是浅层次的，不会深层次去转换成响应式

```html
<template>
  <div>{{ state.count1 }}</div>
  <div>{{ state.nested.count2 }}</div>
</template>

<script setup>
import { shallowReactive } from 'vue'
const state = shallowReactive({
  count1: 0,
  nested: {
    count2: 0
  }
})
setTimeout(()=>{
  state.count1++
},2000);
setTimeout(()=>{
  state.nested.count2++
},4000)
</script>

<style lang="scss" scoped></style>
```



### 使用细节

先说最佳实践：尽量使用 ref 来作为声明响应式数据的主要 API.



#### reactive局限性

1. 使用 reactvie 创建响应式数据的时候，值的类型是有限的
   - 只能是对象类型（object、array、map、set）
   - 不能够是简单值（string、number、boolean）
2. 第二条算是一个注意点，不能够去替换响应式对象，否则会丢失响应式的追踪

```js
let state = reactive({count : 0});
// 下面的这个操作会让上面的对象引用不再被追踪，从而导致上面对象的响应式丢失
state = reactive({count : 1})
```

3. 对解构操作不友好，当对一个 reactvie 响应式对象进行解构的时候，也会丢失响应式

```js
let state = reactive({count : 0});
// 当进行解构的时候，解构出来的是一个普通的值
let { count } = state;
count++; // 这里也就是单纯的值的改变，不会触发和响应式数据关联的操作

// 另外还有函数传参的时候
// 这里传递过去的也就是一个普通的值，没有响应式
func(state.count)
```



#### ref解包细节

所谓 ref 的解包，指的是自动访问 value，不需要再通过 .value 去获取值。例如模板中使用 ref 类型的数据，就会自动解包。

1. ref作为reactvie对象属性

这种情况下也会自动解包

```html
<template>
  <div></div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const name = ref('Bill')
const state = reactive({
  name
})
console.log(state.name) // 这里会自动解包
console.log(name.value)
</script>

<style lang="scss" scoped></style>
```

如果 ref 作为 shallowReactive 对象的属性，那么不会自动解包

```html
<template>
  <div></div>
</template>

<script setup>
import { ref, shallowReactive } from 'vue'
const name = ref('Bill')
const state = shallowReactive({
  name
})
console.log(state.name.value) // 不会自动解包
console.log(name.value)
</script>

<style lang="scss" scoped></style>
```

因为对象的属性是一个 ref 值，这也是一个响应式数据，因此 ref 的变化会引起响应式对象的更新

```html
<template>
  <div>
    <div>{{ state.name.value }}</div>
  </div>
</template>

<script setup>
import { ref, shallowReactive } from 'vue'
const name = ref('Bill')
const state = shallowReactive({
  name
})
setTimeout(() => {
  name.value = 'Tom'
},2000)
</script>

<style lang="scss" scoped></style>
```

【课堂练习】下面的代码：

1. 为什么 Bill 渲染出来有双引号？
2. 为什么 2 秒后界面没有渲染 Smith ？

```html
<template>
  <div>{{ obj.name }}</div>
</template>

<script setup>
import { ref, shallowReactive } from 'vue'
const name = ref('Bill') // name 是一个 ref 值
const obj = shallowReactive({
  name
})
setTimeout(() => {
  obj.name = 'John'
}, 1000)
setTimeout(() => {
  name.value = 'Smith'
}, 2000)
</script>

<style lang="scss" scoped></style>
```

答案：

1. 因为使用的是 shallowReactive，shallowReactive 内部的 ref 是不会自动解包的
2. 1秒后，obj.name 被赋予了 John 这个字符串值，这就使得和原来的 ref 数据失去了联系

如果想要渲染出 Smith，修改如下：

```js
import { ref, shallowReactive } from 'vue'
const name = ref('Bill') // name 是一个 ref 值
const obj = shallowReactive({
  name
})
setTimeout(() => {
  obj.name.value = 'John'
}, 1000)
setTimeout(() => {
  name.value = 'Smith'
}, 2000)
```

下面再来看一个例子：

```html
<template>
  <div>{{ obj.name.value }}</div>
</template>

<script setup>
import { ref, shallowReactive } from 'vue'
const name = ref('Bill');
const stuName = ref('John');

const obj = shallowReactive({name})

// 注意这句代码，意味着和原来的 name 这个 Ref 失去关联
obj.name = stuName;

setTimeout(()=>{
  name.value = 'Tom';
}, 2000)

setTimeout(()=>{
  stuName.value = 'Smith';
}, 4000)
</script>

<style lang="scss" scoped></style>
```



2. 数组和集合里面使用 ref

如果将 ref 数据作为 reactvie 数组或者集合的一个元素，此时是**不会自动解包的**

```js
// 下面这些是官方所给的例子
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

```html
<template>
  <div></div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const name = ref('Bill')
const score = ref(100)
const state = reactive({
  name,
  scores: [score]
})
console.log(state.name) // 会自动解包
console.log(state.scores[0]) // 不会自动解包
console.log(state.scores[0].value) // 100
</script>

<style lang="scss" scoped></style>
```



3. 在模板中的自动解包

在模板里面，只有顶级的 ref 才会自动解包。

```html
<template>
  <div>
    <div>{{ count }}</div>
    <div>{{ object.id }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0) // 顶级的 Ref 自动解包
const object = {
  id: ref(1) // 这就是一个非顶级 Ref 不会自动解包
}
</script>

<style lang="scss" scoped></style>
```

上面的例子，感觉非顶级的 Ref 好像也能够正常渲染出来，仿佛也是自动解包了的。

但是实际情况并非如此。

```html
<template>
  <div>
    <div>{{ count + 1 }}</div>
    <div>{{ object.id + 1 }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0) // 顶级的 Ref 自动解包
const object = {
  id: ref(1) // 这就是一个非顶级 Ref 不会自动解包
}
</script>

<style lang="scss" scoped></style>
```

例如我们在模板中各自加 1 就会发现上面因为已经解包出来了，所以能够正常的进行表达式的计算。

但是下面因为没有解包，意味着 object.id 仍然是一个对象，因此最终计算的结果为 [object Object]1

因此要访问 object.id 的值，没有自动解包我们就手动访问一下 value

```html
<template>
  <div>
    <div>{{ count + 1 }}</div>
    <div>{{ object.id.value + 1 }}</div>
  </div>
</template>
```



## 响应式常用API

- ref 相关：toRef、toRefs、unRef
- 只读代理：readonly
- 判断相关：isRef、isReactive、isProxy、isReadonly
- 3.3新增API：toValue

### ref相关

toRef：基于响应式对象的某一个属性，将其转换为 ref 值

```js
import { reactive, toRef } from 'vue'
const state = reactive({
  count: 0
})
const countRef = toRef(state, 'count')
// 这里其实就等价于 ref(state.count)
console.log(countRef)
console.log(countRef.value)
```

```js
import { reactive, isReactive, toRef } from 'vue'
const state = reactive({
  count: {
    value: 0
  }
})
console.log(isReactive(state)) // true
console.log(isReactive(state.count)) // true
const countRef = toRef(state, 'count')
// 相当于 ref(state.count)
console.log(countRef)
console.log(countRef.value)
console.log(countRef.value.value)
```

toRefs：将一个响应式对象转为一个普通对象，普通对象的每一个属性对应的是一个 ref 值

```js
import { reactive, toRefs } from 'vue'
const state = reactive({
  count: 0,
  message: 'hello'
})
const stateRefs = toRefs(state)
console.log(stateRefs) // {count: RefImpl, message: RefImpl}
console.log(stateRefs.count.value)
console.log(stateRefs.message.value)
```

unRef: 如果参数给的是一个 ref 值，那么就返回内部的值，如果不是 ref，那么就返回参数本身

这个 API 实际上是一个语法糖： val = isRef(val) ? val.value : val

```js
import { ref, unref } from 'vue'
const countRef = ref(10)
const normalValue = 20

console.log(unref(countRef)) // 10
console.log(unref(normalValue)) // 20
```



### 只读代理

接收一个对象（不论是响应式的还是普通的）或者一个 ref，返回一个原来值的只读代理。

```js
import { ref, readonly } from 'vue'
const count = ref(0)
const count2 = readonly(count) // 相当于创建了一个 count 的只读版本
count.value++;
count2.value++; // 会给出警告
```

在某些场景下，我们就是希望一些数据只能读取不能修改

```js
const rawConfig = {
  apiEndpoint: 'https://api.example.com',
  timeout: 5000
};
// 例如在这个场景下，我们就期望这个配置对象是不能够修改的
const config = readonly(rawConfig)
```





### 判断相关

isRef 和 isReactive

```js
import { ref, shallowRef, reactive, shallowReactive, isRef, isReactive } from 'vue'
const obj = {
  a:1,
  b:2,
  c: {
    d:3,
    e:4
  }
}
const state1 = ref(obj)
const state2 = shallowRef(obj)
const state3 = reactive(obj)
const state4 = shallowReactive(obj)
console.log(isRef(state1)) // true
console.log(isRef(state2)) // true
console.log(isRef(state1.value.c)) // false
console.log(isRef(state2.value.c)) // false
console.log(isReactive(state1.value.c)) // true
console.log(isReactive(state2.value.c)) // false
console.log(isReactive(state3)) // true
console.log(isReactive(state4)) // true
console.log(isReactive(state3.c)) // true
console.log(isReactive(state4.c)) // false
```



isProxy: 检查一个对象是否由 reactive、readonly、shallowReactive、shallowReadonly 创建的代理

```js
import { reactive, readonly, shallowReactive, shallowReadonly, isProxy } from 'vue'
// 创建 reactive 代理对象
const reactiveObject = reactive({ message: 'Hello' })
// 创建 readonly 代理对象
const readonlyObject = readonly({ message: 'Hello' })
// 创建 shallowReactive 代理对象
const shallowReactiveObject = shallowReactive({ message: 'Hello' })
// 创建 shallowReadonly 代理对象
const shallowReadonlyObject = shallowReadonly({ message: 'Hello' })
// 创建普通对象
const normalObject = { message: 'Hello' }

console.log(isProxy(reactiveObject)) // true
console.log(isProxy(readonlyObject)) // true
console.log(isProxy(shallowReactiveObject)) // true
console.log(isProxy(shallowReadonlyObject)) // true
console.log(isProxy(normalObject)) // false
```



### 3.3新增API

toValue

这个 API 和前面介绍的 unref 比较相似

```js
import { ref, toValue } from 'vue'
const countRef = ref(10)
const normalValue = 20

console.log(toValue(countRef)) // 10
console.log(toValue(normalValue)) // 20
```

toValue 相比 unref 更加灵活一些，它支持传入 getter 函数，并且返回函数的执行结果

```js
import { ref, toValue } from 'vue'
const countRef = ref(10)
const normalValue = 20
const getter = ()=>30;

console.log(toValue(countRef)) // 10
console.log(toValue(normalValue)) // 20
console.log(toValue(getter)) // 30
```



## 计算属性

模板表达式：

```html
<template>
<span>Name: {{ author.name }}</span>
  <p>Has published books:</p>
  <span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
</template>

<script setup>
import { reactive } from 'vue'
const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
})
</script>

<style lang="scss" scoped></style>
```

在上面的例子中，我们之所以要使用模板表达式，是因为要渲染的数据和模板之间，并非简单的对应关系，需要进行二次处理之后，才能够在模板上使用。

虽然在上面的例子中，使用模板表达式能够解决上面的需求（对数据做二次处理的需求），但是也存在一些问题：

1. 因为只能写表达式，不能够写语句，所以这意味着无法支持复杂的运算
2. 将计算逻辑写在模板里面，模板显得非常的臃肿
3. 相同的计算逻辑要在模板中出现多次，难以维护，计算逻辑理应是能够复用的

因此，正因为有上面的这些问题，所以计算属性登场了。



### 基本使用

基本使用代码如下：

```html
<template>
  <span>Name: {{ author.name }}</span>
  <p>Has published books:</p>
  <span>{{ isPublishBook }}</span>
</template>

<script setup>
import { reactive, computed } from 'vue'
const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
})

const isPublishBook = computed(() => {
  // 在计算属性里面，我们就对数据进行二次处理
  return author.books.length > 0 ? 'Yes' : 'No'
})

// 计算属性也是响应式，当依赖的数据发生变化，那么计算属性也会重新计算
setTimeout(() => {
  author.books = []
}, 2000)
</script>

<style lang="scss" scoped></style>
```

总结一下，计算属性一般就是对响应式数据进行二次计算，返回一个计算属性的 ref，该 ref 可以在模板中使用。如果所依赖的响应式数据发生了变化，那么该计算属性会重新进行计算。



### 可写计算属性

一般来讲，计算属性就是对某个响应式数据进行二次计算，之后在模板中读取计算属性的值，这是绝大多数的场景下的使用，因此计算属性默认也就是只读模式。

但是，计算属性是支持可写的模式，需要往 computed 方法中传递一个对象，该对象中有对应的 getter 和 setter：

```html
<template>
  <span>name:{{ fullName }}</span>
</template>

<script setup>
import { ref, computed } from 'vue'
const firstName = ref('Xie')
const lastName = ref('Jie')

const fullName = computed({
  // 在读取计算属性值的时候会触发
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // 在设置计算属性值的时候会触发
  set(newName) {
    ;[firstName.value, lastName.value] = newName.split(' ')
  }
})

// 接下来可能因为某种原因，要设置计算属性
setTimeout(() => {
  // 这里就涉及到了设置计算属性
  fullName.value = 'Zhang San'
}, 3000)
</script>

<style lang="scss" scoped></style>
```



### 最佳实践

1. Getter 不应该有副作用

现实生活中，也有使用“副作用”这个词的场景。

现实生活中的副作用指的就是“不期待的效果，但是它发生了”。

程序中的副作用也是类似的意思：

```js
function effect(){
  document.body.innerText = 'hello';
}
```

在上面的例子中，effect 函数内部修改了 document.body 的值，这就直接或者间接影响了其他函数（可能也需要读取 document.body 的值）的执行结果，这个时候我们就称 effect 函数是有副作用。

再比如，一个函数修改了全局变量，也是一个副作用操作：

```js
let val = 1;
function effect(){
  val = 2; // 修改全局变量，产生副作用
}
```

常见的副作用操作还有很多：

- 调用系统 I/O 的 API
- 发送网络请求
- 在函数体内修改外部变量的值
- 使用 console.log 等方法进行输出
- 调用存在副作用的函数

回到 Vue 中的计算属性，一个计算属性的声明中应该描述的是根据一个值派生另外一个值，不应该改变其他的状态，也不应该在 getter 中做诸如异步请求、更改DOM一类的操作。



2. 避免直接修改计算属性的值

绝大多数场景下，都应该是读取计算属性的值，而非设置计算属性的值。

>从计算属性返回的值是**派生状态**。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。



### 计算属性和方法

除了计算属性以外，我们还可以定义方法：

```html
<template>
  <span>Name: {{ author.name }}</span>
  <p>Has published books:</p>
  <span>{{ isPublishBook() }}</span>
</template>

<script setup>
import { reactive } from 'vue'
const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
})

function isPublishBook() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
</script>

<style lang="scss" scoped></style>
```

计算属性依赖于响应式数据，然后对响应式数据进行二次计算。只有在响应式数据发生变化的时候，才会重新计算，换句话说，计算属性会缓存所计算的值。

而方法在重新渲染的时候，每次都是重新调用。

```html
<template>
  <button v-on:click="a++">A++</button>
  <button v-on:click="b++">B++</button>
  <p>computedA: {{ computedA }}</p>
  <p>computedB: {{ computedB }}</p>
  <p>methodA: {{ methodA() }}</p>
  <p>methodB: {{ methodB() }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'
const a = ref(1)
const b = ref(1)
// 创建两个计算属性，分别依赖 a 和 b
const computedA = computed(() => {
  console.log('计算属性A重新计算了')
  return a.value + 1
})
const computedB = computed(() => {
  console.log('计算属性B重新计算了')
  return b.value + 1
})
function methodA() {
  console.log('methodA执行了')
  return a.value + 1
}
function methodB() {
  console.log('methodB执行了')
  return b.value + 1
}
</script>

<style lang="scss" scoped></style>
```

最佳实践，当需要对数据进行二次计算的时候，就是使用计算属性即可。方法一般是和事件相关联，作为事件的事件处理方法来使用。


## 类与样式绑定

前面有介绍过属性动态绑定数据。有两个属性比较特殊：class 和 style

这两个用得很多，如果数据那一边使用字符串拼接很容易出错。因此 Vue 针对这两个属性提供了特殊的功能增强。除了字符串的值以外还可以是对象和数组。



### 绑定类

**对象语法**

可以给 class 绑定一个对象来切换 class，该对象的键就是要挂上去的样式类，值对应的是一个布尔值，true 表示挂上去，false 表示不挂上去。

```html
<template>
  <div
    class="demo"
    :class="{
      active: isActive,
      'text-danger': hasError
    }"
  >
    绑定样式类
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isActive = ref(true)
const hasError = ref(false)
setTimeout(() => {
  hasError.value = true
}, 3000)
</script>

<style scoped></style>
```



如果一个元素要挂的类比较多，那么推荐将对象写到数据里面，不要写到模板里面：

```html
<template>
  <div class="demo" :class="classObj">绑定样式类</div>
</template>

<script setup>
import { reactive } from 'vue'
const classObj = reactive({
  active: true,
  isFinite: true,
  'text-danger': false
})

setTimeout(() => {
  classObj['text-danger'] = true
}, 3000)
</script>

<style scoped></style>
```

这样做的好处在于模板会比较清爽。



另外，也可以绑定一个计算属性的样式对象：

```html
<template>
  <div class="demo" :class="classObj">绑定样式类</div>
</template>

<script setup>
import { ref, computed } from 'vue'
const isActive = ref(true)
const error = ref(null)

const classObj = computed(() => {
  return {
    active: isActive.value && !error.value,
    'text-danger': error.value && error.value.type === 'fatal'
  }
})
setTimeout(() => {
  error.value = {
    type: 'fatal'
  }
}, 3000)
</script>

<style scoped></style>
```



**数组语法**

数组语法中，数组的每一项一般都是一个 ref 值，ref 所对应的就是真实的要挂上去的类

```html
<template>
  <div class="demo" :class="[isActive, error]">绑定样式类</div>
</template>

<script setup>
import { ref } from 'vue'
const isActive = ref('active')
const error = ref('text-danger')
setTimeout(() => {
  isActive.value = 'normal'
}, 3000)
</script>

<style scoped></style>
```

数组里面，是支持三目运算表达式的：

```html
<template>
  <div :class="[isActive ? activeClass : '', errorClass]">绑定样式类</div>
</template>

<script setup>
import { ref } from 'vue'
const isActive = ref(false)
const activeClass = ref('active')
const errorClass = ref('text-danger')
setTimeout(() => {
  isActive.value = true
}, 3000)
</script>

<style lang="scss" scoped></style>

```

另外，三目运算表达式可能依赖多个条件，这个时候就会显得该表达式非常冗长，此时可以在数组里面使用嵌套对象的方式：

```html
<div :class="[{ active: isActive }, errorClass]"></div>
```



### 绑定内连样式

内连样式，也就是 style 的绑定，这个更加需要功能增强。

**对象方式**

```html
<template>
  <div
    :style="{
      color: activeColor,
      fontSize: fontSize + 'px'
    }"
  >
    绑定内连样式
  </div>
</template>

<script setup>
import { ref } from 'vue'
const activeColor = ref('red')
const fontSize = ref(30)
setTimeout(() => {
  activeColor.value = 'blue'
}, 3000)
</script>

<style lang="scss" scoped></style>
```

style 绑定的是一个对象，对象的键是样式名称，值对应的是 ref 形式的属性值。

同样可以将 style 所绑定的对象在 script 里面进行声明，这样模板会更加清爽一些

```html
<template>
  <div :style="styleObj">绑定内连样式</div>
</template>

<script setup>
import { reactive } from 'vue'
const styleObj = reactive({
  color: 'red',
  fontSize: '30px'
})
</script>

<style lang="scss" scoped></style>
```



**数组方式**

数组的方式是结合着上面的对象的形式来使用的，在数组中会绑定多个样式对象：

```html
<template>
  <div :style="styleArr">绑定内连样式</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const styleObj = reactive({
  color: 'red',
  fontSize: '30px'
})
const styleObj2 = reactive({
  textDecoration: 'underline'
})
const styleArr = ref([styleObj, styleObj2])
setTimeout(() => {
  styleArr.value.pop()
}, 3000)
</script>

<style lang="scss" scoped></style>
```

通过数组这种方式，可以非常方便的去操控一组样式。




## 条件和列表渲染



### 条件渲染

Vue 中为条件渲染提供了一组内置的指令：

- v-if
- v-else
- v-else-if

```html
<template>
  <div v-if="type === 1">晴天</div>
  <div v-else-if="type === 2">阴天</div>
  <div v-else-if="type === 3">雨天</div>
  <div v-else-if="type === 4">下雪</div>
  <div v-else>不知道什么天气</div>
</template>

<script setup>
import { ref } from 'vue'
const type = ref(1)
setInterval(() => {
  type.value = Math.floor(Math.random() * 5 + 1)
}, 3000)
</script>

<style scoped></style>
```



如果是要切换多个元素，那么可以将多个元素包裹在 template 的标签里面，该标签是不会渲染的。

```html
<template>
  <template v-if="type === 1">
    <div>晴天</div>
    <p>要出去旅游</p>
    <p>玩的开心</p>
  </template>
  <template v-else-if="type === 2">
    <div>阴天</div>
    <p>呆在家里吧</p>
    <p>好好看一本书</p>
  </template>
  <template v-else-if="type === 3">
    <div>雨天</div>
    <p>阴天适合睡觉</p>
    <p>好好睡一觉吧</p>
  </template>
  <template v-else-if="type === 4">
    <div>下雪</div>
    <p>下雪啦，我们出去堆雪人吧</p>
    <p>下雪啦，我们出去打雪仗吧</p>
  </template>
  <div v-else>不知道什么天气</div>
</template>

<script setup>
import { ref } from 'vue'
const type = ref(1)
setInterval(() => {
  type.value = Math.floor(Math.random() * 5 + 1)
}, 3000)
</script>

<style scoped></style>
```



另外，关于条件渲染，还有一个常用指令：v-show

v-show 的切换靠的是 CSS 的 display 属性，当值为 false 的时候，会将 display 属性设置为 none.

```html
<template>
  <div v-if="isShow">使用 v-if 来做条件渲染</div>
  <div v-show="isShow">使用 v-show 来做条件渲染</div>
</template>

<script setup>
import { ref } from 'vue'
const isShow = ref(true)
setTimeout(() => {
  isShow.value = false
}, 2000)
</script>

<style scoped></style>
```

**v-if 和 v-show 区别**

v-if 是“真实的”按条件渲染，因为它确保了在切换时，条件区块内的事件监听器和子组件都会被销毁与重建。

v-if 也是惰性的：如果在初次渲染时条件值为 false，则不会做任何事。条件区块只有当条件首次变为 true 时才被渲染。

相比之下，v-show 简单许多，元素无论初始条件如何，<u>始终会被渲染</u>，只有 CSS display 属性会被切换。

总的来说：

- v-if 有更高的切换开销，如果在运行时绑定条件很少改变，则 v-if 会更合适
- v-show 有更高的<u>初始渲染开销</u>，如果需要频繁切换，则使用 v-show 较好



### 列表渲染

这里涉及到的就是循环，Vue 也提供了一个内置指令：v-for

v-for 指令使用的语法是 item in items 的形式，items 源数据的数组，item 代表的是从 items 取出来的每一项，有点类似于 JS 中的 for..of 循环。

```html
<template>
  <div>
    <h2>商品列表</h2>
    <ul>
      <li v-for="(product, index) in products" :key="index">
        {{ index + 1 }}{{ product.name }} - {{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const products = ref([
  { name: '键盘', price: 99.99 },
  { name: '鼠标', price: 59.99 },
  { name: '显示器', price: 299.99 }
])
</script>

<style scoped></style>
```

一般来讲，在使用 v-for 循环的时候，我们会给元素指定一个 key 属性。key 属性主要是用于 **<u>优化虚拟DOM的渲染性能</u>** 的，相当于是给虚拟 DOM 元素一个唯一性标识。当对 key 进行绑定的时候，期望所绑定的值为一个基础类型的值（string、number），不要使用对象来作为 v-for 的 key.

使用 v-for 循环渲染的时候也可以使用 template 来循环多个元素，此时 key 就挂在 template 标签上面。

```html
<template>
  <div>
    <h2>商品列表</h2>
    <template v-for="(product, index) in products" :key="index">
      <div>{{ index + 1 }}</div>
      <div>{{ product.name }}</div>
      <div>{{ product.price }}</div>
      <hr />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const products = ref([
  { name: '键盘', price: 99.99 },
  { name: '鼠标', price: 59.99 },
  { name: '显示器', price: 299.99 }
])
</script>

<style scoped></style>
```



**关于v-for一些细节**

1. v-for 是可以遍历对象的，遍历对象的时候，第一个值是对象的值，第二值是对象的键，第三个值是索引

```html
<template>
  <div v-for="(value, key, index) in stu" :key="index">
   {{ index }} - {{ key }} - {{ value }}
  </div>
</template>

<script setup>
import { reactive } from 'vue'
const stu = reactive({
  name: 'zhangsan',
  age: 18,
  gender: 'male',
  score: 100
})
</script>

<style scoped></style>
```

2. v-for 还可以接收一个整数值 n，整数值会从 1....n 进行遍历

```html
<template>
  <div v-for="(value, index) in 10" :key="index">
    {{ value }}
  </div>
</template>

<script setup></script>

<style scoped></style>
```

3. v-for 也是存在作用域的，作用域的工作方式和 JS 中的作用域工作方式类似

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // 可以访问外层的 parentMessage
  // 而 item 和 index 只在这个作用域可用
  console.log(parentMessage, item.message, index)
})
```

```html
<template>
  <ul>
    <li v-for="project in projects" :key="project.id">
      <h2>{{ project.name }}</h2>
      <ul>
        <li v-for="task in project.tasks" :key="task.id">
          <h3>{{ task.name }}</h3>
          <ul>
            <li v-for="(subtask, index) in task.subtasks" :key="index">
              {{ project.name }}- {{ task.name }} - {{ subtask }}
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
const projects = ref([
  {
    id: 1,
    name: 'Project A',
    tasks: [
      {
        id: 1,
        name: 'Task A1',
        subtasks: ['Subtask A1.1', 'Subtask A1.2']
      },
      {
        id: 2,
        name: 'Task A2',
        subtasks: ['Subtask A2.1', 'Subtask A2.2']
      }
    ]
  },
  {
    id: 2,
    name: 'Project B',
    tasks: [
      {
        id: 1,
        name: 'Task B1',
        subtasks: ['Subtask B1.1', 'Subtask B1.2']
      },
      {
        id: 2,
        name: 'Task B2',
        subtasks: ['Subtask B2.1', 'Subtask B2.2']
      }
    ]
  }
])
</script>

<style scoped></style>
```



4. 官方有这么一句话：不要同时使用 v-if 和 v-for，因为两者优先级不明显

这里官方所谓的同时使用，指的是不要在一个元素上面同时使用：

```html
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

上面的例子，在同一个元素上面，既使用了 v-for 又使用了 v-if，这种方式是容易出问题的。

```html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

在外新包装一层 template，这样可以满足上面的需求的同时代码也更加易读。



### 数组的侦测

数组的方法整体分为两大类：

- 变更方法：调用这些方法时会对原来的数组进行变更
  - push
  - pop
  - shift
  - unshift
  - splice
  - sort
  - reverse
- 非变更方法：调用这些方法不会对原来的数组进行变更，而是会返回一个新的数组
  - filter
  - concat
  - slice
  - map

针对变更方法，数组只要一更新，就会触发它的响应式，页面会重新渲染

```js
setTimeout(() => {
  projects.value.push({
    id: 3,
    name: '这是一个大项目',
    tasks: [
      {
        id: 1,
        name: '搭建工程',
        subtasks: ['🧵调研框架', '熟悉框架']
      },
      {
        id: 2,
        name: '分解模块',
        subtasks: ['先调研', '分析']
      }
    ]
  })
}, 3000)
```

如果是非变更方法，那么需要使用方法的返回值去替换原来的值：

```js
// `items` 是一个数组的 ref
items.value = items.value.filter((item) => item.message.match(/Foo/))
```





## 事件处理



### 快速入门

在 Vue 中如果要给元素绑定事件，可以使用内置指令 v-on，使用该指定就可以绑定事件：

```html
<template>
  <div>{{ count }}</div>
  <button v-on:click="add">+1</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
function add() {
  count.value++
}
</script>

<style scoped></style>
```

上面的事件示例非常简单，不过关于事件处理，有各种各样的细节。



**事件处理各种细节**

1. 如果事件相关的处理比较简单，那么可以将事件处理器写成内连的

```html
<template>
  <div>{{ count }}</div>
  <button v-on:click="count++">+1</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<style scoped></style>
```

这种内连事件处理器用的比较少，仅在逻辑比较简单的时候可以快速完成事件的书写。



2. 绑定事件是一个很常见的需求，因此 Vue 也提供了简写形式，通过 @ 符号就可以绑定事件

```html
<button @click="count++">+1</button>
```

在日常开发中，更多的见到的就是简写形式。



3. 向事件处理器传递参数

```html
<template>
  <div>{{ count }}</div>
  <button @click="add('Hello World')">+1</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
function add(message) {
  count.value++
  console.log(message)
}
</script>

<style scoped></style>
```



4. 事件对象

- 没有传参：事件对象会作为一个额外的参数，自动传入到事件处理器，在事件处理器中，只需要在形参列表中声明一下即可
- 如果有传参：这种情况下需要使用一个特殊的变量 $event 来向事件处理器传递事件对象

```html
<template>
  <div>{{ count }}</div>
  <button @click="add">+1</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
// 事件对象会自动传入，直接在事件处理器的形参中声明即可
function add(event) {
  count.value++
  console.log(event)
  console.log(event.target)
  console.log(event.clientX, event.clientY)
}
</script>

<style scoped></style>
```

```html
<template>
  <div>{{ count }}</div>
  <!-- 必须显式的使用 $event 来向事件处理器传递事件对象 -->
  <button @click="add('Hello World', $event)">+1</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
function add(message, event) {
  count.value++
  console.log(message)
  console.log(event)
  console.log(event.target)
  console.log(event.clientX, event.clientY)
}
</script>

<style scoped></style>
```

如果是箭头函数，写法如下：

```html
<template>
  <div>{{ count }}</div>
  <!-- 如果是箭头函数，那么事件对象需要作为参数传入 -->
  <!-- 此时参数没有必须是 $event 的限制了 -->
  <button @click="(event) => add('Hello World', event)">+1</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
function add(message, event) {
  count.value++
  console.log(message)
  console.log(event)
  console.log(event.target)
  console.log(event.clientX, event.clientY)
}
</script>

<style scoped></style>
```



### 修饰符

之所以会有修饰符，是因为之前在书写原生事件处理的时候，事件处理器中经常会包含诸如阻止冒泡、阻止默认事件等非事件业务的逻辑。有了修饰符之后，可以使用事件修饰符来完成这些非核心的业务处理，让事件处理器更加专注于业务逻辑。

常见的事件处理器：

- .stop：阻止事件冒泡
- .prevent：阻止默认行为
- .self：只有事件在该元素本身上触发时才触发处理函数（不是在子元素上）
- .capture：改变事件的触发方式，使其在捕获阶段而不是冒泡阶段触发。
- .once：事件只触发一次
- .passive：用于提高页面滚动的性能。

修饰符的使用也很简答：

```html
<button @click.stop="handleClick">点击我</button>
```

下面是一个具体的示例：

```html
<template>
  <button @click.once="clickHandle">click</button>
</template>

<script setup>
function clickHandle() {
  console.log('你触发了事件')
}
</script>

<style scoped></style>
```



另外需要说一下，事件修饰符是可以连用的，例如现在有这么一个需求，我们希望用户在点击按钮时：

- 阻止事件冒泡（.stop）。
- 阻止默认行为（.prevent），例如，防止表单提交。
- 在捕获阶段触发事件处理器（.capture），确保在任何可能的冒泡前响应。
- 事件处理器只触发一次（.once）。

```html
<button @click.capture.stop.prevent.once>click</button>
```

在连用事件修饰符的时候，修饰符的顺序通常不会影响最终的行为，因为不同的修饰符代表对不同方面的行为的控制，相互是不冲突的。



除了事件修饰符以外，Vue 还提供了一组按键修饰符，按键修饰符主要是用于检查特点的按钮：

- .enter
- .tab
- .delete (捕获“Delete”和“Backspace”两个按键)
- .esc
- .space
- .up
- .down
- .left
- .right
- .ctrl
- .alt
- .shift
- .meta（不同的系统对应不同的按键）

```html
<template>
  <input type="text" @keyup.enter="submitText" />
</template>

<script setup>
function submitText() {
  console.log('你要提交输入的内容')
}
</script>

<style scoped></style>
```

按键修饰符也是能够连用，比如上面的例子，我们修改为 alt + enter 是提交

```html
<input type="text" @keyup.alt.enter="submitText" />
```

> Mac 系统中 alt 对应的是 option 按键



有一个特殊的修饰符 .exact ，exact 该单词的含义是“精确、精准” ，该修饰符的作用在于控制触发事件的时候，必须是指定的按键组合，不能够有其他按键。

```html
<button @click.ctrl="onClick">A</button>
```

在上面的例子中，指定按下 ctrl 键触发事件，但是假设我现在同时按下 alt 和 ctrl 也会触发事件

```html
<button @click.ctrl.exact="onClick">A</button>
```

添加了 .exact 修饰符之后，表示只有在按下 ctrl 并且没有按下其他按键的时候才会触发事件



最后还有三个鼠标按键修饰符，用于指定特定的鼠标按键：

- .left
- .right
- .middle

```html
<template>
  <button class="context-menu-button" @contextmenu.prevent.right="handleRightClick">
    右键点击
  </button>
</template>

<script setup>
function handleRightClick() {
  console.log('你点击了鼠标右键')
}
</script>

<style scoped>
.context-menu-button {
  padding: 10px 20px;
  cursor: context-menu; /* 显示适当的鼠标指针 */
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
```





## 表单处理



### 表单元素的数据绑定

下面是一个文本框和数据进行绑定的例子：

```html
<template>
  <input type="text" :value="textContent" @input="(e) => (textContent = e.target.value)" />
  <p>你当前输入的内容为：{{ textContent }}</p>
</template>

<script setup>
import { ref } from 'vue'
const textContent = ref('')
</script>

<style scoped></style>
```

上面的例子我们让文本库和 ref 数据进行了绑定，用户在输入内容的时候，会去更新 textContent 这个 ref 数据，而 ref 数据的变化又会影响文本框本身的 value 值。这其实就是一个双向绑定的例子。

上面的例子虽然实现了双向绑定，但是写起来比较麻烦，因此 Vue 提供了一个内置的指令 v-model

```html
<template>
  <input type="text" v-model="textContent" />
  <p>你当前输入的内容为：{{ textContent }}</p>
</template>

<script setup>
import { ref } from 'vue'
const textContent = ref('')
</script>

<style scoped></style>
```

上面的例子使用了 v-model 来进行双向绑定，textContent 的变化会影响文本框的值，文本框的值也会影响 textContent.

使用 v-model 的好处在于：

1. 简化了书写
2. 根据所使用的元素自动的选择对应的属性以及事件组合
   - input 或者 textarea，元素会绑定 input 事件，绑定的值是 value
   - 如果是单选框或者复选框，背后绑定的事件是 change 事件，绑定的值 checked
   - select 下拉列表绑定的也是 change 事件，绑定的值是 value



**文本域**

文本域就是多行文本，对应的标签为 textarea

```html
<template>
  <textarea cols="30" rows="10" v-model="textContent"></textarea>
  <p>你当前输入的内容为：{{ textContent }}</p>
</template>

<script setup>
import { ref } from 'vue'
const textContent = ref('')
</script>

<style scoped></style>
```



**复选框**

单一的复选框，可以使用 v-model 去绑定一个 ref 类型的布尔值，布尔值为 true 表示选择中，false 表示未选中

```html
<template>
  <input type="checkbox" v-model="checked" />
  <button @click="checked = !checked">切换选中</button>
</template>

<script setup>
import { ref } from 'vue'
const checked = ref(true)
</script>

<style scoped></style>
```

在上面的例子中，布尔值 true 是选中，false 是未选中，但是这个真假值是可以自定义：

```html
<template>
  <input type="checkbox" v-model="checked" :true-value="customTrue" :false-value="customFalse" />
  <button @click="toggle">切换选中</button>
</template>

<script setup>
import { ref } from 'vue'
const checked = ref('yes')
// 现在相当于是自定义什么值是选中，什么值是未选中
// 之前是默认true是选中，false是未选中
// 现在是yes是选中，no是未选中
const customTrue = ref('yes')
const customFalse = ref('no')
function toggle() {
  checked.value === 'yes' ? (checked.value = 'no') : (checked.value = 'yes')
}
</script>

<style scoped></style>
```

有些时候我们有多个复选框，这个时候，可以将多个复选框绑定到同一个数组或者集合的值：

```html
<template>
  <div v-for="(item, index) in arr" :key="index">
    <label for="item.id">{{ item.title }}</label>
    <input type="checkbox" v-model="hobby" :id="item.id" :value="item.value" />
  </div>
  <p>{{ message }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'
const hobby = ref([])
const arr = ref([
  { id: 'swim', title: '游泳', value: '游个泳' },
  { id: 'run', title: '跑步', value: '跑个步' },
  { id: 'game', title: '游戏', value: '玩个游戏' },
  { id: 'music', title: '音乐', value: '听个音乐' },
  { id: 'movie', title: '电影', value: '看个电影' }
])
const message = computed(() => {
  // 根据 hobby 的值进行二次计算
  if (hobby.value.length === 0) return '请选择爱好'
  else return `您选择了${hobby.value.join('、')}`
})
</script>

<style scoped></style>
```

在上面的例子中，checkbox 所绑定的数据不再是一个布尔值，而是一个数组（集合），那么当该复选框被选中的时候，该复选框所对应的值就会被加入到数组里面。



**单选框**

```html
<template>
  <label for="male">男</label>
  <input type="radio" id="male" v-model="gender" value="男" />
  <label for="female">女</label>
  <input type="radio" id="female" v-model="gender" value="女" />
  <label for="secret">保密</label>
  <input type="radio" id="secret" v-model="gender" value="保密" />
</template>

<script setup>
import { ref } from 'vue'
const gender = ref('保密')
setTimeout(() => {
  gender.value = '男'
}, 3000)
</script>

<style scoped></style>
```

上面的例子演示了单选框如何进行双向绑定，哪一个单选框被选中取决于 gender 的值。



**下拉列表**

下拉列表在进行双向绑定的时候，v-model 是写在 select 标签上面：

```html
<template>
  <!-- 下拉列表列表是单选的话，v-model 绑定的值是一个字符串，这个字符串是 option 的 value 值 -->
  <select v-model="hometown1">
    <option value="" disabled>请选择</option>
    <option v-for="(item, index) in hometownList" :key="index" :value="item.key">
      {{ item.value }}
    </option>
  </select>
  <p>您选择的家乡为：{{ hometown1 }}</p>
  <!-- 如果下拉列表是多选的话，v-model 绑定的值是一个数组，这个数组是 option 的 value 值组成的数组 -->
  <select v-model="hometown2" multiple>
    <option value="" disabled>请选择</option>
    <option v-for="(item, index) in hometownList" :key="index" :value="item.key">
      {{ item.value }}
    </option>
  </select>
  <p>您选择的家乡为：{{ hometown2 }}</p>
</template>

<script setup>
import { ref } from 'vue'
const hometown1 = ref('')
const hometown2 = ref([])
const hometownList = ref([
  { key: '成都', value: '成都' },
  { key: '帝都', value: '北京' },
  { key: '魔都', value: '上海' },
  { key: '妖都', value: '广州' },
  { key: '陪都', value: '重庆' }
])
</script>

<style scoped></style>
```

注意下拉列表根据是单选还是多选，v-model 所绑定的值的类型不一样，单选绑定字符串，多选绑定数组。



### 表单相关修饰符

- lazy：默认情况下，v-model 会在每次 input 事件触发时就更新数据，lazy 修饰符可以改为 change 事件触发后才更新数据
- number：将用户输入的内容从字符串转为 number 类型
- trim：去除输入的内容的两端的空格

```html
<template>
  <!-- lazy修饰符演示 -->
  <input type="text" v-model.lazy="mess1" />
  <p>你输入的是：{{ mess1 }}</p>
  <p>类型为{{ typeof mess1 }}</p>
  <p>长度为{{ mess1.length }}</p>

  <!-- number修饰符演示 -->
  <input type="text" v-model.number="mess2" />
  <p>你输入的是：{{ mess2 }}</p>
  <p>类型为{{ typeof mess2 }}</p>
  <p>长度为{{ mess2.length }}</p>

  <!-- trim修饰符演示 -->
  <input type="text" v-model.trim="mess3" />
  <p>你输入的是：{{ mess3 }}</p>
  <p>类型为{{ typeof mess3 }}</p>
  <p>长度为{{ mess3.length }}</p>
</template>

<script setup>
import { ref } from 'vue'
const mess1 = ref('')
const mess2 = ref('')
const mess3 = ref('')
</script>

<style scoped></style>
```




## 生命周期



### 理解什么是生命周期

生命周期是组件（目前我们接触到的就是 App.vue 这个根组件）从<u>创建</u>到最终<u>销毁</u>所经历的一系列过程。在这个过程中设置了一些特殊的时间点，开发者可以在这些特殊的时间点，设置一些函数，这样的函数称之为钩子🪝函数，必须把开发者设置的钩子函数执行完毕后，才能继续走后面的流程。

这就让开发者有机会在特定的时段执行自己的业务逻辑代码。

完整的生命周期图如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-12-031421.png" alt="lifecycle" style="zoom:60%;" />

### 快速入门

目前我们没有必要将上面所有的生命周期钩子函数都完全理解，先学习一个即可。

目前我们需要掌握的就是 mounted，mounted 对应的钩子函数为 onMounted，该钩子函数会在完成了初始化渲染并且创建和插入了 DOM 节点之后被触发，这意味着在当前的这个时间节点，你是可以访问真实的 DOM 元素的。

```html
<template>
  <div>
    <h1>用户列表</h1>
    <ul v-if="!loading">
      <li v-for="(user, index) in users" :key="index">{{ user.name }} - {{ user.email }}</li>
    </ul>
    <div v-if="loading">加载中...</div>
    <div v-if="error">出错啦！</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  // 一般来讲，我们会在此生命周期钩子方法中请求数据
  loading.value = true
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    if (res.ok) {
      users.value = await res.json()
    } else {
      throw new Error('请求失败')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    // 无论是出错也好，还是正常请求到了数据，都需要将 loading 状态改为 false
    loading.value = false
  }
})
</script>

<style scoped></style>
```

完整的生命周期钩子方法：https://cn.vuejs.org/api/composition-api-lifecycle.html



### Vue2中的生命周期

注意，Vue3中是支持Vue2的生命周期方法的，毕竟之前 Vue2 的选项式API的写法是作为一种风格继续存在于Vue3中的。

Vue2以前的那些生命周期方法和Vue3是共存的，只不过名字有一些不一样，例如上面的 mounted 阶段对应的钩子方法：

- Vue3：onMounted
- Vue2：mounted

另外就是执行的时机也会有一些不同，假设 Vue2 和 Vue3 同一个生命周期周设置了两种形式的钩子方法，Vue3 的钩子方法的执行时机会早于 Vue2 的钩子方法。

```html
<template>
  <div>Vue2 和 Vue3 钩子函数执行时机对比</div>
</template>

<script>
import { onMounted } from 'vue'
// 这里使用选项时API风格
export default {
  mounted() {
    console.log('执行Vue2的钩子函数')
  },
  setup() {
    // 使用setup函数
    onMounted(() => {
      console.log('执行Vue3的onMounted函数')
    })
  }
}
</script>

<style scoped></style>
```

上面的这个点稍微有一个印象即可。真实开发中是**不可能**两个版本的生命周期钩子方法混着使用的。


## 侦听器

侦听器和计算属性类似，都是依赖响应式数据。不过计算属性是在依赖的数据发生变化的时候，重新做二次计算，不会涉及到副作用的操作。而侦听器则刚好相反，在依赖的数据发生变化的时候，允许做一些副作用的操作，例如更改 DOM、发送异步请求...



### 快速入门

```html
<template>
  <div>
    <h1>智能机器人</h1>
    <div>
      <input v-model="question" placeholder="请输入问题" />
    </div>
    <div v-if="loading">正在加载中...</div>
    <div v-else>{{ answer }}</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const question = ref('') // 存储用户输入的问题，以 ？ 结束
const answer = ref('') // 存储机器人的回答
const loading = ref(false) // 是否正在加载中
// 侦听器所对应的回调函数，接收两个参数
// 一个是依赖数据的新值，一个是依赖数据的旧值
watch(question, async (newValue) => {
  if (newValue.includes('?')) {
    loading.value = true
    answer.value = '思考中....'
    try {
      const res = await fetch('https://yesno.wtf/api')
      const result = await res.json()
      answer.value = result.answer
    } catch (err) {
      answer.value = '抱歉，我无法回答您的问题'
    } finally {
      loading.value = false
    }
  }
})
</script>

<style scoped></style>
```

在上面的示例中，watch 就是一个侦听器，侦听 question 这个 ref 状态的变化，每次当 ref 状态发生变化的时候，就会重新执行后面的回调函数，回调函数接收两个参数：

- 新的状态值
- 旧的状态值

并且在回调函数中，支持副作用操作。



### 各种细节



#### 1. 侦听的数据源类型

除了上面快速入门中演示的侦听 ref 类型的数据以外，还支持侦听一些其他类型的数据。

**计算属性**

```html
<template>
  <div>
    <input type="text" v-model="firstName" placeholder="first name" />
    <input type="text" v-model="lastName" placeholder="last name" />
    <p>全名：{{ fullName }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
const firstName = ref('John')
const lastName = ref('Doe')
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// 设置侦听器
watch(fullName, (newVal, oldVal) => {
  console.log(`new: ${newVal}, old: ${oldVal}`)
})
</script>

<style scoped></style>
```

**reactive响应式对象**

```html
<template>
  <div>
    <input type="text" v-model="user.name" placeholder="name" />
    <input type="text" v-model="user.age" placeholder="age" />
    <p>用户信息：{{ user.name }} - {{ user.age }}</p>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
const user = reactive({
  name: 'John',
  age: 18
})

// 设置侦听器
watch(user, () => {
  console.log('触发了侦听器回调函数')
})
</script>

<style scoped></style>
```

**Getter函数**

```html
<template>
  <div>
    <input type="number" v-model="count" />
    <p>是否为偶数？{{ isEven() }}</p>
    <div>count2: {{ count2 }}</div>
    <button @click="count2++">+1</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const count = ref(0)
const count2 = ref(0)

// 注意这个函数本身，是每次重新渲染的时候都会重新执行的
function isEven() {
  console.log('isEvent 函数被重新执行了')
  if (count2.value === 5) {
    return 'this is a test'
  }
  return count.value % 2 === 0
}
// 设置侦听器
// 这里侦听的是函数的返回值结果
// 如果函数返回值发生变化，就会触发侦听器回调函数
watch(isEven, () => {
  console.log('触发了侦听器回调函数')
})
</script>

<style scoped></style>
```

**多个数据源所组成的数组**

```html
<template>
  <div>
    <div>
      <input type="text" v-model="title" />
    </div>
    <div>
      <textarea v-model="description" cols="30" rows="10"></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const title = ref('')
const description = ref('')
// 这里侦听的是多个数据源所组成的数组
// 数组里面任何一个数据发生变化，都会触发回调函数
watch([title, description], () => {
  console.log('侦听器的回调函数执行了')
})
</script>

<style scoped></style>
```



#### 2. 侦听层次

这个主要是针对 reactive 响应式对象，当侦听的数据源是 reactvie 类型数据的时候，默认是深层次侦听，这意味着哪怕是嵌套的属性值发生变化，侦听器的回调函数也会重新执行。

```html
<template>
  <div>
    <h1>任务列表</h1>
    <ul>
      <li v-for="task in tasks.list" :key="task.id">
        {{ task.title }} - {{ task.completed ? '已完成' : '未完成' }}
        <button @click="task.completed = !task.completed">切换状态</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
const tasks = reactive({
  list: [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true }
  ]
})

watch(tasks, () => {
  console.log('侦听器触发了！')
})
</script>

<style scoped></style>
```

通过上面的例子，我们可以看出，当侦听的是 reactive 类型的响应式对象时，是深层次侦听的。

虽然上面的这个深层次侦听的特性非常的方便，但是当用于大型数据结构的时候，开销也是很大的，因此一定要留意性能，只在必要的时候再使用。



另外补充一个点，当侦听的是 reactive 对象的时候，不能直接侦听响应式对象的属性值：

```js
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

可以将上面的例子修改为一个 Getter 函数：

```js
const obj = reactive({ count: 0 })

watch(()=>obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```



#### 3. 第三个参数

- 第一个参数：侦听的数据源
- 第二个参数：数据发生变化时要执行的回调函数
- 第三个参数：选项对象
  - immediate：true/false
    - 默认情况下，watch 对应的回调函数是懒执行的，只有在依赖的数据发生变化时，才会执行回调。
    - 但是在某些场景中，我们可能期望立即执行一次，例如请求一些初始化数据，这个时候就可以设置该配置项
  - once：true/false
    - 侦听器的回调函数只执行一次
  - deep：true/false
    - 强制转换为深层次侦听器
    - 什么时候会用到呢？有些时候使用 watch 来侦听一个由计算属性或者 getter 函数返回的对象的时候，默认就不是深层次的侦听
    - 通过设置 deep 可以让这种情况下的对象侦听，也变成深层次的侦听

```html
<template>
  <div>
    <div v-for="task in tasks" :key="task.id" @click="selectTask(task)">
      {{ task.title }} ({{ task.completed ? 'Completed' : 'Pending' }})
    </div>
    <hr />
    <div v-if="selectedTask">
      <h3>Edit Task</h3>
      <input v-model="selectedTask.title" placeholder="Edit title" />
      <label>
        <input type="checkbox" v-model="selectedTask.completed" />
        Completed
      </label>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const tasks = reactive([
  { id: 1, title: 'Learn Vue', completed: false },
  { id: 2, title: 'Read Documentation', completed: false },
  { id: 3, title: 'Build Something Awesome', completed: false }
])

const selectedId = reactive({ id: null })

// 这是一个计算属性
const selectedTask = computed(() => {
  return tasks.find((task) => task.id === selectedId.id)
})

// 侦听的是一个 Getter 函数
// 该 Getter 函数返回计算属性的值
watch(
  () => selectedTask.value,
  () => {
    console.log('Task details changed')
  },
  { deep: true }
)

function selectTask(task) {
  selectedId.id = task.id
}
</script>
```



### watchEffect

watchEffect 相比 watch 而言，能够自动跟踪回调里面的响应式依赖，对比如下：

watch

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId, // 第一个参数需要显式的指定响应式依赖
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

watchEffect

```js
// 不再需要显式的指定响应式数据依赖
// 在回调函数中用到了哪个响应式数据，该数据就会成为一个依赖
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

对于只有一个依赖项的场景来讲，watchEffect 的收益不大，但是如果涉及到多个依赖项，那么 watchEffect 的好处就体现出来了。

watchEffect 相比 watch 还有一个特点：如果你需要侦听一个嵌套的数据结构的几个属性，那么 watchEffect 只会侦听回调中用到的属性，而不是递归侦听所有的属性。

```html
<template>
  <div>
    <h1>团队管理</h1>
    <ul>
      <li v-for="member in team.members" :key="member.id">
        {{ member.name }} - {{ member.role }} - {{ member.status }}
      </li>
    </ul>
    <button @click="updateLeaderStatus">切换领导的状态</button>
    <button @click="updateMemberStatus">切换成员的状态</button>
  </div>
</template>

<script setup>
import { reactive, watchEffect } from 'vue'
const team = reactive({
  members: [
    { id: 1, name: 'Alice', role: 'Leader', status: 'Active' },
    { id: 2, name: 'Bob', role: 'Member', status: 'Inactive' }
  ]
})

// 有两个方法，分别是对 Leader 和 Member 进行状态修改
function updateLeaderStatus() {
  const leader = team.members.find((me) => me.role === 'Leader')
  // 切换状态
  leader.status = leader.status === 'Active' ? 'Inactive' : 'Active'
}

function updateMemberStatus() {
  const member = team.members.find((member) => member.role === 'Member')
  member.status = member.status === 'Active' ? 'Inactive' : 'Active'
}

// 添加一个侦听器
watchEffect(() => {
  // 获取到 leader
  const leader = team.members.find((me) => me.role === 'Leader')
  // 输出 leader 当前的状态
  console.log('Leader状态:', leader.status)
})
</script>

<style scoped></style>
```



### 回调触发的时机

默认情况下，侦听器回调的执行时机在父组件更新 **之后**，所属组件的 DOM 更新 **之前** 被调用。这意味着如果你尝试在回调函数中访问所属组件的 DOM，<u>拿到的是 DOM 更新之前的状态</u>。

```html
<template>
  <div>
    <button @click="isShow = !isShow">显示/隐藏</button>
    <div v-if="isShow" ref="divRef">
      <p>this is a test</p>
    </div>
    <p>上面的高度为：{{ height }} pixels</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const isShow = ref(false)
const height = ref(0) // 存储高度
const divRef = ref(null) // 获取元素

watch(isShow, () => {
  // 获取高度，将高度值给 height
  height.value = divRef.value ? divRef.value.offsetHeight : 0
  console.log(`当前获取的高度为：${height.value}`)
})
</script>

<style scoped></style>
```

如果我们期望侦听器的回调在 DOM 更新之后再被调用，那么可以将第三个参数 flush 设置为 post 即可，如下：

```js
watch(
  isShow,
  () => {
    // 获取高度，将高度值给 height
    height.value = divRef.value ? divRef.value.offsetHeight : 0
    console.log(`当前获取的高度为：${height.value}`)
  },
  {
    flush: 'post'
  }
)
```



### 停止侦听器

大多数情况下你是不需要关心如何停止侦听器，组件上面所设置的侦听器会在组件被卸载的时候自动停止。

但是上面所说的自动停止仅限于同步设置侦听器的情况，如果是异步设置的侦听器，那么组件被销毁也不会自动停止：

```html
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

这种情况下，就需要手动的去停止侦听器。

要手动的停止侦听器，就和 setTimeout 或者 setInterval 类似，调用一下返回的函数即可。

```js
const unwatch = watchEffect(() => {})
// 手动停止
unwatch();
```

下面是一个具体的示例：

```html
<template>
  <div>
    <button @click="a++">+1</button>
    <p>当前 a 的值为：{{ a }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const a = ref(1) // 计数器
const message = ref('') // 消息
// 假设我们期望 a 的值到达一定的值之后，停止侦听
const unwatch = watch(
  a,
  (newVal) => {
    // 当值大于 5 的时候，停止侦听
    if (newVal > 5) {
      unwatch()
    }
    message.value = `当前 a 的值为：${a.value}`
  },
  { immediate: true }
)
</script>

<style scoped></style>
```





## 组件介绍

- 组件结构
- 组件注册
- 组件名



### 组件结构

在 Vue 中支持**单文件组件**，也就是一个文件对应一个组件，这样的文件以 .vue 作为后缀。

一个组件会包含完整的一套结构、样式以及逻辑

```html
<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<style scoped>
button{
  padding: 15px;
}
</style>
```

**setup**

在 Vue3 初期，需要返回一个对象，该对象中包含模板中要用到的数据状态以及方法。

```js
import { ref } from 'vue'
export default {
  setup() {
    // 在这里面定数据和方法
    const count = ref(0)
    function add() {
      count.value++
    }
    return {
      count,
      add
    }
  }
}
```

从 Vue3.2 版本开始，推出了 setup 标签，所有定义的数据状态以及方法都会自动暴露给模板使用，从而减少了样板代码。

另外 setup 标签语法还有一些其他的好处：

- 有更好的类型推断
- 支持顶级 await



**scoped**

定义组件私有的 CSS 样式，也就是说写的样式只对当前组件生效。如果不书写 scoped，那么样式就是全局生效。



除了单文件组件的形式来定义组件外，还可以使用对象的形式来定义组件：

```js
export default {
  setup(){
    // 定义数据
    const count = ref(0)
    return { count }
  },
  template: `<div>{{count}}</div>`
}
```

下面是一个具体的例子：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <template id="my-template-element">
        <div>
            <h1>{{ count }}</h1>
            <button @click="count++">Increment</button>
        </div>
    </template>
    <script src="https://unpkg.com/vue@3.2.31"></script>
    <script>
      const { createApp, ref } = Vue;
      const App = {
        setup() {
          const count = ref(0);
          return { count };
        },
        template: "#my-template-element",
      };
      createApp(App).mount("#app");
    </script>
  </body>
</html>

```



### 组件注册

组件注册分为两种：

- 全局注册
- 局部注册

**全局注册**

使用 Vue 应用实例的 .component( ) 方法来全局注册组件，所注册的组件全局可用。

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // 注册的名字
  'MyComponent',
  // 组件的实现
  {
    /* ... */
  }
)
```

```js
import MyComponent from './App.vue'
app.component('MyComponent', MyComponent)
```

Component 方法是可以链式调用的

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```



**局部注册**

局部注册就是在哪个组件里面用到了 TestCom 这个组件，那么就在当前的组件里面引入它，然后通过 components 配置项进行注册一下即可。

```html
<template>
  <button @click="add">Count is: {{ count }}</button>
  <TestCom />
</template>

<script>
import { ref } from 'vue'
import TestCom from './components/TestCom.vue'
export default {
  // 局部注册
  components: {
    TestCom
  },
  setup() {
    // 在这里面定数据和方法
    const count = ref(0)
    function add() {
      count.value++
    }
    return {
      count,
      add
    }
  }
}
</script>

<style scoped>
button {
  padding: 15px;
}
</style>
```

如果是 setup 标签语法糖，那么只需要导入组件即可，不需要使用 components 配置项来进行注册，因为导入后在模板中使用时会自动注册：

```html
<template>
  <button @click="add">Count is: {{ count }}</button>
  <TestCom />
</template>

<script setup>
import { ref } from 'vue'
import TestCom from './components/TestCom.vue'
// 在这里面定数据和方法
const count = ref(0)
function add() {
  count.value++
}
</script>

<style scoped>
button {
  padding: 15px;
}
</style>
```



实际开发的时候，**推荐使用局部注册**

1. 全局注册无法很好的 tree-shaking
2. 全局注册的组件在大型项目中无法很好的看出组件之间的依赖关系



### 组件名

推荐使用**大驼峰**作为组件名。

> 但是大驼峰在 DOM 内模板中无法使用



组件在应用层面，有三个核心知识点：

1. Props
2. 自定义事件
3. 插槽

## Props

- Props
- 自定义事件
- 插槽

所谓 Props，其实就是外部在使用组件的时候，向组件传递数据。

### 快速入门

下面我们定义了一个 UserCard.vue 组件：

```html
<template>
  <div class="user-card">
    <img :src="user.avatarUrl" alt="用户头像" class="avatar" />
    <div class="user-info">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup>
// defineProps 是一个宏，用于声明组件接收哪些 props
const user = defineProps({
  name: String,
  email: String,
  avatarUrl: String
})
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-info h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.user-info p {
  margin: 5px 0 0;
  font-size: 16px;
  color: #666;
}
</style>

```

在该组件中，接收 name、email 以及 avatrUrl 这三个 prop，使用 defineProps 来定义要接收的 props，defineProps 是一个宏，会在代码实际执行之前进行一个替换操作。

之后 App.vue 作为父组件，在父组件中使用上面的 UserCard.vue 组件（子组件）

```html
<template>
  <div class="app-container">
    <!-- 父组件在使用 UserCard 这个组件的时候，向内部传递数据 -->
    <UserCard name="张三" email="123@gamil.com" avatar-url="src/assets/yinshi.jpg" />
    <UserCard name="莉丝" email="456@gamil.com" avatar-url="src/assets/jinzhu.jpeg" />
  </div>
</template>

<script setup>
import UserCard from './components/UserCard.vue'
</script>

<style scoped>
.app-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
</style>

```



### 使用细节

1. 命名方面

组件内部在声明 props 的时候，推荐使用驼峰命名法：

```js
defineProps({
  greetingMessage: String
})
```

```html
<span>{{ greetingMessage }}</span>
```

不过父组件在使用子组件，给子组件传递属性的时候，推荐使用更加贴近 HTML 的书写风格：

```html
<MyComponent greeting-message="hello" />
```



2. 动态的 Props

在上面的快速入门示例中，我们传递的都是静态的数据：

```html
<UserCard name="张三" email="123@gamil.com" avatar-url="src/assets/yinshi.jpg" />
```

所谓动态的 Props，指的就是父组件所传递的属性值是和父组件本身的状态绑定在一起的：

UserCard.vue

```js
// defineProps 是一个宏，用于声明组件接收哪些 props
defineProps({
  user: {
    type: Object,
    required: true
  }
})
```

App.vue

```html
<template>
  <div class="app-container">
    <!-- 父组件在使用 UserCard 这个组件的时候，向内部传递数据 -->
    <UserCard :user="user" />
    <div class="input-group">
      <input type="text" placeholder="请输入新的名字" v-model="newName" />
      <button @click="changeName">确定修改</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserCard from './components/UserCard.vue'
// 父组件所维护的一份数据
const user = ref({
  name: '张三',
  email: '123@gamil.com',
  avatarUrl: 'src/assets/yinshi.jpg'
})
const newName = ref('')

// 根据用户输入的新名字
// 更新 user 这个数据
function changeName() {
  if (newName.value.trim()) {
    user.value.name = newName.value
  }
}
</script>

<style scoped>
.app-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
.input-group {
  display: flex;
  margin-top: 20px;
}

input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}
</style>
```

还需要注意一个细节：如果想要向组件传递 **非字符串** 类型的值，例如 number、boolean、array... 必须通过动态 Props 的方式来传递，不然组件内部拿到的是一个字符串。



3. 单向数据流

Props 会因为父组件传递的数据的更新而自身发生变化，这种数据的流向是从父组件流向子组件的，这个流向是单向的，这意味着你在子组件中不应该修改父组件传递下来的 Props 数据。

如果你强行修改，Vue 会在控制台抛出警告：

```js
const props = defineProps(['foo'])

// ❌ 警告！prop 是只读的！
props.foo = 'bar'
```

有些时候，我们期望子组件在局部保存一份父组件传递下来的数据，这种情况下，就在子组件中新定义一个子组件的数据存储 Props 上面的值即可。

```js
import {ref} from 'vue'
// defineProps 是一个宏，用于声明组件接收哪些 props
const prop = defineProps(['user', 'age'])
// 在子组件中，使用 ref 创建一个响应式数据
// 值为父组件传递过来的 props 值
const age = ref(prop.age)
```

还有一些时候，可能需要对父组件传递过来的数据进行二次计算，这个也是可以的，前提是在子组件内部自己创建一个计算属性，仅仅使用父组件传递的 props 值来做二次计算。

```js
const props = defineProps(['size'])

// 该 prop 变更时计算属性也会自动更新
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```



### 校验

子组件在声明 Props 的时候，是可以书写校验要求的，如果父组件在传递值的时候不符合 Props 值的要求，开发阶段 Vue 会在控制台给出警告信息。

```js
defineProps({
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // Number 类型的默认值
  propD: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propE: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  // 在 3.4+ 中完整的 props 作为第二个参数传入
  propF: {
    validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propG: {
    type: Function,
    // 不像对象或数组的默认，这不是一个
    // 工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
```

例如我们对上面的 UserCard.vue 添加一个自定义的校验规则：

```js
defineProps({
  user: {
    type: Object,
    required: true,
    // 自定义校验规则
    validator: (value) => {
      return value.name && value.email && value.avatarUrl
    }
  },
  age: {
    type: [Number, String],
    default: 18
  }
})
```

## 自定义事件

自定义事件的核心思想，子组件传递数据给父组件。

另外，父组件传递给子组件的数据，子组件不能去改，此时子组件也可以通过自定义事件的形式，去通知父组件，让父组件即时的更新数据。

### 快速上手

这里以评分组件为例：

```html
<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star" @click="setStar(star)">
      {{ rating >= star ? '★' : '☆' }}
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const rating = ref(0) // 表示几颗星

const emits = defineEmits(['update-rating'])

function setStar(newStar) {
  rating.value = newStar
  // 我们需要将最新的星星状态的值传递给父组件
  // 触发父组件的 update-rating 事件
  emits('update-rating', rating.value)
}
</script>

<style scoped>
.rating-container {
  display: flex;
  font-size: 24px;
  cursor: pointer;
}

.star {
  margin-right: 5px;
  color: gold;
}

.star:hover {
  color: orange;
}
</style>
```

在上面的评分组件中，我们需要将子组件 rating 的状态值传递给父组件，通过触发父组件所绑定的 update-rating 事件来进行传递。

```html
<template>
  <div class="app-container">
    <h1>请对本次服务评分：</h1>
    <Rating @update-rating="handleRating" />
    <p v-if="rating > 0">你当前的评价为 {{ rating }} 颗星</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Rating from './components/Rating.vue'
const rating = ref(0)

function handleRating(newRating) {
  // 更新父组件的数据就可以了
  rating.value = newRating
}
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

p {
  font-size: 18px;
  color: #333;
}
</style>
```

父组件在使用子组件的时候，就为子组件绑定了自定义事件，本例中是 update-rating 事件，当子组件触发该事件时，就会执行该事件所对应的事件处理函数 handleRating. 事件处理函数的形参就能够接收到子组件传递过来的数据。



### 事件相关细节

在组件的模板中，可以直接使用 $emit 去触发自定义事件。例如上面的评分的组件例子，可以这么写：

```html
<span v-for="star in 5" :key="star" class="star" @click="$emit('update-rating', star)">
  {{ rating >= star ? '★' : '☆' }}
</span>
```

和前面所介绍的 Props 类似，自定义事件也是支持校验的。这里的校验主要是对子组件要传递给父组件的值进行校验。

要添加校验，需要书写为对象的形式，对象的键是事件名，值是校验函数，校验函数所接收的参数就是 emit 触发事件时要传递给父组件的参数，需要返回一个布尔值来说明传递的值是否通过了校验。

```html
<script setup>
const emit = defineEmits({
  // 没有校验
  click: null,

  // 校验 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

例如还是拿刚才的评分组件来举例：

```js
defineProps(['rating'])
const emits = defineEmits({
  'update-rating': (value) => {
    if (value < 1 || value > 5) {
      console.warn('传递的值有问题！！！')
      return false
    }
    return true
  }
})

function setStar(newStar) {
  // 我们需要将最新的星星状态的值传递给父组件
  // 触发父组件的 update-rating 事件
  emits('update-rating', 100)
}
```


## 组件v-model

父传子通过 Props，子传父通过自定义事件。

v-model 是 Vue 中的一个内置指令，除了可以做表单元素的双向绑定以外，还可以用在组件上面，从而成为父组件和子组件数据传输的桥梁。

### 快速上手

App.vue

```html
<template>
  <div class="app-container">
    <h1>请对本次服务评分：</h1>
    <!-- <Rating @update-rating="handleRating" :rating /> -->
    <Rating v-model="rating" />
    <p v-if="rating > 0">你当前的评价为 {{ rating }} 颗星</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Rating from './components/Rating.vue'
// 这是父组件维护的数据
const rating = ref(0)
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

p {
  font-size: 18px;
  color: #333;
}
</style>

```

Rating.vue

```html
<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star" @click="setStar(star)">
      {{ model >= star ? '★' : '☆' }}
    </span>
  </div>
</template>

<script setup>
const model = defineModel()

function setStar(newStar) {
  model.value = newStar
}
</script>

<style scoped>
.rating-container {
  display: flex;
  font-size: 24px;
  cursor: pointer;
}

.star {
  margin-right: 5px;
  color: gold;
}

.star:hover {
  color: orange;
}
</style>

```

在上面的例子中， 仍然是一个宏，并且这个宏是从 3.4 才开始支持的。

defineModel 没有破坏单向数据流的规则，因为它的底层仍然是使用的 Props 和 emits，编译器在进行编译的时候，会将 defineModel 这个宏展开为：

- 一个名为 modelValue 的 prop
- 一个名为 update:modelValue 的事件

如果你是 3.4 版本之前，那么得按照这种方式来使用：

```html
<script setup>
// 接收父组件传递下来的 Props
const props = defineProps(['modelValue'])
// 触发父组件的事件
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

由于 v-model 返回的是一个 ref 值，这个值可以再次和子组件的表单元素进行双向绑定：

```html
<input type="text" v-model="model" />
```



### 相关细节

1. defineModel支持简单的验证

```js
// 使 v-model 必填
const model = defineModel({ required: true })

// 提供一个默认值
const model = defineModel({ default: 0 })

// 指定类型
const model = defineModel({ type: String })
```



2. 父组件在使用子组件的时候，v-model 可以传递一个参数

父组件

```html
<!-- 传递给子组件的状态是 bookTitle，而这里的 title 相当于是给当前的 v-model 命名 -->
<MyComponent v-model:title="bookTitle" />
```

回头在子组件中：

```html
<!-- MyComponent.vue -->
<script setup>
// 接收名为 title 的 v-model 绑定值
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

当绑定多个 v-model 的时候，那么就需要命名了：

```html
<!-- 父组件传递多个 v-model绑定值，这个时候就需要命名了 -->
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

```html
<script setup>
// 子组件通过命名来指定要获取哪一个 v-model 绑定值
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

当使用了名字之后，验证就书写成第二个参数即可

```js
const title = defineModel('title', { required: true })
const count = defineModel("count", { type: Number, default: 0 })
```



3. 使用 v-model 和子组件进行通信的时候，也可以使用修饰符

父组件

```html
<MyComponent v-model.capitalize="myText" />
```

回头子组件通过解构的方式能够拿到修饰符

```html
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

虽然拿到了修饰符，但是该修饰符没有任何功能，需要子组件这边自己来实现，实现了对应的功能之后，实际上对应的就是对子组件修改父组件数据时的一种限制。

```html
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    // 如果父组件书写了 capitalize 修饰符
    // 那么子组件在修改状态的时候，会走 setter
    // 在 setter 中就可以对子组件所设置的值进行一个限制
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

这里我们以前面的星级评分为例：

```js
const [model, modifiers] = defineModel({
  required: true,
  // 这个就是一个 setter，回头子组件在修改值的时候，就会走这个 setter
  set(value) {
    console.log(value)
    if (modifiers.number) {
      if (isNaN(value)) {
        value = 0
      } else {
        value = Number(value)
      }
      if (value < 0) {
        value = 0
      } else if (value > 5) {
        value = 5
      }
      return value
    }
  }
})
```



## 插槽

有些时候，我们有这样的需求：父组件需要向子组件传递模板内容，这个时候显然使用前面的 Props 是无法做到的，此时就需要本节课所介绍的插槽。

要使用插槽非常简单，首先在书写子组件的时候，添加上 slot 相当于就是设置了插槽，回头父组件在使用子组件的时候，在子组件元素之间书写的内容就会被插入到子组件 slot 的地方。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-16-075336.png" alt="image-20240416155335459" style="zoom:50%;" />

### 快速入门

首先是子组件 Card.vue

```html
<template>
  <div class="card">
    <!-- 卡片的头部 -->
    <div class="card-header">
      <!-- 具名插槽 -->
      <slot name="header"></slot>
    </div>
    <!-- 卡片的内容 -->
    <div class="card-body">
      <!-- 默认插槽 -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: 20px;
}

.card-header {
  background-color: #f7f7f7;
  border-bottom: 1px solid #ececec;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.card-body {
  padding: 15px;
  font-size: 14px;
  color: #333;
}
</style>
```

通过 slot 来设置插槽，上面的例子中，设置了两个插槽，一个是名为 header 的具名插槽，另外一个是默认插槽。

```html
<template>
  <div>
    <Card>
      <!-- 中间的内容就会被放入到插槽里面 -->
      <template v-slot:header>我的卡片标题</template>
      这是卡片的内容
    </Card>
    <Card>
      <template v-slot:header>探险摄影</template>
      <div class="card-content">
        <img src="./assets/landscape.jpeg" class="card-image" />
        <p>探索未知的自然风光，记录下每一个令人惊叹的瞬间。加入我们的旅程，一起见证世界的壮丽。</p>
      </div>
    </Card>
  </div>
</template>

<script setup>
import Card from './components/Card.vue'
</script>

<style scoped>
.card-image {
  width: 100%; /* 让图片宽度充满卡片 */
  height: auto; /* 保持图片的原始宽高比 */
  border-bottom: 1px solid #ececec; /* 在图片和文本之间添加一条分隔线 */
}
</style>
```

父组件在插入模板内容的时候，可以通过 v-slot 来指定要插入到的具名插槽。如果没有指定，那么内容会被插入到默认插槽里面。



### 插槽相关细节

1. 插槽支持默认内容

可以在 slot 标签之间写一些默认内容，如果父组件没有提供模板内容，那么会渲染默认内容。

```html
<slot>这是默认插槽的默认值</slot>
```



2. 具名插槽

插槽是可以有名字的，这意味着可以设置多个插槽，回头父组件可以根据不同的名字选择对应的内容插入到指定的插槽里面。

父组件在指定名字的时候，使用 v-slot:插槽名

```html
<template v-slot:header>探险摄影</template>
```

这里有一个简写，直接写成 #插槽名

```html
<template #header>探险摄影</template>
```

![image-20240416155242559](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-16-075242.png)

另外，当组件同时接收默认插槽和具名插槽的时候，位于顶级的非 template 节点的内容会被放入到默认插槽里面。



3. 父组件在指定插槽名的时候，可以是动态的

```html
<template v-slot:[slotName]>探险摄影</template>
```

```html
<template #[slotName]>探险摄影</template>
```



### 作用域

首先明确一个点：

- 父组件模板中的表达式只能访问父组件的作用域下的数据
- 子组件模板中的表达式只能访问子组件的作用域下的数据

父组件

```html
<template>
  <div class="parent">
    <h1>父组件的标题</h1>
    <Card>
      <!-- 插槽内容可以访问父组件的数据 -->
      <template v-slot:default>
        <p>这是父组件的数据：{{ parentData }}</p>
        <!-- 以下行将会导致错误，因为试图在父组件中访问子组件的数据 -->
        <p>尝试访问子组件的数据：{{ childData }}</p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue'
import { ref } from 'vue'

// 父组件的数据
const parentData = ref('这是父组件的数据')
</script>

<style>
.parent {
  padding: 20px;
}
</style>
```

子组件

```html
<template>
  <div class="child">
    <h2>子组件的标题</h2>
    <!-- 这里的插槽将展示从父组件传递的内容 -->
    <slot></slot>
    <p>子组件数据：{{ childData }}</p>
    <p>尝试访问父组件数据：{{ parentData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 子组件的数据
const childData = ref('这是子组件的数据')
</script>

<style>
.child {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
}
</style>
```

有些时候，我们需要将子组件作用域下的数据通过 **插槽** 传递给父组件，这就涉及到作用域插槽。

子组件：在设置插槽的时候，添加了一些动态属性

```html
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

父组件：通过 v-slot 并且将值设置为 slotProps，这样就可以拿到子组件传递过来的数据

```html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-16-075301.png" alt="image-20240416155301318" style="zoom:50%;" />

父组件在接收作用域插槽传递过来的数据的时候，也是能够解构的：

```html
<MyComponent v-slot="{text, count}">
  {{ text }} {{ count }}
</MyComponent>
```

下面是一个关于作用域插槽的实际使用场景：

子组件通过作用域插槽将数据传递给父组件：

```html
<template>
  <div class="list-container">
    <ul>
      <li v-for="item in items" :key="item.id">
        <!-- li 里面渲染什么内容我不知道，通过父组件在使用的时候来指定 -->
        <!-- 下面的插槽中，:item=item 就是将子组件的数据传递给父组件的插槽内容 -->
        <slot name="item" :item="item">{{ item.defaultText }}</slot>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 子组件的数据，这个数据可能是通过请求得到的
const items = ref([
  { id: 1, name: 'Vue.js', defaultText: 'Vue.js 是一个渐进式 JavaScript 框架。' },
  { id: 2, name: 'React', defaultText: 'React 是一个用于构建用户界面的 JavaScript 库。' },
  { id: 3, name: 'Angular', defaultText: 'Angular 是一个开源的 Web 应用框架。' }
])
</script>

<style>
.list-container {
  max-width: 300px;
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
```

父组件通过 v-slot 来接收到子组件传递过来的数据内容

```html
<template>
  <div class="app-container">
    <Card>
      <template v-slot="{ item }">
        <!-- 在父组件中来决定子组件的插槽内容 -->
        <h3>{{ item.name }}</h3>
        <p>{{ item.defaultText }}</p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue'
</script>

<style>
.app-container {
  padding: 20px;
}
</style>
```

关于上面的例子，官方还有一个叫法：无渲染组件

>一些组件可能只包括了逻辑而不需要自己渲染内容，视图输出通过作用域插槽全权交给了消费者组件。我们将这种类型的组件称为**无渲染组件**。

## 前端路由介绍

- 前端路由库
- 状态管理库
- 前端组件库

Vue 生态中选择这三个最最最重要的生态库来介绍。

### 什么是前端路由

实际上在最早的多页应用时代，并不存在前端路由这么一说，那个时候路由是属于后端（服务器端）的东西，后端会根据不同的请求路由返回不同的页面。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-16-235256.jpg" alt="16925848313024" style="zoom:50%;" />

在此开发时期有两个特点：

- 整个项目的前后端代码是杂糅在一起的。
- 多页应用时代，每次切换一个页面，都需要重新请求服务器。

后面慢慢就到了单页应用时代，该时代的特点就是只有一个 HTML 页面，以前视图的切换是整个 HTML 页面的切换，而现在视图的切换是页面上某个模块的切换。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-16-235800.jpg" alt="16925848668499" style="zoom:50%;" />

上图中的模块其实就是对应 Vue 中不同的组件，这种组件我们称之为页面级组件。有了页面级组件，需要和路由产生一个映射关系，这个其实就是前端路由。

虽然有了前端路由，但是后端路由仍然存在，只不过从之前的路由和页面的映射关系变成了路由和数据接口之间的映射关系。

### Vue生态的前端路由

Vue生态的前端路由是由 Vue 官方推出的，叫做 Vue Router：https://router.vuejs.org/zh/

首先第一步，需要安装该路由库：

```bash
npm install vue-router@4
```

**快速入门**

1. 我们需要创建两个页面级别的组件，放在 views 目录下面。
2. 在 src 下面创建一个 router 目录，用于存放前端路由配置，然后在该目录下面创建一个 index.js，该文件书写具体的路由配置

```js
// 前端路由配置文件
import { createRouter, createWebHistory } from 'vue-router'
// 页面组件
import Home from '../views/Home.vue'
import About from '../views/About.vue'

// 该方法会创建一个路由的实例
// 在创建路由实例的时候，可以传入一个配置对象
const router = createRouter({
  history: createWebHistory(), // 指定前端路由的模式，常见的有 hash 和 history 两种模式
  // 路由和组件的映射
  routes: [
    {
      path: '/', // 路由的路径
      name: 'Home',
      component: Home // 路由对应的组件
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
export default router
```

3. 需要将该配置所导出的路由实例在 main.js 入口文件中进行挂载

```js
// main.js

// 引入路由实例
import router from '@/router'
// ...
// 挂载
app.use(router).mount('#app')
```

4. 接下来就可以在组件中使用了

```html
<template>
  <div id="app">
    <h1>欢迎来到Vue-router快速入门示例</h1>
    <nav>
      <!-- 该组件由 vue-router 这个库提供的 -->
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <!-- 由 vue-router 这个库提供的 -->
    <!-- 路由所匹配上的组件，会渲染到这个位置 -->
    <router-view />
  </div>
</template>

<script setup></script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

nav a {
  padding: 15px;
}
</style>
```

上面会用到两个由 vue-router 库为我们提供的组件：

- router-link：指示具体的跳转路由路径
- router-view：显示匹配的路由所对应的组件


## 状态管理库

### 状态管理库基本介绍

所谓状态管理库，就是用于**管理一个应用中组件的状态**的。

传统方式组件之间传递状态:

- 父传子用 Props
- 子传父用 Emit

这种方式存在的问题？

如果你的应用的规模一旦慢慢变大，那么不同层级之间组件的状态传递，就会变得非常的麻烦。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-17-000956.jpg" alt="15633343660460" style="zoom:50%;" />

状态管理库如何解决这个问题的？

在状态管理库中，会有一个统一的地方（数据仓库）管理所有的状态，这个时候组件之间要进行状态的传递，只需要一个组件将状态提交到仓库，然后另一个组件从仓库获取最新的状态即可。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-17-001919.jpg" alt="15633438778868" style="zoom:50%;" />

### Vue生态的状态管理库

目前，Vue 生态官方所推荐的状态管理库是 Pinia，这是目前最新的状态管理库，用于替代以前的 Vuex 的，因此我们也是以 Pinia 为主，介绍这个最新的状态管理库。

Pinia ，发音为 /piːnjʌ/，来源于西班牙语 piña 。意思为菠萝，表示与菠萝一样，由很多小块组成。在 Pinia 中，**每个 Store 都是单独存在**，一同进行状态管理。

Pinia 是由 Vue.js 团队成员开发，最初是在 2019 年 11 月左右作为**一项实验性工作**提出的，目的是为了使用 Composition API 重新设计 Vuex，探索 Vuex 下一次迭代会是什么样子。但是 Pinia 在设计之初就倾向于同时支持 Vue 2 和 Vue 3，并且不强制要求开发者使用组合式 API。在探索的过程中，Pinia 实现了 Vuex5 提案的大部分内容，于是就直接取而代之了。

目前 Vue 官方已经宣布 Pinia 就是新一代的 Vuex，但是为了尊重作者本人，名字保持不变，仍然叫做 Pinia。

与之前的 Vuex 相比，Pinia 提供了更简单的 API，更少的规范，以及 *Composition-API* 风格的 API 。更重要的是，与 *TypeScript* 一起使用具有可靠的类型推断支持。

Pinia 官网地址：https://pinia.vuejs.org/

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-03-21-093840.png" alt="image-20230321173840739" style="zoom:50%;" />

对比之前的 Vuex，Pinia 具有如下的特点：

1. **mutations 不复存在**。只有 state 、getters 、actions
2. actions 中支持**同步**和**异步**方法修改 state 状态
3. 与 TypeScript 一起使用具有可靠的类型推断支持
4. **不再有模块嵌套**，只有 Store 的概念，Store 之间可以相互调用
5. **支持插件扩展**，可以非常方便实现本地存储等功能
6. 更加**轻量**，压缩后体积只有 2kb 左右



### 快速入门

首先第一步仍然是安装

```bash
npm install pinia
```

接下来，需要在 Vue 应用中挂载 Pinia

```js
import { createApp } from 'vue'
// 引入了根组件
import App from './App.vue'
import { createPinia } from 'pinia'

// 挂载根组件
const app = createApp(App)
// 创建一个 pinia 的实例
const pinia = createPinia()

app.use(pinia).mount('#app')
```

下一步就是创建数据仓库。src 目录下面创建一个 stores 是目录，该目录是数据仓库目录，下面可以对应多个数据仓库，每个数据仓库就是一个 JS 文件。

注意名字一般叫做 useXXXStore：

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 定义数据状态
  state: () => {
    return {
      count: 0
    }
  },
  // 定义了修改数据状态的两个方法
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  }
})
```

通过 defineStore 方法来创建一个数据仓库，该方法接收两个参数：

- 仓库名称
- 配置对象，在该配置对象里面就可以定义 state、getters、actions

最后就可以在组件中，使用数据仓库里面的状态：

```html
<template>
  <div class="counter">
    <h1>计数器：{{ conterStore.count }}</h1>
    <button @click="conterStore.increment">增加</button>
    <button @click="conterStore.decrement">减少</button>
  </div>
</template>

<script setup>
import { useCounterStore } from './stores/useCounterStore.js'
// 获取数据仓库
const conterStore = useCounterStore()
</script>

<style scoped>
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
```



## 组件库介绍

- 函数
- 函数库
- 类
- 类库
- 模块
- 组件
- 组件库
- 框架
- ....

这些东西看上去很多，但其实本质上就是代码复用的一种方式。

1. **Vuetify** - Vuetify 是一个广受欢迎的 Vue UI 组件库，提供了广泛的材料设计组件。它非常适合快速开发，拥有丰富的组件和详细的文档。

   官网地址：https://vuetifyjs.com/en/

2. **Element Plus** - Element Plus 是 Element UI 的 Vue 3 版本，是一个面向企业级产品的组件库，它提供了一系列可配置的组件和丰富的 API。

   官网地址：https://element-plus.org/

3. **PrimeVue** - PrimeVue 是 PrimeFaces Team 针对 Vue 开发的组件库，它提供了丰富的组件和主题，适合用于各种商业应用。

   官网地址：https://primevue.org/

4. **Ant Design Vue** - 这是 Ant Design 的 Vue 实现，特别适合用于企业级应用。它提供了丰富的 Vue 组件，是构建后台应用界面的理想选择。

   官网地址：https://antdv.com/components/overview

5. **Naive UI** - 一个相对较新的 Vue 3 组件库，采用 TypeScript 编写，提供了一套完整的组件，以灵活性和轻量级著称，还被尤雨溪推荐过。

   官网地址：https://www.naiveui.com/zh-CN/os-theme

6. **BootstrapVue** - 尽管 BootstrapVue 最初是为 Vue 2 开发的，但社区已经在为支持 Vue 3 而努力。它将 Bootstrap 的功能与 Vue 的反应性相结合。

   官网地址：https://bootstrap-vue.org/

7. **Vant** - Vant 是一个轻量级、可靠的移动端 Vue 组件库，由有赞前端团队开发和维护。

   官网地址：https://vant-ui.github.io/vant/#/en-US

### 安装

```bash
npm install element-plus --save
```

安装完毕后，接下来需要在 Vue 应用中挂载组件库。

挂载组件库分为两种形式：**全量引入** 和 **按需引入**

全量引入：就是一次性引入整个组件库，配置也很简单，无需考虑哪些组件需要引入。

```js
import { createApp } from 'vue'
import App from './App.vue'

// 导入组件库
import ElementPlus from 'element-plus'
// 导入组件库的样式
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus).mount('#app')
```

之后就可以在自己应用里面的任意组件中，使用组件库所提供的组件：

```html
<el-button>Default</el-button>
<el-button type="primary">Primary</el-button>
<el-button type="success">Success</el-button>
<el-button type="info">Info</el-button>
<el-button type="warning">Warning</el-button>
<el-button type="danger">Danger</el-button>
```

如果涉及到图标，那么需要额外安装图标相关的库：

```bash
npm install @element-plus/icons-vue
```

安装完毕后，仍然是可以全量进行注册：

```js
// 导入组件库的图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 挂载所有的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

还有一种方式，就是采用 **按需引入**

- 优化包的体积
- 性能更优

目前有两个非常方便的插件，让我们彻底告别全量引入，哪怕是学习阶段也可以采用按需引入

- unplugin-vue-components：会自动扫描你的项目文件，找到使用的 Vue 组件，在打包的时候自动引入这些组件，无需手动的 import.
- unplugin-auto-import：按需引入工具函数的插件，它可以自动引入 Vue 相关的工具函数（ref、computed），这些工具函数也就不需要再 import 了

安装这两个插件：

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

之后需要在 vite 的配置文件中引入这些插件：

```js
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

之后就不再需要在 Vue 应用中去挂载所有的组件了：

```js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.mount('#app')
```

main.js 重新变得非常的干净了。

而且这种方式是按需引入，打包后的体积也非常小。

### 快速上手

下面是 ElementPlus 中一个关于表单的示例：

```html
<template>
  <div class="form-container">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="user-form">
      <h2 class="form-title">用户信息表单</h2>
      <!-- 姓名 -->
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <!-- 出生日期 -->
      <el-form-item label="出生日期：" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="选择日期"
          :picker-options="{ firstDayOfWeek: 1 }"
          style="width: 100%"
        />
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别：" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio value="male">男</el-radio>
          <el-radio value="female">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 兴趣爱好 -->
      <el-form-item label="兴趣爱好：" prop="hobbies">
        <el-checkbox-group v-model="form.hobbies">
          <el-checkbox value="reading" name="hobby">阅读</el-checkbox>
          <el-checkbox value="music" name="hobby">音乐</el-checkbox>
          <el-checkbox value="sports" name="hobby">运动</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="接收通知：" prop="notifications">
        <el-switch v-model="form.notifications"></el-switch>
      </el-form-item>
      <el-form-item label="用户评级：" prop="rating">
        <el-rate v-model="form.rating"></el-rate>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({
  name: '',
  email: '',
  birthday: '',
  gender: 'male',
  hobbies: [],
  notifications: false,
  rating: 0
})

const formRef = ref(null)

const rules = {
  // 验证规则是一个数组，因为可以设置多条验证规则
  // 每一条验证规则，是一个对象
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入您的邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  birthday: [{ required: true, message: '请选择您的出生日期', trigger: 'change' }],
  gender: [{ required: true, message: '请选择您的性别', trigger: 'change' }],
  hobbies: [{ required: true, message: '至少选择一个兴趣爱好', trigger: 'change' }],
  rating: [{ required: true, message: '请评价用户等级', trigger: 'change' }]
}
// 提交表单
function submitForm() {
  // 提交表单的时候，需要看一下表单是否验证通过
  formRef.value.validate((valid) => {
    // 自动传入一个参数，这个参数是一个布尔值，代表表单是否验证通过
    if (valid) {
      // 验证通过
      console.log('表单验证通过')
    } else {
      // 验证不通过
      console.log('表单验证不通过')
      return false
    }
  })
}
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.user-form {
  width: 600px;
  border: 1px solid #eee;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
```

### 国际化

在 ElementPlus 组件库中，默认采用的是英语。

如果想要使用其他的语言，那么同样是稍微配置一下就可以了

```js
import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

app
  .use(ElementPlus, {
    locale: zhCn
  })
  .mount('#app')
```

但是上面的这种配置方式，就变成全量引入了，这意味着打包的时候，会将所有的组件都打包进去。

如果想要采用按需引入的方式，需要借助 ConfigProvider 组件

```html
<template>
	<ElConfigProvider :locale="locale">
  	<!-- 其他组件 -->
	</ElConfigProvider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
// 引入的是中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const locale = ref(zhCn)
</script>
```

