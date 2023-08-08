import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import execute from "rollup-plugin-execute";
import pkg from "./package.json";
import filesize from "rollup-plugin-filesize";
import progress from "rollup-plugin-progress";
import visualizer from "rollup-plugin-visualizer";
import css from "rollup-plugin-css-only";

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.module,
        format: "es",
        sourcemap: false,
      },
      {
        file: pkg.main,
        format: "umd",
        name,
        sourcemap: false,
        plugins: [
          // we only want to run this once, so we'll just make it part of this output's plugins
          execute(["tsc", "node scripts/preprocess.js"]),
        ],
      },
    ],
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ sourceMap: false }),
      }),
      resolve({ browser: true }),
      commonjs({ sourceMap: false }),
      css({ output: "bundle.css" }),
      typescript({ sourceMap: false }),
      json(),
      // For debugging purposes, these can be turned on. This significantly increases build time, though (when tested, build time was ~18sec).
      // progress(), // ~4sec increase
      // visualizer(), // ~4sec increase
      // filesize(), // ~20sec increase
    ],
  },
];
