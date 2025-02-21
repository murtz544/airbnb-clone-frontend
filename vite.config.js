import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://airbnb-clone-be-d5zd.onrender.com',
        changeOrigin: true,
        secure: true,  // If using HTTPS, set this to true
        //rewrite: (path) => path.replace(/^\/api/, '') // Optional: Adjust as per API needs
      }
    }
    // proxy: {
    //   '/api': 'http://localhost:8000'
    // },
  }
}));
