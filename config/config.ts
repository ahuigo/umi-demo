import { defineConfig } from "umi";
import routes from "./routes";

export default defineConfig({
  // routes,
  extraBabelPresets: ["@babel/preset-typescript"],
  extraBabelPlugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
      },
    ],
  ],

  npmClient: "pnpm",
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
});
