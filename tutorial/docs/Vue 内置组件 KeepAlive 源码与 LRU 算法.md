# Vue 内置组件 KeepAlive 源码与 LRU 算法

> 本文所有源码均在：https://github.com/Sunny-117/tiny-vue/tree/main/tutorial

在 Vue 中提供了一些内置组件，例如：

- Transition
- TransitionGroup
- KeepAlive
- Teleport
- Suspense

本文，将主要讲解 KeepAlive 内置组件。在此之前，需要先了解下 Vue 中的 component 元素。

## **component 元素**

component **并非组件**，而是和 slot、template 等元素类似的一种特殊元素，这种元素是模板语法的一部分。但它们并非真正的组件，同时在模板编译期间会被编译掉。因此，它们通常在模板中用小写字母书写。

component 用于渲染动态组件，具体渲染的组件取决于 is 属性

文档地址：https://cn.vuejs.org/api/built-in-special-elements.html#component

代码示例：

```vue
<template>
  <div id="app">
    <nav>
      <button @click="toggleComponent">切换组件</button>
    </nav>
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { shallowRef } from "vue";
import ComponentA from "@/components/ComponentA.vue";
import ComponentB from "@/components/ComponentB.vue";

// 该状态主要用于记录当前渲染的组件
const currentComponent = shallowRef(ComponentA);
// 该状态主要用于记录当前渲染的组件的一个标识
const currentLabel = shallowRef("A");

const toggleComponent = () => {
  if (currentLabel.value === "A") {
    currentComponent.value = ComponentB;
    currentLabel.value = "B";
  } else {
    currentComponent.value = ComponentA;
    currentLabel.value = "A";
  }
};
</script>
```

## KeepAlive 基本使用

KeepAlive 是一个**内置组件**，该组件的主要作用是**缓存组件的状态**。

关键代码如下：

App.vue

```vue
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
```

router-view 组件通过作用于插槽拿到一个和当前路由所匹配的组件，然后将这个组件用于 component 元素的 is 属性。

最为关键的就是 component 元素外边包裹了 keep-alive 内置组件，该组件让状态得以保留。

## KeepAlive 相关细节

使用 KeepAlive 来保持组件状态的之后，可以使用**包含(include)/排除(exclude)**关键字来指定要缓存的组件，这两个 prop 的值都可以是一个以英文逗号分隔的字符串、一个正则表达式，或是包含这两种类型的一个数组：

```vue
<!-- 以英文逗号分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式 (需使用 v-bind) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组 (需使用 v-bind) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

例如：

```vue
<router-view v-slot="{ Component }">
  <keep-alive include="Counter,Timer">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

以英文逗号分隔的时候，注意中间不要添加空格。

还可以接收一个 max 属性，用于**指定最大缓存组件数**。<u>如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间</u>。

```vue
<router-view v-slot="{ Component }">
  <keep-alive :max="3">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

## KeepAlive 生命周期

keep-alive 这个词借鉴于 HTTP 协议。在 HTTP 协议中，KeepAlive 被称之为 **HTTP 持久连接（HTTP persistent connection）**，其作用是允许多个请求或响应共用一个 TCP 连接。

在没有 KeepAlive 的情况下，一个 HTTP 连接会在每次请求/响应结束后关闭，当下一次请求发生时，会建立一个新的 HTTP 连接。频繁地销毁、创建 HTTP 连接会带来额外的性能开销，KeepAlive 就是为了解决这个问题而诞生的。

HTTP 中的 KeepAlive 可以避免连接频繁地销毁/创建，与 HTTP 中的 KeepAlive 类似，Vue 里面的 keep-alive 组件也是用于**对组件进行缓存，避免组件被频繁的销毁/重建**。

简单回忆一下 keep-alive 的使用

```vue
<template>
  <Tab v-if="currentTab === 1">...</Tab>
  <Tab v-if="currentTab === 2">...</Tab>
  <Tab v-if="currentTab === 3">...</Tab>
