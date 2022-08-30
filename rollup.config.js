import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

const banner = `/**
* Vue Typewriter Compostable ${pkg.version}
* (c) 2022-${new Date().getFullYear()} ${pkg.author.name}
* @license ${pkg.license}
*/`;

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      banner
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      banner
    }
  ],
  plugins: [typescript()],
}