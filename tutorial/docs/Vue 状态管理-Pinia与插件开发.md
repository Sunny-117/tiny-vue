# Vue 状态管理-Pinia与插件开发

> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial

# 通信方式总结

通信方式整体来讲能够分为两大类：

1. 父子组件通信
2. 跨层级组件通信

**父子组件通信**

1. Props：通过 Props 可以实现父组件向子组件传递数据。

2. Event：又被称之为自定义事件，原理是父组件通过 Props 向子组件传递一个自定义事件，子组件通过 emit 来触发自定义事件，触发自定义事件的时候就会传递一些数据给父组件

3. 属性透传：一些没有被组件声明为 props、emits 或自定义事件的属性，但依然能传递给子组件，例如常见的 class、style 和 id. 

4. ref引用：ref除了创建响应式数据以外，还可以拿来作为引用。

```html
<template>
  <div>
    <B ref="childRef" />
    <button @click="clickhandle">change name</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import B from './B.vue'

// 这里的ref是拿来做引用的
const childRef = ref(null)

function clickhandle() {
  if (childRef.value) {
    // 当前存在组件的引用
    console.log(childRef.value.name)
    childRef.value.changeName()
  }
}
</script>

```

```html
<template>
  <div>这是B组件</div>
  <div>{{ name }}</div>
</template>

<script setup>
import { ref } from 'vue'
const name = ref('bill')
function changeName() {
  name.value = 'john'
}

// 需要将数据和方法进行暴露
defineExpose({
  name,
  changeName
})
</script>

```

5. 作用域插槽：子组件在设置 slot 的时候，上面绑定一些属性，回头父组件通过 v-slot 来拿到这些属性。

   <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-16-075301.png" alt="image-20240416155301318" style="zoom:50%;" />



**跨层级组件通信**

1. 依赖注入：通过 provide（提供数据方）和 inject（注入数据方）来实现的。

2. 事件总线：从 Vue2 时期就支持的一种通信方式。从 Vue3 开始更加推荐 **依赖注入** 或者 **Pinia** 来进行组件通信。不过事件总线这种方式仍然保留了下来。

   - 原理：本质上是设计模式里面的观察者模式，有一个对象（事件总线）维护一组依赖于它的对象（事件监听器），当自身状态发生变化的时候会通过所有的事件监听器。

   - 核心操作：

     1. 发布事件：发布通知，通知所有的依赖自己去执行监听器方法
     2. 订阅事件：其他对象可以订阅某个事件，当事件发生时，就会触发相应的回调函数
     3. 取消订阅

   - 事件总线的核心代码如下：

     ```js
     class EventBus {
       constructor() {
         // 维护一个事件列表
         this.events = {}
       }
     
       /**
        * 订阅事件
        * @param {*} event 你要订阅哪个事件
        * @param {*} listener 对应的回调函数
        */
       on(event, listener) {
         if (!this.events[event]) {
           // 说明当前没有这个类型
           this.events[event] = []
         }
         this.events[event].push(listener)
       }
     
       /**
        * 发布事件
        * @param {*} event 什么类型
        * @param {*} data 传递给回调函数的数据
        */
       emit(event, data) {
         if (this.events[event]) {
           // 首先有这个类型
           // 通知这个类型下面的所有的订阅者（listener）执行一遍
           this.events[event].forEach((listener) => {
             listener(data)
           })
         }
       }
     
       /**
        * 取消订阅
        * @param {*} event 对应的事件类型
        * @param {*} listener 要取消的回调函数
        */
       off(event, listener) {
         if (this.events[event]) {
           // 说明有这个类型
           this.events[event] = this.events[event].filter((item) => {
             return item !== listener
           })
         }
       }
     }
     
     const eventBus = new EventBus()
     export default eventBus
     ```

   - 除了像上面一样自己来实现事件总线以外，还可以使用现成的第三方库 mitt.

     ```js
     import mitt from 'mitt'
     const eventBus = mitt()
     export default eventBus
     ```

3. 自定义数据仓库：其实就是简易版的 Pinia.

