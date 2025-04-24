import { defineConfig } from 'vite';

export default defineConfig({
  // Configure server port
  server: {
    port: 9999,
    host: '0.0.0.0', // To make it accessible from other devices
  },
  // Configure build output
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  // Configure base path
  base: '/',
}); 