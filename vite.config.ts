import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { bryllenPlugin } from './src/vite-plugin'

export default defineConfig({
  plugins: [react(), bryllenPlugin()],
  server: {
    // SPA fallback: serve index.html for all routes
    middlewareMode: false,
  },
  appType: 'spa',
})
