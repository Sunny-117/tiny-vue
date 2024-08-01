import trigger from "../../effect/trigger.js";
import { TriggerOpTypes, hasChanged } from "../../utils.js";

export default function (target, key, value) {
  // 关于具体的操作类型需要进一步判断
  // 有可能是设置，有可能是新增
  const type = target.hasOwnProperty(key)
    ? TriggerOpTypes.SET
    : TriggerOpTypes.ADD;

  // 在设置之前需要缓存一下旧值
  const oldValue = target[key];
  // 先缓存一下旧的数组长度
  const oldLen = Array.isArray(target) ? target.length : undefined;

  // 先进行设置操作
  const result = Reflect.set(target, key, value);

  // 要不要派发更新需要一些判断
  if (hasChanged(oldValue, value)) {
    // 派发更新
    trigger(target, type, key);

    // 需要判断 length 是否有变化，如果有比变化，需要对 length 进行派发更新
    if (Array.isArray(target) && oldLen !== target.length) {
      // 之所以这里要判断一下，是因为 length 显式的改变是会触发派发更新
      if (key !== "length") {
        // 进入这个 if，说明 length 发生了隐式的变化
        trigger(target, TriggerOpTypes.SET, "length");
      } else {
        // 进入此 else，说明 length 发生了显式的变化
        // 我们需要处理新的长度小于旧的长度的情况，因为这里涉及到了删除操作
        for (let i = target.length; i < oldLen; i++) {
          trigger(target, TriggerOpTypes.DELETE, i.toString());
        }
      }
    }
  }

  return result;
}
