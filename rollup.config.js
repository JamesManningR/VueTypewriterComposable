import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const banner = `/**
* Typewriter Compostable ${pkg.version}
* (c) 2022-${new Date().getFullYear()} ${pkg.author.name}
* @license ${pkg.license}
*/`;

export default [
  {
    input: "src/index.ts",
    plugins: [typescript(), terser()],
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
        exports: 'auto',
        banner
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        exports: 'auto',
        banner
      },
      {
        file: pkg.browser,
        name: 'TypewriterCompostable',
        format: 'umd',
        sourcemap: true,
        exports: 'auto',
        banner
      },
    ],
  }, 
  {

    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
]