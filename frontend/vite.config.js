import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The /api proxy points to the future Spring Boot backend.
// For now the app runs fully on mock data through src/services/api.js.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});