import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { canvaiPlugin } from './src/vite-plugin'

export default defineConfig({
  plugins: [react(), canvaiPlugin()],
})
