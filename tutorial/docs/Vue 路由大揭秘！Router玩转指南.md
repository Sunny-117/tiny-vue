# ⚡️ Vue 路由大揭秘！Router玩转指南

# 路由模式

Vue-router支持 3 种模式：

1. Hash模式
2. HTML5模式
3. Memory模式


**Hash模式**

Hash **是 URL 组成的一部分**，例如：

```
https://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#anchor
```

其 # 后面的部分就是 Hash 部分。**早期 Hash 更多是被用作锚点**：

```html
<a href="target">go target</a>
......
<div id="target">i am target place</div>
```

在上面代码中，点击 \<a> 链接，文档会滚动到 id.target 的 div 的位置。

Hash另一个重要特性：**Hash 的变化不会请求服务器**

利用该特性可以实现不同 URL 映射不同的模块。

#a ---> A

#b ---> B

**实战**：使用 Hash 实现单页应用

Vue-router中如何使用 Hash 模式？

```js
// router/index.js
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // ...
  ]
})
```

import.meta.env.BASE_URL 是 Vite 里面提供的一个环境变量，默认是应用的根路径

- 开发环境，默认值是 '/'
- 生产环境，这个值可以在 vite.config.js 里面的 base 中来指定


**HTML5模式**

HTML5 模式也被称之为 History 模式。该模式利用 HTML5 的 **HistoryAPI 来管理浏览器的历史记录**从而实现单页应用。

History API：

1. history.pushState(state, title, url)：将一个状态推入到历史堆栈里面
2. history.replaceState(state, title, url)：替换当前历史堆栈最上面的状态
3. window.onpopstate：这是一个事件，当用户点击浏览器的前进或者后退按钮的时候，会触发该事件

**1. History实现原理**

工作原理：

1. 拦截链接点击事件
   - 客户端路由器会**拦截**页面上的**所有链接点击事件**（通常是通过阻止链接的默认行为 event.preventDefault( )）
   - 取而代之的是，**路由器使用 history.pushState 或 history.replaceState 更新 URL**。
2. URL 变化处理:
   - 当 URL 变化时，路由器会捕捉到这个变化。
   - 路由器不会发出新的 HTTP 请求，而是根据新的 URL 查找预先定义好的路由规则，并加载相应的视图组件

举个例子，假设有一个单页应用，使用 history 模式，并且有以下路由规则：

- /home: 显示主页内容
- /about: 显示关于页面内容

当用户点击导航链接从 /home 切换到 /about 时，流程如下：

1. 用户点击链接 \<a href="/about">About\</a>
2. 路由器拦截点击事件，调用 event.preventDefault( ) 阻止浏览器的默认行为（即不发出 HTTP 请求）
3. 路由器调用 history.pushState(null, '', '/about') 更新浏览器的地址栏 URL 为 /about
4. 路由器检测到 URL 变化，查找路由规则，发现 /about 对应的视图组件
5. 路由器加载并渲染 /about 视图组件，将其插入到页面的特定位置

整个过程中，浏览器地址栏的 URL 更新了，但没有发出新的 HTTP 请求，所有的视图更新都是在客户端完成的。

**实战**：使用 History 实现单页应用

Vue-router中如何使用 History 模式？

```js
// router/index.js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ...
  ]
})
```

**History存在的问题**

一旦刷新，就会报 404 错误。

思考🤔 为什么会这样？

答案：当你刷新的时候，是会请求服务器的。但是服务器并没有这个后端路由，这个仅仅是一个前端路由。

要解决这个问题，需要在服务器上面做一些配置。添加一个回退路由，如果 URL 不匹配任何的静态资源，回退到首页。



**Memory模式**

无论是 Hash 也好、History API 也好，本质上都是**基于浏览器的特性**来实现的。

而 Memory 模式**一般用于非浏览器环境**，例如 Node 或者 SSR.  因为是非浏览器环境，所以不会有 URL 交互也**不会自动触发初始导航**。

该模式用 createMemoryHistory( ) 创建，并且需要**在调用 app.use(router) 之后手动 push 到初始导航**。

```js
import { createRouter, createMemoryHistory } from 'vue-router'
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
```