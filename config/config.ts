import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "decorator" },
  ],

  extraBabelPresets: ["@babel/preset-typescript"],
  extraBabelPlugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-transform-runtime', {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: false,
    }],
  ],
  npmClient: 'pnpm',
});
