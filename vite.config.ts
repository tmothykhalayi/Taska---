import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const defaultDevApiTarget = 'http://localhost:8000';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devApiTarget = env.VITE_API_PROXY_TARGET || env.VITE_API_URL || defaultDevApiTarget;

  return {
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
  }
})
