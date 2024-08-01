import track from "../../effect/track.js";
import { TrackOpTypes } from "../../utils.js";

export default function (target, key) {
  // 需要进行依赖的收集
  track(target, TrackOpTypes.HAS, key);
  return Reflect.has(target, key);
}
