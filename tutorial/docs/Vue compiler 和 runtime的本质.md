# Vue compiler 和 runtime的本质

> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial


# 模板的本质

## 渲染函数

渲染函数（ h ）调用后会返回虚拟 DOM 节点

文档地址：https://cn.vuejs.org/api/render-function.html#h

实际上，Vue 里面的单文件组件是会被一个 **模板编译器** 进行编译的，编译后的结果并不存在什么模板，而是会把模板编译为渲染函数的形式。

这意味着我们完全可以使用纯 JS 来书写组件，文件的内部直接调用渲染函数来描述你的组件视图。

例如我们之前写过的 UserCard 这个组件，完全可以改写成纯 JS 的形式：

```js
import { defineComponent, h } from 'vue'
import styles from './UserCard.module.css'
export default defineComponent({
  name: 'UserCard',
  props: {
    name: String,
    email: String,
    avatarUrl: String
  },
  setup(props) {
    // 下面我们使用了渲染函数的形式来描述了原本在模板中所描述的视图结构
    return () =>
      h(
        'div',
        {
          class: styles.userCard
        },
        [
          h('img', {
            class: styles.avatar,
            src: props.avatarUrl,
            alt: 'User avatar'
          }),
          h(
            'div',
            {
              class: styles.userInfo
            },
            [h('h2', props.name), h('p', props.email)]
          )
        ]
      )
  }
})
```

```css
.userCard {
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

.userInfo h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.userInfo p {
  margin: 5px 0 0;
  font-size: 16px;
  color: #666;
}
```

甚至也可以使用 Vue2 经典的 options API 的语法来写：

```js
import styles from './UserCard.module.css'
import { h } from 'vue'
export default {
  name: 'UserCard',
  props: {
    name: String,
    email: String,
    avatarUrl: String
  },
  render() {
    return h(
      'div',
      {
        class: styles.userCard
      },
      [
        h('img', {
          class: styles.avatar,
          src: this.avatarUrl,
          alt: 'User avatar'
        }),
        h(
          'div',
          {
            class: styles.userInfo
          },
          [h('h2', this.name), h('p', this.email)]
        )
      ]
    )
  }
}
```

至此我们就知道了，Vue 里面之所以提供模板的方式，是为了让开发者在描述视图的时候，更加的轻松。Vue 在运行的时候本身是不需要什么模板的，它只需要渲染函数，调用这些渲染函数后所得到的虚拟 DOM.

作为一个框架的设计者，你必须要思考：你是框架少做一些，让用户的心智负担更重一些，还是说你的框架多做一些，让用户的心智负担更少一些。

## 模板的编译

**单文件组件中所书写的模板，对于模板编译器来讲，就是普通的字符串。**

模板内容：

```vue
<template>
	<div>
  	<h1 :id="someId">Hello</h1>
  </div>
</template>
```

对于模板编译器来讲，仅仅是一串字符串：

```js
'<template><div><h1 :id="someId">Hello</h1></div></template>'
```

模板编译器需要对上面的字符串进行操作，最终生成的结果：

```js
function render(){
  return h('div', [
    h('h1', {id: someId}, 'Hello')
  ])
}
```

模板编译器在对模板字符串进行编译的时候，是一点一点转换而来的，整个过程：

![image-20231113095532166](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-11-13-015532.png)

- 解析器：负责将模板字符串解析为对应的模板AST
- 转换器：负责将模板AST转换为 JS AST
- 生成器：将 JS AST 生成最终的渲染函数

每一个部件都依赖于上一个部件的执行结果。

假设有这么一段模板：

```vue
<div>
	<p>Vue</p>
  <p>React</p>
</div>
```

对于模板编译器来讲，就是一段字符串：

```js
"<div><p>Vue</p><p>React</p></div>"
```

首先是解析器，拿到这串字符串，对这个字符串进行解析，得到一个一个的 token.

```js
[
  {"type": "tag","name": "div"},
  {"type": "tag","name": "p"},
  {"type": "text","content": "Vue"},
  {"type": "tagEnd","name": "p"},
  {"type": "tag","name": "p"},
  {"type": "text","content": "React"},
  {"type": "tagEnd","name": "p"},
  {"type": "tagEnd","name": "div"}
]
```

接下来解析器还需要根据所得到的 token 来生成抽象语法树（模板的AST）

转换出来的 AST：

```js
{
  "type": "Root",
  "children": [
    {
      "type": "Element",
      "tag": "div",
      "children": [
        {
          "type": "Element",
          "tag": "p",
          "children": [
              {
                "type": "Text",
                "content": "Vue"
              }
          ]
        },
        {
          "type": "Element",
          "tag": "p",
          "children": [
              {
                "type": "Text",
                "content": "React"
              }
          ]
        }
      ]
    }
  ]
}
```

至此解析器的工作就完成了。



接下来就是转换器登场，它需要将上一步得到的模板 AST 转换为 JS AST：

```js
{
  "type": "FunctionDecl",
  "id": {
      "type": "Identifier",
      "name": "render"
  },
  "params": [],
  "body": [
      {
          "type": "ReturnStatement",
          "return": {
              "type": "CallExpression",
              "callee": {"type": "Identifier", "name": "h"},
              "arguments": [
                  { "type": "StringLiteral", "value": "div"},
                  {"type": "ArrayExpression","elements": [
                        {
                            "type": "CallExpression",
                            "callee": {"type": "Identifier", "name": "h"},
                            "arguments": [
                                {"type": "StringLiteral", "value": "p"},
                                {"type": "StringLiteral", "value": "Vue"}
                            ]
                        },
                        {
                            "type": "CallExpression",
                            "callee": {"type": "Identifier", "name": "h"},
                            "arguments": [
                                {"type": "StringLiteral", "value": "p"},
                                {"type": "StringLiteral", "value": "React"}
                            ]
                        }
                    ]
                  }
              ]
          }
      }
  ]
}
```



最后就是生成器，根据上一步所得到的 JS AST，生成具体的 JS 代码：

