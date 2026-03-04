import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { canvaiPlugin } from './src/vite-plugin'

export default defineConfig({
  plugins: [react(), canvaiPlugin()],
  server: {
    // SPA fallback: serve index.html for all routes
    middlewareMode: false,
  },
  appType: 'spa',
})
