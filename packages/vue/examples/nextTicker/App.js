import {
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from "../../dist/tiny-vue.esm.js";

export default {
  name: "App",
  setup() {
    const count = ref(1);
    const instance = getCurrentInstance();

    function onClick() {
      for (let i = 0; i < 100; i++) {
        console.log("update");
        count.value = i;
      }
      console.log('main', instance);
      // 此时虽然响应式数据更新了，但是DOM并没有更新
      // instance.node.el.innerText = '仍然是老的'
      debugger
      nextTick(() => {
        console.log('nextTick', instance);
      });

      // await nextTick()
      // console.log(instance)
    }

    return {
      onClick,
      count,
    };
  },
  render() {
    const button = h("button", { onClick: this.onClick }, "update");
    const p = h("p", {}, "count:" + this.count);

    return h("div", {}, [button, p]);
  },
};
