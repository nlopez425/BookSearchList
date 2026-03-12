import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    deps:{
      inline:["html-encoding-sniffer"]
    },
    setupFiles: './setupTests.ts',
    pool:'forks'
  },
})