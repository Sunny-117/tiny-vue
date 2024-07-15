export default {
  input: "./packages/vue/src/index.ts",
  output: [
    {
      format: "cjs",
      file: "packages/vue/dist/tiny-vue.cjs.js",
    },
    {
      format: "es",
      file: "packages/vue/dist/tiny-vue.esm.js",
    },
  ],
};