</template>
```

根据变量 currentTab 值的不同，会渲染不同的 \<Tab> 组件。当用户频繁地切换 Tab 时，会导致不停地卸载并重建 \<Tab> 组件。为了避免因此产生的性能开销，可以使用 keep-alive 组件来解决这个问题：

```vue
<template>
  <keep-alive>
    <Tab v-if="currentTab === 1">...</Tab>
    <Tab v-if="currentTab === 2">...</Tab>
    <Tab v-if="currentTab === 3">...</Tab>
  </keep-alive>
</template>
```

这样，无论用户怎样切换 \<Tab> 组件，都不会发生频繁的创建和销毁，因为会极大的优化对用户操作的响应，尤其是在大组件场景下，优势会更加明显。

另外 keep-alive 还可以设计一些属性来进行细节方面的把控：

- include：指定要缓存的组件，支持的书写方式有**字符串、正则表达式、数组**
- exclude：排除不缓存的组件
- max：指定最大缓存组件数。如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。

**KeepAlive 生命周期**

当一个组件挂载以及卸载的时候，是会触发相关的生命周期钩子方法。

当我们从组件 A 切换到组件 B 时，会依次出发：

- 组件 A beforeUnmount
- 组件 B created
- 组件 B beforeMount
- 组件 A unmounted
- 组件 B mounted

这就是没有使用 keep-alive 缓存的情况，组件频繁的创建、销毁，性能上面会有损耗。

当我们添加 keep-alive 之后，组件得以缓存。但是这也带来一个新的问题，就是我们不知道该组件是否处于激活状态。比如某些场景下，我们需要组件激活时执行某些任务，但是因为目前组件被缓存了，上面的那些生命周期钩子方法都不会再次执行了。

此时，和 keep-alive 相关的两个生命周期钩子方法可以解决这个问题：

- onActivated：首次挂载，以及组件激活时触发
- onDeactivated：组件卸载，以及组件失活时触发

## KeepAlive 的本质

keep-alive 组件的实现**需要渲染器层面的支持**。当组件需要卸载的时候，不能真的卸载，否则就无法维持组件当前的状态了。

因此正确的做法是：将需要 keep-alive 的组件搬运到一个**隐藏的容器**里面，从而实现“假卸载”。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-28-045458.png" alt="image-20240528125458303" style="zoom:50%;" />

当 keep-alive 的组件需要重新挂载的时候，也是直接从隐藏的容器里面再次搬运到原来的容器。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-28-045719.png" alt="image-20240528125719080" style="zoom:50%;" />

这个过程其实就对应了组件的两个生命周期：

- activated
- deactivated

一个最基本的 keep-alive 组件，实现起来并不复杂，代码如下：

```js
const KeepAlive = {
  // 这是 keepalive 组件独有的属性，用于标识这是一个 keepalive 组件
  __isKeepAlive: true,
  setup(props, { slots }) {
    // 这是一个缓存对象
    // key：vnode.type
    // value: vnode
    const cache = new Map();
    // 存储当前 keepalive 组件的实例
    const instance = currentInstance;
    // 这里从组件实例上面解构出来两个方法，这两个方法实际上是由渲染器注入的
    const { move, createElement } = instance.keepAliveCtx;

    // 创建隐藏容器
    const storageContainer = createElement("div");

    // 这两个方法所做的事情，就是将组件从页面和隐藏容器之间进行移动
    // 这两个方法在渲染器中会被调用
    instance._deActivate = (vnode) => {
      move(vnode, storageContainer);
    };
    instance._activate = (vnode, container, anchor) => {
      move(vnode, container, anchor);
    };

    return () => {
      // 获取到默认插槽里面的内容
      let rawVNode = slots.default();

      // 如果不是对象，说明是非组件的虚拟节点，直接返回
      if (typeof rawVNode.type !== "object") {
        return rawVNode;
      }

      // 接下来我们从缓存里面找一下，看当前的组件是否存在于缓存里面
      const cachedVNode = cache.get(rawVNode.type);

      if (cachedVNode) {
        // 缓存中存在
        // 如果缓存中存在，直接使用缓存的组件实例
        rawVNode.component = cachedVNode.component;
        // 并且挂上一个 keptAlive 属性
        rawVNode.keptAlive = true;
      } else {
        // 缓存中不存在
        // 那么就添加到缓存里面，方便下次使用
        cache.set(rawVNode.type, rawVNode);
      }
      // 接下来又挂了一个 shouldKeepAlive 属性
      rawVNode.shouldKeepAlive = true;
      // 将 keepalive 组件实例也添加到 vnode 上面，后面在渲染器中有用
      rawVNode.keepAliveInstance = instance;
      return rawVNode;
    };
  },
};
```

**keep-alive 和渲染器是结合得比较深的**，keep-alive 组件**本身并不会渲染额外的什么内容**，它的渲染函数最终只返回需要被 keep-alive 的组件，这样的组件我们可以称之为“内部组件”。

keep-alive 组件会对这些组件添加一些标记属性，以便渲染器能够根据这些标记属性执行一些特定的逻辑：

- keptAlive：标识内部组件已经被缓存了，这样当内部组件需要重新渲染的时候，渲染器并不会重新挂载它，而是将其激活。

```js
// 渲染器内部代码片段
function patch(n1, n2, container, anchor) {
  if (n1 && n1.type !== n2.type) {
    unmount(n1);
    n1 = null;
  }

  const { type } = n2;

  if (typeof type === "string") {
    // 省略部分代码
  } else if (type === Text) {
    // 省略部分代码
  } else if (type === Fragment) {
    // 省略部分代码
  } else if (typeof type === "object" || typeof type === "function") {
    // component
    if (!n1) {
      // 如果该组件已经被 KeepAlive，则不会重新挂载它，而是会调用_activate 来激活它
      if (n2.keptAlive) {
        n2.keepAliveInstance._activate(n2, container, anchor);
      } else {
        mountComponent(n2, container, anchor);
      }
    } else {
      patchComponent(n1, n2, anchor);
    }
  }
}
```

- shouldKeepAlive：该属性会被添加到 vnode 上面，这样当渲染器卸载内部组件的时候，不会真正的去卸载，而是将其移动到隐藏的容器里面

```js
// 渲染器代码片段
function unmount(vnode) {
  if (vnode.type === Fragment) {
    vnode.children.forEach((c) => unmount(c));
    return;
  } else if (typeof vnode.type === "object") {
    // vnode.shouldKeepAlive 是一个布尔值，用来标识该组件是否应该 KeepAlive
    if (vnode.shouldKeepAlive) {
      // 对于需要被 KeepAlive 的组件，我们不应该真的卸载它，而应调该组件的父组件，
      // 即 KeepAlive 组件的 _deActivate 函数使其失活
      vnode.keepAliveInstance._deActivate(vnode);
    } else {
      unmount(vnode.component.subTree);
    }
    return;
  }
  const parent = vnode.el.parentNode;
  if (parent) {
    parent.removeChild(vnode.el);
  }
}
```

- keepAliveInstance：该属性让内部组件持有了 KeepAlive 的组件实例，回头在渲染器中的某些场景下可以通过该属性来访问 KeepAlive 组件实例上面的 \_deActivate 以及 \_activate。

### **include 和 exclude**

默认情况下，keep-alive 会对所有的“内部组件”进行缓存。

不过有些时候用户只期望缓存特定的组件，此时可以使用 include 和 exclude.

```vue
<keep-alive include="TextInput,Counter">
  <component :is="Component" />
