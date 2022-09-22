import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  root: 'demo/',
  base: "/VueTypewriterComposable/",
  plugins: [vue()],
  build: {
    minify: 'terser',
  }
})
