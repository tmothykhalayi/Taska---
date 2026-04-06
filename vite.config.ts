import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const defaultDevApiTarget = 'http://localhost:8000';
const devApiTarget = process.env.VITE_API_PROXY_TARGET || process.env.VITE_API_URL || defaultDevApiTarget;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: devApiTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('@reduxjs') || id.includes('react-redux')) return 'redux-vendor';
            if (id.includes('lucide-react')) return 'ui-vendor';
            return 'vendor';
          }
        }
      }
    }
  }
})
