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

# 路由零碎知识

**1. 别名**

通过 alias 可以设置别名。

假设你有一个路由 /user/:id/profile 显示用户的个人资料，你希望能够通过 /profile/:id 也能访问到同样的组件，那么此时就可以通过别名的方式来进行配置，例如：

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/user/:id/profile',
      name: 'user-profile',
      component: UserProfile,
      alias: '/profile/:id' // 配置路由别名
    }
  ]
});
```

别名的好处：

- 提供不同的访问路径：为同一个路由提供了多种访问方式，更加灵活
- 兼容旧路径：有些时候需要更新路径，使用别名可以保证旧的路由依然有效
- 简化路径：特别是嵌套路由的情况下，路径可能会很长，别名可以简化路径

**2. 命名视图**

router-view 被称之为视图或者路由出口。

有些时候会存在这样的需求，那就是**一个路由对应多个组件**，而非一个组件。**不同的组件渲染到不同的视图里面**，此时需要给视图设置不同的 name 来加以区分。

例如：

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      // 注意这里是 components，多了一个's'
      components: {
        default: Home,
        // LeftSidebar: LeftSidebar 的缩写
        LeftSidebar,
        // 它们与 <router-view> 上的 name 属性匹配
        RightSidebar,
      },
    },
  ],
})
```

在上面的 components 配置中，对应了多个组件，所以视图也就提供多个：

```html
<router-view class="view left-sidebar" name="LeftSidebar" />
<router-view class="view main-content" />
<router-view class="view right-sidebar" name="RightSidebar" />
```

如果**视图没有设置名字，那么默认为 default**. 那些只配置了一个组件的路由，默认就渲染在 default 视图所在位置。

**3. 重定向**

通过 redirect 可以配置路由重定向，它允许你将一个路径重定向到另一个路径，当用户访问被重定向的路径时，浏览器的 URL 会自动更新到目标路径，并渲染目标路径对应的组件。

redirect 对应的值可以有多种形式：

1. 字符串

   ```js
   const router = createRouter({
     history: createWebHistory(),
     routes: [
       {
         path: '/home',
         redirect: '/'
       },
       {
         path: '/',
         component: HomeView
       }
     ]
   });
   ```

   在这个示例中，当用户访问 /home 时，会被重定向到 /，并渲染 HomeView 组件。

2. 对象：可以使用对象来更详细地定义重定向，包括传递路径参数和查询参数。

   ```js
   const router = createRouter({
     history: createWebHistory(),
     routes: [
       {
         path: '/user/:id',
         redirect: { name: 'profile', params: { userId: ':id' } }
       },
       {
         path: '/profile/:userId',
         name: 'profile',
         component: UserProfile
       }
     ]
   });
   ```

   在这个示例中，当用户访问 /user/123 时，会被重定向到 /profile/123，并渲染 UserProfile 组件。

3. 函数：重定向函数可以根据路由信息动态生成重定向目标路径。

   ```js
   const router = createRouter({
     history: createWebHistory(),
     routes: [
       {
         path: '/old-path/:id',
         redirect: to => {
           const { params } = to;
           return `/new-path/${params.id}`;
         }
       },
       {
         path: '/new-path/:id',
         component: NewPathComponent
       }
     ]
   });
   ```

   在这个示例中，当用户访问 /old-path/123 时，会被重定向到 /new-path/123，并渲染 NewPathComponent 组件。

**4. 路由元数据**

元数据（meta fields）是一种附加到路由配置中的属性，用来存储与路由相关的**附加信息**。

元数据经常用于权限控制、标题设置、面包屑导航、路由过渡之类的效果

1. 定义元数据：添加一个 meta 配置项，该配置项对应的是一个对象，对象里面就是你自定义要添加的信息

   ```js
   const router = createRouter({
     history: createWebHistory(),
     routes: [
       {
         path: '/',
         component: HomeView,
         meta: { requiresAuth: true, title: 'Home' }
       },
       {
         path: '/about',
         component: AboutView,
         meta: { requiresAuth: false, title: 'About Us' }
       }
     ]
   });
   ```

2. 访问元数据：在导航守卫的回调函数中，会自动传入 to 这个参数（你要起哪里），通过 to.meta 就可以拿到元数据信息

   ```js
   router.beforeEach((to, from, next) => {
     if (to.meta.requiresAuth && !isLoggedIn()) {
       next('/login');
     } else {
       next();
     }
   });
   ```


**5. 路由懒加载**

在新项目的模板代码中，官方路由示例的写法如下：

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
```

可以看到，HomeView 是正常导入，而 AboutView 却有所不同。component 的配置对应的是一个返回 Promise 组件的函数，这种情况下，Vue Router 只会在第一次进入页面时才会获取这个函数，然后使用缓存数据。

这意味着你也可以使用更复杂的函数，只要它们返回一个 Promise ：

```js
const UserDetails = () =>
  Promise.resolve({
    /* 组件定义 */
  })
```

这样的组件导入方式被称之为动态导入，好处在于：

1. 当路由被访问的时候才加载对应组件，这样就会更加高效
2. 进行打包的时候方便做**代码分割**



另外注意，**路由中不要再使用异步组件**，也就是说下面的代码虽然可以使用，但是**没有必要**：

```js
import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const asyncAboutView = defineAsyncComponent(() =>
	import('../views/AboutView.vue')
)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ...
    {
      path: '/about',
      name: 'about',
      component: asyncAboutView
    }
  ]
})

export default router
```

究其原因，是因为 **Vue-router 内部会自动对动态导入做处理，转换为异步组件**，**开发者只需要书写动态导入组件的代码即可**，无需再显式使用 defineAsyncComponent，这样更加简洁方便一些。
