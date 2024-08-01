import track, { pauseTracking, resumeTracking } from "../../effect/track.js";
import { TrackOpTypes, isObject, RAW } from "../../utils.js";
import { reactive } from "../../reactvie.js";

const arrayInstrumentations = {};
// 重写数组的这几个方法
["includes", "indexOf", "lastIndexOf"].forEach((key) => {
  arrayInstrumentations[key] = function (...args) {
    // 1. 正常找，此时 this 指向的是代理对象
    const res = Array.prototype[key].apply(this, args);
    // 2. 找不到
    if (res < 0 || res === false) {
      // 这里就需要拦截器返回原始的对象
      // this[RAW] 拿到的就是原始对象
      return Array.prototype[key].apply(this[RAW], args);
    }
    return res;
  };
});

// 重写 push、pop、shift、unshift
// 在调用这几个方法的时候，需要暂停依赖收集，调用完毕之后再恢复
["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
  arrayInstrumentations[key] = function (...args) {
    pauseTracking(); // 暂停收集依赖
    const res = Array.prototype[key].apply(this, args);
    resumeTracking(); // 恢复收集依赖
    return res;
  };
});

export default function (target, key) {
  // 这里 RAW 是一个特殊标识，用于返回原始对象
  // 这个标识不能和已有属性重复，所示这里使用了 Symbol 类型
  if (key === RAW) {
    return target;
  }

  // 拦截到 get 操作后，要做一些额外的事情
  // 要做的事情，就是收集依赖
  track(target, TrackOpTypes.GET, key);

  // 如果是数组的某些方法，需要对数组的方法进行一个重写
  if (arrayInstrumentations.hasOwnProperty(key) && Array.isArray(target)) {
    return arrayInstrumentations[key];
  }

  const result = Reflect.get(target, key);

  // 获取到的成员可能是对象，需要递归处理，将其转换为响应式
  if (isObject(result)) {
    return reactive(result);
  }

  return result;
}
