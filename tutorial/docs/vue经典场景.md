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

```vue
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
