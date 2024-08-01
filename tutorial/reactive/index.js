// 测试文件
import { reactive } from "./reactvie.js";
import { watch } from "./watch.js";

const x = reactive({
  a: 1,
  b: 2,
});
watch(
  () => x.a + x.b,
  (newValue, oldValue) => {
    console.log(`sum is ${newValue},last sum is ${oldValue}`);
  },{
    immediate: true
  }
);
// x.a++;
// x.a++;