4. Pinia

# Pinia自定义插件

在 Pinia 中，可以为仓库添加插件，通过插件可以扩展以下内容：

- 为 store 添加新的属性
- 定义 store 时增加新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变甚至取消 action
- 实现副作用，如本地存储

首先建议插件**单独放置于一个目录**下，一个插件**其实就是一个方法**：

```js
export function myPiniaPlugin1() {
  // 给所有的仓库添加了一条全局属性
  return {
    secret: "the cake is a lie",
  };
}

export function myPiniaPlugin2(context) {
  // console.log(context);
  const { store } = context;
  // 在仓库上扩展状态
  store.test = "this is a test";
}

/**
 * 给特定的仓库来扩展内容
 * @param {*} param0
 */
export function myPiniaPlugin3({ store }) {
  if (store.$id === "counter") {
    // 为当前 id 为 counter 的仓库来扩展属性
    return {
      name: "my name is pinia",
    };
  }
}

/**
 * 重置仓库状态
 */
export function myPiniaPlugin4({ store }) {
  // 我们首先可以将初始状态深拷贝一份
  const state = deepClone(store.$state);
  // 提供一个 reset 方法可以重置仓库状态
  store.reset = () => {
    store.$patch(deepClone(state));
  };
}
```

每个插件扩展内容，其实就是**对仓库进行内容扩展**。如果想要针对某一个仓库进行内容扩展，可以通过 context.store.$id 来指定某一个仓库来扩展内容。

插件书写完毕后，需要通过 pinia 实例对插件进行一个**注册**操作:

```js
// 引入自定义插件
import { myPiniaPlugin1, myPiniaPlugin2, myPiniaPlugin3, myPiniaPlugin4} from './plugins';
// 注册
pinia.use(myPiniaPlugin1);
pinia.use(myPiniaPlugin2);
pinia.use(myPiniaPlugin3);
pinia.use(myPiniaPlugin4);
```

之后就可以在 store 上使用插件添加的状态或者方法，例如：

```js
// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// 自定义插件
// 在该自定义插件中，扩展了一个数据和方法
function myPlugin({ store }) {
  store.$state.pluginData = '这是插件添加的数据';

  store.pluginMethod = function () {
    console.log('这是插件添加的方法');
  };
}

const pinia = createPinia();
// 注册自定义插件
pinia.use(myPlugin);

const app = createApp(App);
app.use(pinia);
app.mount('#app');
```

```js
// store.js
import { defineStore } from 'pinia';

export const useMyStore = defineStore('myStore', {
  state: () => ({
    myData: '初始数据'
  }),
  actions: {
    usePluginMethod() {
      this.pluginMethod(); // 使用插件提供的方法
      console.log(this.pluginData); // 访问插件提供的数据
    }
  }
});
```

**实战案例**

书写一个插件，该插件用来**记录操作日志**和**捕获错误**。

```js
export function logPlugin({ store }) {
  // 监听所有的 action
  // 当触发了某一个 action 的时候，会执行这个回调函数
  /**
   * name: 本次触发 action 的名称
   * args：触发 action 时传入的参数
   * after：action 执行成功后的回调函数
   * onError：action 执行失败后的回调函数
   */
  store.$onAction(({ name, args, after, onError }) => {
    // 记录开始时间
    const startTime = Date.now()

    console.log(`Action ${name} started with arguments: ${JSON.stringify(args)}`)

    // action 执行成功后的回调函数
    // result 是 action 执行成功后的返回值
    after((result) => {
      // 记录结束时间
      const endTime = Date.now()
      console.log(
        `Action ${name} finished in ${endTime - startTime}ms with result: ${JSON.stringify(result)}`
      )
    })

    onError((error) => {
      // 记录结束时间
      const endTime = Date.now()
      console.error(`Action ${name} failed in ${endTime - startTime}ms with error: ${error}`)
    })
  })
}

```

**第三方插件**

在 npm 官网搜索关键字 “pinia plugin”，之后根据文档使用。

自主学习：pinia-plugin-persistedstate 插件的使用。


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
