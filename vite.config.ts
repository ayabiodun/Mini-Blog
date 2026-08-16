import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        second: fileURLToPath(new URL('./blog.html', import.meta.url)),
      },
    },
  },
  server: {
    // This forces Vite to strictly reload when changing HTML pages
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
});