</keep-alive>
```

因此 keep-alive 组件需要定义相关的 props：

```js
const KeepAlive = {
  __isKeepAlive: true,
  props: {
    include: RegExp,
    exclude: RegExp,
  },
  setup(props, { slots }) {
    // ...
  },
};
```

在进入缓存之前，我们需要对该组件是否匹配进行判断：

```js
const KeepAlive = {
  __isKeepAlive: true,
  props: {
    include: RegExp,
    exclude: RegExp,
  },
  setup(props, { slots }) {
    // 省略部分代码...

    return () => {
      let rawVNode = slots.default();
      if (typeof rawVNode.type !== "object") {
        return rawVNode;
      }

      const name = rawVNode.type.name;
      if (
        name &&
        ((props.include && !props.include.test(name)) ||
          (props.exclude && props.exclude.test(name)))
      ) {
        return rawVNode;
      }

      // 进入缓存的逻辑...
    };
  },
};
```

### 缓存管理 (LRU 算法)

目前为止的缓存实现如下：

```js
const cachedVNode = cache.get(rawVNode.type);
if (cachedVNode) {
  rawVNode.component = cachedVNode.component;
  rawVNode.keptAlive = true;
} else {
  cache.set(rawVNode.type, rawVNode);
}
```

目前缓存的设计，只要缓存不存在，总是会设置新的缓存。这会导致缓存不断的增加，极端情况下会占用大量的内容。

为了解决这个问题，keep-alive 组件允许用户设置缓存的阀值，当组件缓存数量超过了指定阀值时会对缓存进行修剪，也就是 LRU 算法

> 1. FIFO 队列。这个更适合做任务，不适合做组件的。
> 2. LFU。统计每个任务出现的次数，来淘汰出现次数较少的。缺点是比较耗费计算资源。
> 3. LRU 缓存。全称 Least Recently Used。也就是最近最少使用。把所有元素按最近使用情况排序，比如已经到达固定存储量，添加新元素时需要判断当前缓存中是否存在相同元素，若有相同元素则将相同元素放到最后(更新)，若无相同元素则添加该元素并删除第一个元素(也就是最早添加的)。
>
> **组件缓存用的最多的就是 LRU 缓存。(LRU Cache)**

```vue
<keep-alive :max="3">
  <component :is="Component" />