```js
function render () {
	return h('div', [h('p', 'Vue'), h('p', 'React')])
}
```

下面是一个模板编译器大致的结构：

```js
function compile(template){
  // 1. 解析器
  const ast = parse(template)
  // 2. 转换器：将模板 AST 转换为 JS AST
  transform(ast)
  // 3. 生成器
  const code = genrate(ast)
  
  return code;
}
```



## 编译的时机

整体来讲会有两种情况：

1. 运行时编译
2. 预编译



**1. 运行时编译**

例如下面的代码，是直接通过 CDN 的方式引入的 Vue

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
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
  </head>
  <body>
    <!-- 书写模板 -->
    <div id="app">
      <user-card :name="name" :email="email" :avatar-url="avatarUrl" />
    </div>

    <template id="user-card-template">
      <div class="user-card">
        <img :src="avatarUrl" alt="User avatar" class="avatar" />
        <div class="user-info">
          <h2>{{ name }}</h2>
          <p>{{ email }}</p>
        </div>
      </div>
    </template>

    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script>
      const { createApp } = Vue;

      const UserCard = {
        name: "UserCard",
        props: {
          name: String,
          email: String,
          avatarUrl: String,
        },
        template: "#user-card-template",
      };

      createApp({
        components: {
          UserCard,
        },
        data() {
          return {
            name: "John Doe",
            email: "john@example",
            avatarUrl: "./yinshi.jpg",
          };
        },
      }).mount("#app");
    </script>
  </body>
</html>
```

在上面的例子中，也会涉及到模板代码以及模板的编译，那么此时的模板编译就是在运行时进行的。



**2. 预编译**

预编译是发生在工程化环境下面。

所谓预编译，指的是工程打包过程中就完成了模板的编译工作，浏览器拿到的是打包后的代码，是完全没有模板的。

这里推荐一个插件：vite-plugin-inspect

安装该插件后在 vite.config.js 配置文件中简单配置一下：

```js
// vite.config.js
import Inspect from 'vite-plugin-inspect'

export default {
  plugins: [
    Inspect()
  ],
}
```

之后就可以在 http://localhost:5173/__inspect/ 里面看到每一个组件编译后的结果。


# 组件树和虚拟DOM树

在最早期的时候，大家接触到的树就是 DOM 树：

```html
<div>
	<h1>你喜欢的水果</h1>
  <ul>
    <li>西瓜</li>
    <li>香蕉</li>
    <li>苹果</li>
  </ul>
</div>
```

上面的 HTML 结构就会形成一个 DOM 树结构：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-09-014201.png" alt="image-20240509094200993" style="zoom:50%;" />

实际上，组件的本质就是对一组 DOM 进行复用。

假设我们将上面的 DOM 结构封装成一个组件 Fruit，该组件就可以用到其他的组件里面，组件和组件之间就形成了树结构，这就是组件树。而每个组件的背后，对应的是一组虚拟 DOM，虚拟 DOM 的背后又是真实 DOM 的映射：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-09-023228.png" alt="image-20240509103228516" style="zoom:50%;" />

接下来明确定义：

- 组件树：指的是一个一个组件所形成的树结构。
- 虚拟 DOM 树：指的是某一个组件内部的虚拟 DOM 数据结构，**并非整个应用的虚拟 DOM 结构**。

理解清楚上面的概念，有助于你理解为什么 Vue 中既有响应式，又有虚拟 DOM 以及 diff 算法。

回顾 Vue1.x 以及 Vue2.x 的响应式：

- Object.defineProperty
- Dep：相当于观察者模式中的发布者。
- Watcher：相当于观察者模式中的观察者。

但是在 Vue1.x 的时候没有虚拟 DOM，模板中每次引用一个响应式数据，就会生成一个 watcher

```vue
<template>
  <div class="wrapper">
    <!-- 模版中每引用一次响应式数据，就会生成一个 watcher -->
    <!-- watcher 1 -->
    <div class="msg1">{{ msg }}</div>
    <!-- watcher 2 -->
    <div class="msg2">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 和 dep 一一对应，和 watcher 一 对 多
      msg: 'Hello Vue 1.0'
    }
  }
}
</script>
```

- 优点：这种设计的好处在于能够精准的知道哪个数据发生了变化。
- 缺点：当应用足够复杂的时候，一个应用里面会包含大量的组件，而这种设计又会导致一个组件对应多个 watcher，这样的设计是非常消耗资源的

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-09-030208.png" alt="image-20240509110208375" style="zoom:50%;" />

于是从 Vue2.0 版本开始，引入了虚拟 DOM。2.0 的响应式有一个非常大的变动，将 watcher 的粒度放大到了组件级别，也就是说，一个组件对应一个 watcher. 但是这种设计也会带来一些新的问题：以前能够精准的知道是哪一个节点要更新，但是现在因为 watcher 是组件级别，只能知道是哪个组件要更新，但是组件内部具体是哪一个节点更新是无从得知的。这个时候虚拟 DOM 就派上用场了，通过对虚拟 DOM 进行 diff 计算，就能够知道组件内部具体是哪一个节点更新。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-09-030710.png" alt="image-20240509110709853" style="zoom:50%;" />

Vue3 的响应式在架构层面上面是没有改变的，仍然是响应式+虚拟DOM

- 响应式：精确到组件级别，能够知道哪一个组件更新了。不过 Vue3 的响应式基于 Proxy.
- 虚拟 DOM：通过 diff 算法计算哪一个节点需要更新，不过 diff 算法也不再是 Vue2 的 diff 算法，算法方面也有更新。



# 指令的本质

目前为止，我们学习过很多 Vue 的内置指令，例如：

- v-if
- v-show
- v-for
- v-model
- v-html
- v-bind
- v-on
- ......

结合 vite-plugin-inspect 插件的编译结果来进行分析指令的本质。



**v-if**

```vue
<template>
  <div v-if="type === 1">type 的值为 1</div>
  <div v-else-if="type === 2">type 的值为 2</div>
  <div v-else-if="type === 3">type 的值为 3</div>
  <div v-else-if="type === 4">type 的值为 4</div>
  <div v-else>Not 1/2/3/4 is 0</div>
  <button @click="toogleFunc">Toggle</button>
