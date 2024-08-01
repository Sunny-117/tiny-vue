import track from "../../effect/track.js";
import { TrackOpTypes } from "../../utils.js";
export default function (target) {
  // 在此之前，因为涉及到成员的读取，所以要进行依赖收集
  track(target, TrackOpTypes.ITERATE);

  return Reflect.ownKeys(target);
}
