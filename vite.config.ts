import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server:{
    proxy:{
      '/auth':{
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/auth/*':{
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      },
      '/hospital': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/hospital/*': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://172.31.93.85:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});