</template>

<script setup>
import { ref } from 'vue'
const type = ref(1)
function toogleFunc() {
  type.value = Math.floor(Math.random() * 5)
}
</script>

<style scoped></style>
```

编译结果如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-030545.png" alt="image-20240527110545681" style="zoom:50%;" />

对于 v-if 指令，背后对应的就是三目运算符写的不同分支。

每一次 $setup.type 值的变化就会导致渲染函数重新执行，然后进入到不同的分支。



**v-for**

```vue
<template>
  <div>
    <h2>商品列表</h2>
    <ul>
      <!-- 使用 v-for 遍历 products 数组，渲染每个商品的信息 -->
      <li v-for="(product, index) in products" :key="index">
        {{ product.name }} - ${{ product.price }}
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

编译结果如下：

![image-20240527110842602](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-030842.png)

生成的渲染函数里面，用到了一个名为 renderList 的内部方法。

renderList：packages/runtime-core/src/helpers/renderList.ts



**v-bind**

```vue
<template>
  <div v-bind:id>dynamicId</div>
</template>

<script setup>
import { ref } from 'vue'
const id = ref('my-id')
</script>

<style lang="scss" scoped></style>
```

编译后的结果如下：

![image-20240527111250108](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-031250.png)

这里就是将 $setup.id 的值作为 div 的 id 属性值，这里涉及到了响应式数据的读取，因此 $setup.id 的值发生变化的时候，渲染函数会重新执行，div 对应的属性也会发生变化。



**v-on**

```vue
<template>
  <div>{{ count }}</div>
  <button v-on:click="count++">+1</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<style lang="scss" scoped></style>
```

编译结果如下：

![image-20240527111601754](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-031602.png)

这个也非常简单，编译结果就是为 button 元素添加上了 click 事件，该事件对应的事件处理函数为：

```js
$event => $setup.count++
```



通过这么几个例子，我们对比编译前后的结果，可以得出一个结论：

最终编译出来的渲染函数，根本不存在什么指令，**不同的指令会被编译为不同处理**。




# 插槽的本质

复习插槽的概念：

- 子组件：通过 slot 来设置插槽
- 父组件：使用子组件时可以往 slot 的位置插入模板内容

插槽**使用层面**的本质：**父组件向子组件传递模板内容**

- 默认插槽：拥有默认的一些内容
- 具名插槽：给你的插槽取一个名字
- 作用域插槽：数据来自于子组件，通过插槽的形式传递给父组件使用



**父组件传递内容的本质**

传递的是一个对象：

```js
{
  default: function(){ ... },
  xxx: function(){ ... },
  xxx: function(){ ... },
}
```

对于上面的例子来讲，父组件传递的就是这样的一个对象：

```jsx
{
  default: function(){
    // 注意返回值是对应结构的虚拟 DOM
    return (
    	 <div class="card-content">
        <img src="./assets/landscape.jpeg" alt="Beautiful landscape" class="card-image" />
        <p>探索未知的自然风光，记录下每一个令人惊叹的瞬间。加入我们的旅程，一起见证世界的壮丽。</p>
      </div>
    )
  },
  header: function(){
    return (
    	<div>摄影作品</div>
    )
  }
}
```

父组件向子组件传递过去的东西本质上是函数，通过调用这些函数，能够得到对应结构的虚拟 DOM.



**子组件设置插槽的本质**

其实就是对父组件传递过来的函数进行调用，得到对应的虚拟 DOM.

```js
const slots = {
  default: function(){ ... },
  xxx: function(){ ... },
  xxx: function(){ ... },
}; // 该对象是父组件传递过来的对象
slots.default(); // 得到要渲染的虚拟DOM 
slots.header(); // 得到要渲染的虚拟DOM
slots.xxx(); // 得到要渲染的虚拟DOM                   
```



**进行验证**

最后，我们需要对上面的说法进行验证。

```js
import { defineComponent, h, ref } from 'vue'
import styles from './CardComponent.module.css'

export default defineComponent({
  name: 'CardComponent',
  setup(_, { slots }) {
    const title = ref('这是子组件标题222')
    const deaultSlotsVNode = slots.default()
    let headerSlotsVnode = null
    // 如果传递了header插槽，就调用header插槽
    if (slots.header) {
      headerSlotsVnode = slots.header({
        title: title.value
      })
    }
    // 但是要注意，调用了之后，不见得有值，所以要判断一下
    if (!headerSlotsVnode.length) {
      headerSlotsVnode = h('div', null, '默认标题')
    }
    return () =>
      h('div', { class: styles.card }, [
        h('div', { class: styles['card-header'] }, headerSlotsVnode),
        h('div', { class: styles['card-body'] }, deaultSlotsVNode)
      ])
  }
})
```


# v-model的本质

v-model的用法，总结起来就是两个场景：

1. 表单元素和响应式数据双向绑定
2. 父子组件传递数据

**和表单元素绑定**

```vue
<template>
  <div>
    <p>输入的内容为：{{ message }}</p>
    <input type="text" v-model="message" placeholder="请输入内容" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const message = ref('Hello')
</script>

<style>
input {
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
```

在上面的示例中，input 元素和 message 这个响应式数据做了双向绑定。

input 元素所输入的值会影响 message 这个响应式数据的值；message 响应式数据的改变也会影响 input 元素。



**和子组件进行绑定**

App.vue

```vue
<template>
  <div class="app-container">
    <h1>请给产品打分：</h1>
    <!-- 通过 v-model 将父组件的状态值传递给子组件 -->
    <RatingComponent v-model="rating"/>
    <p v-if="rating > 0">您的评分：{{ rating }}/5</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RatingComponent from '@/components/RatingComponent.vue'
const rating = ref(3) // 评分的状态值
</script>

<style>
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

RatingComponent.vue

```vue
<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star" @click="setRating(star)">
      {{ model >= star ? '★' : '☆' }}
    </span>
  </div>
