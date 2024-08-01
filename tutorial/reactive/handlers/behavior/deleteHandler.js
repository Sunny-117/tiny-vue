import trigger from "../../effect/trigger.js";
import { TriggerOpTypes } from "../../utils.js";

export default function (target, key) {
  // 判断一下目标对象上面是否有要删除的属性
  const hadKey = target.hasOwnProperty(key);

  // 进行删除行为
  const result = Reflect.deleteProperty(target, key);

  // 派发更新之前，需要判断一下
  if(hadKey && result){
    trigger(target, TriggerOpTypes.DELETE, key);
  }

  return result;
}
