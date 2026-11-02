import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: [], fileParallelism: false, include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx', 'tests/contract/**/*.test.ts', 'tests/integration/**/*.test.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
