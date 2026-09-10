import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// Base path aligné sur le nom du repo GitHub Pages.
// alexdev02.github.io/copilote-projet-ia-v2/ -> base '/copilote-projet-ia-v2/'
export default defineConfig({
  base: '/copilote-projet-ia-v2/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
