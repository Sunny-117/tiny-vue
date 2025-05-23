export enum PatchFlags {
    TEXT = 1,
    CLASS = 1 << 1,
    STYLE = 1 << 2,
    PROPS = 1 << 3,
    FULL_PROPS = 1 << 4,
    NEED_HYDRATION = 1 << 5,
    STABLE_FRAGMENT = 1 << 6,
    KEYED_FRAGMENT = 1 << 7,
    UNKEYED_FRAGMENT = 1 << 8,
    NEED_PATCH = 1 << 9,
    DYNAMIC_SLOTS = 1 << 10,
    DEV_ROOT_FRAGMENT = 1 << 11,
    HOISTED = -1,
    BAIL = -2,
}
