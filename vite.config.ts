import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  root: 'demo/',
  plugins: [vue(), eslint()],
});
