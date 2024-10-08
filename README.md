# tiny-vue

## Vue 3 设计哲学与源码揭秘篇

![](/assets/2024-08-27-14-31-14.png)

![](/assets/2024-08-27-14-31-01.png)


## 手写 Vue 篇

### Feature

#### reactivity

- [x] reactive 的实现
- [x] ref 的实现
- [x] readonly 的实现
- [x] computed 的实现
- [x] track 依赖收集
- [x] trigger 触发依赖
- [x] 支持 isReactive
- [x] 支持嵌套 reactive
- [x] 支持 toRaw
- [x] 支持 effect.scheduler
- [x] 支持 effect.stop
- [x] 支持 isReadonly
- [x] 支持 isProxy
- [x] 支持 shallowReadonly
- [x] 支持 proxyRefs

#### runtime-core

- [x] 支持组件类型
- [x] 支持 element 类型
- [x] 初始化 props
- [x] setup 可获取 props 和 context
- [x] 支持 component emit
- [x] 支持 proxy
- [x] 可以在 render 函数中获取 setup 返回的对象
- [x] nextTick 的实现
- [x] 支持 getCurrentInstance
- [x] 支持 provide/inject
- [x] 支持最基础的 slots
- [x] 支持 Text 类型节点
- [x] 支持 $el api
- [x] 支持 watchEffect


#### compiler-core
- [x] 解析插值
- [x] 解析 element
- [x] 解析 text

#### runtime-dom
- [x] 支持 custom renderer 

#### runtime-test
- [x] 支持测试 runtime-core 的逻辑

#### infrastructure
- [x] support monorepo with pnpm

