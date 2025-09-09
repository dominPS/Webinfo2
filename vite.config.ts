import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { noSourceMapsPlugin } from './vite-no-sourcemaps-plugin.js'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      },
      jsxRuntime: 'automatic'
    }),
    tsconfigPaths(),
    noSourceMapsPlugin(), // Dodaj plugin eliminujący source mapy
    basicSsl() // Plugin SSL dla bezpiecznego połączenia w Firefox
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    sourcemap: false, // Całkowicie wyłączone dla Firefox
    minify: 'esbuild',
    rollupOptions: {
      output: {
        sourcemap: false, // Dodatowe wyłączenie
        manualChunks: {
          vendor: ['react', 'react-dom'],
          emotion: ['@emotion/react', '@emotion/styled'],
          mui: ['@mui/material', '@mui/icons-material'],
        }
      }
    }
  },
  server: {
    sourcemapIgnoreList: () => true,
    port: 5173,
    host: 'localhost',
    open: '/index.html'
  },
  css: {
    devSourcemap: false // Wyłącz CSS source mapy
  },
  esbuild: {
    sourcemap: false, // Wyłącz esbuild source mapy
    legalComments: 'none'
  },
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false // Wyłącz dla optymalizacji zależności
    }
  }
})
