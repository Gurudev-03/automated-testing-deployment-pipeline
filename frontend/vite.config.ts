import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } },
  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  ['./src/test/setup.ts'],
    coverage: {
      provider:  'v8',
      reporter:  ['text', 'lcov', 'html'],
      exclude:   ['node_modules/', 'src/test/', 'dist/'],
    },
  },
});
