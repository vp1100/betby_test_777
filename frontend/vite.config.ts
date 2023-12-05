import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 80,
    host: '0.0.0.0',
  },
  preview: {
    port: 80,
    host: '0.0.0.0',
  },
  build: {
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  scripts: {
    "build": "vite build",
    "preview": "vite preview"
  },
})