</template>

<script setup>
// 接收父组件通过 v-model 传递过来的状态
const model = defineModel()

function setRating(newRating) {
  // 通过 $emit 方法将新的评分值传递给父组件
  // emit('update:modelValue', newRating);
  model.value = newRating
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

父组件通过 v-model 将自身的数据传递给子组件，子组件通过 defineModel 来拿到父组件传递过来的数据。拿到这个数据之后，不仅可以使用这个数据，还可以修改这个数据。



**v-model 的本质**

通过 vite-plugin-inspect 插件的编译结果来进行分析验证。

首先我们分析第一个场景，和表单元素的双向绑定，编译结果如下：

![image-20240527124828346](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-044828.png)

从编译结果我们可以看出，v-model 会被展开为一个名为 onUpdate:modelValue 的自定义事件，该事件对应的事件处理函数：

```js
$event => ($setup.message) = $event;
```

这就解释了为什么输入框输入的值的时候，会影响响应式数据。

而输入框的 value 本身又是和 $setup.message 绑定在一起的，$setup.message 一变化，就会导致渲染函数重新执行，从而看到输入框里面的内容发生了变化。



接下来分析第二个场景，在子组件上面使用 v-model，编译结果如下：

App.vue

![image-20240527125319488](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-045319.png)

这里会向子组件传递一个名为 modelValue 的 props，props 对应的值就是 $setup.rating，这正是父组件上面的状态。

除此之外向子组件也传递了一个名为 onUpdate:modelValue 的自定义事件，该事件所对应的事件处理函数：

```js
// 该事件处理函数负责的事情：
// 就是将接收到的值更新组件本身的数据 rating
$event => ($setup.rating) = $event;
```

RatingComponent.vue

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-045928.png" alt="image-20240527125928289" style="zoom:50%;" />

对于子组件来讲，就可以通过 modelValue 这个props 来拿到父组件传递过来的数据，并且可以在模板中使用该数据。

当更新数据的时候，就去触发父组件传递过来的 onUpdate:modelValue 自定义事件，并且将新的值传递过去。

至此，你对官网的这句话：

>`defineModel` 是一个便利宏。编译器将其展开为以下内容：
>
>- 一个名为 `modelValue` 的 prop，本地 ref 的值与其同步；
>- 一个名为 `update:modelValue` 的事件，当本地 ref 的值发生变更时触发。

有些时候在子组件上面使用 v-model 的时候，可以使用具名的 v-model，此时展开的 props 和自定义事件的名称会有所不同。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-050918.png" alt="image-20240527130918162" style="zoom:50%;" />

- Props：modelValue ---> title
- 自定义事件：update:modelValue ---> update:title


# setup语法标签

setup 语法标签，是目前 Vue3 最推荐的写法。

不过这种写法并非一开始就是这样的，而是一步一步演进而来的。



**Vue2经典写法**

Vue2 时期采用的是 Options API 语法，这是一种经典写法。

TaskManager.vue

```js
export default {
  name: 'TaskManager',
  props: {
    initialTasks: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      tasks: [...this.initialTasks],
      newTaskTitle: '' // 新任务标题
    }
  },
  methods: {
    // 新增任务
    addTask() {
      if (this.newTaskTitle.trim() === '') {
        return
      }
      // 添加新任务
      this.tasks.push({
        id: Date.now(),
        title: this.newTaskTitle,
        completed: false
      })
      this.newTaskTitle = '' // 清空输入框
    },
    // 标记任务已完成
    completeTask(id) {
      const task = this.tasks.find((task) => task.id === id)
      if (task) {
        task.completed = true
        this.$emit('task-completed', task)
      }
    },
    // 标记任务未完成
    uncompleteTask(id) {
      const task = this.tasks.find((task) => task.id === id)
      if (task) {
        task.completed = false
        this.$emit('task-uncompleted', task)
      }
    }
  }
}
```



**Vue3初期写法**

Vue3 时期，官方提出了 Composition API 风格，这种风格能够对组件的共有模块进行一个更好的组合复用。

```js
import { ref, toRefs } from 'vue'
export default {
  name: 'TaskManager',
  props: {
    initialTasks: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['task-completed', 'task-uncompleted'],
  setup(props, { emit }) {
    // setup是一个生命周期方法
    // 在该方法中书写数据以及函数
    const { initialTasks } = toRefs(props)
    const tasks = ref([...initialTasks.value]) // 任务列表
    const newTaskTitle = ref('') // 存储新任务的标题

    // 添加任务
    const addTask = () => {
      if (newTaskTitle.value.trim() === '') {
        return
      }
      tasks.value.push({
        id: Date.now(),
        title: newTaskTitle.value,
        completed: false
      })
      newTaskTitle.value = ''
    }
    // 完成任务
    const completeTask = (taskId) => {
      const task = tasks.value.find((task) => task.id === taskId)
      if (task) {
        task.completed = true
        // 触发自定义事件
        emit('task-completed', task)
      }
    }
    // 取消完成任务
    const uncompleteTask = (taskId) => {
      const task = tasks.value.find((task) => task.id === taskId)
      if (task) {
        task.completed = false
        // 触发自定义事件
        emit('task-uncompleted', task)
      }
    }

    // 最后需要返回一个对象
    // 该对象里面就包含了需要在模板中使用的数据以及方法
    return {
      tasks,
      newTaskTitle,
      addTask,
      completeTask,
      uncompleteTask
    }
  }
}
```

可以看出，早期的 Vue3 的 CompositionAPI 写法，实际上有 OptionsAPI 写法的影子，和 Vue2 的语法有一定的相似性，同样都是导出一个对象，最重要的特点是对象中多了一个 setup 函数。

这是一个新的生命周期钩子方法，在该方法中，我们可以定义对应的数据和方法，并且在最后返回出去，在模板中可以使用所返回的数据和方法。



**defineComponent写法**

defineComponent 是 Vue 3 中引入的一个**辅助函数**，主要用于定义 Vue 组件，特别是在使用 **TypeScript 时提供更好的类型推断和校验**。

通过使用 defineComponent，我们可以：

1. 自动推断类型：减少显式类型注解，使代码更简洁。
2. 减少冗余：不需要手动定义 Props 接口和响应式数据的类型。
3. 提高可读性：使代码更易读、更易维护。

```js
import { defineComponent, toRefs, ref } from 'vue'
export default defineComponent({
  name: 'TaskManager',
  props: {
    initialTasks: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['task-completed', 'task-uncompleted'],
  setup(props, { emit }) {
    // setup是一个生命周期方法
    // 在该方法中书写数据以及函数
    const { initialTasks } = toRefs(props)
    const tasks = ref([...initialTasks.value]) // 任务列表
    const newTaskTitle = ref('') // 存储新任务的标题

    // 添加任务
    const addTask = () => {
      if (newTaskTitle.value.trim() === '') {
        return
      }
      tasks.value.push({
        id: Date.now(),
        title: newTaskTitle.value,
        completed: false
      })
      newTaskTitle.value = ''
    }
    // 完成任务
    const completeTask = (taskId) => {
      const task = tasks.value.find((task) => task.id === taskId)
      if (task) {
        task.completed = true
        // 触发自定义事件
        emit('task-completed', task)
      }
    }
    // 取消完成任务
    const uncompleteTask = (taskId) => {
      const task = tasks.value.find((task) => task.id === taskId)
      if (task) {
        task.completed = false
        // 触发自定义事件
        emit('task-uncompleted', task)
      }
    }

    // 最后需要返回一个对象
    // 该对象里面就包含了需要在模板中使用的数据以及方法
    return {
      tasks,
      newTaskTitle,
      addTask,
      completeTask,
      uncompleteTask
    }
  }
})
```

可以看出，defineComponent 仅仅只是一个辅助方法，和 TS 配合得更好。但是并没有从本质上改变初期 Composition API 的写法。



**setup标签写法**

从 Vue3.2 版本开始正式引入了 setup 语法糖，它**简化了使用 Composition API 时的书写方式**，使得组件定义更加简洁和直观。

其优化的点主要如下：

1. 简化书写：在传统的 setup 函数中，我们需要返回一个对象，其中包含需要在模板中使用的变量和方法。在 \<script setup> 中，这一步被省略了，所有定义的变量和方法会自动暴露给模板使用，从而减少了样板代码。
2. 更好的类型推断：在 \<script setup> 中所有定义的内容都是顶层变量，TypeScript 的类型推断更加直观和简单。

```js
import { ref, toRefs } from 'vue'

const props = defineProps({
  initialTasks: {
    type: Array,
    required: true
  }
})
const emit = defineEmits(['task-completed', 'task-uncompleted'])

const { initialTasks } = toRefs(props)
const tasks = ref([...initialTasks.value]) // 任务列表
const newTaskTitle = ref('') // 存储新任务的标题
// 添加任务
const addTask = () => {
  if (newTaskTitle.value.trim() === '') {
    return
  }
  tasks.value.push({
    id: Date.now(),
    title: newTaskTitle.value,
    completed: false
  })
  newTaskTitle.value = ''
}
// 完成任务
const completeTask = (taskId) => {
  const task = tasks.value.find((task) => task.id === taskId)
  if (task) {
    task.completed = true
    // 触发自定义事件
    emit('task-completed', task)
  }
}
// 取消完成任务
const uncompleteTask = (taskId) => {
  const task = tasks.value.find((task) => task.id === taskId)
  if (task) {
    task.completed = false
    // 触发自定义事件
    emit('task-uncompleted', task)
  }
}
```

在 setup 语法糖中，没有了模板语法，定义的数据以及方法能够直接在模板中使用。

另外通过 defineProps 获取到父组件传递过来的 props，通过 defineEmits 来触发父组件的事件。

究竟什么是宏呢？宏这个概念最初是在 C 语言里面引入的，大家知道，C 语言是编译型语言，在开始编译之前，会对**宏代码进行一个文本替换的操作**，这就被称之为**预处理**。

举个例子，在 C 语言中通过 #define 来定义宏：

```c
#define PI 3.14159
#define SQUARE(x) ((x) * (x))

int main() {
    double area = PI * SQUARE(5);
    return 0;
}
```

在编译开始之前，会将 PI 替换为 3.14159，将 SQUARE(5) 替换为 ((5) * (5))

理解了这个，回头再看 defineProps 以及 defineEmits，你就非常好理解了，这两个部分的代码回头会被替换掉，替换成 Vue3 刚出来时的写法。

```js
export default {
  // ...
  props: {
    initialTasks: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['task-completed', 'task-uncompleted'],
  // ...
}
```

这一点可以从 vite-plugin-inspect 插件的编译分析中得到验证。

从插件的编译分析中，我们可以看出，setup标签写法其实就是一个语法糖，方便开发者书写，在编译的时候最终会被编译为 CompositionAPI 早期的写法。



**expose上的区别**

**setup 虽然说是一种语法糖，不过在某些行为上的表现还是和原始的 Composition API 有一些区别的**，例如 expose.

这里需要先解释一下什么是 expose：

>一般来讲，父组件管理父组件的数据和方法，子组件管理子组件的数据和方法，如果涉及到通信，那么通过 props 的方式来进行传递。但如果一个组件通过 ref 获取到组件实例，在早期的 Composition API 中，能够拿到组件内部所有数据和方法的。

Vue 提供了一个名为 expose 的方法，由组件自己来决定，如果外部拿到我这个组件实例，我能暴露哪些成员给对方。

```js
export default {
  setup(props, { emit, expose }) {
    expose({
      // 要暴露的成员
    })
  }
}
```

而到了 setup 标签写法中，则**默认行为就是不向外部暴露任何的成**员。如果想要暴露某个成员，仍然是通过 expose 的方式，这里会涉及到一个 defineExpose 的宏。

```js
defineExpose({
  // 要暴露的成员
})
```



# key的本质

在关系型数据库中，有一个 primary key 的概念，这个其实和这里的 key 有一定的相似性。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-25-100513.png" alt="image-20240525180513474" style="zoom:50%;" />

在关系型数据库中，**primary key 用于标记这条数据的唯一性**，因此在上表中只有 id 这个字段能够作为主键，另外 3 个字段都不行。

那么为什么需要对一条数据做唯一性标识呢？那就是**方便精准的查找**。这就好比现实生活中的身份证号，所有人都是独一无二的，你名字可能相同、年龄、性别这些都可能相同，而身份证号则是每个人的一个唯一标识，能够精准找到这个人。

Vue 中的 key，道理就是一样的，key 其实也是用来做唯一标识，谁的唯一标识呢，就是**虚拟节点 VNode 的唯一标识**。

**不采用复用策略**

假设更新前的虚拟 DOM 为：

```js
const oldVNode = {
  type: 'div',
  children: [
    {type: 'p', children: '1'},
    {type: 'p', children: '2'},
    {type: 'p', children: '3'},
  ]
}
```

```html
<div>
  <p>1</p>
  <p>2</p>
  <p>3</p>
</div>
```

更新后的虚拟 DOM 为：

```js
const newVNode = {
  type: 'div',
  children: [
    {type: 'p', children: '4'},
    {type: 'p', children: '5'},
    {type: 'p', children: '6'},
  ]
}
```

如果完全不采用复用策略，那么当更新子节点的时候，需要执行 6 次 DOM 操作。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-26-151420.png" alt="image-20240526231419917" style="zoom:50%;" />

- 卸载所有旧的子节点，需要 3 次 DOM 的删除操作
- 挂载所有新的子节点，需要 3 次 DOM 的添加操作

通过观察我们发现，VNode 的变化，仅仅是 p 元素的子节点（文本节点）发生变化，p 元素本身其实没有任何的变化。因此最为理想的做法是更新这个 3 个 p 元素的文本节点内容，这样只会涉及到 3 次 DOM 操作，性能提升一倍。



**采用复用策略**

1. 先考虑更新前后长度不变、类型不变的情况

这里可以写出如下的伪代码：

```js
function patchChildren(n1, n2, container){
  if(typeof n2.children === 'string'){
    // 说明该节点的子节点就是文本节点
    // ...
  } else if(Array.isArray(n2.children)){
    // 说明该节点的子节点也是数组
    const oldChildren = n1.children; // 旧的子节点数组
    const newChildren = n2. children; // 新的子节点数组
    
    // 目前假设长度没有变化
    for(let i = 0; i < oldChildren.length; i++){
      // 对文本子节点进行更新
      patch(oldChildren[i], newChildren[i])
    }
  } else {
    // 其他情况
    // ...
  }
}
```



2. 考虑长度发生变化的情况

   - 对于新节点更多的情况，那就需要**挂载新的节点**

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-26-153701.png" alt="image-20240526233701292" style="zoom:50%;" />

   - 对于新节点变少的情况，那就需要**卸载多余的旧节点**

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-26-153533.png" alt="image-20240526233532828" style="zoom:50%;" />

因此我们的伪代码会发生一些变化：

```js
function patchChildren(n1, n2, container){
  if(typeof n2.children === 'string'){
    // 说明该节点的子节点就是文本节点
    // ...
  } else if(Array.isArray(n2.children)){
    // 说明该节点的子节点也是数组
    const oldChildren = n1.children; // 旧的子节点数组
    const newChildren = n2. children; // 新的子节点数组
    
    // 存储一下新旧节点的长度
    const oldLen = oldChildren.length; // 旧子节点数组长度
    const newLen = newChildren.length; // 新子节点数组长度
    
    // 接下来先找这一组长度的公共值，也就是最小值
    const commonLength = Math.min(oldLen, newLen);
    
    // 先遍历最小值，把该处理的节点先跟新
    for(let i = 0; i < commonLength; i++){
      // 对文本子节点进行更新
      patch(oldChildren[i], newChildren[i])
    }
    
    // 然后接下来处理长度不同的情况
    if(newLen > oldLen){
      // 新节点多，那么就做新节点的挂载
      for(let i = commonLength; i < newLen; i++){
        patch(null, newChildren[i], container);
      }
    } else if(oldLen > newLen){
      // 旧节点多，做旧节点的卸载
      for(let i = commonLength; i < oldLen; i++){
        unmount(oldChildren[i]);
      }
    }
  } else {
    // 其他情况
    // ...
  }
}
```



3. 考虑类型发生变化

```js
const oldVNode = {
  type: 'div',
  children: [
    {type: 'p', children: '1'},
    {type: 'div', children: '2'},
    {type: 'span', children: '3'},
  ]
}
```

```js
const newVNode = {
  type: 'div',
  children: [
    {type: 'span', children: '3'},
    {type: 'p', children: '1'},
    {type: 'div', children: '2'},
  ]
}
```

按照目前上面的设计，当遇到这种情况的时候，通通不能复用，又回到最初的情况，需要 6 次 DOM 的操作。

但是我们稍作观察，会发现上面的例子中仅仅是元素标签移动了位置，因此最理想的情况是移动 DOM 即可，这样也能达到对 DOM 节点的复用。

这里涉及到一个问题：如何确定是同一个类型能够复用的节点？

如果仅仅只是判断 VNode 的 type 值是否相同，这种方式并不可靠！

```js
const oldVNode = {
  type: 'div',
  children: [
    {type: 'p', children: '3'},
    {type: 'div', children: '2'},
    {type: 'p', children: '1'},
  ]
}
```

```js
const newVNode = {
  type: 'div',
  children: [
    {type: 'p', children: '1'},
    {type: 'p', children: '3'},
    {type: 'div', children: '2'},
  ]
}
```

在这种情况下，没有办法很好的有一个对应关系，因为有多种相同类型的节点。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-002244.png" alt="image-20240527082244205" style="zoom:50%;" />



**加入key标识**

key 相当于给每一个 VNode 一个身份证号，通过这个身份证号就可以找到唯一的那个 VNode，而非多个。

```js
const oldVNode = {
  type: 'div',
  children: [
    {type: 'p', children: '3', key: 1},
    {type: 'div', children: '2', key: 2},
    {type: 'p', children: '1', key: 3},
  ]
}
```

```js
const newVNode = {
  type: 'div',
  children: [
    {type: 'p', children: '1', key: 3},
    {type: 'p', children: '3', key: 1},
    {type: 'div', children: '2', key: 2},
  ]
}
```

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-002600.png" alt="image-20240527082559913" style="zoom:50%;" />

因此，在实际的判断中，如果 VNode 的 type 属性和 key 属性都相同，那么就说明是同一组映射，并且在新旧节点中都出现了，那么就可以进行 DOM 节点的复用。

>哪怕没有 key，我在旧节点中找到一个类型相同的，就复用该 DOM 节点，这样的设计不行么？

实际上，在没有 key 的情况下，Vue 内部采用的就是这样的复用策略，这种策略在 Vue 中被称之为“就地更新”策略。这种策略默认是高效的，**但是这种复用策略仅仅是保证 DOM 节点的类型对上了**，如果节点本身还依赖**子组件状态或者临时 DOM 状态**，<u>由于这种复用策略没有精准的对上号，因此会涉及到子组件状态或者临时 DOM 状态的还原</u>。

举个例子，假设旧节点是三个男生，新节点也是三个男生

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-010403.png" alt="image-20240527090403134" style="zoom:50%;" />

如果不考虑其他的因素，只考虑是否是男生，然后简单的把名字变一下，那么这种就地复用的策略是非常高效。

但是很多时候依赖子组件状态或者临时的 DOM 状态：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-011310.png" alt="image-20240527091310616" style="zoom:50%;" />

在这种情况下，就地复用的策略反而是低效的，因为涉及到子组件状态或者临时的 DOM 状态的恢复。

因此在这个时候，最好的方式就是加上 key，让新旧节点能够精准的对应上。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-011647.png" alt="image-20240527091647134" style="zoom:50%;" />

还有一点需要注意，那就是 **避免使用下标来作为 key 值**。使用下标作为 key 值时，如果列表中的元素顺序发生变化，Vue 会复用错误的元素，导致不必要的 DOM 更新和渲染错误。

例如，当你在列表中插入或删除元素时，使用下标会使得每个元素的 key 发生变化，导致 Vue 不能正确识别元素，从而导致状态和数据的不一致。

```js
// 初始状态
[{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }, { id: 3, text: 'Item 3' }]

// 删除第二个元素后的状态
[{ id: 1, text: 'Item 1' }, { id: 3, text: 'Item 3' }]
```

在这种情况下，如果使用下标作为 key 值，当删除第二个元素后，第三个元素的下标会从 2 变为 1，这会使 Vue 误以为原本的第三个元素和第二个元素是同一个，从而导致错误的更新。



key 本质上就是给 VNode 节点做唯一性标识，算是 VNode 的一个身份证号。

特别是在渲染列表时。key 的作用主要有以下几点：

1. **高效的更新：** key 帮助 Vue 识别哪些元素是变化的、哪些是新的、哪些是需要被移除的。
   - 在没有 key 的情况下，Vue 会尽量复用已有元素，而不管它们的实际内容是否发生了变化，这可能导致不必要的更新或者错误的更新。
   - 通过使用 key，Vue 可以准确地知道哪些元素发生了变化，从而高效地更新 DOM。
2. **确保元素的唯一性：** key 属性需要是唯一的，这样每个元素在列表中都可以被唯一标识。这避免了在元素移动、插入或删除时出现混淆，确保 Vue 可以正确地追踪每个元素。
3. **提升渲染性能：** 使用 key 可以显著提升列表渲染的性能。因为 Vue 能通过 key 快速定位到需要更新的元素，而不是重新渲染整个列表。尤其在处理大型列表时，使用 key 可以避免大量不必要的 DOM 操作，提升应用的响应速度。


# 组件生命周期

官方生命周期图：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-12-031421.png" alt="lifecycle" style="zoom:50%;" />

## 完整生命周期

这里分为这么几个大的阶段：

1. 初始化选项式 API
2. 模板编译
3. 初始化渲染
4. 更新组件
5. 销毁组件

**1. 初始化选项式API**

当渲染器遇到一个组件的时候，首先是**初始化选项式 API**，这里在内部**还会涉及到组件实例对象的创建**。

在组件实例对象创建的前后，就对应着一组生命周期钩子函数：

- 组件实例创建前：setup、beforeCreate
- 组件实例创建后：created

**2. 模板编译**

接下来会进入模板编译的阶段，当模板编译的工作结束后，会执行 beforeMount 钩子函数。

**3. 初始化渲染**

接下来是初始化渲染，到了这个阶段，意味着已经生成了真实的 DOM. 完成初始化渲染后会执行 mounted 生命周期方法。

**4. 更新组件**

更新组件时对应着一组生命周期钩子方法：

- 更新前：beforeUpdate
- 更新后：updated

**5. 销毁组件**

销毁组件时也对应一组生命周期钩子方法：

- 销毁前：beforeUnmount
- 销毁后：unmounted

一般在销毁组件时我们会做一些清理工作，例如清除计时器等操作。

另外需要注意在 Vue3 中生命周期的钩子函数的名字和上面所介绍的生命周期稍微有一些区别：

| 生命周期名称       | Vue2          | Vue3            |
| ------------------ | ------------- | --------------- |
| beforeCreate 阶段  | beforeCreate  | setup           |
| created 阶段       | created       | setup           |
| beforeMount 阶段   | beforeMount   | onBeforeMount   |
| mounted 阶段       | mounted       | onMounted       |
| beforeUpdate 阶段  | beforeUpdate  | onBeforeUpdate  |
| updated 阶段       | updated       | onUpdated       |
| beforeUnmount 阶段 | beforeDestroy | onBeforeUnmount |
| unmounted 阶段     | destoryed     | onUnmounted     |

Vue2 和 Vue3 的生命周期钩子方法是可以共存的，这意味着你在一个组件中可以写 mounted 和 onMounted，Vue3 的生命周期钩子函数的执行时机会比 Vue2 对应的生命周期钩子函数要早一些，不过一般没人会这么写。

## 生命周期的本质

**所谓生命周期，其实就是在合适的时机调用用户所设置的回调函数**。

首先需要了解组件实例和组件挂载。假设用户书写了这么一个组件：

```js
export default {
  name: 'UserCard',
  props: {
    name: String,
    email: String,
    avatarUrl: String
  },
  data(){
    return {
      foo: 1
    }
  },
  mounted() {
    // ...
  },
  render() {
    return h('div', { class: styles.userCard }, [
      h('img', {
        class: styles.avatar,
        src: this.avatarUrl,
        alt: 'User avatar'
      }),
      h('div', { class: styles.userInfo }, [h('h2', this.name), h('p', this.email)])
    ])
  }
}
```

那么这些内容实际上是一个**选项对象**，回头在渲染这个组件的时候，某些信息是会被挂到组件实例上面的。**组件实例本质就是一个对象，该对象维护着组件运行过程中的所有信息**，例如：

- 注册到组件的生命周期钩子函数
- 组件渲染的子树
- 组件是否已经被挂载
- 组件自身的状态

```js
function mountComponent(vnode, container, anchor) {
  // 获取选项对象
  const componentOptions = vnode.type;
  // 从选项对象上面提取出 render 以及 data
  const { render, data } = componentOptions;

  // 创建响应式数据
  const state = reactive(data());

  // 定义组件实例，一个组件实例本质上就是一个对象，它包含与组件有关的状态信息
  const instance = {
    // 组件自身的状态数据，即 data
    state,
    // 一个布尔值，用来表示组件是否已经被挂载，初始值为 false
    isMounted: false,
    // 组件所渲染的内容，即子树（subTree）
    subTree: null,
  };

  // 将组件实例设置到 vnode 上，用于后续更新
  vnode.component = instance;

  // 后面逻辑略...
}

```

下面是组件挂载：

```js
function mountComponent(vnode, container, anchor) {
  // 前面逻辑略...
  
  effect(
    () => {
      // 调用组件的渲染函数，获得子树
      const subTree = render.call(state, state);
      // 检查组件是否已经被挂载
      if (!instance.isMounted) {
        // 初次挂载，调用 patch 函数第一个参数传递 null
        patch(null, subTree, container, anchor);
        // 重点：将组件实例的 isMounted 设置为 true，这样当更新发生时就不会再次进行挂载操作，
        // 而是会执行更新
        instance.isMounted = true;
      } else {
        // 当 isMounted 为 true 时，说明组件已经被挂载，只需要完成自更新即可，
        // 所以在调用 patch 函数时，第一个参数为组件上一次渲染的子树，
        // 意思是，使用新的子树与上一次渲染的子树进行打补丁操作
        patch(instance.subTree, subTree, container, anchor);
      }
      // 更新组件实例的子树
      instance.subTree = subTree;
    },
    { scheduler: queueJob }
  );
}
```

其核心就是根据组件实例的 isMounted 属性来判断该组件是否是初次挂载：

- 初次挂载：patch 的第一个参数为 null；会设置组件实例 isMounted 为 true
- 非初次挂载：更新组件的逻辑，patch 的第一个参数是组件上一次渲染的子树，从而和新的子树进行 diff 计算

**所谓生命周期，就是在合适的时机执行用户传入的回调函数**。

```js
function mountComponent(vnode, container, anchor) {
  const componentOptions = vnode.type;
  // 从组件选项对象中取得组件的生命周期函数
  const {
    render,
    data,
    beforeCreate,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
  } = componentOptions;
  
  // 拿到生命周期钩子函数之后，就会在下面的流程中对应的位置调用这些钩子函数

  // 在这里调用 beforeCreate 钩子
  beforeCreate && beforeCreate();

  const state = reactive(data());

  const instance = {
    state,
    isMounted: false,
    subTree: null,
  };
  vnode.component = instance;

  // 组件实例已经创建
  // 此时在这里调用 created 钩子
  created && created.call(state);

  effect(
    () => {
      const subTree = render.call(state, state);
      if (!instance.isMounted) {
        // 在这里调用 beforeMount 钩子
        beforeMount && beforeMount.call(state);
        patch(null, subTree, container, anchor);
        instance.isMounted = true;
        // 在这里调用 mounted 钩子
        mounted && mounted.call(state);
      } else {
        // 在这里调用 beforeUpdate 钩子
        beforeUpdate && beforeUpdate.call(state);
        patch(instance.subTree, subTree, container, anchor);
        // 在这里调用 updated 钩子
        updated && updated.call(state);
      }
      instance.subTree = subTree;
    },
    { scheduler: queueJob }
  );
}
```

在上面的代码中，首先从组件的选项对象中获取到注册到组件上面的生命周期函数，然后内部会在合适的时机调用它们。

## 嵌套结构下的生命周期

组件之间是可以进行嵌套的，从而形成一个组件树结构。那么当遇到多组件嵌套的时候，各个组件的生命周期是如何运行的呢？

实际上非常简单，就是一个递归的过程。

假设 A 组件下面嵌套了 B 组件，那么渲染 A 的时候会执行 A 的 onBeforeMount，然后是 B 组件的 onBeforeMount，然后 B 正常挂载，执行 B 组件的 mounted，B 渲染完成后，接下来才是 A 的 mounted.

1. 组件 A：onBeforeMount
2. 组件 B：onBeforeMount
3. 组件 B：mounted
4. 组件 A：mounted

倘若涉及到组件的销毁，也同样是递归的逻辑。






> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial

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