</keep-alive>
```

因此在设计 keep-alive 组件的时候，新增一个 max 的 props：

```js
const KeepAlive = {
  __isKeepAlive: true,
  props: {
    include: RegExp,
    exclude: RegExp,
    max: Number,
  },
  setup(props, { slots }) {
    // ...
  },
};
```

接下来需要有一个能够修剪缓存的方法：

```ts
function pruneCacheEntry(key: CacheKey) {
  const cached = cache.get(key) as VNode;

  // 中间逻辑略...

  cache.delete(key);
  keys.delete(key);
}
```

然后是更新缓存的队列：

```ts
const cachedVNode = cache.get(key);
if (cachedVNode) {
  // 其他逻辑略...

  // 进入此分支，说明缓存队列里面有，有的话就更新一下顺序
  // 保证当前这个在缓存中是最新的
  // 先删除，再添加即可
  keys.delete(key);
  keys.add(key);
} else {
  // 说明缓存中没有，说明是全新的，先添加再修剪
  keys.add(key);
  if (max && keys.size > parseInt(max as string, 10)) {
    // 进入此分支，说明当前添加进去的组件缓存已经超过了最大值，进行删除
    pruneCacheEntry(keys.values().next().value);
  }
}
```

- keep-alive 核心原理就是将内部组件搬运到隐藏容器，以及从隐藏容器搬运回来。因为没有涉及到真正的卸载，所以组件状态也得以保留。
- keep-alive 和渲染器是结合得比较深的，keep-alive 会给内部组件添加一些特殊的标识，这些标识就是给渲染器的用，回头渲染器在挂载和卸载组件的时候，会根据这些标识执行特定的操作。
- include 和 exclude 核心原理就是对内部组件进行一个匹配操作，匹配上了再进入后面的缓存逻辑
- max：添加之前看一下缓存里面有没有缓存过该组件
  - 缓存过：更新到队列最后
  - 没有缓存过：加入到缓存里面，但是要看一下有没有超过最大值，超过了就需要进行修剪。

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
- [esbuild 原理与应用实战](https://juejin.cn/column/7285233095058718756)
- [js-challanges 题解来了，迎接你的校招提前批](https://juejin.cn/column/7244788137410560055)
