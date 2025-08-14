// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(process.cwd(), 'src') } },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true, // lets you use it/expect without importing
  },
})
