import { defineConfig } from "rolldown";

// TODO: 产物如何inline
export default defineConfig({
  input: "./packages/vue/src/index.ts",
  platform: 'browser',
  // external: (id: string, parentId: string | undefined, isResolved: boolean) => {
  //   if (id.startsWith("@tiny-vue")) {
  //     return false;
  //   }
  //   return true;
  // },
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
})