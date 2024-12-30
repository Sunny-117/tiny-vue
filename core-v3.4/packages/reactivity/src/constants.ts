export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive"
}


export enum DirtyLevels {
    Dirty = 4,// 脏值，意味取值要运行计算属性
    NoDirty = 0 // 不脏，用上一次返回的结果
}