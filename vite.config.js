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
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.pdf')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Copy public assets
    copyPublicDir: true,
  },
  // Configure base path
  base: '/',
  // Configure assets handling
  assetsInclude: ['**/*.pdf'],
  // Configure public directory
  publicDir: 'assets',
}); 